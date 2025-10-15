import * as snmp from 'net-snmp';
import { databaseService } from './database-service';

export interface SNMPDevice {
  id: string;
  host: string;
  port: number;
  community: string;
  version: 0 | 1; // Version1 | Version2c
  oids: string[];
  pollInterval: number;
  lastPoll?: Date;
  isActive: boolean;
}

export interface DeviceResult {
  deviceId: string;
  timestamp: Date;
  success: boolean;
  data?: { [oid: string]: any };
  error?: string;
}

export class SNMPPoller {
  private devices: Map<string, SNMPDevice> = new Map();
  private sessions: Map<string, snmp.Session> = new Map();
  private pollTimers: Map<string, NodeJS.Timeout> = new Map();
  private results: DeviceResult[] = [];
  private maxResults = 1000;
  private running = false;

  constructor() {
    this.startPolling();
  }

  addDevice(device: SNMPDevice): void {
    this.devices.set(device.id, device);
    this.createSession(device);
    this.schedulePoll(device);
  }

  removeDevice(deviceId: string): void {
    const timer = this.pollTimers.get(deviceId);
    if (timer) {
      clearTimeout(timer);
      this.pollTimers.delete(deviceId);
    }

    const session = this.sessions.get(deviceId);
    if (session) {
      session.close();
      this.sessions.delete(deviceId);
    }

    this.devices.delete(deviceId);
  }

  getDevice(deviceId: string): SNMPDevice | undefined {
    return this.devices.get(deviceId);
  }

  getAllDevices(): SNMPDevice[] {
    return Array.from(this.devices.values());
  }

