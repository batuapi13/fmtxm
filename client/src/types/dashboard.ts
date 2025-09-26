export type TransmitterStatus = 'operational' | 'warning' | 'error' | 'offline';
export type TransmitterType = '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | '11' | '12' | 'reserve1' | 'reserve2';

export interface TransmitterData {
  id: string;
  type: TransmitterType;
  label: string; // "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "Reserve 1", "Reserve 2"
  channelName: string; // Channel name from OID
  frequency: string; // Frequency in MHz (e.g., "88.1", "95.8")
  status: TransmitterStatus;
  transmitPower: number;
  reflectPower: number;
  mainAudio: boolean;
  backupAudio: boolean;
  connectivity: boolean;
  lastSeen: string;
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
  alerts: number;
}