import { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertTriangle, MapPin, Wifi, Activity } from 'lucide-react';
import { parseCSVData } from '@/utils/csvParser';
import type { SiteData, TransmitterData } from '@/types/dashboard';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default markers in React Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Load CSV data with validation to prevent HTML corruption
const loadCSVData = async (): Promise<SiteData[]> => {
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

// Fallback sites data in case CSV loading fails
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
  }
];

interface AlarmData {
  state: string;
  site: string;
  channel: string;
  frequency: string;
  issue: string;
  severity: 'error' | 'warning';
  siteId: string;
  coordinates: { lat: number; lng: number };
}

// Map control component to handle focusing on sites
function MapController({ focusTarget }: { focusTarget: { lat: number; lng: number } | null }) {
  const map = useMap();
  
  useEffect(() => {
    if (focusTarget) {
      map.setView([focusTarget.lat, focusTarget.lng], 10, { animate: true });
    }
  }, [focusTarget, map]);

  return null;
}

export default function MapPage() {
  const [sites, setSites] = useState<SiteData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [alarms, setAlarms] = useState<AlarmData[]>([]);
  const [focusTarget, setFocusTarget] = useState<{ lat: number; lng: number } | null>(null);
  const [selectedSiteId, setSelectedSiteId] = useState<string | null>(null);

  // Load and set up data
  useEffect(() => {
    const initializeData = async () => {
      setIsLoading(true);
      const data = await loadCSVData();
      setSites(data);
      
      // Extract alarms from site data
      const extractedAlarms: AlarmData[] = [];
      data.forEach(site => {
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
            
            extractedAlarms.push({
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
      
      setAlarms(extractedAlarms);
      setIsLoading(false);
    };

    initializeData();
  }, []);

  // Create custom icons for different site statuses
  const createCustomIcon = (status: string, isSelected: boolean = false) => {
    const color = status === 'operational' ? '#22c55e' : status === 'warning' ? '#f59e0b' : '#ef4444';
    const size = isSelected ? 24 : 20;
    const border = isSelected ? '4px solid #ffffff' : '3px solid white';
    
    return L.divIcon({
      className: 'custom-marker',
      html: `<div style="background-color: ${color}; width: ${size}px; height: ${size}px; border-radius: 50%; border: ${border}; box-shadow: 0 2px 6px rgba(0,0,0,0.3); ${isSelected ? 'z-index: 1000;' : ''}"></div>`,
      iconSize: [size, size],
      iconAnchor: [size/2, size/2]
    });
  };

  // Handle alarm row click to focus map on site
  const handleAlarmClick = (alarm: AlarmData) => {
    console.log(`Focusing map on site: ${alarm.site} at coordinates:`, alarm.coordinates);
    setFocusTarget(alarm.coordinates);
    setSelectedSiteId(alarm.siteId);
    
    // Clear selection after animation
    setTimeout(() => {
      setSelectedSiteId(null);
    }, 3000);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-lg">Loading transmission sites...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <MapPin className="w-6 h-6 text-primary" />
              <h1 className="text-2xl font-bold" data-testid="map-page-title">
                Malaysia Transmission Sites Map
              </h1>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Wifi className="w-4 h-4" />
                <span>{sites.filter(s => s.overallStatus === 'operational').length}/{sites.length} Online</span>
              </div>
              <div className="flex items-center gap-1">
                <Activity className="w-4 h-4" />
                <span>{sites.reduce((sum, s) => sum + s.runningActiveCount + s.runningBackupCount, 0)} TX Active</span>
              </div>
              {alarms.length > 0 && (
                <div className="flex items-center gap-1 text-destructive">
                  <AlertTriangle className="w-4 h-4" />
                  <span>{alarms.length} {alarms.length === 1 ? 'Alarm' : 'Alarms'}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Full Screen Map */}
        <Card className="h-[500px]">
          <CardContent className="p-0 h-full">
            <MapContainer
              center={[4.2105, 101.9758]} // Center of Malaysia
              zoom={6}
              style={{ height: '100%', width: '100%' }}
              className="rounded-lg"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              
              <MapController focusTarget={focusTarget} />
              
              {sites.map(site => (
                <Marker
                  key={site.id}
                  position={[site.coordinates.lat, site.coordinates.lng]}
                  icon={createCustomIcon(site.overallStatus, selectedSiteId === site.id)}
                >
                  <Popup>
                    <div className="space-y-2 min-w-[200px]">
                      <div className="font-semibold">{site.name}</div>
                      <div className="text-sm text-muted-foreground">{site.location}</div>
                      <div className="flex items-center gap-2">
                        <Badge variant={site.overallStatus === 'operational' ? 'default' : site.overallStatus === 'warning' ? 'secondary' : 'destructive'}>
                          {site.overallStatus}
                        </Badge>
                        {site.alerts > 0 && (
                          <Badge variant="destructive" className="flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" />
                            {site.alerts}
                          </Badge>
                        )}
                      </div>
                      <div className="text-sm">
                        <div>Active TX: {site.runningActiveCount}/{site.activeTransmitterCount}</div>
                        <div>Backup TX: {site.runningBackupCount}/{site.backupTransmitterCount}</div>
                        <div>Reserves: {site.activeReserveCount}/{site.reserveTransmitterCount}</div>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </CardContent>
        </Card>

        {/* Alarms Table */}
        {alarms.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-destructive" />
                Active Alarms ({alarms.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>State</TableHead>
                    <TableHead>Site</TableHead>
                    <TableHead>Channel</TableHead>
                    <TableHead>Frequency</TableHead>
                    <TableHead>Issue</TableHead>
                    <TableHead>Severity</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {alarms.map((alarm, index) => (
                    <TableRow 
                      key={index} 
                      data-testid={`alarm-row-${index}`}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => handleAlarmClick(alarm)}
                      title="Click to focus map on this site"
                    >
                      <TableCell className="font-medium">{alarm.state}</TableCell>
                      <TableCell>{alarm.site}</TableCell>
                      <TableCell>{alarm.channel}</TableCell>
                      <TableCell>{alarm.frequency}</TableCell>
                      <TableCell>{alarm.issue}</TableCell>
                      <TableCell>
                        <Badge variant={alarm.severity === 'error' ? 'destructive' : 'secondary'}>
                          {alarm.severity}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {alarms.length === 0 && (
          <Card>
            <CardContent className="text-center py-8">
              <div className="flex items-center justify-center gap-2 text-green-600">
                <Wifi className="w-5 h-5" />
                <span className="text-lg">All transmission sites operating normally</span>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}