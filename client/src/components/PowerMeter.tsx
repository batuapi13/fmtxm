import { Card, CardContent } from '@/components/ui/card';

interface PowerMeterProps {
  label: string;
  value: number;
  unit: string;
  max: number;
  threshold?: { warning: number; error: number };
  showGraph?: boolean;
  status?: 'operational' | 'warning' | 'error' | 'offline';
}

export default function PowerMeter({ label, value, unit, max, threshold, showGraph = false, status = 'operational' }: PowerMeterProps) {
  const percentage = Math.min((value / max) * 100, 100);
  
  const getTextColor = () => {
    if (status === 'error') return 'text-red-400';
    if (status === 'warning') return 'text-yellow-400';
    if (status === 'offline') return 'text-red-400';
    return 'text-white';
  };

  // Mock graph data for visual appeal
  const graphPoints = showGraph ? Array.from({ length: 20 }, (_, i) => 
    value + (Math.sin(i * 0.3) * (value * 0.1)) + (Math.random() * (value * 0.05))
  ) : [];

  return (
    <Card className="border-card-border">
      <CardContent className="p-4">
        <div className="space-y-2">
          <div className="text-left space-y-1">
            <span className="text-[11px] text-muted-foreground block leading-tight" data-testid="power-label">
              {label}
            </span>
            <span className={`text-xs sm:text-sm font-mono font-medium transition-colors block leading-tight tabular-nums ${getTextColor()}`} data-testid={`power-value-${label.toLowerCase().replace(/\s+/g, '-')}`}>
              {value.toFixed(0)} <span className="text-[10px] text-muted-foreground">W</span>
            </span>
          </div>
          
          {showGraph && (
            <div className="h-8 flex items-end justify-between gap-px mt-3" data-testid="power-graph">
              {graphPoints.map((point, i) => (
                <div
                  key={i}
                  className="bg-chart-1 opacity-60 w-full"
                  style={{ height: `${(point / max) * 100}%` }}
                />
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}