import { useState, useEffect } from 'react';
import DashboardHeader from './DashboardHeader';
import SiteCard from './SiteCard';
import type { SiteData } from '@/types/dashboard';

// todo: remove mock functionality  
const mockSites: SiteData[] = [
  {
    id: 'site001',
    name: 'Downtown FM',
    location: 'Mount Wilson, CA',
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
    name: 'Valley Station',
    location: 'Burbank, CA',
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
    name: 'Harbor Point',
    location: 'San Pedro, CA',
    overallStatus: 'error' as const,
    activeTransmitter: 'reserve' as const,
    transmitters: {
      main: {
        id: 'tx005',
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
        id: 'tx006',
        type: 'reserve' as const,
        status: 'operational' as const,
        transmitPower: 875,
        reflectPower: 22,
        mainAudio: true,
        backupAudio: true,
        connectivity: true,
        lastSeen: '1 second ago'
      }
    },
    alerts: 5
  },
  {
    id: 'site004',
    name: 'Riverside Tower',
    location: 'Riverside, CA',
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
  }
];

export default function Dashboard() {
  const [sites, setSites] = useState(mockSites);
  const [filteredSites, setFilteredSites] = useState(mockSites);
  const [searchQuery, setSearchQuery] = useState('');

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
      
      <div className="p-6">
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
  );
}