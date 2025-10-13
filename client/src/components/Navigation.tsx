import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { MapPin, Layers, Settings } from 'lucide-react';

export default function Navigation() {
  const [location] = useLocation();

  return (
    <nav className="bg-card border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">FM</span>
            </div>
            <span className="font-semibold text-lg">Malaysian FM Network Monitor</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Link href="/map">
              <Button 
                variant={location === '/map' ? 'default' : 'ghost'}
                size="sm"
                className="flex items-center gap-2"
                data-testid="nav-map"
              >
                <MapPin className="w-4 h-4" />
                Map View
              </Button>
            </Link>
            
            <Link href="/cards">
              <Button 
                variant={location === '/cards' ? 'default' : 'ghost'}
                size="sm"
                className="flex items-center gap-2"
                data-testid="nav-cards"
              >
                <Layers className="w-4 h-4" />
                Site Cards
              </Button>
            </Link>
            
            <Link href="/site-config">
              <Button 
                variant={location === '/site-config' ? 'default' : 'ghost'}
                size="sm"
                className="flex items-center gap-2"
                data-testid="nav-site-config"
              >
                <Settings className="w-4 h-4" />
                Site Config
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}