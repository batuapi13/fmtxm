import { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertTriangle, MapPin, Wifi, Activity } from 'lucide-react';
import { extractAlarmsFromSites, type AlarmData } from '@/utils/siteDataLoader';
import { snmpService } from '@/services/snmpService';
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
  const [transmitters, setTransmitters] = useState<any[]>([]);
  const [dbSites, setDbSites] = useState<any[]>([]);

  // Convert raw transmitter and site data to SiteData format
  const convertMetricsToSiteData = (transmitters: any[], sites: any[], metrics: any[]): SiteData[] => {
    return sites.map(site => {
      const siteTransmitters = transmitters.filter(t => t.siteId === site.id);
      const siteMetrics = metrics.filter(m => siteTransmitters.some(t => t.id === m.transmitterId));
      
      const transmitterData: TransmitterData[] = siteTransmitters.map(transmitter => {
        const metric = siteMetrics.find(m => m.transmitterId === transmitter.id);
        
        return {
          id: transmitter.id,
          name: transmitter.name,
          type: transmitter.type?.toString() || '1',
          role: transmitter.role === 'main' ? 'active' : transmitter.role === 'backup' ? 'backup' : 'standby',
          status: metric ? (metric.isOnline ? 'operational' : 'offline') : 'offline',
          frequency: metric?.frequency || 0,
          power: metric?.power || 0,
          transmitPower: metric?.transmitPower || 0,
          reflectPower: metric?.reflectPower || 0,
          mainAudio: metric?.mainAudio || 0,
          backupAudio: metric?.backupAudio || 0,
          connectivity: metric?.isOnline ? 'connected' : 'disconnected',
          lastSeen: metric?.timestamp ? new Date(metric.timestamp) : new Date(),
          isTransmitting: metric?.isTransmitting || false
        };
      });

      const operationalCount = transmitterData.filter(t => t.status === 'operational').length;
      const warningCount = transmitterData.filter(t => t.status === 'warning').length;
      const errorCount = transmitterData.filter(t => t.status === 'error').length;
      const offlineCount = transmitterData.filter(t => t.status === 'offline').length;

      let overallStatus: 'operational' | 'warning' | 'error' | 'offline' = 'operational';
      if (errorCount > 0) overallStatus = 'error';
      else if (warningCount > 0) overallStatus = 'warning';
      else if (offlineCount === transmitterData.length) overallStatus = 'offline';

      return {
        id: site.id,
        name: site.name,
        state: site.state,
        coordinates: { lat: site.latitude, lng: site.longitude },
        status: overallStatus,
        transmitters: transmitterData,
        totalTransmitters: transmitterData.length,
        operationalCount,
        warningCount,
        errorCount,
        offlineCount
      };
    });
  };

  // Load and set up data
  useEffect(() => {
    const initializeData = async () => {
      setIsLoading(true);
      try {
        // Fetch data from database
        const [transmittersData, sitesData, latestMetrics] = await Promise.all([
          snmpService.getTransmitters(),
          snmpService.getSites(),
          snmpService.getLatestTransmitterMetrics()
        ]);

        setTransmitters(transmittersData);
        setDbSites(sitesData);

        // Convert to SiteData format
        const siteData = convertMetricsToSiteData(transmittersData, sitesData, latestMetrics);
        setSites(siteData);
        
        // Extract alarms using shared function
        const extractedAlarms = extractAlarmsFromSites(siteData);
        setAlarms(extractedAlarms);
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setIsLoading(false);
      }
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
              
              {sites.map(site => {
                // Check if this site has any alarms in the unified system
                const siteAlarms = alarms.filter(alarm => alarm.siteId === site.id);
                const hasAlarms = siteAlarms.length > 0;
                
                // Determine visual status - if site has alarms, show warning/error regardless of overallStatus
                let visualStatus = site.overallStatus;
                if (hasAlarms) {
                  // If there are error-level alarms, show error; otherwise show warning
                  const hasErrorAlarms = siteAlarms.some(alarm => alarm.severity === 'error');
                  visualStatus = hasErrorAlarms ? 'error' : 'warning';
                }
                
                
                return (
                  <Marker
                    key={`${site.id}-${visualStatus}-${selectedSiteId === site.id}`}
                    position={[site.coordinates.lat, site.coordinates.lng]}
                    icon={createCustomIcon(visualStatus, selectedSiteId === site.id)}
                  >
                  <Popup>
                    <div className="space-y-2 min-w-[200px]">
                      <div className="font-semibold">{site.name}</div>
                      <div className="text-sm text-muted-foreground">{site.location}</div>
                      <div className="flex items-center gap-2">
                        <Badge variant={site.overallStatus === 'operational' ? 'default' : site.overallStatus === 'warning' ? 'secondary' : 'destructive'}>
                          {site.overallStatus}
                        </Badge>
                        {alarms.filter(alarm => alarm.siteId === site.id).length > 0 && (
                          <Badge variant="destructive" className="flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" />
                            {alarms.filter(alarm => alarm.siteId === site.id).length}
                          </Badge>
                        )}
                      </div>
                      <div className="text-sm">
                        <div>Active TX: {site.runningActiveCount}/{site.activeTransmitterCount}</div>
                        <div>Backup TX: {site.runningBackupCount}/{site.backupTransmitterCount}</div>
                        <div>Standby Pool: {site.activeStandbyCount}/{site.standbyTransmitterCount}</div>
                      </div>
                    </div>
                  </Popup>
                </Marker>
                );
              })}
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