import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import PowerMeter from './PowerMeter';
import { Radio, Volume2, VolumeX, Wifi, WifiOff } from 'lucide-react';
import type { TransmitterData } from '@/types/dashboard';

interface TransmitterCardProps {
  transmitter: TransmitterData;
  isActive?: boolean;
}

export default function TransmitterCard({ transmitter, isActive = false }: TransmitterCardProps) {
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational':
        return 'text-status-operational';
      case 'warning':
        return 'text-status-warning';
      case 'error':
      case 'offline':
        return 'text-status-error';
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <Card className={`border-card-border hover-elevate ${isActive ? 'ring-2 ring-primary' : ''}`}>
      <CardHeader className="pb-2">
        <div className="flex items-center gap-1">
          <Radio className={`w-3 h-3 ${getStatusColor(transmitter.status)}`} />
          <span className="font-medium text-sm" data-testid={`transmitter-label-${transmitter.type}`}>
            {transmitter.label}
          </span>
        </div>
        <div className="space-y-1">
          <Badge 
            variant={isActive ? 'default' : 'secondary'}
            className="text-xs px-1 py-0 w-fit"
            data-testid={`status-badge-${transmitter.type}`}
          >
            {transmitter.status === 'operational' ? 'Active' : transmitter.status === 'warning' ? 'Standby' : 'Offline'}
          </Badge>
          <div className="text-xs text-muted-foreground font-mono" data-testid={`channel-name-${transmitter.type}`}>
            {transmitter.channelName}
          </div>
          {transmitter.takenOverFrom && (
            <div className="text-xs text-amber-600 flex items-center gap-1">
              <span>↳ Covering TX {transmitter.takenOverFrom.split('_').pop()}</span>
            </div>
          )}
          <div className="text-xs font-bold text-primary" data-testid={`frequency-${transmitter.type}`}>
            {transmitter.frequency} MHz
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3 p-3">
        <div className="space-y-2">
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
        
        <div className="flex items-center justify-center gap-3">
          <div className="flex flex-col items-center gap-1">
            {transmitter.mainAudio ? 
              <Volume2 className="w-3 h-3 text-status-operational" data-testid="main-audio-icon" /> : 
              <VolumeX className="w-3 h-3 text-status-error" data-testid="main-audio-icon" />
            }
            <span className="text-xs">Main</span>
          </div>
          
          <div className="flex flex-col items-center gap-1">
            {transmitter.backupAudio ? 
              <Volume2 className="w-3 h-3 text-status-operational" data-testid="backup-audio-icon" /> : 
              <VolumeX className="w-3 h-3 text-status-error" data-testid="backup-audio-icon" />
            }
            <span className="text-xs">Backup</span>
          </div>
          
          <div className="flex flex-col items-center gap-1">
            {transmitter.connectivity ? 
              <Wifi className="w-3 h-3 text-status-operational" data-testid="connectivity-icon" /> : 
              <WifiOff className="w-3 h-3 text-status-error" data-testid="connectivity-icon" />
            }
            <span className="text-xs">Conn</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}