import StatusIndicator from '../StatusIndicator';

export default function StatusIndicatorExample() {
  return (
    <div className="space-y-4 p-4">
      <StatusIndicator status="operational" label="Online" animate />
      <StatusIndicator status="warning" label="High SWR" />
      <StatusIndicator status="error" label="Power Fault" />
      <StatusIndicator status="offline" label="No Connection" />
    </div>
  );
}