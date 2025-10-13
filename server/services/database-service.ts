import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { transmitters, transmitterMetrics, sites } from '../../shared/schema';
import { eq, desc, and, gte, lte } from 'drizzle-orm';
import type { DeviceResult } from './snmp-poller';

// Database connection
const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:password@127.0.0.1:5432/fmtxm';
const pool = new Pool({ connectionString });
const db = drizzle(pool);

export interface TransmitterMetricData {
  transmitterId: string;
  timestamp: Date;
  powerOutput?: number;
  frequency?: number;
  vswr?: number;
  temperature?: number;
  forwardPower?: number;
  reflectedPower?: number;
  status: string;
  snmpData?: any;
  errorMessage?: string;
}

export class DatabaseService {
  /**
   * Store SNMP poll result in the database
   */
  async storeTransmitterMetrics(deviceId: string, result: DeviceResult): Promise<void> {
    try {
      // First, check if transmitter exists
      const transmitter = await db
        .select()
        .from(transmitters)
        .where(eq(transmitters.id, deviceId))
        .limit(1);

      if (transmitter.length === 0) {
        console.warn(`Transmitter ${deviceId} not found in database, skipping metric storage`);
        return;
      }

      // Parse SNMP data to extract metrics
      const metrics = this.parseSnmpData(result);

      // Insert metrics into TimescaleDB hypertable
      await db.insert(transmitterMetrics).values({
        transmitterId: deviceId,
        timestamp: result.timestamp,
        powerOutput: metrics.powerOutput,
        frequency: metrics.frequency,
        vswr: metrics.vswr,
        temperature: metrics.temperature,
        forwardPower: metrics.forwardPower,
        reflectedPower: metrics.reflectedPower,
        status: result.success ? 'active' : 'fault',
        snmpData: result.data,
        errorMessage: result.error
      });

      console.log(`Stored metrics for transmitter ${deviceId} at ${result.timestamp}`);
    } catch (error) {
      console.error(`Failed to store metrics for transmitter ${deviceId}:`, error);
      throw error;
    }
  }

  /**
   * Parse SNMP data to extract transmitter metrics
   * This is a basic implementation - customize based on your SNMP OIDs
   */
  private parseSnmpData(result: DeviceResult): Partial<TransmitterMetricData> {
    const metrics: Partial<TransmitterMetricData> = {};

    if (!result.success || !result.data) {
      return metrics;
    }

    // Example OID mappings - customize these based on your transmitter's SNMP MIB
    const oidMappings = {
      // Common transmitter OIDs (these are examples - adjust for your equipment)
      '1.3.6.1.4.1.12345.1.1.1': 'forwardPower',    // Forward power
      '1.3.6.1.4.1.12345.1.1.2': 'reflectedPower',  // Reflected power
      '1.3.6.1.4.1.12345.1.1.3': 'frequency',       // Frequency
      '1.3.6.1.4.1.12345.1.1.4': 'temperature',     // Temperature
      '1.3.6.1.4.1.12345.1.1.5': 'powerOutput',     // Power output
      '1.3.6.1.4.1.12345.1.1.6': 'vswr',           // VSWR
    };

    // Parse SNMP data based on OID mappings
    for (const [oid, value] of Object.entries(result.data)) {
      const metricName = oidMappings[oid as keyof typeof oidMappings];
      if (metricName && typeof value === 'number') {
        (metrics as any)[metricName] = value;
      }
    }

    // Calculate VSWR from forward and reflected power if not directly available
    if (metrics.forwardPower && metrics.reflectedPower && !metrics.vswr) {
      const reflectionCoeff = Math.sqrt(metrics.reflectedPower / metrics.forwardPower);
      metrics.vswr = (1 + reflectionCoeff) / (1 - reflectionCoeff);
    }

    return metrics;
  }

  /**
   * Get latest metrics for a transmitter
   */
  async getLatestMetrics(transmitterId: string): Promise<any> {
    try {
      const result = await db
        .select()
        .from(transmitterMetrics)
        .where(eq(transmitterMetrics.transmitterId, transmitterId))
        .orderBy(desc(transmitterMetrics.timestamp))
        .limit(1);

      return result[0] || null;
    } catch (error) {
      console.error(`Failed to get latest metrics for transmitter ${transmitterId}:`, error);
      throw error;
    }
  }

  /**
   * Get metrics for a transmitter within a time range
   */
  async getMetricsRange(
    transmitterId: string,
    startTime: Date,
    endTime: Date,
    limit = 1000
  ): Promise<any[]> {
    try {
      const result = await db
        .select()
        .from(transmitterMetrics)
        .where(
          and(
            eq(transmitterMetrics.transmitterId, transmitterId),
            gte(transmitterMetrics.timestamp, startTime),
            lte(transmitterMetrics.timestamp, endTime)
          )
        )
        .orderBy(desc(transmitterMetrics.timestamp))
        .limit(limit);

      return result;
    } catch (error) {
      console.error(`Failed to get metrics range for transmitter ${transmitterId}:`, error);
      throw error;
    }
  }

  /**
   * Get all transmitters from database
   */
  async getAllTransmitters(): Promise<any[]> {
    try {
      return await db.select().from(transmitters);
    } catch (error) {
      console.error('Failed to get transmitters:', error);
      throw error;
    }
  }

  /**
   * Create or update a transmitter
   */
  async upsertTransmitter(transmitterData: any): Promise<any> {
    try {
      // Check if transmitter exists
      const existing = await db
        .select()
        .from(transmitters)
        .where(eq(transmitters.id, transmitterData.id))
        .limit(1);

      if (existing.length > 0) {
        // Update existing transmitter
        const [updated] = await db
          .update(transmitters)
          .set({
            ...transmitterData,
            updatedAt: new Date()
          })
          .where(eq(transmitters.id, transmitterData.id))
          .returning();
        return updated;
      } else {
        // Insert new transmitter
        const [inserted] = await db
          .insert(transmitters)
          .values(transmitterData)
          .returning();
        return inserted;
      }
    } catch (error) {
      console.error('Failed to upsert transmitter:', error);
      throw error;
    }
  }

  /**
   * Get all sites from database
   */
  async getAllSites(): Promise<any[]> {
    try {
      return await db.select().from(sites);
    } catch (error) {
      console.error('Failed to get sites:', error);
      throw error;
    }
  }

  /**
   * Close database connection
   */
  async close(): Promise<void> {
    await pool.end();
  }
}

// Export singleton instance
export const databaseService = new DatabaseService();