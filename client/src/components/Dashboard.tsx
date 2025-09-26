import { useState, useEffect } from 'react';
import DashboardHeader from './DashboardHeader';
import SiteCard from './SiteCard';
import MalaysiaMap from './MalaysiaMap';
import type { SiteData } from '@/types/dashboard';

// Comprehensive Malaysian FM transmission sites with 12+ transmitters
const mockSites: SiteData[] = [
  {
    id: 'site001',
    name: 'Gunung Ulu Kali',
    location: 'Genting Highlands, Selangor, Malaysia',
    coordinates: { lat: 3.4205, lng: 101.7646 },
    broadcaster: 'Multiple Commercial Broadcasters',
    overallStatus: 'operational' as const,
    activeTransmitterCount: 12,
    transmitters: [
      { id: 'tx001', type: '1' as const, label: '1', channelName: 'Eight FM', frequency: '88.1', status: 'operational' as const, transmitPower: 950, reflectPower: 15, mainAudio: true, backupAudio: true, connectivity: true, lastSeen: '2 seconds ago' },
      { id: 'tx002', type: '2' as const, label: '2', channelName: 'GoXuan FM', frequency: '90.5', status: 'operational' as const, transmitPower: 920, reflectPower: 18, mainAudio: true, backupAudio: true, connectivity: true, lastSeen: '1 second ago' },
      { id: 'tx003', type: '3' as const, label: '3', channelName: 'BFM 89.9', frequency: '89.9', status: 'warning' as const, transmitPower: 880, reflectPower: 45, mainAudio: true, backupAudio: false, connectivity: true, lastSeen: '3 seconds ago' },
      { id: 'tx004', type: '4' as const, label: '4', channelName: 'IKIM.fm', frequency: '91.5', status: 'operational' as const, transmitPower: 940, reflectPower: 12, mainAudio: true, backupAudio: true, connectivity: true, lastSeen: '1 second ago' },
      { id: 'tx005', type: '5' as const, label: '5', channelName: 'THR Raaga', frequency: '92.5', status: 'operational' as const, transmitPower: 915, reflectPower: 20, mainAudio: true, backupAudio: true, connectivity: true, lastSeen: '2 seconds ago' },
      { id: 'tx006', type: '6' as const, label: '6', channelName: 'Malaysia Kini', frequency: '93.3', status: 'operational' as const, transmitPower: 890, reflectPower: 25, mainAudio: true, backupAudio: true, connectivity: true, lastSeen: '1 second ago' },
      { id: 'tx007', type: '7' as const, label: '7', channelName: 'City Plus FM', frequency: '94.5', status: 'operational' as const, transmitPower: 935, reflectPower: 16, mainAudio: true, backupAudio: true, connectivity: true, lastSeen: '3 seconds ago' },
      { id: 'tx008', type: '8' as const, label: '8', channelName: 'Bernama Radio', frequency: '95.1', status: 'operational' as const, transmitPower: 900, reflectPower: 22, mainAudio: true, backupAudio: true, connectivity: true, lastSeen: '2 seconds ago' },
      { id: 'tx009', type: '9' as const, label: '9', channelName: 'Gold FM', frequency: '96.3', status: 'operational' as const, transmitPower: 925, reflectPower: 19, mainAudio: true, backupAudio: true, connectivity: true, lastSeen: '1 second ago' },
      { id: 'tx010', type: '10' as const, label: '10', channelName: 'Red FM', frequency: '97.7', status: 'operational' as const, transmitPower: 910, reflectPower: 21, mainAudio: true, backupAudio: true, connectivity: true, lastSeen: '2 seconds ago' },
      { id: 'tx011', type: '11' as const, label: '11', channelName: 'Suara Malaysia', frequency: '98.5', status: 'operational' as const, transmitPower: 895, reflectPower: 24, mainAudio: true, backupAudio: true, connectivity: true, lastSeen: '3 seconds ago' },
      { id: 'tx012', type: '12' as const, label: '12', channelName: 'Rhythm FM', frequency: '99.7', status: 'operational' as const, transmitPower: 940, reflectPower: 17, mainAudio: true, backupAudio: true, connectivity: true, lastSeen: '1 second ago' },
      { id: 'tx013', type: 'reserve1' as const, label: 'Reserve 1', channelName: 'Emergency Service 1', frequency: '100.1', status: 'operational' as const, transmitPower: 0, reflectPower: 0, mainAudio: true, backupAudio: true, connectivity: true, lastSeen: '2 seconds ago' },
      { id: 'tx014', type: 'reserve2' as const, label: 'Reserve 2', channelName: 'Emergency Service 2', frequency: '100.5', status: 'operational' as const, transmitPower: 0, reflectPower: 0, mainAudio: true, backupAudio: true, connectivity: true, lastSeen: '3 seconds ago' }
    ],
    alerts: 1
  },
  {
    id: 'site002',
    name: 'Gunung Jerai',
    location: 'Kedah, Malaysia',
    coordinates: { lat: 5.7919, lng: 100.4226 },
    broadcaster: 'Northern Malaysia Broadcasting Hub',
    overallStatus: 'operational' as const,
    activeTransmitterCount: 10,
    transmitters: [
      { id: 'tx015', type: '1' as const, label: '1', channelName: 'Hot FM', frequency: '97.6', status: 'operational' as const, transmitPower: 920, reflectPower: 18, mainAudio: true, backupAudio: true, connectivity: true, lastSeen: '1 second ago' },
      { id: 'tx016', type: '2' as const, label: '2', channelName: 'Fly FM', frequency: '95.8', status: 'operational' as const, transmitPower: 900, reflectPower: 22, mainAudio: true, backupAudio: true, connectivity: true, lastSeen: '2 seconds ago' },
      { id: 'tx017', type: '3' as const, label: '3', channelName: 'Mix FM', frequency: '94.5', status: 'operational' as const, transmitPower: 885, reflectPower: 28, mainAudio: true, backupAudio: true, connectivity: true, lastSeen: '1 second ago' },
      { id: 'tx018', type: '4' as const, label: '4', channelName: 'Hitz.fm', frequency: '92.9', status: 'operational' as const, transmitPower: 910, reflectPower: 20, mainAudio: true, backupAudio: true, connectivity: true, lastSeen: '3 seconds ago' },
      { id: 'tx019', type: '5' as const, label: '5', channelName: 'Sinar FM', frequency: '96.7', status: 'operational' as const, transmitPower: 895, reflectPower: 25, mainAudio: true, backupAudio: true, connectivity: true, lastSeen: '2 seconds ago' },
      { id: 'tx020', type: '6' as const, label: '6', channelName: 'Nasional FM', frequency: '107.9', status: 'operational' as const, transmitPower: 940, reflectPower: 15, mainAudio: true, backupAudio: true, connectivity: true, lastSeen: '1 second ago' },
      { id: 'tx021', type: '7' as const, label: '7', channelName: 'Minnal FM', frequency: '100.1', status: 'operational' as const, transmitPower: 875, reflectPower: 30, mainAudio: true, backupAudio: true, connectivity: true, lastSeen: '2 seconds ago' },
      { id: 'tx022', type: '8' as const, label: '8', channelName: 'Radio Klasik', frequency: '101.9', status: 'operational' as const, transmitPower: 920, reflectPower: 18, mainAudio: true, backupAudio: true, connectivity: true, lastSeen: '1 second ago' },
      { id: 'tx023', type: '9' as const, label: '9', channelName: 'THR Gegar', frequency: '102.6', status: 'operational' as const, transmitPower: 905, reflectPower: 23, mainAudio: true, backupAudio: true, connectivity: true, lastSeen: '3 seconds ago' },
      { id: 'tx024', type: '10' as const, label: '10', channelName: 'Kedah FM', frequency: '103.5', status: 'operational' as const, transmitPower: 890, reflectPower: 26, mainAudio: true, backupAudio: true, connectivity: true, lastSeen: '2 seconds ago' },
      { id: 'tx025', type: '11' as const, label: '11', channelName: 'Best FM', frequency: '104.1', status: 'error' as const, transmitPower: 0, reflectPower: 0, mainAudio: false, backupAudio: false, connectivity: false, lastSeen: '12 minutes ago' },
      { id: 'tx026', type: '12' as const, label: '12', channelName: 'Era FM', frequency: '105.3', status: 'warning' as const, transmitPower: 650, reflectPower: 75, mainAudio: true, backupAudio: false, connectivity: true, lastSeen: '5 seconds ago' },
      { id: 'tx027', type: 'reserve1' as const, label: 'Reserve 1', channelName: 'Emergency Backup', frequency: '106.1', status: 'operational' as const, transmitPower: 0, reflectPower: 0, mainAudio: true, backupAudio: true, connectivity: true, lastSeen: '1 second ago' },
      { id: 'tx028', type: 'reserve2' as const, label: 'Reserve 2', channelName: 'Standby Service', frequency: '106.7', status: 'operational' as const, transmitPower: 0, reflectPower: 0, mainAudio: true, backupAudio: true, connectivity: true, lastSeen: '2 seconds ago' }
    ],
    alerts: 2
  },
  {
    id: 'site003',
    name: 'Bukit Penara',
    location: 'Penang Hill, Penang, Malaysia',
    coordinates: { lat: 5.4203, lng: 100.2708 },
    broadcaster: 'Penang Broadcasting Centre',
    overallStatus: 'operational' as const,
    activeTransmitterCount: 12,
    transmitters: [
      { id: 'tx029', type: '1' as const, label: '1', channelName: 'Red FM', frequency: '104.9', status: 'operational' as const, transmitPower: 930, reflectPower: 17, mainAudio: true, backupAudio: true, connectivity: true, lastSeen: '1 second ago' },
      { id: 'tx030', type: '2' as const, label: '2', channelName: 'My FM', frequency: '101.8', status: 'operational' as const, transmitPower: 910, reflectPower: 21, mainAudio: true, backupAudio: true, connectivity: true, lastSeen: '2 seconds ago' },
      { id: 'tx031', type: '3' as const, label: '3', channelName: 'One FM', frequency: '88.1', status: 'operational' as const, transmitPower: 895, reflectPower: 26, mainAudio: true, backupAudio: true, connectivity: true, lastSeen: '1 second ago' },
      { id: 'tx032', type: '4' as const, label: '4', channelName: '988 FM', frequency: '98.8', status: 'operational' as const, transmitPower: 940, reflectPower: 14, mainAudio: true, backupAudio: true, connectivity: true, lastSeen: '3 seconds ago' },
      { id: 'tx033', type: '5' as const, label: '5', channelName: 'TraXX FM', frequency: '90.7', status: 'operational' as const, transmitPower: 885, reflectPower: 28, mainAudio: true, backupAudio: true, connectivity: true, lastSeen: '2 seconds ago' },
      { id: 'tx034', type: '6' as const, label: '6', channelName: 'Light & Easy', frequency: '107.5', status: 'operational' as const, transmitPower: 920, reflectPower: 19, mainAudio: true, backupAudio: true, connectivity: true, lastSeen: '1 second ago' },
      { id: 'tx035', type: '7' as const, label: '7', channelName: 'Ai FM', frequency: '106.7', status: 'operational' as const, transmitPower: 905, reflectPower: 23, mainAudio: true, backupAudio: true, connectivity: true, lastSeen: '2 seconds ago' },
      { id: 'tx036', type: '8' as const, label: '8', channelName: 'Wai FM', frequency: '105.3', status: 'operational' as const, transmitPower: 890, reflectPower: 25, mainAudio: true, backupAudio: true, connectivity: true, lastSeen: '1 second ago' },
      { id: 'tx037', type: '9' as const, label: '9', channelName: 'Era FM', frequency: '103.3', status: 'operational' as const, transmitPower: 925, reflectPower: 18, mainAudio: true, backupAudio: true, connectivity: true, lastSeen: '3 seconds ago' },
      { id: 'tx038', type: '10' as const, label: '10', channelName: 'Hot FM', frequency: '99.9', status: 'operational' as const, transmitPower: 915, reflectPower: 20, mainAudio: true, backupAudio: true, connectivity: true, lastSeen: '2 seconds ago' },
      { id: 'tx039', type: '11' as const, label: '11', channelName: 'Fly FM', frequency: '95.8', status: 'operational' as const, transmitPower: 900, reflectPower: 22, mainAudio: true, backupAudio: true, connectivity: true, lastSeen: '1 second ago' },
      { id: 'tx040', type: '12' as const, label: '12', channelName: 'Mix FM', frequency: '94.5', status: 'operational' as const, transmitPower: 935, reflectPower: 16, mainAudio: true, backupAudio: true, connectivity: true, lastSeen: '2 seconds ago' },
      { id: 'tx041', type: 'reserve1' as const, label: 'Reserve 1', channelName: 'Emergency Backup', frequency: '102.1', status: 'operational' as const, transmitPower: 0, reflectPower: 0, mainAudio: true, backupAudio: true, connectivity: true, lastSeen: '1 second ago' },
      { id: 'tx042', type: 'reserve2' as const, label: 'Reserve 2', channelName: 'Disaster Response', frequency: '102.7', status: 'operational' as const, transmitPower: 0, reflectPower: 0, mainAudio: true, backupAudio: true, connectivity: true, lastSeen: '3 seconds ago' }
    ],
    alerts: 0
  },
  {
    id: 'site004',
    name: 'Gunung Korbu',
    location: 'Perak, Malaysia',
    coordinates: { lat: 4.7077, lng: 101.5068 },
    broadcaster: 'Central Malaysia Network',
    overallStatus: 'warning' as const,
    activeTransmitterCount: 11,
    transmitters: [
      { id: 'tx043', type: '1' as const, label: '1', channelName: 'Perak FM', frequency: '106.1', status: 'operational' as const, transmitPower: 920, reflectPower: 18, mainAudio: true, backupAudio: true, connectivity: true, lastSeen: '1 second ago' },
      { id: 'tx044', type: '2' as const, label: '2', channelName: 'THR Raaga', frequency: '99.3', status: 'operational' as const, transmitPower: 900, reflectPower: 22, mainAudio: true, backupAudio: true, connectivity: true, lastSeen: '2 seconds ago' },
      { id: 'tx045', type: '3' as const, label: '3', channelName: 'Gegar FM', frequency: '102.6', status: 'operational' as const, transmitPower: 885, reflectPower: 28, mainAudio: true, backupAudio: true, connectivity: true, lastSeen: '1 second ago' },
      { id: 'tx046', type: '4' as const, label: '4', channelName: 'Suria FM', frequency: '105.7', status: 'operational' as const, transmitPower: 910, reflectPower: 20, mainAudio: true, backupAudio: true, connectivity: true, lastSeen: '3 seconds ago' },
      { id: 'tx047', type: '5' as const, label: '5', channelName: 'Era FM', frequency: '98.1', status: 'operational' as const, transmitPower: 895, reflectPower: 25, mainAudio: true, backupAudio: true, connectivity: true, lastSeen: '2 seconds ago' },
      { id: 'tx048', type: '6' as const, label: '6', channelName: 'Hitz FM', frequency: '96.7', status: 'operational' as const, transmitPower: 925, reflectPower: 17, mainAudio: true, backupAudio: true, connectivity: true, lastSeen: '1 second ago' },
      { id: 'tx049', type: '7' as const, label: '7', channelName: 'Mix FM', frequency: '94.5', status: 'operational' as const, transmitPower: 940, reflectPower: 15, mainAudio: true, backupAudio: true, connectivity: true, lastSeen: '2 seconds ago' },
      { id: 'tx050', type: '8' as const, label: '8', channelName: 'Fly FM', frequency: '92.9', status: 'operational' as const, transmitPower: 875, reflectPower: 30, mainAudio: true, backupAudio: true, connectivity: true, lastSeen: '1 second ago' },
      { id: 'tx051', type: '9' as const, label: '9', channelName: 'Hot FM', frequency: '91.3', status: 'operational' as const, transmitPower: 905, reflectPower: 23, mainAudio: true, backupAudio: true, connectivity: true, lastSeen: '3 seconds ago' },
      { id: 'tx052', type: '10' as const, label: '10', channelName: 'Nasional FM', frequency: '107.9', status: 'operational' as const, transmitPower: 890, reflectPower: 26, mainAudio: true, backupAudio: true, connectivity: true, lastSeen: '2 seconds ago' },
      { id: 'tx053', type: '11' as const, label: '11', channelName: 'Radio Klasik', frequency: '108.5', status: 'operational' as const, transmitPower: 930, reflectPower: 18, mainAudio: true, backupAudio: true, connectivity: true, lastSeen: '1 second ago' },
      { id: 'tx054', type: '12' as const, label: '12', channelName: 'Sinar FM', frequency: '100.9', status: 'error' as const, transmitPower: 0, reflectPower: 0, mainAudio: false, backupAudio: false, connectivity: false, lastSeen: '18 minutes ago' },
      { id: 'tx055', type: 'reserve1' as const, label: 'Reserve 1', channelName: 'Emergency TX 1', frequency: '103.1', status: 'operational' as const, transmitPower: 0, reflectPower: 0, mainAudio: true, backupAudio: true, connectivity: true, lastSeen: '1 second ago' },
      { id: 'tx056', type: 'reserve2' as const, label: 'Reserve 2', channelName: 'Emergency TX 2', frequency: '103.7', status: 'operational' as const, transmitPower: 0, reflectPower: 0, mainAudio: true, backupAudio: true, connectivity: true, lastSeen: '2 seconds ago' }
    ],
    alerts: 1
  },
  {
    id: 'site005',
    name: 'Mount Austin',
    location: 'Johor Bahru, Johor, Malaysia',
    coordinates: { lat: 1.4927, lng: 103.7414 },
    broadcaster: 'Southern Malaysia Broadcasting',
    overallStatus: 'operational' as const,
    activeTransmitterCount: 12,
    transmitters: [
      { id: 'tx057', type: '1' as const, label: '1', channelName: 'Johor FM', frequency: '101.9', status: 'operational' as const, transmitPower: 940, reflectPower: 15, mainAudio: true, backupAudio: true, connectivity: true, lastSeen: '1 second ago' },
      { id: 'tx058', type: '2' as const, label: '2', channelName: 'Best FM', frequency: '104.1', status: 'operational' as const, transmitPower: 920, reflectPower: 18, mainAudio: true, backupAudio: true, connectivity: true, lastSeen: '2 seconds ago' },
      { id: 'tx059', type: '3' as const, label: '3', channelName: 'Molek FM', frequency: '99.5', status: 'operational' as const, transmitPower: 910, reflectPower: 21, mainAudio: true, backupAudio: true, connectivity: true, lastSeen: '1 second ago' },
      { id: 'tx060', type: '4' as const, label: '4', channelName: 'Era FM', frequency: '107.6', status: 'operational' as const, transmitPower: 895, reflectPower: 26, mainAudio: true, backupAudio: true, connectivity: true, lastSeen: '3 seconds ago' },
      { id: 'tx061', type: '5' as const, label: '5', channelName: 'Hot FM', frequency: '97.6', status: 'operational' as const, transmitPower: 925, reflectPower: 17, mainAudio: true, backupAudio: true, connectivity: true, lastSeen: '2 seconds ago' },
      { id: 'tx062', type: '6' as const, label: '6', channelName: 'Fly FM', frequency: '95.8', status: 'operational' as const, transmitPower: 885, reflectPower: 28, mainAudio: true, backupAudio: true, connectivity: true, lastSeen: '1 second ago' },
      { id: 'tx063', type: '7' as const, label: '7', channelName: 'Mix FM', frequency: '94.5', status: 'operational' as const, transmitPower: 905, reflectPower: 23, mainAudio: true, backupAudio: true, connectivity: true, lastSeen: '2 seconds ago' },
      { id: 'tx064', type: '8' as const, label: '8', channelName: 'Hitz FM', frequency: '92.9', status: 'operational' as const, transmitPower: 900, reflectPower: 22, mainAudio: true, backupAudio: true, connectivity: true, lastSeen: '1 second ago' },
      { id: 'tx065', type: '9' as const, label: '9', channelName: 'Suria FM', frequency: '106.3', status: 'operational' as const, transmitPower: 930, reflectPower: 16, mainAudio: true, backupAudio: true, connectivity: true, lastSeen: '3 seconds ago' },
      { id: 'tx066', type: '10' as const, label: '10', channelName: 'Gegar FM', frequency: '103.9', status: 'operational' as const, transmitPower: 875, reflectPower: 30, mainAudio: true, backupAudio: true, connectivity: true, lastSeen: '2 seconds ago' },
      { id: 'tx067', type: '11' as const, label: '11', channelName: 'THR Raaga', frequency: '100.1', status: 'operational' as const, transmitPower: 915, reflectPower: 19, mainAudio: true, backupAudio: true, connectivity: true, lastSeen: '1 second ago' },
      { id: 'tx068', type: '12' as const, label: '12', channelName: 'Minnal FM', frequency: '105.1', status: 'operational' as const, transmitPower: 890, reflectPower: 25, mainAudio: true, backupAudio: true, connectivity: true, lastSeen: '2 seconds ago' },
      { id: 'tx069', type: 'reserve1' as const, label: 'Reserve 1', channelName: 'Backup Service', frequency: '102.3', status: 'operational' as const, transmitPower: 0, reflectPower: 0, mainAudio: true, backupAudio: true, connectivity: true, lastSeen: '1 second ago' },
      { id: 'tx070', type: 'reserve2' as const, label: 'Reserve 2', channelName: 'Emergency TX', frequency: '102.9', status: 'operational' as const, transmitPower: 0, reflectPower: 0, mainAudio: true, backupAudio: true, connectivity: true, lastSeen: '3 seconds ago' }
    ],
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
          
          // Update all transmitters
          updatedSite.transmitters = site.transmitters.map((transmitter, index) => {
            const powerVariation = transmitter.status === 'operational' ? 
              (Math.random() - 0.5) * 10 : 0;
            
            // Numbered transmitters (1-12) are active, reserves are standby unless main tx are offline
            const isActive = !transmitter.type.includes('reserve') || 
                           site.transmitters.filter(tx => !tx.type.includes('reserve')).every(tx => tx.status === 'offline');
            
            const baseTransmitPower = isActive && transmitter.status === 'operational' ? 
              Math.max(0, transmitter.transmitPower + powerVariation) :
              transmitter.transmitPower;
              
            return {
              ...transmitter,
              transmitPower: transmitter.type.includes('reserve') && !isActive ? 0 : baseTransmitPower,
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