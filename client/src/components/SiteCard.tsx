import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import TransmitterCard from './TransmitterCard';
import StatusIndicator from './StatusIndicator';
import { MapPin, AlertTriangle } from 'lucide-react';
import type { SiteData } from '@/types/dashboard';

interface SiteCardProps {
  site: SiteData;
  onSiteClick?: (siteId: string) => void;
}

export default function SiteCard({ site, onSiteClick }: SiteCardProps) {
  const handleClick = () => {
    console.log(`Site clicked: ${site.name}`);
    onSiteClick?.(site.id);
  };

  return (
    <Card className="border-card-border hover-elevate cursor-pointer" onClick={handleClick}>
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-lg" data-testid={`site-name-${site.id}`}>
                {site.name}
              </h3>
              <StatusIndicator 
                status={site.overallStatus} 
                size="md" 
                animate={site.overallStatus === 'operational'}
              />
            </div>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <MapPin className="w-3 h-3" />
              <span data-testid="site-location">
                {site.location} ({site.coordinates.lat}, {site.coordinates.lng})
              </span>
            </div>
          </div>
          
          {site.alerts > 0 && (
            <Badge variant="destructive" className="flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" />
              {site.alerts}
            </Badge>
          )}
        </div>
        
        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">Active Transmitters:</span>
          <Badge variant="default" data-testid="active-transmitter-count">
            {site.activeTransmitterCount} of {site.transmitters.length}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-4 gap-2">
          {site.transmitters.map(transmitter => {
            // Numbered transmitters (1-12) are active, reserves are standby unless main tx are offline
            const isActive = !transmitter.type.includes('reserve') || 
                           site.transmitters.filter(tx => !tx.type.includes('reserve')).every(tx => tx.status === 'offline');
            
            return (
              <TransmitterCard 
                key={transmitter.id}
                transmitter={transmitter}
                isActive={isActive && transmitter.status !== 'offline'}
              />
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}