import MalaysiaMap from '../MalaysiaMap';
import type { SiteData } from '@/types/dashboard';

export default function MalaysiaMapExample() {
  //todo: remove mock functionality
  const mockSites: SiteData[] = [
    {
      id: 'site001',
      name: 'Downtown FM',
      location: 'Kuala Lumpur',
      overallStatus: 'operational',
      activeTransmitter: 'main',
      transmitters: {
        main: {
          id: 'tx001',
          type: 'main',
          status: 'operational',
          transmitPower: 950,
          reflectPower: 15,
          mainAudio: true,
          backupAudio: true,
          connectivity: true,
          lastSeen: '2 seconds ago'
        },
        reserve: {
          id: 'tx002',
          type: 'reserve',
          status: 'operational',
          transmitPower: 0,
          reflectPower: 0,
          mainAudio: true,
          backupAudio: true,
          connectivity: true,
          lastSeen: '5 seconds ago'
        }
      },
      alerts: 0
    },
    {
      id: 'site002',
      name: 'Valley Station',
      location: 'Selangor',
      overallStatus: 'warning',
      activeTransmitter: 'main',
      transmitters: {
        main: {
          id: 'tx003',
          type: 'main',
          status: 'warning',
          transmitPower: 820,
          reflectPower: 65,
          mainAudio: true,
          backupAudio: false,
          connectivity: true,
          lastSeen: '1 minute ago'
        },
        reserve: {
          id: 'tx004',
          type: 'reserve',
          status: 'operational',
          transmitPower: 0,
          reflectPower: 0,
          mainAudio: true,
          backupAudio: true,
          connectivity: true,
          lastSeen: '3 seconds ago'
        }
      },
      alerts: 2
    }
  ];

  return (
    <div className="max-w-4xl">
      <MalaysiaMap sites={mockSites} selectedSiteId="site001" />
    </div>
  );
}