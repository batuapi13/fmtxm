import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import StateCard from '@/components/StateCard';
import { Search, Filter, RefreshCw, Settings, Layers } from 'lucide-react';
import { extractAlarmsFromSites } from '@/utils/siteDataLoader';
import { snmpService } from '@/services/snmpService';
import type { SiteData } from '@/types/dashboard';


// Convert raw transmitter and site data to SiteData format
const convertMetricsToSiteData = (transmitters: any[], sites: any[], latestMetrics: any[]): SiteData[] => {
  // Group transmitters by site
  const transmittersBySite = transmitters.reduce((acc: Record<string, any[]>, transmitter: any) => {
    const siteId = transmitter.site_id;
    if (!acc[siteId]) {
      acc[siteId] = [];
    }
    acc[siteId].push(transmitter);
    return acc;
  }, {} as Record<string, any[]>);

  // Create metrics lookup
  const metricsLookup = latestMetrics.reduce((acc: Record<string, any>, item: any) => {
    acc[item.transmitterId] = item.metrics;
    return acc;
  }, {} as Record<string, any>);

  return sites.map((site: any): SiteData => {
    const siteTransmitters = transmittersBySite[site.id] || [];
    
    const transmitterData: any[] = siteTransmitters.map((transmitter: any) => {
      const metrics = metricsLookup[transmitter.id] || {};
      
      return {
        id: transmitter.id,
        label: transmitter.label || transmitter.name,
        type: (transmitter.type || '1'),
        role: (transmitter.role || 'active'),
        status: (transmitter.status || 'offline'),
        channelName: transmitter.channel_name || 'Unknown',
        frequency: transmitter.frequency?.toString() || '0.0',
        transmitPower: metrics.transmit_power || 0,
        reflectPower: metrics.reflect_power || 0,
        mainAudio: metrics.main_audio || false,
        backupAudio: metrics.backup_audio || false,
        connectivity: metrics.connectivity || false,
        lastSeen: metrics.last_seen ? new Date(metrics.last_seen).toISOString() : new Date().toISOString(),
        isTransmitting: metrics.is_transmitting || false
      };
    });

    // Calculate counts
    const activeCount = transmitterData.filter(t => t.role === 'active').length;
    const backupCount = transmitterData.filter(t => t.role === 'backup').length;
    const standbyCount = transmitterData.filter(t => t.role === 'standby').length;
    const runningCount = transmitterData.filter(t => t.isTransmitting).length;
    const alertCount = transmitterData.filter(t => t.status === 'error' || t.status === 'warning').length;

    // Determine overall status
    let overallStatus = 'operational';
    if (alertCount > 0) {
      overallStatus = 'error';
    } else if (runningCount === 0) {
      overallStatus = 'offline';
    } else if (runningCount < activeCount) {
      overallStatus = 'warning';
    }

    return {
      id: site.id,
      name: site.name,
      location: site.location || 'Unknown',
      coordinates: {
        lat: site.latitude || 0,
        lng: site.longitude || 0
      },
      broadcaster: site.broadcaster || 'Unknown',
      transmitters: transmitterData,
      overallStatus,
      alerts: alertCount,
      activeTransmitterCount: activeCount,
      backupTransmitterCount: backupCount,
      standbyTransmitterCount: standbyCount,
      runningActiveCount: runningCount,
      runningBackupCount: transmitterData.filter(t => t.role === 'backup' && t.isTransmitting).length,
      activeStandbyCount: transmitterData.filter(t => t.role === 'standby' && t.isTransmitting).length
    };
  });
};

