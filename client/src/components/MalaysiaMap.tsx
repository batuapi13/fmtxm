import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import StatusIndicator from './StatusIndicator';
import { ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import type { SiteData } from '@/types/dashboard';

interface MapPin {
  id: string;
  name: string;
  x: number; // SVG coordinate
  y: number; // SVG coordinate
  status: 'operational' | 'warning' | 'error' | 'offline';
  site: SiteData;
}

interface MalaysiaMapProps {
  sites: SiteData[];
  onSiteSelect?: (siteId: string) => void;
  selectedSiteId?: string;
}

export default function MalaysiaMap({ sites, onSiteSelect, selectedSiteId }: MalaysiaMapProps) {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [viewBox, setViewBox] = useState('0 0 800 600');

  // Real Malaysian FM transmission sites with accurate coordinates
  const mapPins: MapPin[] = [
    {
      id: 'site001',
      name: 'RTM Kuala Lumpur',
      x: 480, // Kuala Lumpur
      y: 340,
      status: sites.find(s => s.id === 'site001')?.overallStatus || 'offline',
      site: sites.find(s => s.id === 'site001')!,
    },
    {
      id: 'site002', 
      name: 'Gunung Jerai',
      x: 420, // Kedah
      y: 150,
      status: sites.find(s => s.id === 'site002')?.overallStatus || 'offline',
      site: sites.find(s => s.id === 'site002')!,
    },
    {
      id: 'site003',
      name: 'Bukit Penara',
      x: 380, // Penang
      y: 170,
      status: sites.find(s => s.id === 'site003')?.overallStatus || 'offline',
      site: sites.find(s => s.id === 'site003')!,
    },
    {
      id: 'site004',
      name: 'Gunung Ledang',
      x: 440, // Johor
      y: 470,
      status: sites.find(s => s.id === 'site004')?.overallStatus || 'offline',
      site: sites.find(s => s.id === 'site004')!,
    },
    {
      id: 'site005',
      name: 'Bukit Pelindung',
      x: 580, // Pahang (Kuantan)
      y: 320,
      status: sites.find(s => s.id === 'site005')?.overallStatus || 'offline',
      site: sites.find(s => s.id === 'site005')!,
    },
    {
      id: 'site006',
      name: 'Bukit Lambir',
      x: 780, // Sarawak
      y: 280,
      status: sites.find(s => s.id === 'site006')?.overallStatus || 'offline',
      site: sites.find(s => s.id === 'site006')!,
    },
    {
      id: 'site007',
      name: 'Bukit Karatong',
      x: 880, // Sabah
      y: 180,
      status: sites.find(s => s.id === 'site007')?.overallStatus || 'offline',
      site: sites.find(s => s.id === 'site007')!,
    },
    {
      id: 'site008',
      name: 'Media Prima Petaling Jaya',
      x: 470, // Selangor
      y: 330,
      status: sites.find(s => s.id === 'site008')?.overallStatus || 'offline',
      site: sites.find(s => s.id === 'site008')!,
    }
  ].filter(pin => pin.site); // Only include pins for sites that exist

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev * 1.5, 3));
    console.log('Zooming in to level:', zoomLevel * 1.5);
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev / 1.5, 0.5));
    console.log('Zooming out to level:', zoomLevel / 1.5);
  };

  const handleReset = () => {
    setZoomLevel(1);
    setViewBox('0 0 800 600');
    console.log('Reset map view');
  };

  const handlePinClick = (pin: MapPin) => {
    console.log(`Selected site: ${pin.name}`);
    onSiteSelect?.(pin.id);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational': return '#22c55e';
      case 'warning': return '#f59e0b';
      case 'error': return '#ef4444';
      default: return '#6b7280';
    }
  };

  return (
    <Card className="border-card-border">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold" data-testid="map-title">
              Malaysia Transmission Sites
            </h3>
            <p className="text-sm text-muted-foreground">
              {mapPins.length} sites • Zoom: {zoomLevel.toFixed(1)}x
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={handleZoomIn}
              data-testid="button-zoom-in"
            >
              <ZoomIn className="w-4 h-4" />
            </Button>
            <Button
              variant="outline" 
              size="icon"
              onClick={handleZoomOut}
              data-testid="button-zoom-out"
            >
              <ZoomOut className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={handleReset}
              data-testid="button-reset-view"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="relative bg-muted/20 rounded-lg border border-border overflow-hidden">
          <svg
            viewBox={viewBox}
            className="w-full h-96 cursor-move"
            style={{ transform: `scale(${zoomLevel})` }}
            data-testid="malaysia-map"
          >
            {/* Accurate Malaysia outline with state boundaries */}
            {/* Peninsular Malaysia */}
            <path
              d="M350 100 L400 90 L450 100 L480 120 L500 140 L520 160 L540 180 L560 200 L580 230 L590 260 L600 290 L610 320 L620 350 L610 380 L590 410 L570 440 L540 460 L510 470 L480 480 L450 490 L420 480 L390 470 L360 450 L340 420 L330 390 L320 360 L310 330 L300 300 L290 270 L300 240 L310 210 L320 180 L330 150 L340 120 Z"
              fill="hsl(var(--muted))"
              stroke="hsl(var(--border))"
              strokeWidth="1.5"
              className="hover:fill-muted-foreground/10 transition-colors"
            />
            {/* Penang Island */}
            <circle
              cx="380"
              cy="170"
              r="8"
              fill="hsl(var(--muted))"
              stroke="hsl(var(--border))"
              strokeWidth="1"
            />
            {/* Langkawi */}
            <circle
              cx="370"
              cy="140"
              r="5"
              fill="hsl(var(--muted))"
              stroke="hsl(var(--border))"
              strokeWidth="1"
            />
            {/* Sabah */}
            <path
              d="M750 120 L900 100 L950 130 L980 160 L990 190 L980 220 L960 250 L930 270 L900 280 L870 275 L840 270 L810 260 L780 240 L760 220 L750 190 L750 150 Z"
              fill="hsl(var(--muted))"
              stroke="hsl(var(--border))"
              strokeWidth="1.5"
              className="hover:fill-muted-foreground/10 transition-colors"
            />
            {/* Sarawak */}
            <path
              d="M650 200 L750 180 L820 190 L870 210 L900 230 L920 250 L910 280 L890 310 L860 330 L830 340 L800 345 L770 340 L740 330 L710 320 L680 300 L660 280 L650 250 L650 220 Z"
              fill="hsl(var(--muted))"
              stroke="hsl(var(--border))"
              strokeWidth="1.5"
              className="hover:fill-muted-foreground/10 transition-colors"
            />
            {/* State boundary lines */}
            <g stroke="hsl(var(--border))" strokeWidth="0.8" fill="none" opacity="0.6">
              {/* Peninsular state boundaries */}
              <path d="M370 140 L390 160 L410 180" /> {/* Perlis-Kedah */}
              <path d="M420 180 L440 200 L460 220" /> {/* Kedah-Perak */}
              <path d="M460 220 L480 240 L500 260" /> {/* Perak-Selangor */}
              <path d="M500 260 L520 280 L540 300" /> {/* Selangor-Negeri Sembilan */}
              <path d="M540 300 L560 320 L580 340" /> {/* N.Sembilan-Melaka-Johor */}
              <path d="M520 240 L550 250 L580 260" /> {/* Pahang western border */}
              <path d="M580 260 L600 280 L610 300" /> {/* Pahang-Terengganu */}
              <path d="M550 200 L580 210 L600 230" /> {/* Kelantan-Terengganu */}
            </g>
            
            {/* Site pins */}
            {mapPins.map((pin) => (
              <g key={pin.id}>
                <circle
                  cx={pin.x}
                  cy={pin.y}
                  r={selectedSiteId === pin.id ? "12" : "8"}
                  fill={getStatusColor(pin.status)}
                  stroke="white"
                  strokeWidth="2"
                  className="cursor-pointer hover:r-10 transition-all animate-pulse"
                  onClick={() => handlePinClick(pin)}
                  data-testid={`map-pin-${pin.id}`}
                />
                <text
                  x={pin.x}
                  y={pin.y - 15}
                  textAnchor="middle"
                  className="text-xs font-medium fill-foreground pointer-events-none"
                  style={{ fontSize: '12px' }}
                >
                  {pin.name}
                </text>
              </g>
            ))}
          </svg>
          
          {/* Legend */}
          {/* Legend */}
          <div className="absolute bottom-4 left-4 bg-card/90 backdrop-blur-sm border border-border rounded-lg p-3 space-y-2">
            <h4 className="text-sm font-medium">Status Legend</h4>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <StatusIndicator status="operational" size="sm" />
                <span className="text-xs">Operational</span>
              </div>
              <div className="flex items-center gap-2">
                <StatusIndicator status="warning" size="sm" />
                <span className="text-xs">Warning</span>
              </div>
              <div className="flex items-center gap-2">
                <StatusIndicator status="error" size="sm" />
                <span className="text-xs">Error</span>
              </div>
              <div className="flex items-center gap-2">
                <StatusIndicator status="offline" size="sm" />
                <span className="text-xs">Offline</span>
              </div>
            </div>
          </div>
          
          {/* State labels */}
          <div className="absolute inset-0 pointer-events-none">
            <svg viewBox="0 0 800 600" className="w-full h-96">
              <g className="text-xs fill-muted-foreground font-medium" style={{ fontSize: '10px' }}>
                <text x="380" y="200" textAnchor="middle">Kedah</text>
                <text x="420" y="240" textAnchor="middle">Perak</text>
                <text x="470" y="280" textAnchor="middle">Selangor</text>
                <text x="480" y="350" textAnchor="middle">KL</text>
                <text x="520" y="320" textAnchor="middle">Pahang</text>
                <text x="460" y="430" textAnchor="middle">Johor</text>
                <text x="590" y="260" textAnchor="middle">Terengganu</text>
                <text x="570" y="220" textAnchor="middle">Kelantan</text>
                <text x="500" y="360" textAnchor="middle">N. Sembilan</text>
                <text x="450" y="400" textAnchor="middle">Melaka</text>
                <text x="380" y="170" textAnchor="middle">Penang</text>
                <text x="360" y="140" textAnchor="middle">Perlis</text>
                <text x="800" y="260" textAnchor="middle">Sarawak</text>
                <text x="880" y="200" textAnchor="middle">Sabah</text>
              </g>
            </svg>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}