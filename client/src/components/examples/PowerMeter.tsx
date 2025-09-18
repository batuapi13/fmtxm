import PowerMeter from '../PowerMeter';

export default function PowerMeterExample() {
  return (
    <div className="space-y-4 max-w-sm">
      <PowerMeter 
        label="Transmit Power" 
        value={950} 
        unit="W" 
        max={1000}
        threshold={{ warning: 800, error: 980 }}
        showGraph
      />
      <PowerMeter 
        label="Reflect Power" 
        value={25} 
        unit="W" 
        max={100}
        threshold={{ warning: 50, error: 80 }}
      />
    </div>
  );
}