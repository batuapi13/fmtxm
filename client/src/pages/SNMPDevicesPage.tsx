import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { 
  Plus, 
  Trash2, 
  Save, 
  Settings, 
  Play,
  Pause,
  TestTube,
  AlertCircle,
  CheckCircle,
  Clock,
  Wifi,
  WifiOff
} from 'lucide-react';

interface SNMPDevice {
  id: string;
  name: string;
  host: string;
  port: number;
  community: string;
  version: 'v1' | 'v2c';
  timeout: number;
  retries: number;
  oids: string[];
  pollInterval: number;
  enabled: boolean;
  status?: 'connected' | 'disconnected' | 'error' | 'testing';
  lastPoll?: Date;
  lastError?: string;
}

interface DeviceResult {
  deviceId: string;
  timestamp: Date;
  success: boolean;
  data?: { [oid: string]: any };
  error?: string;
}

const SNMPDevicesPage: React.FC = () => {
  // Ensure hash fragment scrolls to diagnostics section when present
  useEffect(() => {
    const scrollToHash = () => {
      const { hash } = window.location;
      if (hash) {
        const el = document.querySelector(hash);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    };
    // Try immediately and on hash changes
    scrollToHash();
    window.addEventListener('hashchange', scrollToHash);
    return () => window.removeEventListener('hashchange', scrollToHash);
  }, []);
  const [devices, setDevices] = useState<SNMPDevice[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<SNMPDevice | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [deviceResults, setDeviceResults] = useState<{ [deviceId: string]: DeviceResult }>({});
  const [pollerRunning, setPollerRunning] = useState(false);
  // Re-scroll to hash when key content mounts/updates
  useEffect(() => {
    const { hash } = window.location;
    if (hash) {
      const el = document.querySelector(hash);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }, [selectedDevice, deviceResults]);

  // Mock initial devices
  useEffect(() => {
    const mockDevices: SNMPDevice[] = [
      {
        id: '1',
        name: 'ETG5000 Transmitter',
        host: '192.168.1.100',
        port: 161,
        community: 'public',
        version: 'v2c',
        timeout: 5000,
        retries: 3,
        oids: [
          '1.3.6.1.4.1.elenos.4.2.1', // generalStatus
          '1.3.6.1.4.1.elenos.4.2.2', // over2_3dBCarrier
          '1.3.6.1.4.1.elenos.4.2.3', // pilotPowerGood
          '1.3.6.1.4.1.elenos.4.1.1'  // softwareVersion
        ],
        pollInterval: 10000,
        enabled: true,
        status: 'connected',
        lastPoll: new Date()
      },
      {
        id: '2',
        name: 'Network Switch',
        host: '192.168.1.10',
        port: 161,
        community: 'public',
        version: 'v2c',
        timeout: 3000,
        retries: 2,
        oids: [
          '1.3.6.1.2.1.1.1.0', // sysDescr
          '1.3.6.1.2.1.1.3.0', // sysUpTime
          '1.3.6.1.2.1.1.5.0'  // sysName
        ],
        pollInterval: 60000,
        enabled: false,
        status: 'disconnected'
      }
    ];
    setDevices(mockDevices);
  }, []);

  const handleAddDevice = () => {
    const newDevice: SNMPDevice = {
      id: Date.now().toString(),
      name: 'New Device',
      host: '192.168.1.1',
      port: 161,
      community: 'public',
      version: 'v2c',
      timeout: 5000,
      retries: 3,
      oids: ['1.3.6.1.2.1.1.1.0'],
      pollInterval: 10000,
      enabled: false
    };
    setDevices([...devices, newDevice]);
    setSelectedDevice(newDevice);
    setIsEditing(true);
  };

  const handleDeleteDevice = (deviceId: string) => {
    setDevices(devices.filter(d => d.id !== deviceId));
    if (selectedDevice?.id === deviceId) {
      setSelectedDevice(null);
      setIsEditing(false);
    }
  };

  const handleSaveDevice = () => {
    if (!selectedDevice) return;
    
    setDevices(devices.map(d => 
      d.id === selectedDevice.id ? selectedDevice : d
    ));
    setIsEditing(false);
  };

  const handleTestDevice = async (device: SNMPDevice) => {
    // Update device status to testing
    setDevices(devices.map(d => 
      d.id === device.id ? { ...d, status: 'testing' } : d
    ));

    try {
      // Simulate API call to test device
      const response = await fetch('/api/snmp/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(device)
      });
      
      const result = await response.json();
      
      // Update device status based on test result
      setDevices(devices.map(d => 
        d.id === device.id ? { 
          ...d, 
          status: result.success ? 'connected' : 'error',
          lastPoll: new Date(),
          lastError: result.error
        } : d
      ));

      // Store test result
      setDeviceResults(prev => ({
        ...prev,
        [device.id]: result
      }));
    } catch (error) {
      setDevices(devices.map(d => 
        d.id === device.id ? { 
          ...d, 
          status: 'error',
          lastError: 'Connection failed'
        } : d
      ));
    }
  };

  const handleStartPoller = async () => {
    try {
      await fetch('/api/snmp/start', { method: 'POST' });
      setPollerRunning(true);
    } catch (error) {
      console.error('Failed to start poller:', error);
    }
  };

  const handleStopPoller = async () => {
    try {
      await fetch('/api/snmp/stop', { method: 'POST' });
      setPollerRunning(false);
    } catch (error) {
      console.error('Failed to stop poller:', error);
    }
  };

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'disconnected':
        return <WifiOff className="h-4 w-4 text-gray-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'testing':
        return <Clock className="h-4 w-4 text-yellow-500 animate-spin" />;
      default:
        return <Wifi className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'connected':
        return <Badge variant="default" className="bg-green-500">Connected</Badge>;
      case 'disconnected':
        return <Badge variant="secondary">Disconnected</Badge>;
      case 'error':
        return <Badge variant="destructive">Error</Badge>;
      case 'testing':
        return <Badge variant="outline">Testing...</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">SNMP Devices</h1>
          <p className="text-muted-foreground">Manage and monitor SNMP-enabled devices</p>
        </div>
        <div className="flex gap-2">
          {pollerRunning ? (
            <Button onClick={handleStopPoller} variant="outline">
              <Pause className="h-4 w-4 mr-2" />
              Stop Poller
            </Button>
          ) : (
            <Button onClick={handleStartPoller}>
              <Play className="h-4 w-4 mr-2" />
              Start Poller
            </Button>
          )}
          <Button onClick={handleAddDevice}>
            <Plus className="h-4 w-4 mr-2" />
            Add Device
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Device List */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Devices ({devices.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {devices.map((device) => (
                <div
                  key={device.id}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedDevice?.id === device.id
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:bg-muted/50'
                  }`}
                  onClick={() => {
                    setSelectedDevice(device);
                    setIsEditing(false);
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(device.status)}
                      <div>
                        <div className="font-medium">{device.name}</div>
                        <div className="text-sm text-muted-foreground">{device.host}:{device.port}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(device.status)}
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteDevice(device.id);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  {device.enabled && (
                    <div className="mt-2 text-xs text-muted-foreground">
                      Poll interval: {device.pollInterval / 1000}s
                      {device.lastPoll && (
                        <span className="ml-2">
                          Last: {device.lastPoll.toLocaleTimeString()}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              ))}
              {devices.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No devices configured
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Device Configuration */}
        <div className="lg:col-span-2">
          {/* Persistent anchor for diagnostics section (always present) */}
          <div id="problems_and_diagnostics" className="scroll-mt-24" />
          {selectedDevice ? (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    {getStatusIcon(selectedDevice.status)}
                    {selectedDevice.name}
                  </CardTitle>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleTestDevice(selectedDevice)}
                      disabled={selectedDevice.status === 'testing'}
                    >
                      <TestTube className="h-4 w-4 mr-2" />
                      Test
                    </Button>
                    {isEditing ? (
                      <>
                        <Button size="sm" onClick={handleSaveDevice}>
                          <Save className="h-4 w-4 mr-2" />
                          Save
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setIsEditing(false)}
                        >
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <Button size="sm" onClick={() => setIsEditing(true)}>
                        Edit
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Device Name</Label>
                    <Input
                      id="name"
                      value={selectedDevice.name}
                      onChange={(e) => setSelectedDevice({
                        ...selectedDevice,
                        name: e.target.value
                      })}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label htmlFor="host">Host/IP Address</Label>
                    <Input
                      id="host"
                      value={selectedDevice.host}
                      onChange={(e) => setSelectedDevice({
                        ...selectedDevice,
                        host: e.target.value
                      })}
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="port">Port</Label>
                    <Input
                      id="port"
                      type="number"
                      value={selectedDevice.port}
                      onChange={(e) => setSelectedDevice({
                        ...selectedDevice,
                        port: parseInt(e.target.value) || 161
                      })}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label htmlFor="community">Community String</Label>
                    <Input
                      id="community"
                      value={selectedDevice.community}
                      onChange={(e) => setSelectedDevice({
                        ...selectedDevice,
                        community: e.target.value
                      })}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label htmlFor="version">SNMP Version</Label>
                    <Select
                      value={selectedDevice.version}
                      onValueChange={(value: 'v1' | 'v2c') => setSelectedDevice({
                        ...selectedDevice,
                        version: value
                      })}
                      disabled={!isEditing}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="v1">v1</SelectItem>
                        <SelectItem value="v2c">v2c</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="timeout">Timeout (ms)</Label>
                    <Input
                      id="timeout"
                      type="number"
                      value={selectedDevice.timeout}
                      onChange={(e) => setSelectedDevice({
                        ...selectedDevice,
                        timeout: parseInt(e.target.value) || 5000
                      })}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label htmlFor="retries">Retries</Label>
                    <Input
                      id="retries"
                      type="number"
                      value={selectedDevice.retries}
                      onChange={(e) => setSelectedDevice({
                        ...selectedDevice,
                        retries: parseInt(e.target.value) || 3
                      })}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label htmlFor="pollInterval">Poll Interval (ms)</Label>
                    <Input
                      id="pollInterval"
                      type="number"
                      value={selectedDevice.pollInterval}
                      onChange={(e) => setSelectedDevice({
                        ...selectedDevice,
                        pollInterval: parseInt(e.target.value) || 30000
                      })}
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="oids">OIDs to Poll (one per line)</Label>
                  <Textarea
                    id="oids"
                    value={selectedDevice.oids.join('\n')}
                    onChange={(e) => setSelectedDevice({
                      ...selectedDevice,
                      oids: e.target.value.split('\n').filter(oid => oid.trim())
                    })}
                    disabled={!isEditing}
                    rows={6}
                    placeholder="1.3.6.1.2.1.1.1.0&#10;1.3.6.1.2.1.1.3.0&#10;1.3.6.1.2.1.1.5.0"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="enabled"
                    checked={selectedDevice.enabled}
                    onCheckedChange={(checked) => setSelectedDevice({
                      ...selectedDevice,
                      enabled: checked
                    })}
                    disabled={!isEditing}
                  />
                  <Label htmlFor="enabled">Enable polling for this device</Label>
                </div>

                {selectedDevice.lastError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center gap-2 text-red-700">
                      <AlertCircle className="h-4 w-4" />
                      <span className="font-medium">Last Error</span>
                    </div>
                    <p className="text-red-600 text-sm mt-1">{selectedDevice.lastError}</p>
                  </div>
                )}

                {/* Display last poll results */}
                {deviceResults[selectedDevice.id] && (
                  <div id="diagnostics_results" className="space-y-2">
                    <Label>Last Poll Results</Label>
                    <div className="p-3 bg-muted rounded-lg">
                      <div className="text-sm space-y-1">
                        <div>
                          <strong>Status:</strong> {deviceResults[selectedDevice.id].success ? 'Success' : 'Failed'}
                        </div>
                        <div>
                          <strong>Timestamp:</strong> {deviceResults[selectedDevice.id].timestamp.toLocaleString()}
                        </div>
                        {deviceResults[selectedDevice.id].data && (
                          <div>
                            <strong>Data:</strong>
                            <pre className="mt-1 text-xs bg-background p-2 rounded border overflow-auto">
                              {JSON.stringify(deviceResults[selectedDevice.id].data, null, 2)}
                            </pre>
                          </div>
                        )}
                        {deviceResults[selectedDevice.id].error && (
                          <div className="text-red-600">
                            <strong>Error:</strong> {deviceResults[selectedDevice.id].error}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center h-64">
                <div className="text-center text-muted-foreground">
                  <Settings className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Select a device to view and edit its configuration</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default SNMPDevicesPage;