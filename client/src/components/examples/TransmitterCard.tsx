import TransmitterCard from '../TransmitterCard';

export default function TransmitterCardExample() {
  //todo: remove mock functionality
  const mockTransmitter = {
    id: 'tx001',
    type: '1' as const,
    role: 'active' as const,
    label: '1',
    channelName: '988 FM',
    frequency: '98.8',
    status: 'operational' as const,
    transmitPower: 950,
    reflectPower: 15,
    mainAudio: true,
    backupAudio: true,
    connectivity: true,
    lastSeen: '2 seconds ago',
    isTransmitting: true
  };

  return (
    <div className="max-w-sm">
      <TransmitterCard transmitter={mockTransmitter} isActive={true} />
    </div>
  );
}