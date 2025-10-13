import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import SiteCard from './SiteCard';
import { MapPin, Wifi, AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react';
import type { SiteData } from '@/types/dashboard';
import { extractAlarmsFromSites } from '@/utils/siteDataLoader';

interface StateCardProps {
  state: string;
  sites: SiteData[];
  onSiteClick?: (siteId: string) => void;
}

export default function StateCard({ state, sites, onSiteClick }: StateCardProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  // Calculate state-level statistics
  const totalSites = sites.length;
  const operationalSites = sites.filter(site => site.overallStatus === 'operational').length;
  const allAlarms = extractAlarmsFromSites(sites);
  const totalAlarms = allAlarms.length;
  const totalTransmitters = sites.reduce((sum, site) => sum + site.activeTransmitterCount + site.backupTransmitterCount, 0);
  const totalRunningTransmitters = sites.reduce((sum, site) => sum + site.runningActiveCount + site.runningBackupCount, 0);

  // Sort sites by name for consistent display
  const sortedSites = [...sites].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <Card className="border-card-border">
      <CardHeader 
        className="pb-4 cursor-pointer hover:bg-muted/50 transition-colors" 
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <h2 className="font-bold text-xl text-primary" data-testid={`state-name-${state}`}>
                {state}
              </h2>
              <Badge variant="outline" className="text-sm">
                {totalSites} {totalSites === 1 ? 'Site' : 'Sites'}
              </Badge>
            </div>
            
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Wifi className="w-4 h-4" />
                <span>Operational: {operationalSites}/{totalSites}</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>TX: {totalRunningTransmitters}/{totalTransmitters}</span>
              </div>
              {totalAlarms > 0 && (
                <div className="flex items-center gap-1 text-destructive">
                  <AlertTriangle className="w-4 h-4" />
                  <span>{totalAlarms} {totalAlarms === 1 ? 'Alarm' : 'Alarms'}</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex items-center">
            {isExpanded ? (
              <ChevronUp className="w-5 h-5 text-muted-foreground" />
            ) : (
              <ChevronDown className="w-5 h-5 text-muted-foreground" />
            )}
          </div>
        </div>
      </CardHeader>
      
      {isExpanded && (
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {sortedSites.map(site => (
              <SiteCard 
                key={site.id} 
                site={site} 
                onSiteClick={onSiteClick}
              />
            ))}
          </div>
        </CardContent>
      )}
    </Card>
  );
}