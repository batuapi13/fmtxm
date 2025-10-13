import SiteCard from '../SiteCard';

export default function SiteCardExample() {
  //todo: remove mock functionality
  const mockSite = {
    id: 'site001',
    name: 'Downtown FM',
    location: 'Mount Wilson, CA',
    coordinates: { lat: 34.2257, lng: -118.0614 },
    broadcaster: 'Example Broadcasting',
    overallStatus: 'operational' as const,
    activeTransmitterCount: 1,
    backupTransmitterCount: 1,
    standbyTransmitterCount: 0,
    runningActiveCount: 1,
    runningBackupCount: 0,
    activeStandbyCount: 0,
    transmitters: [
      {
        id: 'tx001',
        type: '1' as const,
        role: 'active' as const,
        label: '1',
        channelName: 'Downtown FM',
        frequency: '95.5',
        status: 'operational' as const,
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
        type: 'backup1' as const,
        role: 'backup' as const,
        label: 'Backup 1',
        channelName: 'Reserve',
        frequency: '95.5',
        status: 'operational' as const,
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
  };

  return (
    <div className="max-w-4xl">
      <SiteCard site={mockSite} />
    </div>
  );
}