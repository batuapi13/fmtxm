import { useState, useEffect } from 'react';
import DashboardHeader from './DashboardHeader';
import SiteCard from './SiteCard';
import MalaysiaMap from './MalaysiaMap';
import type { SiteData } from '@/types/dashboard';

// Real Malaysian FM transmission sites
const mockSites: SiteData[] = [
  {
    id: 'site001',
    name: 'Gunung Ulu Kali',
    location: 'Genting Highlands, Selangor, Malaysia',
    coordinates: { lat: 3.4205, lng: 101.7646 },
    broadcaster: 'Multiple Commercial Broadcasters',
    frequency: 'Multiple FM Frequencies',
    overallStatus: 'operational' as const,
    activeTransmitter: '1' as const,
    transmitters: [
      {
        id: 'tx001',
        type: '1' as const,
        label: '1',
        channelName: 'Eight FM',
        status: 'operational' as const,
        transmitPower: 950,
        reflectPower: 15,
        mainAudio: true,
        backupAudio: true,
        connectivity: true,
        lastSeen: '2 seconds ago'
      },
      {
        id: 'tx002',
        type: '2' as const,
        label: '2',
        channelName: 'GoXuan',
        status: 'operational' as const,
        transmitPower: 920,
        reflectPower: 18,
        mainAudio: true,
        backupAudio: true,
        connectivity: true,
        lastSeen: '1 second ago'
      },
      {
        id: 'tx003',
        type: '3' as const,
        label: '3',
        channelName: 'BFM89.9',
        status: 'warning' as const,
        transmitPower: 880,
        reflectPower: 45,
        mainAudio: true,
        backupAudio: false,
        connectivity: true,
        lastSeen: '3 seconds ago'
      },
      {
        id: 'tx004',
        type: '4' as const,
        label: '4',
        channelName: 'IKIMfm',
        status: 'operational' as const,
        transmitPower: 940,
        reflectPower: 12,
        mainAudio: true,
        backupAudio: true,
        connectivity: true,
        lastSeen: '1 second ago'
      },
      {
        id: 'tx005',
        type: 'reserve' as const,
        label: 'Reserve',
        channelName: 'Standby',
        status: 'operational' as const,
        transmitPower: 0,
        reflectPower: 0,
        mainAudio: true,
        backupAudio: true,
        connectivity: true,
        lastSeen: '2 seconds ago'
      }
    ],
    alerts: 1
  },
  {
    id: 'site002',
    name: 'Media Prima Petaling Jaya',
    location: 'Petaling Jaya, Selangor, Malaysia',
    coordinates: { lat: 3.1319, lng: 101.6841 },
    broadcaster: 'Media Prima Audio',
    frequency: 'Multiple Commercial FM',
    overallStatus: 'operational' as const,
    activeTransmitter: '2' as const,
    transmitters: [
      {
        id: 'tx006',
        type: '1' as const,
        label: '1',
        channelName: 'Hitz',
        status: 'operational' as const,
        transmitPower: 890,
        reflectPower: 22,
        mainAudio: true,
        backupAudio: true,
        connectivity: true,
        lastSeen: '1 second ago'
      },
      {
        id: 'tx007',
        type: '2' as const,
        label: '2',
        channelName: 'Mix',
        status: 'operational' as const,
        transmitPower: 920,
        reflectPower: 18,
        mainAudio: true,
        backupAudio: true,
        connectivity: true,
        lastSeen: '2 seconds ago'
      },
      {
        id: 'tx008',
        type: '3' as const,
        label: '3',
        channelName: 'Fly FM',
        status: 'operational' as const,
        transmitPower: 885,
        reflectPower: 28,
        mainAudio: true,
        backupAudio: true,
        connectivity: true,
        lastSeen: '1 second ago'
      },
      {
        id: 'tx009',
        type: '4' as const,
        label: '4',
        channelName: 'Hot FM',
        status: 'warning' as const,
        transmitPower: 750,
        reflectPower: 85,
        mainAudio: true,
        backupAudio: false,
        connectivity: true,
        lastSeen: '5 seconds ago'
      },
      {
        id: 'tx010',
        type: 'reserve' as const,
        label: 'Reserve',
        channelName: 'Standby',
        status: 'operational' as const,
        transmitPower: 0,
        reflectPower: 0,
        mainAudio: true,
        backupAudio: true,
        connectivity: true,
        lastSeen: '3 seconds ago'
      }
    ],
    alerts: 1
  },
  {
    id: 'site003',
    name: 'RTM Shah Alam',
    location: 'Shah Alam, Selangor, Malaysia',
    coordinates: { lat: 3.0733, lng: 101.5185 },
    broadcaster: 'RTM National',
    frequency: 'Multiple Government FM',
    overallStatus: 'warning' as const,
    activeTransmitter: 'reserve' as const,
    transmitters: [
      {
        id: 'tx011',
        type: '1' as const,
        label: '1',
        channelName: 'Nasional FM',
        status: 'error' as const,
        transmitPower: 0,
        reflectPower: 0,
        mainAudio: false,
        backupAudio: false,
        connectivity: false,
        lastSeen: '15 minutes ago'
      },
      {
        id: 'tx012',
        type: '2' as const,
        label: '2',
        channelName: 'Minnal FM',
        status: 'operational' as const,
        transmitPower: 845,
        reflectPower: 32,
        mainAudio: true,
        backupAudio: true,
        connectivity: true,
        lastSeen: '2 seconds ago'
      },
      {
        id: 'tx013',
        type: '3' as const,
        label: '3',
        channelName: 'Sinar FM',
        status: 'operational' as const,
        transmitPower: 890,
        reflectPower: 25,
        mainAudio: true,
        backupAudio: true,
        connectivity: true,
        lastSeen: '1 second ago'
      },
      {
        id: 'tx014',
        type: '4' as const,
        label: '4',
        channelName: 'Radio Klasik',
        status: 'operational' as const,
        transmitPower: 870,
        reflectPower: 28,
        mainAudio: true,
        backupAudio: true,
        connectivity: true,
        lastSeen: '3 seconds ago'
      },
      {
        id: 'tx015',
        type: 'reserve' as const,
        label: 'Reserve',
        channelName: 'Emergency Broadcast',
        status: 'operational' as const,
        transmitPower: 750,
        reflectPower: 45,
        mainAudio: true,
        backupAudio: true,
        connectivity: true,
        lastSeen: '1 second ago'
      }
    ],
    alerts: 2
  }
];