export default function CardsPage() {
  const [sites, setSites] = useState<SiteData[]>([]);
  const [filteredSites, setFilteredSites] = useState<SiteData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'operational' | 'warning' | 'error'>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [totalAlarms, setTotalAlarms] = useState(0);
  const [transmitters, setTransmitters] = useState<any[]>([]);
  const [dbSites, setDbSites] = useState<any[]>([]);

  // Initialize data from database
  useEffect(() => {
    const initializeData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch transmitters and sites from database
        const [transmittersData, sitesData] = await Promise.all([
          snmpService.getTransmitters(),
          snmpService.getSites()
        ]);
        
        setTransmitters(transmittersData);
        setDbSites(sitesData);
        
        // Get latest metrics and convert to site data
        const latestMetrics = await snmpService.getLatestTransmitterMetrics();
        const siteData = convertMetricsToSiteData(transmittersData, sitesData, latestMetrics);
        
        setSites(siteData);
        setFilteredSites(siteData);
        
        // Use centralized alarm extraction to ensure consistency with MapPage
        const alarms = extractAlarmsFromSites(siteData);
        setTotalAlarms(alarms.length);
      } catch (error) {
        console.error('Failed to initialize cards page data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeData();
  }, []);

  // Filter sites based on search and status
  useEffect(() => {
    let filtered = sites;

    if (searchTerm) {
      filtered = filtered.filter(site => 
        site.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        site.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        site.broadcaster.toLowerCase().includes(searchTerm.toLowerCase()) ||
        site.transmitters.some(tx => 
          tx.channelName.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(site => site.overallStatus === statusFilter);
    }

    setFilteredSites(filtered);
  }, [sites, searchTerm, statusFilter]);

  // Group filtered sites by state
  const groupedByState = filteredSites.reduce((groups, site) => {
    // Extract state from location (e.g., "JOHOR, Malaysia" -> "JOHOR")
    const state = site.location.split(',')[0].trim();
    if (!groups[state]) {
      groups[state] = [];
    }
    groups[state].push(site);
    return groups;
  }, {} as Record<string, SiteData[]>);

  // Sort states alphabetically
  const sortedStates = Object.keys(groupedByState).sort();

  const handleSiteClick = (siteId: string) => {
    console.log(`Site selected: ${siteId}`);
  };

  const handleRefresh = async () => {
    console.log('Refreshing all site data...');
    try {
      const latestMetrics = await snmpService.getLatestTransmitterMetrics();
      const updatedSiteData = convertMetricsToSiteData(transmitters, dbSites, latestMetrics);
      setSites(updatedSiteData);
      setFilteredSites(updatedSiteData);
      
      // Update alarms count
      const alarms = extractAlarmsFromSites(updatedSiteData);
      setTotalAlarms(alarms.length);
    } catch (error) {
      console.error('Failed to refresh data:', error);
    }
  };

  const handleSettings = () => {
    console.log('Opening SNMP configuration settings...');
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
              <Layers className="w-6 h-6 text-primary" />
              <h1 className="text-2xl font-bold" data-testid="cards-page-title">
                Transmission Sites Overview
              </h1>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <Badge variant="outline">
                {sites.length} Total Sites
              </Badge>
              <Badge variant="default">
                {sites.filter(s => s.overallStatus === 'operational').length} Online
              </Badge>
              {totalAlarms > 0 && (
                <Badge variant="destructive">
                  {totalAlarms} {totalAlarms === 1 ? 'Alarm' : 'Alarms'}
                </Badge>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleRefresh}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Button variant="outline" size="sm" onClick={handleSettings}>
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Search and Filter Controls */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Search & Filter</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search sites, channels, or locations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                    data-testid="search-input"
                  />
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button
                  variant={statusFilter === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setStatusFilter('all')}
                  className="flex items-center gap-1"
                >
                  <Filter className="w-4 h-4" />
                  All
                </Button>
                <Button
                  variant={statusFilter === 'operational' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setStatusFilter('operational')}
                >
                  Operational
                </Button>
                <Button
                  variant={statusFilter === 'warning' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setStatusFilter('warning')}
                >
                  Warning
                </Button>
                <Button
                  variant={statusFilter === 'error' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setStatusFilter('error')}
                >
                  Error
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* State Cards Grid */}
        <div className="space-y-6">
          {sortedStates.map(state => (
            <StateCard
              key={state}
              state={state}
              sites={groupedByState[state]}
              onSiteClick={handleSiteClick}
            />
          ))}
        </div>
        
        {filteredSites.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            No transmission sites found matching your criteria.
          </div>
        )}
      </div>
    </div>
  );
}