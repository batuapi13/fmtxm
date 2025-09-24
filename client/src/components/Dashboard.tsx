import { useState, useEffect } from 'react';
import DashboardHeader from './DashboardHeader';
import SiteCard from './SiteCard';
import MalaysiaMap from './MalaysiaMap';
import type { SiteData } from '@/types/dashboard';

// Real Malaysian FM transmission sites
const mockSites: SiteData[] = [
  {
    id: 'site001',
    name: 'RTM Kuala Lumpur',
    location: 'Kuala Lumpur, Malaysia',
    overallStatus: 'operational' as const,
    activeTransmitter: 'main' as const,
    transmitters: {
      main: {
        id: 'tx001',
        type: 'main' as const,
        status: 'operational' as const,
        transmitPower: 950,
        reflectPower: 15,
        mainAudio: true,
        backupAudio: true,
        connectivity: true,
        lastSeen: '2 seconds ago'
      },
      reserve: {
        id: 'tx002',
        type: 'reserve' as const,
        status: 'operational' as const,
        transmitPower: 0,
        reflectPower: 0,
        mainAudio: true,
        backupAudio: true,
        connectivity: true,
        lastSeen: '5 seconds ago'
      }
    },
    alerts: 0
  },
  {
    id: 'site002',
    name: 'Gunung Jerai',
    location: 'Kedah, Malaysia',
    overallStatus: 'warning' as const,
    activeTransmitter: 'main' as const,
    transmitters: {
      main: {
        id: 'tx003',
        type: 'main' as const,
        status: 'warning' as const,
        transmitPower: 820,
        reflectPower: 65,
        mainAudio: true,
        backupAudio: false,
        connectivity: true,
        lastSeen: '1 minute ago'
      },
      reserve: {
        id: 'tx004',
        type: 'reserve' as const,
        status: 'operational' as const,
        transmitPower: 0,
        reflectPower: 0,
        mainAudio: true,
        backupAudio: true,
        connectivity: true,
        lastSeen: '3 seconds ago'
      }
    },
    alerts: 2
  },
  {
    id: 'site003',
    name: 'Bukit Penara',
    location: 'Pulau Pinang, Malaysia',
    overallStatus: 'operational' as const,
    activeTransmitter: 'main' as const,
    transmitters: {
      main: {
        id: 'tx005',
        type: 'main' as const,
        status: 'operational' as const,
        transmitPower: 890,
        reflectPower: 25,
        mainAudio: true,
        backupAudio: true,
        connectivity: true,
        lastSeen: '3 seconds ago'
      },
      reserve: {
        id: 'tx006',
        type: 'reserve' as const,
        status: 'operational' as const,
        transmitPower: 0,
        reflectPower: 0,
        mainAudio: true,
        backupAudio: true,
        connectivity: true,
        lastSeen: '1 second ago'
      }
    },
    alerts: 0
  },
  {
    id: 'site004',
    name: 'Gunung Ledang',
    location: 'Johor, Malaysia',
    overallStatus: 'operational' as const,
    activeTransmitter: 'main' as const,
    transmitters: {
      main: {
        id: 'tx007',
        type: 'main' as const,
        status: 'operational' as const,
        transmitPower: 995,
        reflectPower: 8,
        mainAudio: true,
        backupAudio: true,
        connectivity: true,
        lastSeen: '1 second ago'
      },
      reserve: {
        id: 'tx008',
        type: 'reserve' as const,
        status: 'operational' as const,
        transmitPower: 0,
        reflectPower: 0,
        mainAudio: true,
        backupAudio: true,
        connectivity: true,
        lastSeen: '4 seconds ago'
      }
    },
    alerts: 0
  },
  {
    id: 'site005',
    name: 'Bukit Pelindung',
    location: 'Kuantan, Pahang, Malaysia',
    overallStatus: 'operational' as const,
    activeTransmitter: 'main' as const,
    transmitters: {
      main: {
        id: 'tx009',
        type: 'main' as const,
        status: 'operational' as const,
        transmitPower: 875,
        reflectPower: 18,
        mainAudio: true,
        backupAudio: true,
        connectivity: true,
        lastSeen: '2 seconds ago'
      },
      reserve: {
        id: 'tx010',
        type: 'reserve' as const,
        status: 'operational' as const,
        transmitPower: 0,
        reflectPower: 0,
        mainAudio: true,
        backupAudio: true,
        connectivity: true,
        lastSeen: '6 seconds ago'
      }
    },
    alerts: 0
  },
  {
    id: 'site006',
    name: 'Bukit Lambir',
    location: 'Miri, Sarawak, Malaysia',
    overallStatus: 'warning' as const,
    activeTransmitter: 'reserve' as const,
    transmitters: {
      main: {
        id: 'tx011',
        type: 'main' as const,
        status: 'error' as const,
        transmitPower: 0,
        reflectPower: 0,
        mainAudio: false,
        backupAudio: false,
        connectivity: false,
        lastSeen: '15 minutes ago'
      },
      reserve: {
        id: 'tx012',
        type: 'reserve' as const,
        status: 'operational' as const,
        transmitPower: 750,
        reflectPower: 35,
        mainAudio: true,
        backupAudio: true,
        connectivity: true,
        lastSeen: '1 second ago'
      }
    },
    alerts: 3
  },
  {
    id: 'site007',
    name: 'Bukit Karatong',
    location: 'Kota Kinabalu, Sabah, Malaysia',
    overallStatus: 'operational' as const,
    activeTransmitter: 'main' as const,
    transmitters: {
      main: {
        id: 'tx013',
        type: 'main' as const,
        status: 'operational' as const,
        transmitPower: 900,
        reflectPower: 20,
        mainAudio: true,
        backupAudio: true,
        connectivity: true,
        lastSeen: '3 seconds ago'
      },
      reserve: {
        id: 'tx014',
        type: 'reserve' as const,
        status: 'operational' as const,
        transmitPower: 0,
        reflectPower: 0,
        mainAudio: true,
        backupAudio: true,
        connectivity: true,
        lastSeen: '7 seconds ago'
      }
    },
    alerts: 0
  },
  {
    id: 'site008',
    name: 'Media Prima Petaling Jaya',
    location: 'Selangor, Malaysia',
    overallStatus: 'operational' as const,
    activeTransmitter: 'main' as const,
    transmitters: {
      main: {
        id: 'tx015',
        type: 'main' as const,
        status: 'operational' as const,
        transmitPower: 925,
        reflectPower: 12,
        mainAudio: true,
        backupAudio: true,
        connectivity: true,
        lastSeen: '1 second ago'
      },
      reserve: {
        id: 'tx016',
        type: 'reserve' as const,
        status: 'operational' as const,
        transmitPower: 0,
        reflectPower: 0,
        mainAudio: true,
        backupAudio: true,
        connectivity: true,
        lastSeen: '5 seconds ago'
      }
    },
    alerts: 0
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
          
          // Update main transmitter
          const mainPowerVariation = site.transmitters.main.status === 'operational' ? 
            (Math.random() - 0.5) * 10 : 0;
          updatedSite.transmitters = {
            main: {
              ...site.transmitters.main,
              transmitPower: Math.max(0, site.transmitters.main.transmitPower + mainPowerVariation),
              lastSeen: site.transmitters.main.connectivity ? 
                `${Math.floor(Math.random() * 10) + 1} seconds ago` : 
                site.transmitters.main.lastSeen
            },
            reserve: {
              ...site.transmitters.reserve,
              transmitPower: site.transmitters.reserve.status === 'operational' && site.activeTransmitter === 'reserve' ? 
                Math.max(0, site.transmitters.reserve.transmitPower + (Math.random() - 0.5) * 10) :
                site.transmitters.reserve.transmitPower,
              lastSeen: site.transmitters.reserve.connectivity ? 
                `${Math.floor(Math.random() * 10) + 1} seconds ago` : 
                site.transmitters.reserve.lastSeen
            }
          };
          
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