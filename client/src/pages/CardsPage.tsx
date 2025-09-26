import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import StateCard from '@/components/StateCard';
import { Search, Filter, RefreshCw, Settings, Layers } from 'lucide-react';
import { loadSiteData, extractAlarmsFromSites } from '@/utils/siteDataLoader';
import type { SiteData } from '@/types/dashboard';


export default function CardsPage() {
  const [sites, setSites] = useState<SiteData[]>([]);
  const [filteredSites, setFilteredSites] = useState<SiteData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'operational' | 'warning' | 'error'>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [totalAlarms, setTotalAlarms] = useState(0);

  // Load and set up data
  useEffect(() => {
    const initializeData = async () => {
      setIsLoading(true);
      const data = await loadSiteData();
      setSites(data);
      setFilteredSites(data);
      
      // Use centralized alarm extraction to ensure consistency with MapPage
      const alarms = extractAlarmsFromSites(data);
      setTotalAlarms(alarms.length);
      
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
              {totalAlarms > 0 && (
                <Badge variant="destructive">
                  {totalAlarms} Alerts
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