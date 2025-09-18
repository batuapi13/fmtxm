export type TransmitterStatus = 'operational' | 'warning' | 'error' | 'offline';
export type TransmitterType = 'main' | 'reserve';

export interface TransmitterData {
  id: string;
  type: TransmitterType;
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
  overallStatus: TransmitterStatus;
  activeTransmitter: TransmitterType;
  transmitters: {
    main: TransmitterData;
    reserve: TransmitterData;
  };
  alerts: number;
}