import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import PowerMeter from './PowerMeter';
import { Radio, Volume2, VolumeX, Wifi, WifiOff, GripVertical } from 'lucide-react';
import type { TransmitterData } from '@/types/dashboard';
import { useMemo } from 'react';

interface TransmitterCardProps {
  transmitter: TransmitterData;
  isActive?: boolean;
  // Drag handle props for dnd-kit activator
  dragHandleRef?: (node: HTMLElement | null) => void;
  dragHandleListeners?: any;
}

export default function TransmitterCard({ transmitter, isActive = false, dragHandleRef, dragHandleListeners }: TransmitterCardProps) {
  const displayLabel = useMemo(() => transmitter.label, [transmitter.label]);
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational':
        return 'text-status-operational';
      case 'warning':
        return 'text-status-warning';
      case 'error':
        return 'text-status-error';
      case 'offline':
        return 'text-status-offline';
      default:
        return 'text-muted-foreground';
    }
  };

  // Label editing disabled on card; use Site Config page

  return (
    <Card className={`border-card-border hover-elevate h-full ${isActive ? 'ring-2 ring-primary' : ''}`}>
      <CardHeader className="pb-2">
        <div className="flex items-start gap-2 min-h-[56px] relative">
          {/* Status icon */}
          <Radio className={`w-3 h-3 ${getStatusColor(transmitter.status)}`} />
          {/* Label - allow 2 lines */}
          <div 
            className="font-medium text-sm leading-tight break-words flex-1 pr-6"
            data-testid={`transmitter-label-${transmitter.type}`}
            style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
          >
            {displayLabel}
          </div>
          {/* Drag handle repositioned to top-right to avoid covering label */}
          <button
            className="absolute right-1 top-1 cursor-grab p-1 rounded hover:bg-muted/40"
            aria-label="Drag transmitter"
            ref={dragHandleRef as any}
            {...(dragHandleListeners || {})}
            onClick={(e) => e.preventDefault()}
          >
            <GripVertical className="w-3 h-3 text-muted-foreground" />
          </button>
        </div>
        <div className="space-y-1 min-h-[44px]">
          <Badge 
            variant={isActive ? 'default' : 'secondary'}
            className={`text-xs px-1 py-0 w-fit 
              ${transmitter.status === 'operational' ? 'bg-status-operational/20 text-status-operational border-status-operational/30' : ''}
              ${transmitter.status === 'warning' ? 'bg-status-warning/20 text-status-warning border-status-warning/30' : ''}
              ${transmitter.status === 'offline' || transmitter.status === 'error' ? 'bg-status-offline/20 text-status-offline border-status-offline/30' : ''}
            `}
            data-testid={`status-badge-${transmitter.type}`}
          >
            {transmitter.status === 'operational' ? 'Active' : transmitter.status === 'warning' ? 'Standby' : 'Offline'}
          </Badge>
          <div className="text-xs text-muted-foreground font-mono truncate" data-testid={`channel-name-${transmitter.type}`}>
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
        
        <div className="flex items-center justify-center gap-3 min-h-[48px]">
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
              <WifiOff className="w-3 h-3 text-status-offline" data-testid="connectivity-icon" />
            }
            <span className="text-xs">Conn</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}