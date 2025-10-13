import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, Download, Upload, Edit, Plus, Trash2, Power, Settings } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { SiteData } from '@/types/dashboard';

interface TransmitterDevice {
  id: string;
  type: string;
  label: string;
  role: 'Active' | 'Backup' | 'Standby';
  channelName: string;
  frequency: string;
  oidOffset: string;
  ipAddress: string;
}

interface SiteConfig {
  id?: string;
  name: string;
  location: string;
  description: string;
  latitude: string;
  longitude: string;
  technician: string;
  phone: string;
  email: string;
  transmitters: TransmitterDevice[];
}

export default function SiteConfigPage() {
  const [selectedSite, setSelectedSite] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [originalConfig, setOriginalConfig] = useState<SiteConfig | null>(null);
  const [sites, setSites] = useState<SiteData[]>([]);
  const [siteConfig, setSiteConfig] = useState<SiteConfig>({
    name: '',
    location: '',
    description: '',
    latitude: '',
    longitude: '',
    technician: '',
    phone: '',
    email: '',
    transmitters: []
  });

  // Initialize original config when component mounts or site changes
  React.useEffect(() => {
    if (!isEditing) {
      setOriginalConfig({ ...siteConfig });
    }
  }, [selectedSite, isEditing]);

  const handleInputChange = (field: keyof SiteConfig, value: string) => {
    setSiteConfig(prev => ({
      ...prev,
      [field]: value
    }));
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
      id: `tx-${Date.now()}`,
      type: 'FM Transmitter',
      label: `TX ${siteConfig.transmitters.length + 1}`,
      role: 'Active',
      channelName: '',
      frequency: '',
      oidOffset: '',
      ipAddress: ''
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
    // TODO: Implement save functionality
    console.log('Saving configuration:', siteConfig);
    setIsEditing(false);
    setHasUnsavedChanges(false);
    setOriginalConfig({ ...siteConfig });
    alert('Configuration saved successfully!');
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
    // Export empty configuration template since no sites are configured
    const emptyConfig = {
      sites: [],
      message: "No sites configured. This is an empty configuration template."
    };
    const dataStr = JSON.stringify(emptyConfig, null, 2);
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
    <div className="min-h-screen bg-gray-900 text-white p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">FM Transmitter Management</h1>
          <p className="text-gray-400">Configure and monitor FM transmitter sites</p>
        </div>
        
        <div className="flex gap-2">
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
            {sites.length === 0 ? (
              <Card className="bg-gray-800/50 border-gray-700">
                <CardContent className="p-4 text-center">
                  <p className="text-gray-400 text-sm">No sites configured</p>
                  <p className="text-gray-500 text-xs mt-1">Click "Add Site" to create your first site</p>
                </CardContent>
              </Card>
            ) : (
              sites.map((site) => (
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
                        <div className="text-gray-300">Host: Not configured</div>
                        <div className="text-gray-300">Port: Not configured</div>
                        <div className="text-gray-300">Version: Not configured</div>
                        <div className="text-gray-300">Community: Not configured</div>
                      </div>
                      
                      <div className="text-xs">
                        <span className="text-gray-400">Transmitters ({site.activeTransmitterCount + site.backupTransmitterCount})</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          <Badge variant="secondary" className="text-xs px-1 py-0">
                            No transmitters configured
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>

        {/* Right Panel - Configuration Form */}
        <div className="flex-1">
          {selectedSite ? (
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Site Configuration</CardTitle>
                  <div className="flex gap-2">
                    {!isEditing ? (
                      <Button 
                        size="sm" 
                        onClick={() => setIsEditing(true)}
                        className="bg-blue-500 hover:bg-blue-600"
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                    ) : (
                      <>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={handleCancel}
                          className="border-gray-600 text-gray-300"
                        >
                          Cancel
                        </Button>
                        <Button 
                          size="sm" 
                          onClick={handleSave}
                          className="bg-green-500 hover:bg-green-600"
                          disabled={!hasUnsavedChanges}
                        >
                          Save Changes
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Site Information */}
                <div className="space-y-4">
                  <h3 className="text-md font-semibold border-b border-gray-700 pb-2">Site Information</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="siteName">Site Name</Label>
                      <Input
                        id="siteName"
                        value={siteConfig.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        disabled={!isEditing}
                        className="bg-gray-700 border-gray-600"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={siteConfig.location}
                        onChange={(e) => handleInputChange('location', e.target.value)}
                        disabled={!isEditing}
                        className="bg-gray-700 border-gray-600"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={siteConfig.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      disabled={!isEditing}
                      className="bg-gray-700 border-gray-600"
                      rows={3}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="latitude">Latitude</Label>
                      <Input
                        id="latitude"
                        value={siteConfig.latitude}
                        onChange={(e) => handleInputChange('latitude', e.target.value)}
                        disabled={!isEditing}
                        className="bg-gray-700 border-gray-600"
                        placeholder="e.g., 3.1390"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="longitude">Longitude</Label>
                      <Input
                        id="longitude"
                        value={siteConfig.longitude}
                        onChange={(e) => handleInputChange('longitude', e.target.value)}
                        disabled={!isEditing}
                        className="bg-gray-700 border-gray-600"
                        placeholder="e.g., 101.6869"
                      />
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="space-y-4">
                  <h3 className="text-md font-semibold border-b border-gray-700 pb-2">Contact Information</h3>
                  
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="technician">Site Technician</Label>
                      <Input
                        id="technician"
                        value={siteConfig.technician}
                        onChange={(e) => handleInputChange('technician', e.target.value)}
                        disabled={!isEditing}
                        className="bg-gray-700 border-gray-600"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          value={siteConfig.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          disabled={!isEditing}
                          className="bg-gray-700 border-gray-600"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          value={siteConfig.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          disabled={!isEditing}
                          className="bg-gray-700 border-gray-600"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Transmitter Configuration */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-md font-semibold border-b border-gray-700 pb-2">Transmitter Configuration</h3>
                    {isEditing && (
                      <Button 
                        size="sm" 
                        onClick={addTransmitter}
                        className="bg-green-500 hover:bg-green-600"
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Add Transmitter
                      </Button>
                    )}
                  </div>
                  
                  {siteConfig.transmitters.length === 0 ? (
                    <div className="text-center py-8 text-gray-400">
                      <p>No transmitters configured</p>
                      {isEditing && (
                        <p className="text-sm mt-1">Click "Add Transmitter" to configure your first transmitter</p>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {siteConfig.transmitters.map((transmitter, index) => (
                        <Card key={transmitter.id} className="bg-gray-700/50 border-gray-600">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-4">
                              <h4 className="font-medium">Transmitter {index + 1}</h4>
                              {isEditing && (
                                <Button 
                                  size="sm" 
                                  variant="ghost" 
                                  onClick={() => removeTransmitter(index)}
                                  className="text-red-400 hover:text-red-300"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              )}
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label>Type</Label>
                                <Select 
                                  value={transmitter.type} 
                                  onValueChange={(value) => handleTransmitterChange(index, 'type', value)}
                                  disabled={!isEditing}
                                >
                                  <SelectTrigger className="bg-gray-600 border-gray-500">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="FM Transmitter">FM Transmitter</SelectItem>
                                    <SelectItem value="AM Transmitter">AM Transmitter</SelectItem>
                                    <SelectItem value="Digital Transmitter">Digital Transmitter</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              
                              <div className="space-y-2">
                                <Label>Label</Label>
                                <Input
                                  value={transmitter.label}
                                  onChange={(e) => handleTransmitterChange(index, 'label', e.target.value)}
                                  disabled={!isEditing}
                                  className="bg-gray-600 border-gray-500"
                                />
                              </div>
                              
                              <div className="space-y-2">
                                <Label>Role</Label>
                                <Select 
                                  value={transmitter.role} 
                                  onValueChange={(value) => handleTransmitterChange(index, 'role', value as 'Active' | 'Backup' | 'Standby')}
                                  disabled={!isEditing}
                                >
                                  <SelectTrigger className="bg-gray-600 border-gray-500">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="Active">Active</SelectItem>
                                    <SelectItem value="Backup">Backup</SelectItem>
                                    <SelectItem value="Standby">Standby</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              
                              <div className="space-y-2">
                                <Label>Channel Name</Label>
                                <Input
                                  value={transmitter.channelName}
                                  onChange={(e) => handleTransmitterChange(index, 'channelName', e.target.value)}
                                  disabled={!isEditing}
                                  className="bg-gray-600 border-gray-500"
                                />
                              </div>
                              
                              <div className="space-y-2">
                                <Label>Frequency (MHz)</Label>
                                <Input
                                  value={transmitter.frequency}
                                  onChange={(e) => handleTransmitterChange(index, 'frequency', e.target.value)}
                                  disabled={!isEditing}
                                  className="bg-gray-600 border-gray-500"
                                />
                              </div>
                              
                              <div className="space-y-2">
                                <Label>IP Address</Label>
                                <Input
                                  value={transmitter.ipAddress}
                                  onChange={(e) => handleTransmitterChange(index, 'ipAddress', e.target.value)}
                                  disabled={!isEditing}
                                  className="bg-gray-600 border-gray-500"
                                />
                              </div>
                            </div>
                            
                            <div className="mt-4">
                              <Label>SNMP OID Offset</Label>
                              <Input
                                value={transmitter.oidOffset}
                                onChange={(e) => handleTransmitterChange(index, 'oidOffset', e.target.value)}
                                disabled={!isEditing}
                                className="bg-gray-600 border-gray-500 mt-2"
                                placeholder="e.g., 1.3.6.1.4.1.12345.1.1"
                              />
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-gray-800/50 border-gray-700">
              <CardContent className="p-8 text-center">
                <MapPin className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium mb-2">No Site Selected</h3>
                <p className="text-gray-400">Select a site from the left panel to configure its settings</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}