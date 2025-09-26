export type TransmitterStatus = 'operational' | 'warning' | 'error' | 'offline';
export type TransmitterType = '1' | '2' | '3' | '4' | 'reserve';

export interface TransmitterData {
  id: string;
  type: TransmitterType;
  label: string; // "1", "2", "3", "4", "Reserve"
  channelName: string; // Channel name from OID
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
  frequency: string;
  overallStatus: TransmitterStatus;
  activeTransmitter: TransmitterType;
  transmitters: TransmitterData[]; // Array of 5 transmitters (1,2,3,4,reserve)
  alerts: number;
}