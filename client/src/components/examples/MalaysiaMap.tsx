import MalaysiaMap from '../MalaysiaMap';
import type { SiteData } from '@/types/dashboard';

export default function MalaysiaMapExample() {
  const mockSites: SiteData[] = [
    {
      id: 'site001',
      name: 'KL Tower',
      location: 'Kuala Lumpur',
      coordinates: { lat: 3.1478, lng: 101.6953 },
      broadcaster: 'KL Broadcasting',
      overallStatus: 'operational',
      activeTransmitterCount: 1,
      backupTransmitterCount: 1,
      standbyTransmitterCount: 0,
      runningActiveCount: 1,
      runningBackupCount: 0,
      activeStandbyCount: 0,
      transmitters: [
        {
          id: 'tx001',
          type: '1',
          role: 'active',
          label: '1',
          channelName: 'KL FM',
          frequency: '95.8',
          status: 'operational',
          transmitPower: 950,
          reflectPower: 15,
          mainAudio: true,
          backupAudio: true,
          connectivity: true,
          lastSeen: '2 seconds ago',
          isTransmitting: true
        },
        {
          id: 'tx002',
          type: 'backup1',
          role: 'backup',
          label: 'Backup 1',
          channelName: 'Reserve',
          frequency: '95.8',
          status: 'operational',
          transmitPower: 0,
          reflectPower: 0,
          mainAudio: true,
          backupAudio: true,
          connectivity: true,
          lastSeen: '5 seconds ago',
          isTransmitting: false
        }
      ],
      alerts: 0
    },
    {
      id: 'site002',
      name: 'Valley Station',
      location: 'Selangor',
      coordinates: { lat: 3.0738, lng: 101.5183 },
      broadcaster: 'Valley Broadcasting',
      overallStatus: 'warning',
      activeTransmitterCount: 1,
      backupTransmitterCount: 1,
      standbyTransmitterCount: 0,
      runningActiveCount: 1,
      runningBackupCount: 0,
      activeStandbyCount: 0,
      transmitters: [
        {
          id: 'tx003',
          type: '1',
          role: 'active',
          label: '1',
          channelName: 'Valley FM',
          frequency: '102.3',
          status: 'warning',
          transmitPower: 820,
          reflectPower: 25,
          mainAudio: true,
          backupAudio: false,
          connectivity: true,
          lastSeen: '8 seconds ago',
          isTransmitting: true
        }
      ],
      alerts: 1
    }
  ];

  return (
    <div className="w-full h-96">
      <MalaysiaMap sites={mockSites} />
    </div>
  );
}