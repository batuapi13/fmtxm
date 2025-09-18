import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import TransmitterCard from './TransmitterCard';
import StatusIndicator from './StatusIndicator';
import { MapPin, AlertTriangle } from 'lucide-react';

interface SiteData {
  id: string;
  name: string;
  location: string;
  overallStatus: 'operational' | 'warning' | 'error' | 'offline';
  activeTransmitter: 'main' | 'reserve';
  transmitters: {
    main: {
      id: string;
      type: 'main';
      status: 'operational' | 'warning' | 'error' | 'offline';
      transmitPower: number;
      reflectPower: number;
      mainAudio: boolean;
      backupAudio: boolean;
      connectivity: boolean;
      lastSeen: string;
    };
    reserve: {
      id: string;
      type: 'reserve';
      status: 'operational' | 'warning' | 'error' | 'offline';
      transmitPower: number;
      reflectPower: number;
      mainAudio: boolean;
      backupAudio: boolean;
      connectivity: boolean;
      lastSeen: string;
    };
  };
  alerts: number;
}

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
              <span data-testid="site-location">{site.location}</span>
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
          <span className="text-muted-foreground">Active:</span>
          <Badge variant={site.activeTransmitter === 'main' ? 'default' : 'secondary'}>
            {site.activeTransmitter === 'main' ? 'Main' : 'Reserve'}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <TransmitterCard 
            transmitter={site.transmitters.main}
            isActive={site.activeTransmitter === 'main'}
          />
          <TransmitterCard 
            transmitter={site.transmitters.reserve}
            isActive={site.activeTransmitter === 'reserve'}
          />
        </div>
      </CardContent>
    </Card>
  );
}