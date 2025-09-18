import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import StatusIndicator from './StatusIndicator';
import { Search, Settings, Bell, RefreshCw } from 'lucide-react';
import { useState } from 'react';

interface DashboardHeaderProps {
  totalSites: number;
  onlineSites: number;
  totalAlerts: number;
  onSearch?: (query: string) => void;
  onRefresh?: () => void;
  onSettingsClick?: () => void;
}

export default function DashboardHeader({ 
  totalSites, 
  onlineSites, 
  totalAlerts, 
  onSearch, 
  onRefresh,
  onSettingsClick 
}: DashboardHeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    onSearch?.(value);
    console.log(`Searching for: ${value}`);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    console.log('Refreshing dashboard data...');
    onRefresh?.();
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const handleSettings = () => {
    console.log('Opening settings...');
    onSettingsClick?.();
  };

  return (
    <div className="border-b border-border bg-card">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-6">
          <div>
            <h1 className="text-2xl font-semibold text-foreground" data-testid="dashboard-title">
              SNMP FM Transmitter Dashboard
            </h1>
            <p className="text-sm text-muted-foreground mt-1">Real-time monitoring and status</p>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-center gap-2">
              <StatusIndicator status="operational" size="sm" />
              <span className="text-sm" data-testid="sites-online">
                {onlineSites}/{totalSites} Sites Online
              </span>
            </div>
            
            {totalAlerts > 0 && (
              <Badge variant="destructive" className="flex items-center gap-1" data-testid="alert-count">
                <Bell className="w-3 h-3" />
                {totalAlerts} Alerts
              </Badge>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search sites..."
              value={searchQuery}
              onChange={handleSearch}
              className="pl-9"
              data-testid="search-input"
            />
          </div>
          
          <Button
            variant="outline"
            size="icon"
            onClick={handleRefresh}
            disabled={isRefreshing}
            data-testid="button-refresh"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </Button>
          
          <Button
            variant="outline"
            size="icon"
            onClick={handleSettings}
            data-testid="button-settings"
          >
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}