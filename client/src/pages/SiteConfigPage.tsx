import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { MapPin, Settings, Plus, Trash2, Download, Upload, Edit, Power } from 'lucide-react';
import { SiteData } from '@/types/dashboard';

interface TransmitterDevice {
  id: string;
  type: string;
  label: string;
  role: 'Active' | 'Backup' | 'Standby';
  channelName: string;
  frequency: string;
  oidOffset: string;
}

interface SiteConfig {
  id?: string;
  name: string;
  location: string;
  description: string;
  hostIp: string;
  port: string;
  communityString: string;
  snmpVersion: string;
  baseOid: string;
  latitude: string;
  longitude: string;
  technician: string;
  phone: string;
  email: string;
  transmitters: TransmitterDevice[];
}

const mockSites: SiteData[] = [
  {
    id: 'site-1',
    name: 'Gunung Ulu Kali',
    location: 'SELANGOR, Malaysia',
    coordinates: { lat: 3.4048, lng: 101.7680 },
    broadcaster: 'RTM',
    overallStatus: 'offline',
    transmitters: [],
    activeTransmitterCount: 3,
    backupTransmitterCount: 1,
    standbyTransmitterCount: 0,
    runningActiveCount: 0,
    runningBackupCount: 0,
    activeStandbyCount: 0,
    alerts: 0
  },
  {
    id: 'site-2',
    name: 'Kuantan | Bukit Pelindung',
    location: 'PAHANG, Malaysia',
    coordinates: { lat: 3.8077, lng: 103.3260 },
    broadcaster: 'RTM',
    overallStatus: 'offline',
    transmitters: [],
    activeTransmitterCount: 1,
    backupTransmitterCount: 1,
    standbyTransmitterCount: 0,
    runningActiveCount: 0,
    runningBackupCount: 0,
    activeStandbyCount: 0,
    alerts: 0
  },
  {
    id: 'site-3',
    name: 'Penang Hill',
    location: 'PENANG, Malaysia',
    coordinates: { lat: 5.4164, lng: 100.3327 },
    broadcaster: 'RTM',
    overallStatus: 'offline',
    transmitters: [],
    activeTransmitterCount: 1,
    backupTransmitterCount: 1,
    standbyTransmitterCount: 0,
    runningActiveCount: 0,
    runningBackupCount: 0,
    activeStandbyCount: 0,
    alerts: 0
  },
  {
    id: 'site-4',
    name: 'Mount Santubong',
    location: 'SARAWAK, Malaysia',
    coordinates: { lat: 1.7297, lng: 110.3371 },
    broadcaster: 'RTM',
    overallStatus: 'offline',
    transmitters: [],
    activeTransmitterCount: 1,
    backupTransmitterCount: 1,
    standbyTransmitterCount: 0,
    runningActiveCount: 0,
    runningBackupCount: 0,
    activeStandbyCount: 0,
    alerts: 0
  }
];

