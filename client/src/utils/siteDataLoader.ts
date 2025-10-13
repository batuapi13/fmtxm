import { parseCSVData } from '@/utils/csvParser';
import type { SiteData } from '@/types/dashboard';

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
    const csvData = parseCSVData(csvText);
    
    return csvData;
    
  } catch (error) {
    console.error('Error loading CSV data:', error);
    console.log('No fallback data available - returning empty array.');
    return [];
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

// Centralized alarm extraction function - includes both transmitter issues and site-level alerts
export const extractAlarmsFromSites = (sites: SiteData[]): AlarmData[] => {
  const alarms: AlarmData[] = [];
  
  sites.forEach(site => {
    const state = site.location.split(',')[0].trim();
    
    // Add transmitter-specific alarms
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
    
    // Add site-level alerts as alarms (if any additional alerts beyond transmitter issues)
    const transmitterAlarmCount = site.transmitters.filter(tx => tx.status === 'error' || tx.status === 'warning').length;
    const additionalAlerts = site.alerts - transmitterAlarmCount;
    
    for (let i = 0; i < additionalAlerts; i++) {
      alarms.push({
        state,
        site: site.name,
        channel: 'Site Infrastructure',
        frequency: 'N/A',
        issue: 'Site-level operational alert',
        severity: 'warning',
        siteId: site.id,
        coordinates: site.coordinates
      });
    }
  });
  
  return alarms;
};