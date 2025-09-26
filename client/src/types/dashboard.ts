export type TransmitterStatus = 'operational' | 'warning' | 'error' | 'offline';
export type TransmitterType = '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | '11' | '12' | 'reserve1' | 'reserve2';
export type TransmitterRole = 'active' | 'backup' | 'reserve';

export interface TransmitterData {
  id: string;
  type: TransmitterType;
  role: TransmitterRole; // active, backup, or reserve
  label: string; // "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "Reserve 1", "Reserve 2"
  channelName: string; // Channel name from OID - can be taken over by reserve
  frequency: string; // Frequency in MHz (e.g., "88.1", "95.8") - can be taken over by reserve
  originalChannelName?: string; // Original channel name for reserve transmitters
  originalFrequency?: string; // Original frequency for reserve transmitters
  status: TransmitterStatus;
  transmitPower: number;
  reflectPower: number;
  mainAudio: boolean;
  backupAudio: boolean;
  connectivity: boolean;
  lastSeen: string;
  isTransmitting: boolean; // Whether transmitter is actually transmitting
  takenOverFrom?: string; // ID of transmitter this reserve has taken over from
}

export interface SiteData {
  id: string;
  name: string;
  location: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  broadcaster: string;
  overallStatus: TransmitterStatus;
  transmitters: TransmitterData[]; // Array of 12+ transmitters (1-12, reserve1, reserve2)
  activeTransmitterCount: number; // Count of currently active transmitters
  backupTransmitterCount: number; // Count of backup transmitters
  reserveTransmitterCount: number; // Count of reserve transmitters
  runningActiveCount: number; // Count of running active transmitters
  runningBackupCount: number; // Count of running backup transmitters
  activeReserveCount: number; // Count of active (transmitting) reserve transmitters
  alerts: number;
}