export default function SiteConfigPage() {
  const [selectedSite, setSelectedSite] = useState<string | null>('site-1');
  const [isEditing, setIsEditing] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [originalConfig, setOriginalConfig] = useState<SiteConfig | null>(null);
  const [siteConfig, setSiteConfig] = useState<SiteConfig>({
    name: 'Gunung Ulu Kali',
    location: 'SELANGOR, Malaysia',
    description: 'Optional description of the site',
    hostIp: '192.168.1.100',
    port: '161',
    communityString: 'public',
    snmpVersion: 'v2c',
    baseOid: '1.3.6.1.4.1.12345',
    latitude: '',
    longitude: '',
    technician: '',
    phone: '',
    email: '',
    transmitters: [
      {
        id: '1',
        type: '1',
        label: '1',
        role: 'Active',
        channelName: 'Eight FM',
        frequency: '88.1',
        oidOffset: '.1'
      },
      {
        id: '2',
        type: '2',
        label: '2',
        role: 'Active',
        channelName: 'GoXuan FM',
        frequency: '90.5',
        oidOffset: '.2'
      },
      {
        id: '3',
        type: '3',
        label: '3',
        role: 'Active',
        channelName: 'IFM 89.9',
        frequency: '89.9',
        oidOffset: '.3'
      },
      {
        id: '4',
        type: '11',
        label: '11',
        role: 'Backup',
        channelName: 'Best FM',
        frequency: '104.1',
        oidOffset: '.11'
      }
    ]
  });

  // Initialize original config when component mounts or site changes
  React.useEffect(() => {
    if (!originalConfig) {
      setOriginalConfig({ ...siteConfig });
    }
  }, [siteConfig, originalConfig]);

  const handleInputChange = (field: keyof SiteConfig, value: string) => {
    setSiteConfig(prev => ({ ...prev, [field]: value }));
    setHasUnsavedChanges(true);
  };

  const handleTransmitterChange = (index: number, field: keyof TransmitterDevice, value: string) => {
    setSiteConfig(prev => ({
      ...prev,
      transmitters: prev.transmitters.map((tx, i) => 
        i === index ? { ...tx, [field]: value } : tx
      )
    }));
    setHasUnsavedChanges(true);
  };

  const addTransmitter = () => {
    const newTransmitter: TransmitterDevice = {
      id: Date.now().toString(),
      type: '',
      label: '',
      role: 'Active',
      channelName: '',
      frequency: '',
      oidOffset: ''
    };
    setSiteConfig(prev => ({
      ...prev,
      transmitters: [...prev.transmitters, newTransmitter]
    }));
    setHasUnsavedChanges(true);
  };

  const removeTransmitter = (index: number) => {
    setSiteConfig(prev => ({
      ...prev,
      transmitters: prev.transmitters.filter((_, i) => i !== index)
    }));
    setHasUnsavedChanges(true);
  };

  const handleSave = () => {
    // Basic validation
    if (!siteConfig.name.trim()) {
      alert('Site name is required');
      return;
    }
    if (!siteConfig.hostIp.trim()) {
      alert('Host/IP address is required');
      return;
    }
    if (!siteConfig.port.trim()) {
      alert('Port is required');
      return;
    }

    // TODO: Implement actual save functionality (API call)
    console.log('Saving site configuration:', siteConfig);
    
    // Update original config and reset unsaved changes flag
    setOriginalConfig({ ...siteConfig });
    setHasUnsavedChanges(false);
    
    // Show success message (in a real app, this would be a toast notification)
    alert('Site configuration saved successfully!');
  };

  const handleCancel = () => {
    if (hasUnsavedChanges) {
      const confirmCancel = window.confirm('You have unsaved changes. Are you sure you want to cancel?');
      if (!confirmCancel) return;
    }
    
    // Restore original configuration
    if (originalConfig) {
      setSiteConfig({ ...originalConfig });
    }
    setHasUnsavedChanges(false);
  };

  const handleExport = () => {
    // TODO: Implement export functionality
    const dataStr = JSON.stringify(mockSites, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = 'site-configuration.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    console.log('Export completed');
  };

  const handleImport = () => {
    // TODO: Implement import functionality
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const importedData = JSON.parse(e.target?.result as string);
            console.log('Imported data:', importedData);
            alert('Import functionality will be implemented in the next version');
          } catch (error) {
            alert('Invalid JSON file');
          }
        };
        reader.readAsText(file);
      }
    };
    
    input.click();
  };

  const handleAddSite = () => {
    // TODO: Implement add site functionality
    const newSiteId = `site-${Date.now()}`;
    console.log('Adding new site with ID:', newSiteId);
    alert('Add Site functionality will be implemented in the next version');
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'operational': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'warning': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'error': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'inactive': return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center">
            <span className="text-white font-bold text-sm">FM</span>
          </div>
          <h1 className="text-xl font-semibold">Malaysian FM Network Monitor</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="border-gray-600 text-gray-300">
            <MapPin className="w-4 h-4 mr-2" />
            Map View
          </Button>
          <Button variant="outline" size="sm" className="border-gray-600 text-gray-300">
            Site Cards
          </Button>
          <Button variant="outline" size="sm" className="border-gray-600 text-gray-300">
            <Settings className="w-4 h-4 mr-2" />
            SNMP Config
          </Button>
          <Button size="sm" className="bg-blue-500 hover:bg-blue-600">
            Site Config
          </Button>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Left Panel - Site List */}
        <div className="w-80 space-y-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              <h2 className="text-lg font-semibold">Site Configuration</h2>
            </div>
            
            <p className="text-sm text-gray-400">
              Manage transmitter sites and their SNMP connection settings
            </p>
            
             <div className="flex flex-wrap gap-2">
               <Button 
                 size="sm" 
                 variant="outline" 
                 className="border-gray-600 text-gray-300 hover:bg-gray-700"
                 onClick={handleExport}
               >
                 <Download className="w-4 h-4 mr-1" />
                 Export
               </Button>
               <Button 
                 size="sm" 
                 variant="outline" 
                 className="border-gray-600 text-gray-300 hover:bg-gray-700"
                 onClick={handleImport}
               >
                 <Upload className="w-4 h-4 mr-1" />
                 Import
               </Button>
               <Button 
                 size="sm" 
                 className="bg-blue-500 hover:bg-blue-600"
                 onClick={handleAddSite}
               >
                 <Plus className="w-4 h-4 mr-1" />
                 Add Site
               </Button>
             </div>
          </div>

          <div className="space-y-2">
            {mockSites.map((site) => (
              <Card 
                key={site.id}
                className={`cursor-pointer transition-colors ${
                  selectedSite === site.id 
                    ? 'bg-blue-500/20 border-blue-500/50' 
                    : 'bg-gray-800/50 border-gray-700 hover:bg-gray-800/70'
                }`}
                onClick={() => setSelectedSite(site.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-sm">{site.name}</h3>
                    <div className="flex gap-1">
                      <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                        <Power className="w-3 h-3" />
                      </Button>
                      <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button size="sm" variant="ghost" className="h-6 w-6 p-0 text-red-400">
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 mb-2">{site.location}</p>
                  
                  <div className="space-y-2">
                    <div className="text-xs">
                      <span className="text-gray-400">SNMP Configuration</span>
                      <div className="text-gray-300">Host: 192.168.1.100</div>
                      <div className="text-gray-300">Port: 161</div>
                      <div className="text-gray-300">Version: v2c</div>
                      <div className="text-gray-300">Community: public</div>
                    </div>
                    
                    <div className="text-xs">
                      <span className="text-gray-400">Transmitters ({site.activeTransmitterCount + site.backupTransmitterCount})</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {site.id === 'site-1' && (
                          <>
                            <Badge variant="secondary" className="text-xs bg-blue-500/20 text-blue-400">
                              Eight FM (88.1 MHz)
                            </Badge>
                            <Badge variant="secondary" className="text-xs bg-blue-500/20 text-blue-400">
                              GoXuan FM (90.5 MHz)
                            </Badge>
                            <Badge variant="secondary" className="text-xs bg-blue-500/20 text-blue-400">
                              IFM 89.9 (89.9 MHz)
                            </Badge>
                          </>
                        )}
                        {site.id === 'site-2' && (
                          <>
                            <Badge variant="secondary" className="text-xs bg-blue-500/20 text-blue-400">
                              Traxx FM (90.1 MHz)
                            </Badge>
                            <Badge variant="secondary" className="text-xs bg-blue-500/20 text-blue-400">
                              Minnal FM (95.1 MHz)
                            </Badge>
                          </>
                        )}
                        {site.id === 'site-3' && (
                          <>
                            <Badge variant="secondary" className="text-xs bg-blue-500/20 text-blue-400">
                              Mix FM (94.5 MHz)
                            </Badge>
                            <Badge variant="secondary" className="text-xs bg-blue-500/20 text-blue-400">
                              Hot FM (97.6 MHz)
                            </Badge>
                          </>
                        )}
                        {site.id === 'site-4' && (
                          <>
                            <Badge variant="secondary" className="text-xs bg-blue-500/20 text-blue-400">
                              Red FM (104.9 MHz)
                            </Badge>
                            <Badge variant="secondary" className="text-xs bg-blue-500/20 text-blue-400">
                              Cats FM (99.3 MHz)
                            </Badge>
                          </>
                        )}
                      </div>
                      <div className="text-gray-500 mt-1">+1 more...</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Right Panel - Site Configuration Form */}
        <div className="flex-1">
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-lg">Edit Site</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Basic Information */}
              <div>
                <h3 className="text-sm font-medium mb-4">Basic Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="siteName" className="text-sm text-gray-300">Site Name</Label>
                    <Input
                      id="siteName"
                      value={siteConfig.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="bg-gray-900/50 border-gray-600 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="location" className="text-sm text-gray-300">Location</Label>
                    <Input
                      id="location"
                      value={siteConfig.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      className="bg-gray-900/50 border-gray-600 text-white"
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <Label htmlFor="description" className="text-sm text-gray-300">Description</Label>
                  <Textarea
                    id="description"
                    value={siteConfig.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    className="bg-gray-900/50 border-gray-600 text-white"
                    rows={3}
                  />
                </div>
              </div>

              {/* SNMP Configuration */}
              <div>
                <h3 className="text-sm font-medium mb-4">SNMP Configuration</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="hostIp" className="text-sm text-gray-300">Host/IP Address</Label>
                    <Input
                      id="hostIp"
                      value={siteConfig.hostIp}
                      onChange={(e) => handleInputChange('hostIp', e.target.value)}
                      className="bg-gray-900/50 border-gray-600 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="port" className="text-sm text-gray-300">Port</Label>
                    <Input
                      id="port"
                      value={siteConfig.port}
                      onChange={(e) => handleInputChange('port', e.target.value)}
                      className="bg-gray-900/50 border-gray-600 text-white"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 mt-4">
                  <div>
                    <Label htmlFor="communityString" className="text-sm text-gray-300">Community String</Label>
                    <Input
                      id="communityString"
                      value={siteConfig.communityString}
                      onChange={(e) => handleInputChange('communityString', e.target.value)}
                      className="bg-gray-900/50 border-gray-600 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="snmpVersion" className="text-sm text-gray-300">SNMP Version</Label>
                    <Select value={siteConfig.snmpVersion} onValueChange={(value) => handleInputChange('snmpVersion', value)}>
                      <SelectTrigger className="bg-gray-900/50 border-gray-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-600">
                        <SelectItem value="v1">v1</SelectItem>
                        <SelectItem value="v2c">v2c</SelectItem>
                        <SelectItem value="v3">v3</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="baseOid" className="text-sm text-gray-300">Base OID</Label>
                    <Input
                      id="baseOid"
                      value={siteConfig.baseOid}
                      onChange={(e) => handleInputChange('baseOid', e.target.value)}
                      className="bg-gray-900/50 border-gray-600 text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Coordinates */}
              <div>
                <h3 className="text-sm font-medium mb-4">Coordinates (Optional)</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="latitude" className="text-sm text-gray-300">Latitude</Label>
                    <Input
                      id="latitude"
                      value={siteConfig.latitude}
                      onChange={(e) => handleInputChange('latitude', e.target.value)}
                      className="bg-gray-900/50 border-gray-600 text-white"
                      placeholder="e.g., 3.1390"
                    />
                  </div>
                  <div>
                    <Label htmlFor="longitude" className="text-sm text-gray-300">Longitude</Label>
                    <Input
                      id="longitude"
                      value={siteConfig.longitude}
                      onChange={(e) => handleInputChange('longitude', e.target.value)}
                      className="bg-gray-900/50 border-gray-600 text-white"
                      placeholder="e.g., 101.6869"
                    />
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div>
                <h3 className="text-sm font-medium mb-4">Contact Information (Optional)</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="technician" className="text-sm text-gray-300">Technician</Label>
                    <Input
                      id="technician"
                      value={siteConfig.technician}
                      onChange={(e) => handleInputChange('technician', e.target.value)}
                      className="bg-gray-900/50 border-gray-600 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone" className="text-sm text-gray-300">Phone</Label>
                    <Input
                      id="phone"
                      value={siteConfig.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="bg-gray-900/50 border-gray-600 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-sm text-gray-300">Email</Label>
                    <Input
                      id="email"
                      value={siteConfig.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="bg-gray-900/50 border-gray-600 text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Transmitters/Devices */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium">Transmitters/Devices</h3>
                  <Button 
                    size="sm" 
                    onClick={addTransmitter}
                    className="bg-blue-500 hover:bg-blue-600"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Device
                  </Button>
                </div>
                
                <div className="space-y-4">
                  {siteConfig.transmitters.map((transmitter, index) => (
                    <div key={transmitter.id} className="border border-gray-600 rounded-lg p-4 space-y-4">
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <Label className="text-sm text-gray-300">Type</Label>
                          <Input
                            value={transmitter.type}
                            onChange={(e) => handleTransmitterChange(index, 'type', e.target.value)}
                            className="bg-gray-900/50 border-gray-600 text-white"
                          />
                        </div>
                        <div>
                          <Label className="text-sm text-gray-300">Label</Label>
                          <Input
                            value={transmitter.label}
                            onChange={(e) => handleTransmitterChange(index, 'label', e.target.value)}
                            className="bg-gray-900/50 border-gray-600 text-white"
                          />
                        </div>
                        <div>
                          <Label className="text-sm text-gray-300">Role</Label>
                          <Select 
                            value={transmitter.role} 
                            onValueChange={(value) => handleTransmitterChange(index, 'role', value as 'Active' | 'Backup' | 'Standby')}
                          >
                            <SelectTrigger className="bg-gray-900/50 border-gray-600 text-white">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-800 border-gray-600">
                              <SelectItem value="Active">Active</SelectItem>
                              <SelectItem value="Backup">Backup</SelectItem>
                              <SelectItem value="Standby">Standby</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <Label className="text-sm text-gray-300">Channel Name</Label>
                          <Input
                            value={transmitter.channelName}
                            onChange={(e) => handleTransmitterChange(index, 'channelName', e.target.value)}
                            className="bg-gray-900/50 border-gray-600 text-white"
                          />
                        </div>
                        <div>
                          <Label className="text-sm text-gray-300">Frequency (MHz)</Label>
                          <Input
                            value={transmitter.frequency}
                            onChange={(e) => handleTransmitterChange(index, 'frequency', e.target.value)}
                            className="bg-gray-900/50 border-gray-600 text-white"
                          />
                        </div>
                        <div className="flex items-end gap-2">
                          <div className="flex-1">
                            <Label className="text-sm text-gray-300">OID Offset</Label>
                            <Input
                              value={transmitter.oidOffset}
                              onChange={(e) => handleTransmitterChange(index, 'oidOffset', e.target.value)}
                              className="bg-gray-900/50 border-gray-600 text-white"
                            />
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => removeTransmitter(index)}
                            className="border-red-500/50 text-red-400 hover:bg-red-500/20"
                          >
                            <Trash2 className="w-4 h-4" />
                            Remove
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-600">
                <Button variant="outline" className="border-gray-600 text-gray-300">
                  Cancel
                </Button>
                <Button className="bg-blue-500 hover:bg-blue-600">
                  Save
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}