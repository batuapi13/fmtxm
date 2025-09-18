interface StatusIndicatorProps {
  status: 'operational' | 'warning' | 'error' | 'offline';
  size?: 'sm' | 'md' | 'lg';
  animate?: boolean;
  label?: string;
}

export default function StatusIndicator({ status, size = 'md', animate = false, label }: StatusIndicatorProps) {
  const sizeClasses = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',  
    lg: 'w-4 h-4'
  };

  const statusClasses = {
    operational: 'bg-status-operational',
    warning: 'bg-status-warning',
    error: 'bg-status-error', 
    offline: 'bg-status-offline'
  };

  return (
    <div className="flex items-center gap-2" data-testid={`status-${status}`}>
      <div 
        className={`rounded-full ${sizeClasses[size]} ${statusClasses[status]} ${animate && status === 'operational' ? 'animate-pulse' : ''}`}
        data-testid={`indicator-${status}`}
      />
      {label && (
        <span className="text-sm text-muted-foreground" data-testid="status-label">
          {label}
        </span>
      )}
    </div>
  );
}