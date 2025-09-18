import TransmitterCard from '../TransmitterCard';

export default function TransmitterCardExample() {
  //todo: remove mock functionality
  const mockTransmitter = {
    id: 'tx001',
    type: 'main' as const,
    status: 'operational' as const,
    transmitPower: 950,
    reflectPower: 15,
    mainAudio: true,
    backupAudio: true,
    connectivity: true,
    lastSeen: '2 seconds ago'
  };

  return (
    <div className="max-w-sm">
      <TransmitterCard transmitter={mockTransmitter} isActive={true} />
    </div>
  );
}