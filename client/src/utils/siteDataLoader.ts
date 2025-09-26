import { parseCSVData } from '@/utils/csvParser';
import type { SiteData } from '@/types/dashboard';

// Consistent fallback sites data used by both Map and Cards pages
const fallbackSites: SiteData[] = [
  {
    id: 'site001',
    name: 'Gunung Ulu Kali',
    location: 'SELANGOR, Malaysia',
    coordinates: { lat: 3.4205, lng: 101.7646 },
    broadcaster: 'Selangor Broadcasting Network',
    overallStatus: 'operational' as const,
    activeTransmitterCount: 8,
    backupTransmitterCount: 4,
    reserveTransmitterCount: 2,
    runningActiveCount: 8,
    runningBackupCount: 4,
    activeReserveCount: 0,
    transmitters: [
      { id: 'tx001', type: '1' as const, role: 'active' as const, label: '1', channelName: 'Eight FM', frequency: '88.1', status: 'operational' as const, transmitPower: 950, reflectPower: 15, mainAudio: true, backupAudio: true, connectivity: true, lastSeen: '2 seconds ago', isTransmitting: true },
      { id: 'tx002', type: '2' as const, role: 'active' as const, label: '2', channelName: 'GoXuan FM', frequency: '90.5', status: 'operational' as const, transmitPower: 920, reflectPower: 18, mainAudio: true, backupAudio: true, connectivity: true, lastSeen: '1 second ago', isTransmitting: true },
      { id: 'tx003', type: '3' as const, role: 'active' as const, label: '3', channelName: 'BFM 89.9', frequency: '89.9', status: 'warning' as const, transmitPower: 880, reflectPower: 45, mainAudio: true, backupAudio: false, connectivity: true, lastSeen: '3 seconds ago', isTransmitting: true },
      { id: 'tx004', type: '11' as const, role: 'backup' as const, label: '11', channelName: 'Best FM', frequency: '104.1', status: 'error' as const, transmitPower: 0, reflectPower: 0, mainAudio: false, backupAudio: false, connectivity: false, lastSeen: '12 minutes ago', isTransmitting: false }
    ],
    alerts: 2
  },
  {
    id: 'site002',
    name: 'Kuantan | Bukit Pelindung',
    location: 'PAHANG, Malaysia',
    coordinates: { lat: 3.8077, lng: 103.3260 },
    broadcaster: 'Pahang Broadcasting Network',
    overallStatus: 'error' as const,
    activeTransmitterCount: 6,
    backupTransmitterCount: 3,
    reserveTransmitterCount: 1,
    runningActiveCount: 5,
    runningBackupCount: 2,
    activeReserveCount: 1,
    transmitters: [
      { id: 'tx005', type: '1' as const, role: 'active' as const, label: '1', channelName: 'Gegar', frequency: '97.1', status: 'error' as const, transmitPower: 0, reflectPower: 0, mainAudio: false, backupAudio: false, connectivity: false, lastSeen: '45 minutes ago', isTransmitting: false },
      { id: 'tx006', type: '2' as const, role: 'active' as const, label: '2', channelName: 'Pahang FM', frequency: '95.3', status: 'operational' as const, transmitPower: 980, reflectPower: 12, mainAudio: true, backupAudio: true, connectivity: true, lastSeen: '1 second ago', isTransmitting: true }
    ],
    alerts: 1
  },
  {
    id: 'site003',
    name: 'Penang Hill',
    location: 'PENANG, Malaysia',
    coordinates: { lat: 5.4205, lng: 100.2697 },
    broadcaster: 'Penang Broadcasting Network',
    overallStatus: 'warning' as const,
    activeTransmitterCount: 5,
    backupTransmitterCount: 2,
    reserveTransmitterCount: 1,
    runningActiveCount: 4,
    runningBackupCount: 2,
    activeReserveCount: 0,
    transmitters: [
      { id: 'tx007', type: '1' as const, role: 'active' as const, label: '1', channelName: 'Mix FM', frequency: '94.5', status: 'warning' as const, transmitPower: 850, reflectPower: 42, mainAudio: true, backupAudio: false, connectivity: true, lastSeen: '5 seconds ago', isTransmitting: true },
      { id: 'tx008', type: '2' as const, role: 'active' as const, label: '2', channelName: 'Lite FM', frequency: '105.7', status: 'operational' as const, transmitPower: 920, reflectPower: 18, mainAudio: true, backupAudio: true, connectivity: true, lastSeen: '2 seconds ago', isTransmitting: true }
    ],
    alerts: 1
  },
  {
    id: 'site004',
    name: 'Mount Santubong',
    location: 'SARAWAK, Malaysia',
    coordinates: { lat: 1.7297, lng: 110.3400 },
    broadcaster: 'Sarawak Broadcasting Network',
    overallStatus: 'warning' as const,
    activeTransmitterCount: 4,
    backupTransmitterCount: 2,
    reserveTransmitterCount: 1,
    runningActiveCount: 3,
    runningBackupCount: 1,
    activeReserveCount: 1,
    transmitters: [
      { id: 'tx009', type: '1' as const, role: 'active' as const, label: '1', channelName: 'Red FM', frequency: '104.9', status: 'warning' as const, transmitPower: 750, reflectPower: 48, mainAudio: true, backupAudio: false, connectivity: true, lastSeen: '8 seconds ago', isTransmitting: true },
      { id: 'tx010', type: '2' as const, role: 'active' as const, label: '2', channelName: 'Cats FM', frequency: '99.9', status: 'operational' as const, transmitPower: 900, reflectPower: 20, mainAudio: true, backupAudio: true, connectivity: true, lastSeen: '3 seconds ago', isTransmitting: true }
    ],
    alerts: 1
  }
];

