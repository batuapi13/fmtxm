import { Card, CardContent } from '@/components/ui/card';

interface PowerMeterProps {
  label: string;
  value: number;
  unit: string;
  max: number;
  threshold?: { warning: number; error: number };
  showGraph?: boolean;
}

export default function PowerMeter({ label, value, unit, max, threshold, showGraph = false }: PowerMeterProps) {
  const percentage = Math.min((value / max) * 100, 100);
  
  const getStatusColor = () => {
    if (!threshold) return 'bg-primary';
    if (value >= threshold.error) return 'bg-status-error';
    if (value >= threshold.warning) return 'bg-status-warning';
    return 'bg-status-operational';
  };

  // Mock graph data for visual appeal
  const graphPoints = showGraph ? Array.from({ length: 20 }, (_, i) => 
    value + (Math.sin(i * 0.3) * (value * 0.1)) + (Math.random() * (value * 0.05))
  ) : [];

  return (
    <Card className="border-card-border">
      <CardContent className="p-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground" data-testid="power-label">
              {label}
            </span>
            <span className="text-lg font-mono font-medium" data-testid={`power-value-${label.toLowerCase().replace(/\s+/g, '-')}`}>
              {value.toFixed(1)} {unit}
            </span>
          </div>
          
          <div className="relative h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className={`absolute left-0 top-0 h-full transition-all duration-300 ${getStatusColor()}`}
              style={{ width: `${percentage}%` }}
              data-testid="power-bar"
            />
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