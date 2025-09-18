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

  // Map site locations to SVG coordinates (approximate Malaysia outline)
  const mapPins: MapPin[] = [
    {
      id: 'site001',
      name: 'Downtown FM',
      x: 420, // Kuala Lumpur area
      y: 320,
      status: sites.find(s => s.id === 'site001')?.overallStatus || 'offline',
      site: sites.find(s => s.id === 'site001')!,
    },
    {
      id: 'site002', 
      name: 'Valley Station',
      x: 380, // Selangor area
      y: 300,
      status: sites.find(s => s.id === 'site002')?.overallStatus || 'offline',
      site: sites.find(s => s.id === 'site002')!,
    },
    {
      id: 'site003',
      name: 'Harbor Point', 
      x: 450, // Johor area
      y: 480,
      status: sites.find(s => s.id === 'site003')?.overallStatus || 'offline',
      site: sites.find(s => s.id === 'site003')!,
    },
    {
      id: 'site004',
      name: 'Riverside Tower',
      x: 550, // East Coast area
      y: 350,
      status: sites.find(s => s.id === 'site004')?.overallStatus || 'offline',
      site: sites.find(s => s.id === 'site004')!,
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
            {/* Simplified Malaysia outline */}
            <path
              d="M100 200 L200 150 L300 160 L400 140 L500 160 L600 200 L650 250 L700 300 L680 400 L600 450 L500 480 L400 500 L300 480 L200 450 L150 400 L100 350 Z
                 M250 120 L350 100 L400 120 L380 160 L320 150 L270 140 Z
                 M500 100 L600 80 L650 120 L620 160 L550 150 L520 130 Z"
              fill="hsl(var(--muted))"
              stroke="hsl(var(--border))"
              strokeWidth="2"
              className="hover:fill-muted-foreground/10 transition-colors"
            />
            
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
        </div>
      </CardContent>
    </Card>
  );
}