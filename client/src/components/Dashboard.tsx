import { useState, useEffect } from 'react';
import DashboardHeader from './DashboardHeader';
import StateCard from './StateCard';
import SiteCard from './SiteCard';
import MalaysiaMap from './MalaysiaMap';
import { snmpService } from '@/services/snmpService';
import type { SiteData, TransmitterData, TransmitterStatus, TransmitterType, TransmitterRole } from '@/types/dashboard';

// Convert raw transmitter and site data to SiteData format
const convertMetricsToSiteData = (transmitters: any[], sites: any[], latestMetrics: any[]): SiteData[] => {
  // Group transmitters by site (camelCase siteId from DB)
  const transmittersBySite = transmitters.reduce((acc: Record<string, any[]>, transmitter: any) => {
    const siteId = transmitter.siteId;
    if (!siteId) return acc;
    if (!acc[siteId]) {
      acc[siteId] = [];
    }
    acc[siteId].push(transmitter);
    return acc;
  }, {} as Record<string, any[]>);

  // Create metrics lookup keyed by transmitterId
  const metricsLookup = latestMetrics.reduce((acc: Record<string, any>, item: any) => {
    acc[item.transmitterId] = item.metrics;
    return acc;
  }, {} as Record<string, any>);

  return sites.map((site: any): SiteData => {
    // Sort by displayOrder for consistent UI ordering
    const siteTransmitters = (transmittersBySite[site.id] || [])
      .slice()
      .sort((a: any, b: any) => {
        const ao = typeof a.displayOrder === 'number' ? a.displayOrder : 0;
        const bo = typeof b.displayOrder === 'number' ? b.displayOrder : 0;
        return ao - bo;
      });
    
    const transmitterData: TransmitterData[] = siteTransmitters.map((transmitter: any, index: number): TransmitterData => {
      const metrics = metricsLookup[transmitter.id] || {};
      const rawStatus = metrics?.status;
      const forwardPower = metrics?.forwardPower ?? 0;
      const reflectedPower = metrics?.reflectedPower ?? 0;
      const statusUi: TransmitterStatus = rawStatus === 'active'
        ? 'operational'
        : rawStatus === 'standby'
        ? 'warning'
        : rawStatus === 'fault'
        ? 'error'
        : 'offline';
      const isOnline = rawStatus !== 'offline';
      
      // Prefer label from site config (server displayLabel exposed as label)
      const apiLabelCandidate = (typeof transmitter.label === 'string' ? transmitter.label : transmitter.displayLabel) as string | undefined;
      const apiLabel = apiLabelCandidate && apiLabelCandidate.trim().length > 0 ? apiLabelCandidate.trim() : undefined;
      const roleDefaultLabel = transmitter.role === 'active'
        ? 'Main'
        : transmitter.role === 'backup'
        ? 'Backup'
        : String(index + 1);
      const computedLabel = apiLabel ?? roleDefaultLabel;
      
      return {
        id: transmitter.id,
        label: computedLabel,
        type: (transmitter.type || '1') as TransmitterType,
        role: (transmitter.role || 'active') as TransmitterRole,
        status: statusUi,
        channelName: transmitter.name || 'Unknown',
        frequency: (metrics?.frequency ?? transmitter.frequency ?? 0).toString(),
        transmitPower: forwardPower,
        reflectPower: reflectedPower,
        mainAudio: false,
        backupAudio: false,
        connectivity: isOnline,
        lastSeen: metrics?.timestamp ? new Date(metrics.timestamp).toISOString() : new Date().toISOString(),
        isTransmitting: forwardPower > 0
      };
    });

    // Calculate counts
    const activeCount = transmitterData.filter(t => t.role === 'active').length;
    const backupCount = transmitterData.filter(t => t.role === 'backup').length;
    const standbyCount = transmitterData.filter(t => t.role === 'standby').length;
    // Use status-based logic: 'operational' == currently active; 'warning' == standby
    const runningCount = transmitterData.filter(t => t.status === 'operational').length;
    const alertCount = transmitterData.filter(t => t.status === 'error' || t.status === 'warning').length;

    // Determine overall status
    let overallStatus: TransmitterStatus = 'operational';
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
      runningActiveCount: transmitterData.filter(t => t.role === 'active' && t.status === 'operational').length,
      runningBackupCount: transmitterData.filter(t => t.role === 'backup' && t.status === 'operational').length,
      activeStandbyCount: transmitterData.filter(t => t.role === 'standby' && t.status === 'operational').length
    };
  });
};

