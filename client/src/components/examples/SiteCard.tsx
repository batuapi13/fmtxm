import SiteCard from '../SiteCard';

export default function SiteCardExample() {
  //todo: remove mock functionality
  const mockSite = {
    id: 'site001',
    name: 'Downtown FM',
    location: 'Mount Wilson, CA',
    overallStatus: 'operational' as const,
    activeTransmitter: 'main' as const,
    transmitters: {
      main: {
        id: 'tx001',
        type: 'main' as const,
        status: 'operational' as const,
        transmitPower: 950,
        reflectPower: 15,
        mainAudio: true,
        backupAudio: true,
        connectivity: true,
        lastSeen: '2 seconds ago'
      },
      reserve: {
        id: 'tx002',
        type: 'reserve' as const,
        status: 'operational' as const,
        transmitPower: 0,
        reflectPower: 0,
        mainAudio: true,
        backupAudio: true,
        connectivity: true,
        lastSeen: '5 seconds ago'
      }
    },
    alerts: 0
  };

  return (
    <div className="max-w-4xl">
      <SiteCard site={mockSite} />
    </div>
  );
}