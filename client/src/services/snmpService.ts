import type { SiteData } from '@/types/dashboard';

export interface SNMPDevice {
  id: string;
  name: string;
  host: string;
  port: number;
  community: string;
  version: 0 | 1;
  oids: string[];
  pollInterval: number;
  isActive: boolean;
}

export interface SNMPResult {
  deviceId: string;
  timestamp: Date;
  data: Array<{
    oid: string;
    value: any;
    type: string;
  }>;
  success: boolean;
  error?: string;
}

class SNMPService {
  private baseUrl = 'http://localhost:5000/api/snmp';
  private eventSource: EventSource | null = null;
  private listeners: Map<string, Function[]> = new Map();

  async getDevices(): Promise<SNMPDevice[]> {
    try {
      const response = await fetch(`${this.baseUrl}/devices`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching SNMP devices:', error);
      return [];
    }
  }

  async addDevice(device: Omit<SNMPDevice, 'id'>): Promise<SNMPDevice | null> {
    try {
      const response = await fetch(`${this.baseUrl}/devices`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(device),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error adding SNMP device:', error);
      return null;
    }
  }

  async updateDevice(id: string, device: Partial<SNMPDevice>): Promise<SNMPDevice | null> {
    try {
      const response = await fetch(`${this.baseUrl}/devices/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(device),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error updating SNMP device:', error);
      return null;
    }
  }

  async deleteDevice(id: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/devices/${id}`, {
        method: 'DELETE',
      });
      
      return response.ok;
    } catch (error) {
      console.error('Error deleting SNMP device:', error);
      return false;
    }
  }

  async testDevice(device: Omit<SNMPDevice, 'id' | 'isActive'>): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/test`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(device),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      return result.success;
    } catch (error) {
      console.error('Error testing SNMP device:', error);
      return false;
    }
  }

  async getPollerStatus(): Promise<{
    running: boolean;
    deviceCount: number;
    resultCount: number;
  }> {
    try {
      const response = await fetch(`${this.baseUrl}/status`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching poller status:', error);
      return { running: false, deviceCount: 0, resultCount: 0 };
    }
  }

  async startPoller(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/start`, {
        method: 'POST',
      });
      return response.ok;
    } catch (error) {
      console.error('Error starting poller:', error);
      return false;
    }
  }

  async stopPoller(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/stop`, {
        method: 'POST',
      });
      return response.ok;
    } catch (error) {
      console.error('Error stopping poller:', error);
      return false;
    }
  }

  // Real-time updates using Server-Sent Events
  subscribeToUpdates(callback: (data: { results: SNMPResult[], latestMetrics: any[] }) => void): () => void {
    if (!this.eventSource) {
      this.eventSource = new EventSource(`${this.baseUrl}/events`);
      
      this.eventSource.addEventListener('update', (event) => {
        try {
          const data = JSON.parse(event.data);
          this.emit('update', data);
        } catch (error) {
          console.error('Error parsing SSE data:', error);
        }
      });

      this.eventSource.addEventListener('connected', (event) => {
        console.log('Connected to SNMP events:', event.data);
      });

      this.eventSource.onerror = (error) => {
        console.error('SSE connection error:', error);
      };
    }

    this.on('update', callback);

    return () => {
      this.off('update', callback);
      if (this.getListenerCount('update') === 0 && this.eventSource) {
        this.eventSource.close();
        this.eventSource = null;
      }
    };
  }

  // New methods for database-backed transmitter data
  async getTransmitters(): Promise<any[]> {
    try {
      const response = await fetch(`${this.baseUrl}/transmitters`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching transmitters:', error);
      return [];
    }
  }

  async getLatestTransmitterMetrics(): Promise<any[]> {
    try {
      const response = await fetch(`${this.baseUrl}/transmitters/metrics/latest`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching all latest metrics:', error);
      return [];
    }
  }

  async getLatestTransmitterMetricsById(transmitterId: string): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/transmitters/${transmitterId}/metrics/latest`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching latest metrics:', error);
      return null;
    }
  }

  async getTransmitterMetricsRange(transmitterId: string, start: Date, end: Date): Promise<any[]> {
    try {
      const response = await fetch(
        `${this.baseUrl}/transmitters/${transmitterId}/metrics?start=${start.toISOString()}&end=${end.toISOString()}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching metrics range:', error);
      return [];
    }
  }

  async getSites(): Promise<any[]> {
    try {
      const response = await fetch(`${this.baseUrl}/sites`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching sites:', error);
      return [];
    }
  }

  private on(event: string, callback: Function): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);
  }

  private off(event: string, callback: Function): void {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  private emit(event: string, data: any): void {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.forEach(callback => callback(data));
    }
  }

  private getListenerCount(event: string): number {
    return this.listeners.get(event)?.length || 0;
  }

  // Convert SNMP data to SiteData format for Dashboard integration
  convertToSiteData(devices: SNMPDevice[], results: SNMPResult[]): SiteData[] {
    const siteMap = new Map<string, SiteData>();

    devices.forEach(device => {
      // Create a basic site structure from device info
      const site: SiteData = {
        id: device.id,
        name: device.name,
        location: `${device.host}, Malaysia`, // Default location
        coordinates: { lat: 3.1390, lng: 101.6869 }, // Default to KL coordinates
        broadcaster: 'SNMP Monitored Site',
        overallStatus: 'operational',
        activeTransmitterCount: 1,
        backupTransmitterCount: 0,
        standbyTransmitterCount: 0,
        runningActiveCount: 1,
        runningBackupCount: 0,
        activeStandbyCount: 0,
        transmitters: [{
          id: `tx_${device.id}`,
          type: '1',
          role: 'active',
          label: '1',
          channelName: device.name,
          frequency: '88.1', // Default frequency
          status: 'operational',
          transmitPower: 0,
          reflectPower: 0,
          mainAudio: true,
          backupAudio: true,
          connectivity: device.isActive,
          lastSeen: '0 seconds ago',
          isTransmitting: false
        }],
        alerts: 0
      };

      siteMap.set(device.id, site);
    });

    // Update sites with latest SNMP results
    results.forEach(result => {
      const site = siteMap.get(result.deviceId);
      if (site && site.transmitters.length > 0) {
        const transmitter = site.transmitters[0];
        
        // Update based on SNMP success/failure
        if (result.success) {
          transmitter.connectivity = true;
          transmitter.lastSeen = new Date(result.timestamp).toLocaleString();
          site.overallStatus = 'operational';
          
          // Parse SNMP data for transmitter parameters
          result.data.forEach(item => {
            // Example OID mappings - adjust based on your actual OIDs
            if (item.oid.includes('transmitPower')) {
              transmitter.transmitPower = parseFloat(item.value) || 0;
              transmitter.isTransmitting = transmitter.transmitPower > 0;
            } else if (item.oid.includes('reflectPower')) {
              transmitter.reflectPower = parseFloat(item.value) || 0;
            } else if (item.oid.includes('frequency')) {
              transmitter.frequency = item.value.toString();
            }
          });
        } else {
          transmitter.connectivity = false;
          transmitter.status = 'error';
          site.overallStatus = 'error';
          site.alerts = 1;
        }
      }
    });

    return Array.from(siteMap.values());
  }
}

export const snmpService = new SNMPService();