export default function Dashboard() {
  const [sites, setSites] = useState(mockSites);
  const [filteredSites, setFilteredSites] = useState(mockSites);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSiteId, setSelectedSiteId] = useState<string | undefined>();

  const onlineSites = sites.filter(site => site.overallStatus === 'operational').length;
  const totalAlerts = sites.reduce((sum, site) => sum + site.alerts, 0);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setFilteredSites(sites);
    } else {
      const filtered = sites.filter(site => 
        site.name.toLowerCase().includes(query.toLowerCase()) ||
        site.location.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredSites(filtered);
    }
  };

  const handleRefresh = () => {
    console.log('Refreshing all site data...');
    // todo: implement real SNMP data refresh
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

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setSites(currentSites => 
        currentSites.map(site => {
          const updatedSite = { ...site };
          
          // Update all transmitters
          updatedSite.transmitters = site.transmitters.map((transmitter, index) => {
            const powerVariation = transmitter.status === 'operational' ? 
              (Math.random() - 0.5) * 10 : 0;
            
            const isActive = site.activeTransmitter === transmitter.type;
            const baseTransmitPower = isActive && transmitter.status === 'operational' ? 
              Math.max(0, transmitter.transmitPower + powerVariation) :
              transmitter.transmitPower;
              
            return {
              ...transmitter,
              transmitPower: transmitter.type === 'reserve' && !isActive ? 0 : baseTransmitPower,
              lastSeen: transmitter.connectivity ? 
                `${Math.floor(Math.random() * 10) + 1} seconds ago` : 
                transmitter.lastSeen
            };
          });
          
          return updatedSite;
        })
      );
    }, 50); // Sub-100ms polling for real-time updates

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    handleSearch(searchQuery);
  }, [sites, searchQuery]);

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
        {/* Malaysia Map Section */}
        <div className="w-full">
          <MalaysiaMap 
            sites={filteredSites}
            onSiteSelect={handleSiteClick}
            selectedSiteId={selectedSiteId}
          />
        </div>
        
        {/* Site Cards Grid */}
        <div>
          <h2 className="text-xl font-semibold mb-4" data-testid="sites-section-title">
            Transmission Sites
          </h2>
        <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-6">
          {filteredSites.map(site => (
            <SiteCard 
              key={site.id}
              site={site}
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