// Centralized CSV data loading function with consistent validation and fallback
export const loadSiteData = async (): Promise<SiteData[]> => {
  try {
    const response = await fetch('/attached_assets/malaysia_radio_frequencies_normalized_1758859695370.csv');
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const csvText = await response.text();
    
    // Validate that we received CSV content, not HTML
    const firstLine = csvText.split('\n')[0]?.trim();
    const expectedHeader = 'State,Site,Station,Frequency (MHz)';
    
    // Check for HTML indicators or wrong header
    if (csvText.includes('<!DOCTYPE html>') || 
        csvText.includes('THEME_PREVIEW_STYLE_ID') || 
        csvText.includes('HIGHLIGHT_BG:') ||
        firstLine !== expectedHeader) {
      
      console.error('CSV validation failed. Received HTML or invalid content instead of CSV.');
      console.error('First 120 characters:', csvText.substring(0, 120));
      throw new Error('Invalid CSV content - received HTML or malformed data');
    }
    
    console.log('CSV validation passed. Loading authentic Malaysian radio frequency data...');
    return parseCSVData(csvText);
    
  } catch (error) {
    console.error('Error loading CSV data:', error);
    console.log('Falling back to predefined site data to maintain functionality.');
    return fallbackSites;
  }
};

// Interface for alarm data used by both pages
export interface AlarmData {
  state: string;
  site: string;
  channel: string;
  frequency: string;
  issue: string;
  severity: 'error' | 'warning';
  siteId: string;
  coordinates: { lat: number; lng: number };
}

// Centralized alarm extraction function to ensure consistency
export const extractAlarmsFromSites = (sites: SiteData[]): AlarmData[] => {
  const alarms: AlarmData[] = [];
  
  sites.forEach(site => {
    const state = site.location.split(',')[0].trim();
    site.transmitters.forEach(transmitter => {
      if (transmitter.status === 'error' || transmitter.status === 'warning') {
        let issue = '';
        if (transmitter.status === 'error') {
          issue = 'Transmitter offline - No connectivity';
        } else if (transmitter.status === 'warning') {
          if (!transmitter.backupAudio) issue = 'Backup audio failure';
          if (transmitter.reflectPower > 40) issue = 'High reflect power';
        }
        
        alarms.push({
          state,
          site: site.name,
          channel: transmitter.channelName,
          frequency: `${transmitter.frequency} MHz`,
          issue,
          severity: transmitter.status as 'error' | 'warning',
          siteId: site.id,
          coordinates: site.coordinates
        });
      }
    });
  });
  
  return alarms;
};