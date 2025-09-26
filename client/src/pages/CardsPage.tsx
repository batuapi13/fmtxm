import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import StateCard from '@/components/StateCard';
import { Search, Filter, RefreshCw, Settings, Layers } from 'lucide-react';
import { parseCSVData } from '@/utils/csvParser';
import type { SiteData } from '@/types/dashboard';

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
      { id: 'tx001', type: '1' as const, role: 'active' as const, label: '1', channelName: 'Eight FM', frequency: '88.1', status: 'operational' as const, transmitPower: 950, reflectPower: 15, mainAudio: true, backupAudio: true, connectivity: true, lastSeen: '2 seconds ago', isTransmitting: true }
    ],
    alerts: 0
  }
];

export default function CardsPage() {
  const [sites, setSites] = useState<SiteData[]>([]);
  const [filteredSites, setFilteredSites] = useState<SiteData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'operational' | 'warning' | 'error'>('all');
  const [isLoading, setIsLoading] = useState(true);

  // Load and set up data
  useEffect(() => {
    const initializeData = async () => {
      setIsLoading(true);
      const data = await loadCSVData();
      setSites(data);
      setFilteredSites(data);
      setIsLoading(false);
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

  const handleRefresh = () => {
    console.log('Refreshing all site data...');
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
              {sites.reduce((sum, s) => sum + s.alerts, 0) > 0 && (
                <Badge variant="destructive">
                  {sites.reduce((sum, s) => sum + s.alerts, 0)} Alerts
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