export default function Dashboard() {
  const [sites, setSites] = useState<SiteData[]>([]);
  const [filteredSites, setFilteredSites] = useState<SiteData[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedSiteId, setSelectedSiteId] = useState<string | undefined>(undefined);
  const [transmitters, setTransmitters] = useState<any[]>([]);
  const [dbSites, setDbSites] = useState<any[]>([]);

  // Initialize data from database
  useEffect(() => {
    const initializeData = async () => {
      try {
        setLoading(true);
        
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
      } catch (error) {
        console.error('Failed to initialize dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeData();
  }, []);

  // Subscribe to real-time updates
  useEffect(() => {
    const unsubscribe = snmpService.subscribeToUpdates((data: any) => {
      if (data.latestMetrics && Array.isArray(data.latestMetrics)) {
        // Update sites with new metrics
        setSites(prevSites => {
          const updatedSites = prevSites.map(site => {
            const updatedTransmitters = site.transmitters.map(transmitter => {
              const metricUpdate = data.latestMetrics.find((m: any) => m.transmitterId === transmitter.id);
              if (metricUpdate && metricUpdate.metrics) {
                const metrics = metricUpdate.metrics;
                const rawStatus = metrics?.status;
                const forwardPower = metrics?.forwardPower ?? transmitter.transmitPower;
                const reflectedPower = metrics?.reflectedPower ?? transmitter.reflectPower;
                const statusUi: TransmitterStatus = rawStatus === 'active'
                  ? 'operational'
                  : rawStatus === 'standby'
                  ? 'warning'
                  : rawStatus === 'fault'
                  ? 'error'
                  : 'offline';
                const isOnline = rawStatus !== 'offline';

                return {
                  ...transmitter,
                  status: statusUi,
                  transmitPower: forwardPower,
                  reflectPower: reflectedPower,
                  mainAudio: transmitter.mainAudio,
                  backupAudio: transmitter.backupAudio,
                  connectivity: isOnline,
                  lastSeen: metrics?.timestamp ? new Date(metrics.timestamp).toISOString() : transmitter.lastSeen,
                  isTransmitting: forwardPower > 0
                };
              }
              return transmitter;
            });

            // Recalculate counts and status
            const activeCount = updatedTransmitters.filter(t => t.role === 'active').length;
            const backupCount = updatedTransmitters.filter(t => t.role === 'backup').length;
            const standbyCount = updatedTransmitters.filter(t => t.role === 'standby').length;
            // status-based logic for running counts
            const runningCount = updatedTransmitters.filter(t => t.status === 'operational').length;
            const alertCount = updatedTransmitters.filter(t => t.status === 'error' || t.status === 'warning').length;

            let overallStatus: TransmitterStatus = 'operational';
            if (alertCount > 0) {
              overallStatus = 'error';
            } else if (runningCount === 0) {
              overallStatus = 'offline';
            } else if (runningCount < activeCount) {
              overallStatus = 'warning';
            }

            return {
              ...site,
              transmitters: updatedTransmitters,
              alerts: alertCount,
              activeTransmitterCount: activeCount,
              backupTransmitterCount: backupCount,
              standbyTransmitterCount: standbyCount,
              runningActiveCount: updatedTransmitters.filter(t => t.role === 'active' && t.status === 'operational').length,
              runningBackupCount: updatedTransmitters.filter(t => t.role === 'backup' && t.status === 'operational').length,
              activeStandbyCount: updatedTransmitters.filter(t => t.role === 'standby' && t.status === 'operational').length,
              overallStatus
            };
          });

          return updatedSites;
        });
      }
    });

    return unsubscribe;
  }, []);

  // Apply search filter
  useEffect(() => {
    if (searchQuery) {
      const filtered = sites.filter(site =>
        site.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        site.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        site.broadcaster.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredSites(filtered);
    } else {
      setFilteredSites(sites);
    }
  }, [sites, searchQuery]);

  const onlineSites = sites.filter(site => site.overallStatus === 'operational').length;
  const totalAlerts = sites.reduce((sum, site) => sum + site.alerts, 0);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleStatusFilter = (status: string) => {
    if (status === 'all') {
      setFilteredSites(sites);
    } else {
      const filtered = sites.filter(site => site.overallStatus === status);
      setFilteredSites(filtered);
    }
  };

  const handleRefresh = async () => {
    console.log('Refreshing all site data...');
    try {
      const latestMetrics = await snmpService.getLatestTransmitterMetrics();
      const updatedSiteData = convertMetricsToSiteData(transmitters, dbSites, latestMetrics);
      setSites(updatedSiteData);
      setFilteredSites(updatedSiteData);
    } catch (error) {
      console.error('Failed to refresh data:', error);
    }
  };

  const handleSiteClick = (siteId: string) => {
    console.log(`Opening detailed view for site: ${siteId}`);
    setSelectedSiteId(siteId);
    // todo: implement detailed site view
  };

  const handleSettings = () => {
    console.log('Opening SNMP configuration settings...');
    // todo: implement settings panel
  };

  const groupedByState = filteredSites.reduce((groups, site) => {
    // Extract state from location if not available as separate field
    const state = site.location.split(',')[0]?.trim() || 'Unknown';
    if (!groups[state]) {
      groups[state] = [];
    }
    groups[state].push(site);
    return groups;
  }, {} as Record<string, SiteData[]>);

  const sortedStates = Object.keys(groupedByState).sort();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader 
        totalSites={sites.length}
        onlineSites={onlineSites}
        totalAlerts={totalAlerts}
        onSearch={handleSearch}
        onRefresh={handleRefresh}
        onSettingsClick={handleSettings}
      />

      <div className="p-6 space-y-6">
        <div className="w-full">
          <MalaysiaMap 
            sites={filteredSites}
            onSiteSelect={handleSiteClick}
            onStatusFilter={handleStatusFilter}
            selectedSiteId={selectedSiteId}
          />
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4" data-testid="sites-section-title">
            Transmission Sites by State
          </h2>
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

          {filteredSites.length === 0 && searchQuery && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No sites found matching "{searchQuery}"</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}