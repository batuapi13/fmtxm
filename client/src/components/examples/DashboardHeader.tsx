import DashboardHeader from '../DashboardHeader';

export default function DashboardHeaderExample() {
  return (
    <div className="w-full">
      <DashboardHeader 
        totalSites={12}
        onlineSites={10}
        totalAlerts={3}
      />
    </div>
  );
}