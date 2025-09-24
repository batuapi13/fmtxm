import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import StatusIndicator from './StatusIndicator';
import PowerMeter from './PowerMeter';
import { Radio, Volume2, VolumeX, Wifi, WifiOff } from 'lucide-react';

interface TransmitterData {
  id: string;
  type: 'main' | 'reserve';
  status: 'operational' | 'warning' | 'error' | 'offline';
  transmitPower: number;
  reflectPower: number;
  mainAudio: boolean;
  backupAudio: boolean;
  connectivity: boolean;
  lastSeen: string;
}

interface TransmitterCardProps {
  transmitter: TransmitterData;
  isActive?: boolean;
}

export default function TransmitterCard({ transmitter, isActive = false }: TransmitterCardProps) {
  const typeColor = transmitter.type === 'main' ? 'bg-transmitter-main' : 'bg-transmitter-reserve';
  
  return (
    <Card className={`border-card-border hover-elevate ${isActive ? 'ring-2 ring-primary' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Radio className={`w-4 h-4 ${transmitter.type === 'main' ? 'text-transmitter-main' : 'text-transmitter-reserve'}`} />
            <span className="font-medium capitalize" data-testid={`transmitter-type-${transmitter.type}`}>
              {transmitter.type}
            </span>
          </div>
          <Badge 
            variant={isActive ? 'default' : 'secondary'}
            className="text-xs"
            data-testid={`status-badge-${transmitter.type}`}
          >
            {isActive ? 'Active' : 'Standby'}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <PowerMeter
            label="Fwd Power"
            value={transmitter.transmitPower}
            unit="W"
            max={1000}
            threshold={{ warning: 800, error: 980 }}
            status={transmitter.status}
          />
          <PowerMeter
            label="Reflect Power"
            value={transmitter.reflectPower}
            unit="W"
            max={100}
            threshold={{ warning: 50, error: 80 }}
            status={transmitter.status}
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {transmitter.mainAudio ? 
                <Volume2 className="w-4 h-4 text-status-operational" /> : 
                <VolumeX className="w-4 h-4 text-status-error" />
              }
              <span className="text-sm">Main Audio</span>
            </div>
            <StatusIndicator 
              status={transmitter.mainAudio ? 'operational' : 'error'} 
              size="sm"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {transmitter.backupAudio ? 
                <Volume2 className="w-4 h-4 text-status-operational" /> : 
                <VolumeX className="w-4 h-4 text-status-error" />
              }
              <span className="text-sm">Backup Audio</span>
            </div>
            <StatusIndicator 
              status={transmitter.backupAudio ? 'operational' : 'error'} 
              size="sm"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {transmitter.connectivity ? 
                <Wifi className="w-4 h-4 text-status-operational" /> : 
                <WifiOff className="w-4 h-4 text-status-error" />
              }
              <span className="text-sm">Connectivity</span>
            </div>
            <StatusIndicator 
              status={transmitter.connectivity ? 'operational' : 'offline'} 
              size="sm"
              animate={transmitter.connectivity}
            />
          </div>
        </div>
        
        <div className="pt-2 border-t border-border">
          <span className="text-xs text-muted-foreground" data-testid="last-seen">
            Last seen: {transmitter.lastSeen}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}