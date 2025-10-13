import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Trash2, Edit, Plus, Play, Square, TestTube } from 'lucide-react';
import { snmpService, type SNMPDevice } from '@/services/snmpService';

interface DeviceFormData {
  name: string;
  host: string;
  port: number;
  community: string;
  version: 0 | 1;
  oids: string[];
  pollInterval: number;
}

export default function SNMPDevicesPage() {
  const [devices, setDevices] = useState<SNMPDevice[]>([]);
  const [pollerStatus, setPollerStatus] = useState({ running: false, deviceCount: 0, resultCount: 0 });
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingDevice, setEditingDevice] = useState<SNMPDevice | null>(null);
  const [testingDevice, setTestingDevice] = useState<string | null>(null);
  const [formData, setFormData] = useState<DeviceFormData>({
    name: '',
    host: '',
    port: 161,
    community: 'public',
    version: 1,
    oids: ['1.3.6.1.2.1.1.1.0'], // System description OID
    pollInterval: 30000
  });

  useEffect(() => {
    loadDevices();
    loadPollerStatus();
  }, []);

  const loadDevices = async () => {
    const deviceList = await snmpService.getDevices();
    setDevices(deviceList);
  };

  const loadPollerStatus = async () => {
    const status = await snmpService.getPollerStatus();
    setPollerStatus(status);
  };

  const handleAddDevice = async () => {
    const newDevice = await snmpService.addDevice({
      ...formData,
      isActive: true
    });
    
    if (newDevice) {
      setDevices(prev => [...prev, newDevice]);
      setIsAddDialogOpen(false);
      resetForm();
    }
  };

  const handleUpdateDevice = async () => {
    if (!editingDevice) return;
    
    const updatedDevice = await snmpService.updateDevice(editingDevice.id, formData);
    
    if (updatedDevice) {
      setDevices(prev => prev.map(d => d.id === editingDevice.id ? updatedDevice : d));
      setEditingDevice(null);
      resetForm();
    }
  };

  const handleDeleteDevice = async (id: string) => {
    const success = await snmpService.deleteDevice(id);
    
    if (success) {
      setDevices(prev => prev.filter(d => d.id !== id));
    }
  };

  const handleTestDevice = async (device: SNMPDevice) => {
    setTestingDevice(device.id);
    
    const success = await snmpService.testDevice({
      name: device.name,
      host: device.host,
      port: device.port,
      community: device.community,
      version: device.version,
      oids: device.oids,
      pollInterval: device.pollInterval
    });
    
    setTestingDevice(null);
    
    // Show result (you might want to add a toast notification here)
    alert(success ? 'Device test successful!' : 'Device test failed!');
  };

  const handleToggleDevice = async (device: SNMPDevice) => {
    const updatedDevice = await snmpService.updateDevice(device.id, {
      isActive: !device.isActive
    });
    
    if (updatedDevice) {
      setDevices(prev => prev.map(d => d.id === device.id ? updatedDevice : d));
    }
  };

  const handleStartPoller = async () => {
    const success = await snmpService.startPoller();
    if (success) {
      await loadPollerStatus();
    }
  };

  const handleStopPoller = async () => {
    const success = await snmpService.stopPoller();
    if (success) {
      await loadPollerStatus();
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      host: '',
      port: 161,
      community: 'public',
      version: 1,
      oids: ['1.3.6.1.2.1.1.1.0'],
      pollInterval: 30000
    });
  };

  const openEditDialog = (device: SNMPDevice) => {
    setEditingDevice(device);
    setFormData({
      name: device.name,
      host: device.host,
      port: device.port,
      community: device.community,
      version: device.version,
      oids: device.oids,
      pollInterval: device.pollInterval
    });
  };

  const handleOidsChange = (value: string) => {
    const oids = value.split('\n').filter(oid => oid.trim().length > 0);
    setFormData(prev => ({ ...prev, oids }));
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">SNMP Devices</h1>
            <p className="text-muted-foreground">Manage and monitor SNMP-enabled devices</p>
          </div>
          
          <div className="flex gap-2">
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Device
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Add SNMP Device</DialogTitle>
                </DialogHeader>
                <DeviceForm
                  formData={formData}
                  setFormData={setFormData}
                  onSubmit={handleAddDevice}
                  onCancel={() => {
                    setIsAddDialogOpen(false);
                    resetForm();
                  }}
                  onOidsChange={handleOidsChange}
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Poller Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              SNMP Poller Status
              <div className="flex gap-2">
                {pollerStatus.running ? (
                  <Button variant="outline" size="sm" onClick={handleStopPoller}>
                    <Square className="w-4 h-4 mr-2" />
                    Stop Poller
                  </Button>
                ) : (
                  <Button size="sm" onClick={handleStartPoller}>
                    <Play className="w-4 h-4 mr-2" />
                    Start Poller
                  </Button>
                )}
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {pollerStatus.running ? (
                    <Badge variant="default">Running</Badge>
                  ) : (
                    <Badge variant="secondary">Stopped</Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">Status</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{pollerStatus.deviceCount}</div>
                <p className="text-sm text-muted-foreground">Active Devices</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{pollerStatus.resultCount}</div>
                <p className="text-sm text-muted-foreground">Total Results</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Devices List */}
        <div className="grid gap-4">
          {devices.map(device => (
            <Card key={device.id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span>{device.name}</span>
                    <Badge variant={device.isActive ? "default" : "secondary"}>
                      {device.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleTestDevice(device)}
                      disabled={testingDevice === device.id}
                    >
                      <TestTube className="w-4 h-4 mr-2" />
                      {testingDevice === device.id ? 'Testing...' : 'Test'}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditDialog(device)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteDevice(device.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <Label className="text-muted-foreground">Host</Label>
                    <p>{device.host}:{device.port}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Community</Label>
                    <p>{device.community}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Version</Label>
                    <p>v{device.version === 0 ? '1' : '2c'}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Poll Interval</Label>
                    <p>{device.pollInterval / 1000}s</p>
                  </div>
                </div>
                <div className="mt-4">
                  <Label className="text-muted-foreground">OIDs ({device.oids.length})</Label>
                  <div className="mt-1 text-xs text-muted-foreground">
                    {device.oids.slice(0, 3).join(', ')}
                    {device.oids.length > 3 && ` +${device.oids.length - 3} more`}
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <Switch
                    checked={device.isActive}
                    onCheckedChange={() => handleToggleDevice(device)}
                  />
                  <Label>Enable polling for this device</Label>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {devices.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-muted-foreground">No SNMP devices configured</p>
              <Button className="mt-4" onClick={() => setIsAddDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Device
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Edit Dialog */}
        {editingDevice && (
          <Dialog open={!!editingDevice} onOpenChange={() => setEditingDevice(null)}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Edit SNMP Device</DialogTitle>
              </DialogHeader>
              <DeviceForm
                formData={formData}
                setFormData={setFormData}
                onSubmit={handleUpdateDevice}
                onCancel={() => {
                  setEditingDevice(null);
                  resetForm();
                }}
                onOidsChange={handleOidsChange}
              />
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
}

interface DeviceFormProps {
  formData: DeviceFormData;
  setFormData: (data: DeviceFormData) => void;
  onSubmit: () => void;
  onCancel: () => void;
  onOidsChange: (value: string) => void;
}

function DeviceForm({ formData, setFormData, onSubmit, onCancel, onOidsChange }: DeviceFormProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Device Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g., Transmitter Site 1"
          />
        </div>
        <div>
          <Label htmlFor="host">Host/IP Address</Label>
          <Input
            id="host"
            value={formData.host}
            onChange={(e) => setFormData({ ...formData, host: e.target.value })}
            placeholder="e.g., 192.168.1.100"
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label htmlFor="port">Port</Label>
          <Input
            id="port"
            type="number"
            value={formData.port}
            onChange={(e) => setFormData({ ...formData, port: parseInt(e.target.value) || 161 })}
          />
        </div>
        <div>
          <Label htmlFor="community">Community</Label>
          <Input
            id="community"
            value={formData.community}
            onChange={(e) => setFormData({ ...formData, community: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="version">SNMP Version</Label>
          <Select
            value={formData.version.toString()}
            onValueChange={(value) => setFormData({ ...formData, version: parseInt(value) as 0 | 1 })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">v1</SelectItem>
              <SelectItem value="1">v2c</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="pollInterval">Poll Interval (seconds)</Label>
        <Input
          id="pollInterval"
          type="number"
          value={formData.pollInterval / 1000}
          onChange={(e) => setFormData({ ...formData, pollInterval: (parseInt(e.target.value) || 30) * 1000 })}
          min="5"
          max="3600"
        />
      </div>

      <div>
        <Label htmlFor="oids">OIDs (one per line)</Label>
        <Textarea
          id="oids"
          value={formData.oids.join('\n')}
          onChange={(e) => onOidsChange(e.target.value)}
          placeholder="1.3.6.1.2.1.1.1.0&#10;1.3.6.1.2.1.1.3.0"
          rows={6}
        />
        <p className="text-xs text-muted-foreground mt-1">
          Enter SNMP OIDs to monitor, one per line. Common OIDs: System Description (1.3.6.1.2.1.1.1.0), System Uptime (1.3.6.1.2.1.1.3.0)
        </p>
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={onSubmit}>
          Save Device
        </Button>
      </div>
    </div>
  );
}