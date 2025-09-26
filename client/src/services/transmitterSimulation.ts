import { SiteData, TransmitterData } from '@/types/dashboard';

export interface SimulationConfig {
  updateInterval: number; // milliseconds
  powerVariationRange: number; // ±percentage
  alarmProbability: number; // 0-1, chance per minute of alarm
  recoveryProbability: number; // 0-1, chance per minute of recovery
}

const DEFAULT_CONFIG: SimulationConfig = {
  updateInterval: 2000, // 2 seconds
  powerVariationRange: 0.05, // ±5%
  alarmProbability: 0.002, // 0.2% per minute
  recoveryProbability: 0.1, // 10% per minute
};

class TransmitterSimulation {
  private sites: SiteData[] = [];
  private baselines: Map<string, { transmitPower: number; reflectPower: number }> = new Map();
  private intervals: Set<NodeJS.Timeout> = new Set();
  private config: SimulationConfig = DEFAULT_CONFIG;
  private listeners: Set<(sites: SiteData[]) => void> = new Set();

  initialize(sites: SiteData[], config?: Partial<SimulationConfig>) {
    this.sites = sites;
    this.config = { ...DEFAULT_CONFIG, ...config };
    
    // Store baseline values for each transmitter
    sites.forEach(site => {
      site.transmitters.forEach(tx => {
        this.baselines.set(tx.id, {
          transmitPower: tx.transmitPower,
          reflectPower: tx.reflectPower
        });
      });
    });

    this.startSimulation();
  }

  private startSimulation() {
    // Clear any existing intervals
    this.intervals.forEach(clearInterval);
    this.intervals.clear();

    // Start main simulation loop
    const interval = setInterval(() => {
      this.updateAllTransmitters();
      this.notifyListeners();
    }, this.config.updateInterval);
    
    this.intervals.add(interval);
  }

  private updateAllTransmitters() {
    this.sites.forEach(site => {
      site.transmitters.forEach(tx => this.updateTransmitter(tx));
      
      // Recalculate site overall status
      site.overallStatus = this.calculateSiteStatus(site);
    });
  }

  private updateTransmitter(tx: TransmitterData) {
    const baseline = this.baselines.get(tx.id);
    if (!baseline) return;

    // Update timestamp
    tx.lastSeen = `${Math.floor(Math.random() * 10) + 1} seconds ago`;

    // Skip updates for offline transmitters occasionally recovering
    if (tx.status === 'error' || tx.status === 'offline') {
      if (Math.random() < this.config.recoveryProbability / 30) { // Per 2-second interval
        this.recoverTransmitter(tx, baseline);
      }
      return;
    }

    // Introduce random problems
    if (Math.random() < this.config.alarmProbability / 30) { // Per 2-second interval
      this.introduceAlarm(tx);
      return;
    }

    // Normal operation - vary power levels
    if (tx.isTransmitting) {
      const powerVariation = (Math.random() - 0.5) * 2 * this.config.powerVariationRange;
      const reflectVariation = (Math.random() - 0.5) * 2 * this.config.powerVariationRange * 2; // More variation for reflect

      tx.transmitPower = Math.max(0, Math.round(baseline.transmitPower * (1 + powerVariation)));
      tx.reflectPower = Math.max(0, Math.round(baseline.reflectPower * (1 + reflectVariation)));

      // Check for warning thresholds
      const lowPowerThreshold = baseline.transmitPower * 0.85;
      const highReflectThreshold = baseline.reflectPower * 2;

      if (tx.transmitPower < lowPowerThreshold || tx.reflectPower > highReflectThreshold) {
        if (tx.status === 'operational') {
          tx.status = 'warning';
          tx.backupAudio = false; // Backup audio might fail
        }
      } else if (tx.status === 'warning' && Math.random() < 0.1) {
        // 10% chance to recover from warning per update
        tx.status = 'operational';
        tx.backupAudio = true;
      }
    }
  }

  private introduceAlarm(tx: TransmitterData) {
    const alarmTypes = ['power_loss', 'high_reflect', 'audio_loss', 'connectivity'];
    const alarmType = alarmTypes[Math.floor(Math.random() * alarmTypes.length)];

    switch (alarmType) {
      case 'power_loss':
        tx.status = 'error';
        tx.transmitPower = 0;
        tx.reflectPower = 0;
        tx.isTransmitting = false;
        tx.mainAudio = false;
        tx.backupAudio = false;
        tx.lastSeen = `${Math.floor(Math.random() * 30) + 10} minutes ago`;
        break;
      
      case 'high_reflect':
        tx.status = 'warning';
        tx.reflectPower = Math.floor(Math.random() * 40) + 60; // High reflect power
        break;
      
      case 'audio_loss':
        tx.status = 'warning';
        tx.backupAudio = false;
        if (Math.random() < 0.3) tx.mainAudio = false;
        break;
      
      case 'connectivity':
        tx.status = 'warning';
        tx.connectivity = false;
        tx.lastSeen = `${Math.floor(Math.random() * 5) + 1} minutes ago`;
        break;
    }
  }

  private recoverTransmitter(tx: TransmitterData, baseline: { transmitPower: number; reflectPower: number }) {
    tx.status = 'operational';
    tx.transmitPower = baseline.transmitPower;
    tx.reflectPower = baseline.reflectPower;
    tx.isTransmitting = true;
    tx.mainAudio = true;
    tx.backupAudio = true;
    tx.connectivity = true;
    tx.lastSeen = '1 second ago';
  }

  private calculateSiteStatus(site: SiteData): 'operational' | 'warning' | 'error' {
    const transmitters = site.transmitters;
    const errorCount = transmitters.filter(tx => tx.status === 'error' || tx.status === 'offline').length;
    const warningCount = transmitters.filter(tx => tx.status === 'warning').length;

    if (errorCount > 0) return 'error';
    if (warningCount > 0) return 'warning';
    return 'operational';
  }

  addListener(callback: (sites: SiteData[]) => void) {
    this.listeners.add(callback);
  }

  removeListener(callback: (sites: SiteData[]) => void) {
    this.listeners.delete(callback);
  }

  private notifyListeners() {
    this.listeners.forEach(callback => callback([...this.sites]));
  }

  getSites(): SiteData[] {
    return [...this.sites];
  }

  stop() {
    this.intervals.forEach(clearInterval);
    this.intervals.clear();
    this.listeners.clear();
  }
}

export const transmitterSimulation = new TransmitterSimulation();