  getResults(deviceId?: string, limit = 100): DeviceResult[] {
    let filtered = this.results;
    
    if (deviceId) {
      filtered = this.results.filter(r => r.deviceId === deviceId);
    }
    
    return filtered
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

  private createSession(device: SNMPDevice): void {
    try {
      const options: snmp.SessionOptions = {
        port: device.port,
        retries: 3,
        timeout: 5000,
        version: device.version === 0 ? snmp.Version1 : snmp.Version2c
      };

      console.log(`Creating SNMP session for device ${device.id} at ${device.host}:${device.port}`);
      const session = snmp.createSession(device.host, device.community, options);
      
      session.on('error', (error) => {
        console.error(`SNMP session error for device ${device.id}:`, error);
        this.recordResult(device.id, false, undefined, error.message);
      });

      this.sessions.set(device.id, session);
      console.log(`SNMP session created successfully for device ${device.id}`);
    } catch (error) {
      console.error(`Failed to create SNMP session for device ${device.id}:`, error);
      this.recordResult(device.id, false, undefined, error instanceof Error ? error.message : 'Unknown error');
    }
  }

  private schedulePoll(device: SNMPDevice): void {
    if (!device.isActive) {
      console.log(`Device ${device.id} is not active, skipping poll scheduling`);
      return;
    }

    console.log(`Scheduling poll for device ${device.id} in ${device.pollInterval}ms`);
    const timer = setTimeout(async () => {
      // Check gating before polling: transmitter.isActive and site.isActive must be true
      const shouldPoll = await this.shouldPollDevice(device);
      if (!shouldPoll) {
        console.log(`Gating active: skipping poll for device ${device.id}`);
        this.schedulePoll(device); // Re-evaluate after next interval
        return;
      }

      console.log(`Starting poll for device ${device.id}`);
      await this.pollDevice(device);
      this.schedulePoll(device); // Schedule next poll
    }, device.pollInterval);

    this.pollTimers.set(device.id, timer);
  }

  private async pollDevice(device: SNMPDevice): Promise<void> {
    console.log(`Polling device ${device.id} (${device.host})`);
    // Double-check gating just before polling (in case state changed between scheduling and execution)
    const gated = await this.shouldPollDevice(device);
    if (!gated) {
      console.log(`Gating active at poll time: skipping device ${device.id}`);
      return;
    }
    const session = this.sessions.get(device.id);
    if (!session) {
      console.error(`No session found for device ${device.id}`);
      this.recordResult(device.id, false, undefined, 'No SNMP session available');
      return;
    }

    try {
      console.log(`Performing SNMP GET for device ${device.id} with OIDs:`, device.oids);
      const results = await this.performSNMPGet(session, device.oids);
      
      const data: { [oid: string]: any } = {};
      device.oids.forEach((oid, index) => {
        data[oid] = results[index];
      });

      console.log(`SNMP poll successful for device ${device.id}:`, data);
      this.recordResult(device.id, true, data);
      device.lastPoll = new Date();
    } catch (error) {
      console.error(`SNMP poll failed for device ${device.id}:`, error);
      this.recordResult(device.id, false, undefined, error instanceof Error ? error.message : 'Unknown error');
    }
  }

  // Determine if a device should be polled based on device/transmitter/site activity
  private async shouldPollDevice(device: SNMPDevice): Promise<boolean> {
    // First check device flag
    if (!device.isActive) return false;

    try {
      const transmitter = await databaseService.getTransmitterById(device.id);
      if (transmitter) {
        // If transmitter is inactive, gate off
        if (transmitter.isActive === false) return false;

        // If linked to a site, ensure site is active
        if (transmitter.siteId) {
          const site = await databaseService.getSiteById(transmitter.siteId);
          if (site && site.isActive === false) return false;
        }
      }
    } catch (error) {
      // If database lookup fails, default to allowing poll to avoid blocking system
      console.warn(`Gating check failed for device ${device.id}:`, error);
    }

    return true;
  }

  private performSNMPGet(session: snmp.Session, oids: string[]): Promise<any[]> {
    return new Promise((resolve, reject) => {
      session.get(oids, (error, varbinds) => {
        if (error) {
          reject(error);
        } else {
          resolve(varbinds || []);
        }
      });
    });
  }

  private recordResult(deviceId: string, success: boolean, data?: { [oid: string]: any }, error?: string): void {
    const result: DeviceResult = {
      deviceId,
      timestamp: new Date(),
      success,
      data,
      error
    };

    this.results.push(result);

    // Keep only the most recent results
    if (this.results.length > this.maxResults) {
      this.results = this.results.slice(-this.maxResults);
    }

    // Store result in database asynchronously
    this.storeResultInDatabase(result).catch(err => {
      console.error(`Failed to store result in database for device ${deviceId}:`, err);
    });
  }

  private async storeResultInDatabase(result: DeviceResult): Promise<void> {
    try {
      await databaseService.storeTransmitterMetrics(result.deviceId, result);
    } catch (error) {
      console.error('Database storage error:', error);
      // Don't throw - we don't want database issues to break SNMP polling
    }
  }

  private startPolling(): void {
    // Initial polling for all active devices
    const devices = Array.from(this.devices.entries());
    for (const [deviceId, device] of devices) {
      if (device.isActive) {
        this.schedulePoll(device);
      }
    }
  }

  updateDevice(deviceId: string, updates: Partial<SNMPDevice>): boolean {
    const device = this.devices.get(deviceId);
    if (!device) return false;

    // Stop current polling
    const timer = this.pollTimers.get(deviceId);
    if (timer) {
      clearTimeout(timer);
      this.pollTimers.delete(deviceId);
    }

    // Update device
    Object.assign(device, updates);
    this.devices.set(deviceId, device);

    // Recreate session if connection details changed
    if (updates.host || updates.port || updates.community || updates.version) {
      const session = this.sessions.get(deviceId);
      if (session) {
        session.close();
      }
      this.createSession(device);
    }

    // Restart polling if active
    if (device.isActive) {
      this.schedulePoll(device);
    }

    return true;
  }

  getDeviceStatus(deviceId: string): { isOnline: boolean; lastSeen?: Date; errorCount: number } {
    const device = this.devices.get(deviceId);
    if (!device) {
      return { isOnline: false, errorCount: 0 };
    }

    const recentResults = this.getResults(deviceId, 10);
    const errorCount = recentResults.filter(r => !r.success).length;
    const lastSuccessful = recentResults.find(r => r.success);

    return {
      isOnline: errorCount < 5 && !!lastSuccessful, // Consider online if less than 5 recent errors
      lastSeen: lastSuccessful?.timestamp,
      errorCount
    };
  }

  // Test device connection
  async testDevice(device: SNMPDevice): Promise<{ success: boolean; error?: string; data?: any[] }> {
    try {
      const session = snmp.createSession(device.host, device.community, {
        port: device.port,
        version: device.version === 0 ? snmp.Version1 : snmp.Version2c
      });
      const result = await this.performSNMPGet(session, device.oids);
      session.close();
      return { success: true, data: result };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  // Start polling all devices
  start(): void {
    this.running = true;
    this.startPolling();
  }

  // Stop polling all devices
  stop(): void {
    this.running = false;
    const timers = Array.from(this.pollTimers.values());
    for (const timer of timers) {
      clearTimeout(timer);
    }
    this.pollTimers.clear();
  }

  // Check if poller is running
  isRunning(): boolean {
    return this.running;
  }

  clearResults(): void {
    this.results = [];
  }

  cleanup(): void {
    // Stop all polling
    this.stop();
    
    // Clear all timers
    this.pollTimers.forEach(timer => clearTimeout(timer));
    this.pollTimers.clear();
    
    // Close all sessions
    this.sessions.forEach(session => session.close());
    this.sessions.clear();
    
    // Clear devices and results
    this.devices.clear();
    this.results = [];
  }
}