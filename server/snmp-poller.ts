import * as snmp from 'net-snmp';
import { EventEmitter } from 'events';

export interface SNMPDevice {
  id: string;
  name: string;
  host: string;
  port: number;
  community: string;
  version: 0 | 1; // Version1 | Version2c
  timeout: number;
  retries: number;
  oids: string[];
  pollInterval: number; // in milliseconds
  enabled: boolean;
}

export interface SNMPResult {
  deviceId: string;
  timestamp: Date;
  success: boolean;
  data?: { [oid: string]: any };
  error?: string;
}

export class SNMPPoller extends EventEmitter {
  private devices: Map<string, SNMPDevice> = new Map();
  private sessions: Map<string, snmp.Session> = new Map();
  private timers: Map<string, NodeJS.Timeout> = new Map();
  private isRunning: boolean = false;

  constructor() {
    super();
  }

  /**
   * Add a device to the poller
   */
  addDevice(device: SNMPDevice): void {
    this.devices.set(device.id, device);
    
    if (this.isRunning && device.enabled) {
      this.startPollingDevice(device);
    }
    
    this.emit('deviceAdded', device);
  }

  /**
   * Remove a device from the poller
   */
  removeDevice(deviceId: string): void {
    this.stopPollingDevice(deviceId);
    this.devices.delete(deviceId);
    this.emit('deviceRemoved', deviceId);
  }

  /**
   * Update a device configuration
   */
  updateDevice(deviceId: string, updates: Partial<SNMPDevice>): void {
    const device = this.devices.get(deviceId);
    if (!device) {
      throw new Error(`Device ${deviceId} not found`);
    }

    const updatedDevice = { ...device, ...updates };
    this.devices.set(deviceId, updatedDevice);

    // Restart polling if device is running
    if (this.timers.has(deviceId)) {
      this.stopPollingDevice(deviceId);
      if (updatedDevice.enabled) {
        this.startPollingDevice(updatedDevice);
      }
    }

    this.emit('deviceUpdated', updatedDevice);
  }

  /**
   * Get all devices
   */
  getDevices(): SNMPDevice[] {
    return Array.from(this.devices.values());
  }

  /**
   * Get a specific device
   */
  getDevice(deviceId: string): SNMPDevice | undefined {
    return this.devices.get(deviceId);
  }

  /**
   * Start polling all enabled devices
   */
  start(): void {
    if (this.isRunning) {
      return;
    }

    this.isRunning = true;
    
    for (const device of Array.from(this.devices.values())) {
      if (device.enabled) {
        this.startPollingDevice(device);
      }
    }

    this.emit('started');
  }

  /**
   * Stop polling all devices
   */
  stop(): void {
    if (!this.isRunning) {
      return;
    }

    this.isRunning = false;

    // Stop all timers and close sessions
    for (const deviceId of Array.from(this.devices.keys())) {
      this.stopPollingDevice(deviceId);
    }

    this.emit('stopped');
  }

  /**
   * Start polling a specific device
   */
  private startPollingDevice(device: SNMPDevice): void {
    // Create SNMP session
    const session = snmp.createSession(device.host, device.community, {
      port: device.port,
      retries: device.retries,
      timeout: device.timeout,
      version: device.version
    });

    this.sessions.set(device.id, session);

    // Start polling timer
    const timer = setInterval(() => {
      this.pollDevice(device);
    }, device.pollInterval);

    this.timers.set(device.id, timer);

    // Initial poll
    this.pollDevice(device);
  }

  /**
   * Stop polling a specific device
   */
  private stopPollingDevice(deviceId: string): void {
    // Clear timer
    const timer = this.timers.get(deviceId);
    if (timer) {
      clearInterval(timer);
      this.timers.delete(deviceId);
    }

    // Close session
    const session = this.sessions.get(deviceId);
    if (session) {
      session.close();
      this.sessions.delete(deviceId);
    }
  }

  /**
   * Poll a specific device
   */
  private async pollDevice(device: SNMPDevice): Promise<void> {
    const session = this.sessions.get(device.id);
    if (!session) {
      return;
    }

    const result: SNMPResult = {
      deviceId: device.id,
      timestamp: new Date(),
      success: false
    };

    try {
      const data = await this.performSNMPGet(session, device.oids);
      result.success = true;
      result.data = data;
      
      this.emit('pollSuccess', result);
    } catch (error) {
      result.error = error instanceof Error ? error.message : 'Unknown error';
      this.emit('pollError', result);
    }

    this.emit('pollComplete', result);
  }

  /**
   * Perform SNMP GET operation
   */
  private performSNMPGet(session: snmp.Session, oids: string[]): Promise<{ [oid: string]: any }> {
    return new Promise((resolve, reject) => {
      session.get(oids, (error, varbinds) => {
        if (error) {
          reject(error);
          return;
        }

        if (!varbinds) {
          reject(new Error('No varbinds returned'));
          return;
        }

        const data: { [oid: string]: any } = {};
        
        for (const varbind of varbinds) {
          if (snmp.isVarbindError(varbind)) {
            reject(new Error(`SNMP error for OID ${varbind.oid}: ${snmp.varbindError(varbind)}`));
            return;
          }
          
          data[varbind.oid] = varbind.value;
        }

        resolve(data);
      });
    });
  }

  /**
   * Perform a one-time poll of a device (for testing)
   */
  async testDevice(device: SNMPDevice): Promise<SNMPResult> {
    const session = snmp.createSession(device.host, device.community, {
      port: device.port,
      retries: device.retries,
      timeout: device.timeout,
      version: device.version
    });

    const result: SNMPResult = {
      deviceId: device.id,
      timestamp: new Date(),
      success: false
    };

    try {
      const data = await this.performSNMPGet(session, device.oids);
      result.success = true;
      result.data = data;
    } catch (error) {
      result.error = error instanceof Error ? error.message : 'Unknown error';
    } finally {
      session.close();
    }

    return result;
  }
}

// Create a singleton instance
export const snmpPoller = new SNMPPoller();

// Common SNMP OIDs for network devices
export const CommonOIDs = {
  // System information
  sysDescr: '1.3.6.1.2.1.1.1.0',
  sysObjectID: '1.3.6.1.2.1.1.2.0',
  sysUpTime: '1.3.6.1.2.1.1.3.0',
  sysContact: '1.3.6.1.2.1.1.4.0',
  sysName: '1.3.6.1.2.1.1.5.0',
  sysLocation: '1.3.6.1.2.1.1.6.0',
  
  // Interface information
  ifNumber: '1.3.6.1.2.1.2.1.0',
  ifDescr: '1.3.6.1.2.1.2.2.1.2',
  ifType: '1.3.6.1.2.1.2.2.1.3',
  ifMtu: '1.3.6.1.2.1.2.2.1.4',
  ifSpeed: '1.3.6.1.2.1.2.2.1.5',
  ifPhysAddress: '1.3.6.1.2.1.2.2.1.6',
  ifAdminStatus: '1.3.6.1.2.1.2.2.1.7',
  ifOperStatus: '1.3.6.1.2.1.2.2.1.8',
  
  // SNMP statistics
  snmpInPkts: '1.3.6.1.2.1.11.1.0',
  snmpOutPkts: '1.3.6.1.2.1.11.2.0',
  snmpInBadVersions: '1.3.6.1.2.1.11.3.0',
  snmpInBadCommunityNames: '1.3.6.1.2.1.11.4.0'
};