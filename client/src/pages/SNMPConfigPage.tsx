import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Trash2, 
  Save, 
  Download, 
  Upload, 
  Settings, 
  Copy,
  Edit3,
  FileText,
  AlertCircle
} from 'lucide-react';

interface OIDDefinition {
  id: string;
  name: string;
  oid: string;
  description: string;
  dataType: 'INTEGER' | 'OCTET STRING' | 'OBJECT IDENTIFIER' | 'Counter32' | 'Gauge32';
  access: 'read-only' | 'read-write' | 'write-only' | 'not-accessible';
  unit?: string;
  minValue?: number;
  maxValue?: number;
  enumValues?: { [key: number]: string };
}

interface SNMPTemplate {
  id: string;
  name: string;
  description: string;
  manufacturer: string;
  model: string;
  version: string;
  baseOID: string;
  oids: OIDDefinition[];
  createdAt: string;
  updatedAt: string;
}

const SNMPConfigPage: React.FC = () => {
  // Mock data for ETG5000 template
  const mockETG5000Template: SNMPTemplate = {
    id: 'etg5000-v1',
    name: 'ETG5000',
    description: 'Elenos ETG5000 FM Transmitter Template',
    manufacturer: 'Elenos',
    model: 'ETG5000',
    version: '1.0',
    baseOID: '1.3.6.1.4.1.elenos.4',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
    oids: [
      {
        id: 'oid-1',
        name: 'generalStatus',
        oid: '1.3.6.1.4.1.elenos.4.2.1',
        description: 'Overall transmitter status',
        dataType: 'INTEGER',
        access: 'read-only',
        enumValues: { 1: 'fault', 2: 'warning', 3: 'stop', 4: 'ok' }
      },
      {
        id: 'oid-2',
        name: 'over2_3dBCarrier',
        oid: '1.3.6.1.4.1.elenos.4.2.2',
        description: 'Carrier level over 2-3dB threshold',
        dataType: 'INTEGER',
        access: 'read-only',
        enumValues: { 0: 'normal', 1: 'over_threshold' }
      },
      {
        id: 'oid-3',
        name: 'pilotPowerGood',
        oid: '1.3.6.1.4.1.elenos.4.2.3',
        description: 'Pilot power status indicator',
        dataType: 'INTEGER',
        access: 'read-only',
        enumValues: { 0: 'bad', 1: 'good' }
      },
      {
        id: 'oid-4',
        name: 'externalReferenceMissing',
        oid: '1.3.6.1.4.1.elenos.4.2.4',
        description: 'External reference signal status',
        dataType: 'INTEGER',
        access: 'read-only',
        enumValues: { 0: 'present', 1: 'missing' }
      },
      {
        id: 'oid-5',
        name: 'exciterWorkingLimiter',
        oid: '1.3.6.1.4.1.elenos.4.2.5',
        description: 'Exciter limiter operation status',
        dataType: 'INTEGER',
        access: 'read-only',
        enumValues: { 0: 'inactive', 1: 'active' }
      },
      {
        id: 'oid-6',
        name: 'softwareVersion',
        oid: '1.3.6.1.4.1.elenos.4.1.1',
        description: 'Transmitter software version',
        dataType: 'OCTET STRING',
        access: 'read-only'
      },
      {
        id: 'oid-7',
        name: 'dataMapVersion',
        oid: '1.3.6.1.4.1.elenos.4.1.2',
        description: 'Data mapping version',
        dataType: 'OCTET STRING',
        access: 'read-only'
      },
      {
        id: 'oid-8',
        name: 'transmitterLocation',
        oid: '1.3.6.1.4.1.elenos.4.1.3',
        description: 'Physical location identifier',
        dataType: 'OCTET STRING',
        access: 'read-write'
      },
      {
        id: 'oid-9',
        name: 'transmitterIdentity',
        oid: '1.3.6.1.4.1.elenos.4.1.4',
        description: 'Unique transmitter identifier',
        dataType: 'OCTET STRING',
        access: 'read-write'
      },
      {
        id: 'oid-10',
        name: 'radioName',
        oid: '1.3.6.1.4.1.elenos.4.1.5',
        description: 'Radio station name',
        dataType: 'OCTET STRING',
        access: 'read-write'
      }
    ]
  };

  const [templates, setTemplates] = useState<SNMPTemplate[]>([
    {
      id: '1',
      name: 'Elenos ETG5000 - Standard MIB',
      description: 'Real OIDs available on Elenos elGentooTM device (192.168.117.21)',
      manufacturer: 'Elenos',
      model: 'ETG5000',
      version: '1.0',
      baseOID: '1.3.6.1.2.1',
      createdAt: '2024-01-15T10:30:00Z',
      updatedAt: '2024-01-15T10:30:00Z',
      oids: [
        {
          id: '1',
          name: 'System Description',
          oid: '1.3.6.1.2.1.1.1.0',
          description: 'System description and OS information',
          dataType: 'OCTET STRING',
          access: 'read-only'
        },
        {
          id: '2',
          name: 'System Uptime',
          oid: '1.3.6.1.2.1.1.3.0',
          description: 'Time since system boot',
          dataType: 'Counter32',
          access: 'read-only',
          unit: 'centiseconds'
        },
        {
          id: '3',
          name: 'System Contact',
          oid: '1.3.6.1.2.1.1.4.0',
          description: 'Administrator contact information',
          dataType: 'OCTET STRING',
          access: 'read-write'
        },
        {
          id: '4',
          name: 'System Name',
          oid: '1.3.6.1.2.1.1.5.0',
          description: 'System hostname',
          dataType: 'OCTET STRING',
          access: 'read-write'
        },
        {
          id: '5',
          name: 'System Location',
          oid: '1.3.6.1.2.1.1.6.0',
          description: 'Physical location of the device',
          dataType: 'OCTET STRING',
          access: 'read-write'
        },
        {
          id: '6',
          name: 'Interface Count',
          oid: '1.3.6.1.2.1.2.1.0',
          description: 'Number of network interfaces',
          dataType: 'INTEGER',
          access: 'read-only'
        },
        {
          id: '7',
          name: 'Interface Name (eth0)',
          oid: '1.3.6.1.2.1.2.2.1.2.2',
          description: 'Name of ethernet interface',
          dataType: 'OCTET STRING',
          access: 'read-only'
        },
        {
          id: '8',
          name: 'Interface Speed (eth0)',
          oid: '1.3.6.1.2.1.2.2.1.5.2',
          description: 'Speed of ethernet interface',
          dataType: 'Gauge32',
          access: 'read-only',
          unit: 'bps'
        },
        {
          id: '9',
          name: 'Interface Status (eth0)',
          oid: '1.3.6.1.2.1.2.2.1.8.2',
          description: 'Operational status of ethernet interface',
          dataType: 'INTEGER',
          access: 'read-only',
          enumValues: { 1: 'up', 2: 'down', 3: 'testing' }
        },
        {
          id: '10',
          name: 'Interface In Octets (eth0)',
          oid: '1.3.6.1.2.1.2.2.1.10.2',
          description: 'Bytes received on ethernet interface',
          dataType: 'Counter32',
          access: 'read-only',
          unit: 'bytes'
        }
      ]
    },
    {
      id: '2',
      name: 'Elenos ETG5000 - Production MIB',
      description: 'Critical operational OIDs for Elenos transmitter monitoring (Enterprise 31946)',
      manufacturer: 'Elenos',
      model: 'ETG5000',
      version: '3.0',
      baseOID: '1.3.6.1.4.1.31946',
      createdAt: '2024-01-15T10:30:00Z',
      updatedAt: '2024-01-15T10:30:00Z',
      oids: [
        // General Info
        {
          id: '1',
          name: 'Transmitter Location',
          oid: '1.3.6.1.4.1.31946.3.1.5',
          description: 'Physical location of the transmitter',
          dataType: 'OCTET STRING',
          access: 'read-write'
        },
        {
          id: '2',
          name: 'Transmitter Identity',
          oid: '1.3.6.1.4.1.31946.3.1.6',
          description: 'Unique transmitter identifier',
          dataType: 'OCTET STRING',
          access: 'read-only'
        },
        {
          id: '3',
          name: 'Radio Name',
          oid: '1.3.6.1.4.1.31946.3.1.7',
          description: 'Radio station name',
          dataType: 'OCTET STRING',
          access: 'read-write'
        },
        {
          id: '4',
          name: 'TX Frequency',
          oid: '1.3.6.1.4.1.31946.4.2.6.10.14',
          description: 'Transmission frequency in tens of KHz',
          dataType: 'INTEGER',
          access: 'read-write',
          unit: 'tens of KHz',
          minValue: 8750,
          maxValue: 10800
        },
        // RF Monitoring
        {
          id: '5',
          name: 'Forward Power',
          oid: '1.3.6.1.4.1.31946.4.2.6.10.1',
          description: 'Forward power expressed in watts',
          dataType: 'INTEGER',
          access: 'read-only',
          unit: 'W'
        },
        {
          id: '6',
          name: 'Forward Power Warning',
          oid: '1.3.6.1.4.1.31946.4.2.6.60.43',
          description: 'Forward power alarm condition',
          dataType: 'INTEGER',
          access: 'read-only',
          enumValues: { 1: 'state-off', 2: 'state-on' }
        },
        {
          id: '7',
          name: 'Reflected Power',
          oid: '1.3.6.1.4.1.31946.4.2.6.10.2',
          description: 'Reflected power expressed in watts',
          dataType: 'INTEGER',
          access: 'read-only',
          unit: 'W'
        },
        {
          id: '8',
          name: 'Reflected Power Warning',
          oid: '1.3.6.1.4.1.31946.4.2.6.60.44',
          description: 'Reflected power alarm condition',
          dataType: 'INTEGER',
          access: 'read-only',
          enumValues: { 1: 'state-off', 2: 'state-on' }
        },
        // User Access & TX State
        {
          id: '9',
          name: 'Local/Remote Control',
          oid: '1.3.6.1.4.1.31946.4.2.6.10.4',
          description: 'Status of the control mode',
          dataType: 'INTEGER',
          access: 'read-only',
          enumValues: { 1: 'remote', 2: 'local' }
        },
        {
          id: '10',
          name: 'On Air Alarm',
          oid: '1.3.6.1.4.1.31946.4.2.6.60.20',
          description: 'Indicates transmitter is functioning and on air',
          dataType: 'INTEGER',
          access: 'read-only',
          enumValues: { 1: 'off-the-air', 2: 'on-air' }
        },
        {
          id: '11',
          name: 'On Air Status',
          oid: '1.3.6.1.4.1.31946.4.2.6.10.12',
          description: 'Indicates if transmitter is on air or not',
          dataType: 'INTEGER',
          access: 'read-only',
          enumValues: { 1: 'off-the-air', 2: 'on-air' }
        },
        {
          id: '12',
          name: 'Standby Status',
          oid: '1.3.6.1.4.1.31946.4.2.6.10.13',
          description: 'Indicates if transmitter is in standby or active',
          dataType: 'INTEGER',
          access: 'read-only',
          enumValues: { 1: 'active', 2: 'stand-by' }
        },
        // Audio Status
        {
          id: '13',
          name: 'TX MPX Peak',
          oid: '1.3.6.1.4.1.31946.4.2.6.10.15',
          description: 'MPX Peak (1 sec. window) in KHz',
          dataType: 'INTEGER',
          access: 'read-only',
          unit: 'KHz'
        },
        {
          id: '14',
          name: 'TX Left Peak',
          oid: '1.3.6.1.4.1.31946.4.2.6.10.17',
          description: 'Left Input Peak (1 sec. window) in KHz',
          dataType: 'INTEGER',
          access: 'read-only',
          unit: 'KHz'
        },
        {
          id: '15',
          name: 'TX Right Peak',
          oid: '1.3.6.1.4.1.31946.4.2.6.10.18',
          description: 'Right Input Peak (1 sec. window) in KHz',
          dataType: 'INTEGER',
          access: 'read-only',
          unit: 'KHz'
        },
        {
          id: '16',
          name: 'No Audio Alarm',
          oid: '1.3.6.1.4.1.31946.4.2.6.60.30',
          description: 'Audio signal absence alarm',
          dataType: 'INTEGER',
          access: 'read-only',
          enumValues: { 1: 'state-off', 2: 'state-on' }
        },
        {
          id: '17',
          name: 'MPX No Audio',
          oid: '1.3.6.1.4.1.31946.4.2.6.60.55',
          description: 'MPX audio absence alarm',
          dataType: 'INTEGER',
          access: 'read-only',
          enumValues: { 1: 'state-off', 2: 'state-on' }
        },
        {
          id: '18',
          name: 'AES/EBU No Audio',
          oid: '1.3.6.1.4.1.31946.4.2.6.60.56',
          description: 'AES/EBU audio absence alarm',
          dataType: 'INTEGER',
          access: 'read-only',
          enumValues: { 1: 'state-off', 2: 'state-on' }
        },
        {
          id: '19',
          name: 'Stereo No Audio',
          oid: '1.3.6.1.4.1.31946.4.2.6.60.57',
          description: 'Stereo audio absence alarm',
          dataType: 'INTEGER',
          access: 'read-only',
          enumValues: { 1: 'state-off', 2: 'state-on' }
        }
      ]
    },
    {
      id: '3',
      name: 'Elenos ETG5000 - Extended MIB',
      description: 'Additional Elenos-specific OIDs from MIB files (for reference)',
      manufacturer: 'Elenos',
      model: 'ETG5000',
      version: '2.0',
      baseOID: '1.3.6.1.4.1.elenos.4',
      createdAt: '2024-01-15T10:30:00Z',
      updatedAt: '2024-01-15T10:30:00Z',
      oids: [
        {
          id: '1',
          name: 'General Status',
          oid: '1.3.6.1.4.1.elenos.4.2.1.1.0',
          description: 'Overall transmitter status',
          dataType: 'INTEGER',
          access: 'read-only',
          enumValues: { 0: 'Off', 1: 'On', 2: 'Standby', 3: 'Fault' }
        },
        {
          id: '2',
          name: 'Carrier Level',
          oid: '1.3.6.1.4.1.elenos.4.2.1.2.0',
          description: 'RF carrier output level',
          dataType: 'INTEGER',
          access: 'read-write',
          unit: 'dBm',
          minValue: -20,
          maxValue: 80
        },
        {
          id: '3',
          name: 'Pilot Power',
          oid: '1.3.6.1.4.1.elenos.4.2.1.3.0',
          description: 'Pilot tone power level',
          dataType: 'INTEGER',
          access: 'read-write',
          unit: '%',
          minValue: 0,
          maxValue: 100
        },
        {
          id: '4',
          name: 'External Reference',
          oid: '1.3.6.1.4.1.elenos.4.2.1.4.0',
          description: 'External reference status',
          dataType: 'INTEGER',
          access: 'read-only',
          enumValues: { 0: 'Internal', 1: 'External', 2: 'GPS' }
        },
        {
          id: '5',
          name: 'Exciter Limiter',
          oid: '1.3.6.1.4.1.elenos.4.2.1.5.0',
          description: 'Exciter limiter threshold',
          dataType: 'INTEGER',
          access: 'read-write',
          unit: '%',
          minValue: 0,
          maxValue: 100
        },
        {
          id: '6',
          name: 'Software Version',
          oid: '1.3.6.1.4.1.elenos.4.2.1.6.0',
          description: 'Transmitter software version',
          dataType: 'OCTET STRING',
          access: 'read-only'
        },
        {
          id: '7',
          name: 'Forward Power',
          oid: '1.3.6.1.4.1.elenos.4.2.2.1.0',
          description: 'Forward RF power measurement',
          dataType: 'INTEGER',
          access: 'read-only',
          unit: 'W',
          minValue: 0,
          maxValue: 10000
        },
        {
          id: '8',
          name: 'Reflected Power',
          oid: '1.3.6.1.4.1.elenos.4.2.2.2.0',
          description: 'Reflected RF power measurement',
          dataType: 'INTEGER',
          access: 'read-only',
          unit: 'W',
          minValue: 0,
          maxValue: 1000
        },
        {
          id: '9',
          name: 'PA Temperature',
          oid: '1.3.6.1.4.1.elenos.4.2.3.1.0',
          description: 'Power amplifier temperature',
          dataType: 'INTEGER',
          access: 'read-only',
          unit: '°C',
          minValue: -40,
          maxValue: 100
        },
        {
          id: '10',
          name: 'Frequency',
          oid: '1.3.6.1.4.1.elenos.4.2.1.11.0',
          description: 'Transmitter frequency setting',
          dataType: 'INTEGER',
          access: 'read-write',
          unit: 'kHz',
          minValue: 87500,
          maxValue: 108000
        }
      ]
    },
    {
      id: '4',
      name: '988 FM - Ulu Kali Site Configuration',
      description: 'Site-specific SNMP configuration for 988 FM transmitter at Gunung Ulu Kali (98.8 MHz) with OID offset .4',
      manufacturer: 'Elenos',
      model: 'ETG5000',
      version: '3.0',
      baseOID: '1.3.6.1.4.1.31946',
      createdAt: '2024-01-15T11:00:00Z',
      updatedAt: '2024-01-15T11:00:00Z',
      oids: [
        // General Info - Site Specific with OID Offset .4
        {
          id: '1',
          name: 'Transmitter Location',
          oid: '1.3.6.1.4.1.31946.3.1.5.4',
          description: 'Physical location: Gunung Ulu Kali, Selangor (TX4)',
          dataType: 'OCTET STRING',
          access: 'read-write'
        },
        {
          id: '2',
          name: 'Transmitter Identity',
          oid: '1.3.6.1.4.1.31946.3.1.6.4',
          description: 'Unique identifier: 988FM-UluKali-TX04',
          dataType: 'OCTET STRING',
          access: 'read-only'
        },
        {
          id: '3',
          name: 'Radio Name',
          oid: '1.3.6.1.4.1.31946.3.1.7.4',
          description: 'Station name: 988 FM (TX4)',
          dataType: 'OCTET STRING',
          access: 'read-write'
        },
        {
          id: '4',
          name: 'TX Frequency',
          oid: '1.3.6.1.4.1.31946.4.2.6.10.14.4',
          description: 'Transmission frequency: 98.8 MHz (9880 tens of KHz) - TX4',
          dataType: 'INTEGER',
          access: 'read-write',
          unit: 'tens of KHz',
          minValue: 8750,
          maxValue: 10800
        },
        // RF Monitoring - Critical Parameters with OID Offset .4
        {
          id: '5',
          name: 'Forward Power',
          oid: '1.3.6.1.4.1.31946.4.2.6.10.1.4',
          description: 'Forward power output for 988 FM transmitter (TX4)',
          dataType: 'INTEGER',
          access: 'read-only',
          unit: 'W'
        },
        {
          id: '6',
          name: 'Forward Power Warning',
          oid: '1.3.6.1.4.1.31946.4.2.6.60.43.4',
          description: 'Forward power alarm status for 988 FM (TX4)',
          dataType: 'INTEGER',
          access: 'read-only',
          enumValues: { 1: 'state-off', 2: 'state-on' }
        },
        {
          id: '7',
          name: 'Reflected Power',
          oid: '1.3.6.1.4.1.31946.4.2.6.10.2.4',
          description: 'Reflected power measurement for 988 FM (TX4)',
          dataType: 'INTEGER',
          access: 'read-only',
          unit: 'W'
        },
        {
          id: '8',
          name: 'Reflected Power Warning',
          oid: '1.3.6.1.4.1.31946.4.2.6.60.44.4',
          description: 'Reflected power alarm status for 988 FM (TX4)',
          dataType: 'INTEGER',
          access: 'read-only',
          enumValues: { 1: 'state-off', 2: 'state-on' }
        },
        // Operational Status - 988 FM Specific with OID Offset .4
        {
          id: '9',
          name: 'Local/Remote Control',
          oid: '1.3.6.1.4.1.31946.4.2.6.10.4.4',
          description: 'Control mode status for 988 FM transmitter (TX4)',
          dataType: 'INTEGER',
          access: 'read-only',
          enumValues: { 1: 'remote', 2: 'local' }
        },
        {
          id: '10',
          name: 'On Air Alarm',
          oid: '1.3.6.1.4.1.31946.4.2.6.60.20.4',
          description: '988 FM on-air status alarm indicator (TX4)',
          dataType: 'INTEGER',
          access: 'read-only',
          enumValues: { 1: 'off-the-air', 2: 'on-air' }
        },
        {
          id: '11',
          name: 'On Air Status',
          oid: '1.3.6.1.4.1.31946.4.2.6.10.12.4',
          description: '988 FM transmitter on-air operational status (TX4)',
          dataType: 'INTEGER',
          access: 'read-only',
          enumValues: { 1: 'off-the-air', 2: 'on-air' }
        },
        {
          id: '12',
          name: 'Standby Status',
          oid: '1.3.6.1.4.1.31946.4.2.6.10.13.4',
          description: '988 FM transmitter standby/active status (TX4)',
          dataType: 'INTEGER',
          access: 'read-only',
          enumValues: { 1: 'active', 2: 'stand-by' }
        },
        // Audio Monitoring - 988 FM Content with OID Offset .4
        {
          id: '13',
          name: 'TX MPX Peak',
          oid: '1.3.6.1.4.1.31946.4.2.6.10.15.4',
          description: '988 FM MPX Peak level (1 sec. window) - TX4',
          dataType: 'INTEGER',
          access: 'read-only',
          unit: 'KHz'
        },
        {
          id: '14',
          name: 'TX Left Peak',
          oid: '1.3.6.1.4.1.31946.4.2.6.10.17.4',
          description: '988 FM Left audio input peak (1 sec. window) - TX4',
          dataType: 'INTEGER',
          access: 'read-only',
          unit: 'KHz'
        },
        {
          id: '15',
          name: 'TX Right Peak',
          oid: '1.3.6.1.4.1.31946.4.2.6.10.18.4',
          description: '988 FM Right audio input peak (1 sec. window) - TX4',
          dataType: 'INTEGER',
          access: 'read-only',
          unit: 'KHz'
        },
        {
          id: '16',
          name: 'No Audio Alarm',
          oid: '1.3.6.1.4.1.31946.4.2.6.60.30.4',
          description: '988 FM audio signal absence alarm (TX4)',
          dataType: 'INTEGER',
          access: 'read-only',
          enumValues: { 0: 'Audio Present', 1: 'No Audio' }
        }
      ]
    }
  ]);
  const [selectedTemplate, setSelectedTemplate] = useState<SNMPTemplate | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingOID, setEditingOID] = useState<OIDDefinition | null>(null);
  const [showNewOIDForm, setShowNewOIDForm] = useState(false);

  const [newOID, setNewOID] = useState<Partial<OIDDefinition>>({
    name: '',
    oid: '',
    description: '',
    dataType: 'INTEGER',
    access: 'read-only',
    unit: '',
    minValue: undefined,
    maxValue: undefined,
    enumValues: {}
  });

  const handleSaveTemplate = () => {
    if (selectedTemplate) {
      const updatedTemplates = templates.map(t => 
        t.id === selectedTemplate.id 
          ? { ...selectedTemplate, updatedAt: new Date().toISOString() }
          : t
      );
      setTemplates(updatedTemplates);
      setIsEditing(false);
      // Show success notification
      console.log('Template saved successfully');
    }
  };

  const handleAddOID = () => {
    if (selectedTemplate && newOID.name && newOID.oid) {
      const oidToAdd: OIDDefinition = {
        id: `oid-${Date.now()}`,
        name: newOID.name,
        oid: newOID.oid,
        description: newOID.description || '',
        dataType: newOID.dataType as OIDDefinition['dataType'],
        access: newOID.access as OIDDefinition['access'],
        unit: newOID.unit,
        minValue: newOID.minValue,
        maxValue: newOID.maxValue,
        enumValues: newOID.enumValues
      };

      const updatedTemplate = {
        ...selectedTemplate,
        oids: [...selectedTemplate.oids, oidToAdd]
      };

      setSelectedTemplate(updatedTemplate);
      setNewOID({
        name: '',
        oid: '',
        description: '',
        dataType: 'INTEGER',
        access: 'read-only',
        unit: '',
        minValue: undefined,
        maxValue: undefined,
        enumValues: {}
      });
      setShowNewOIDForm(false);
    }
  };

  const handleDeleteOID = (oidId: string) => {
    if (selectedTemplate) {
      const updatedTemplate = {
        ...selectedTemplate,
        oids: selectedTemplate.oids.filter(oid => oid.id !== oidId)
      };
      setSelectedTemplate(updatedTemplate);
    }
  };

  const handleExportTemplate = () => {
    if (selectedTemplate) {
      const dataStr = JSON.stringify(selectedTemplate, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${selectedTemplate.name}_template.json`;
      link.click();
      URL.revokeObjectURL(url);
    }
  };

  const handleImportTemplate = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedTemplate: SNMPTemplate = JSON.parse(e.target?.result as string);
          setTemplates([...templates, importedTemplate]);
          setSelectedTemplate(importedTemplate);
        } catch (error) {
          console.error('Error importing template:', error);
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">SNMP Configuration</h1>
              <p className="text-gray-400">
                Create and manage SNMP templates for different transmitter models
              </p>
            </div>
            <div className="flex gap-3">
              <Button 
                size="sm" 
                variant="outline" 
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
                onClick={handleExportTemplate}
                disabled={!selectedTemplate}
              >
                <Download className="w-4 h-4 mr-1" />
                Export
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
                onClick={() => document.getElementById('import-input')?.click()}
              >
                <Upload className="w-4 h-4 mr-1" />
                Import
              </Button>
              <input
                id="import-input"
                type="file"
                accept=".json"
                onChange={handleImportTemplate}
                className="hidden"
              />
              <Button 
                size="sm" 
                className="bg-blue-500 hover:bg-blue-600"
                onClick={() => {
                  // TODO: Implement new template creation
                  console.log('Create new template');
                }}
              >
                <Plus className="w-4 h-4 mr-1" />
                New Template
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Template List */}
          <div className="lg:col-span-1">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <FileText className="w-5 h-5 mr-2" />
                  Templates
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {templates.map((template) => (
                  <div
                    key={template.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedTemplate?.id === template.id
                        ? 'border-blue-500 bg-blue-500/10'
                        : 'border-gray-600 hover:border-gray-500 hover:bg-gray-700/50'
                    }`}
                    onClick={() => setSelectedTemplate(template)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-white">{template.name}</h3>
                        <p className="text-sm text-gray-400">{template.manufacturer} {template.model}</p>
                        <p className="text-xs text-gray-500 mt-1">{template.oids.length} OIDs</p>
                      </div>
                      <Badge variant="secondary" className="bg-gray-700 text-gray-300">
                        v{template.version}
                      </Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Template Details */}
          <div className="lg:col-span-2">
            {selectedTemplate ? (
              <div className="space-y-6">
                {/* Template Info */}
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-white flex items-center">
                        <Settings className="w-5 h-5 mr-2" />
                        {selectedTemplate.name} Template
                      </CardTitle>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-gray-600 text-gray-300 hover:bg-gray-700"
                          onClick={() => setIsEditing(!isEditing)}
                        >
                          <Edit3 className="w-4 h-4 mr-1" />
                          {isEditing ? 'Cancel' : 'Edit'}
                        </Button>
                        {isEditing && (
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700"
                            onClick={handleSaveTemplate}
                          >
                            <Save className="w-4 h-4 mr-1" />
                            Save
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-gray-300">Manufacturer</Label>
                        <Input
                          value={selectedTemplate.manufacturer}
                          disabled={!isEditing}
                          className="bg-gray-700 border-gray-600 text-white"
                          onChange={(e) => setSelectedTemplate({
                            ...selectedTemplate,
                            manufacturer: e.target.value
                          })}
                        />
                      </div>
                      <div>
                        <Label className="text-gray-300">Model</Label>
                        <Input
                          value={selectedTemplate.model}
                          disabled={!isEditing}
                          className="bg-gray-700 border-gray-600 text-white"
                          onChange={(e) => setSelectedTemplate({
                            ...selectedTemplate,
                            model: e.target.value
                          })}
                        />
                      </div>
                      <div>
                        <Label className="text-gray-300">Version</Label>
                        <Input
                          value={selectedTemplate.version}
                          disabled={!isEditing}
                          className="bg-gray-700 border-gray-600 text-white"
                          onChange={(e) => setSelectedTemplate({
                            ...selectedTemplate,
                            version: e.target.value
                          })}
                        />
                      </div>
                      <div>
                        <Label className="text-gray-300">Base OID</Label>
                        <Input
                          value={selectedTemplate.baseOID}
                          disabled={!isEditing}
                          className="bg-gray-700 border-gray-600 text-white"
                          onChange={(e) => setSelectedTemplate({
                            ...selectedTemplate,
                            baseOID: e.target.value
                          })}
                        />
                      </div>
                    </div>
                    <div>
                      <Label className="text-gray-300">Description</Label>
                      <Textarea
                        value={selectedTemplate.description}
                        disabled={!isEditing}
                        className="bg-gray-700 border-gray-600 text-white"
                        onChange={(e) => setSelectedTemplate({
                          ...selectedTemplate,
                          description: e.target.value
                        })}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* OID Management */}
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-white">OID Definitions</CardTitle>
                      <Button
                        size="sm"
                        className="bg-blue-500 hover:bg-blue-600"
                        onClick={() => setShowNewOIDForm(true)}
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Add OID
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {/* New OID Form */}
                    {showNewOIDForm && (
                      <Card className="bg-gray-700 border-gray-600 mb-4">
                        <CardHeader>
                          <CardTitle className="text-white text-lg">Add New OID</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label className="text-gray-300">Name</Label>
                              <Input
                                value={newOID.name || ''}
                                onChange={(e) => setNewOID({ ...newOID, name: e.target.value })}
                                className="bg-gray-600 border-gray-500 text-white"
                                placeholder="e.g., forwardPower"
                              />
                            </div>
                            <div>
                              <Label className="text-gray-300">OID</Label>
                              <Input
                                value={newOID.oid || ''}
                                onChange={(e) => setNewOID({ ...newOID, oid: e.target.value })}
                                className="bg-gray-600 border-gray-500 text-white"
                                placeholder="e.g., 1.3.6.1.4.1.12345.4.2.1.2"
                              />
                            </div>
                            <div>
                              <Label className="text-gray-300">Unit (optional)</Label>
                              <Input
                                value={newOID.unit || ''}
                                onChange={(e) => setNewOID({ ...newOID, unit: e.target.value })}
                                className="bg-gray-600 border-gray-500 text-white"
                                placeholder="e.g., Watts, °C, dBm"
                              />
                            </div>
                            <div>
                              <Label className="text-gray-300">Data Type</Label>
                              <select
                                value={newOID.dataType || 'INTEGER'}
                                onChange={(e) => setNewOID({ ...newOID, dataType: e.target.value as OIDDefinition['dataType'] })}
                                className="w-full p-2 bg-gray-600 border border-gray-500 rounded text-white"
                              >
                                <option value="INTEGER">INTEGER</option>
                                <option value="OCTET STRING">OCTET STRING</option>
                                <option value="OBJECT IDENTIFIER">OBJECT IDENTIFIER</option>
                                <option value="Counter32">Counter32</option>
                                <option value="Gauge32">Gauge32</option>
                              </select>
                            </div>
                            <div>
                              <Label className="text-gray-300">Access</Label>
                              <select
                                value={newOID.access || 'read-only'}
                                onChange={(e) => setNewOID({ ...newOID, access: e.target.value as OIDDefinition['access'] })}
                                className="w-full p-2 bg-gray-600 border border-gray-500 rounded text-white"
                              >
                                <option value="read-only">read-only</option>
                                <option value="read-write">read-write</option>
                                <option value="write-only">write-only</option>
                                <option value="not-accessible">not-accessible</option>
                              </select>
                            </div>
                            <div>
                              <Label className="text-gray-300">Enum Values (optional)</Label>
                              <Input
                                className="bg-gray-600 border-gray-500 text-white"
                                placeholder="0=off,1=on,2=error"
                                onChange={(e) => {
                                  const enumStr = e.target.value;
                                  const enumValues: Record<number, string> = {};
                                  if (enumStr) {
                                    enumStr.split(',').forEach(pair => {
                                      const [key, value] = pair.split('=');
                                      if (key && value) {
                                        enumValues[parseInt(key.trim())] = value.trim();
                                      }
                                    });
                                  }
                                  setNewOID({ ...newOID, enumValues });
                                }}
                              />
                            </div>
                          </div>
                          {newOID.dataType === 'Gauge32' && (
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label className="text-gray-300">Min Value</Label>
                                <Input
                                  type="number"
                                  value={newOID.minValue || ''}
                                  onChange={(e) => setNewOID({ ...newOID, minValue: e.target.value ? parseInt(e.target.value) : undefined })}
                                  className="bg-gray-600 border-gray-500 text-white"
                                />
                              </div>
                              <div>
                                <Label className="text-gray-300">Max Value</Label>
                                <Input
                                  type="number"
                                  value={newOID.maxValue || ''}
                                  onChange={(e) => setNewOID({ ...newOID, maxValue: e.target.value ? parseInt(e.target.value) : undefined })}
                                  className="bg-gray-600 border-gray-500 text-white"
                                />
                              </div>
                            </div>
                          )}
                          <div>
                            <Label className="text-gray-300">Description</Label>
                            <Textarea
                              value={newOID.description || ''}
                              onChange={(e) => setNewOID({ ...newOID, description: e.target.value })}
                              className="bg-gray-600 border-gray-500 text-white"
                              placeholder="Describe what this OID represents..."
                            />
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              className="bg-green-600 hover:bg-green-700"
                              onClick={handleAddOID}
                            >
                              Add OID
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-gray-600 text-gray-300 hover:bg-gray-700"
                              onClick={() => setShowNewOIDForm(false)}
                            >
                              Cancel
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* OID List */}
                    <div className="space-y-3">
                      {selectedTemplate.oids.map((oid) => (
                        <div
                          key={oid.id}
                          className="p-4 bg-gray-700 rounded-lg border border-gray-600"
                        >
                          <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <h4 className="font-medium text-white">{oid.name}</h4>
                                  <Badge variant="secondary" className="bg-gray-600 text-gray-300">
                                    {oid.dataType}
                                  </Badge>
                                  <Badge variant="outline" className="border-gray-500 text-gray-400">
                                    {oid.access}
                                  </Badge>
                                  {oid.unit && (
                                    <Badge variant="outline" className="border-blue-500 text-blue-400">
                                      {oid.unit}
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-sm text-gray-400 mb-1">{oid.description}</p>
                                <p className="text-xs font-mono text-gray-500">{oid.oid}</p>
                                {oid.enumValues && Object.keys(oid.enumValues).length > 0 && (
                                  <div className="mt-2">
                                    <p className="text-xs text-gray-400 mb-1">Enum Values:</p>
                                    <div className="flex flex-wrap gap-1">
                                      {Object.entries(oid.enumValues).map(([key, value]) => (
                                        <Badge key={key} variant="outline" className="border-gray-500 text-gray-400 text-xs">
                                          {key}: {value}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
                                )}
                                {oid.minValue !== undefined && oid.maxValue !== undefined && (
                                  <div className="mt-2">
                                    <p className="text-xs text-gray-400">Range: {oid.minValue} - {oid.maxValue} {oid.unit}</p>
                                  </div>
                                )}
                              </div>
                            <div className="flex gap-2 ml-4">
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-gray-600 text-gray-300 hover:bg-gray-600"
                                onClick={() => {
                                  navigator.clipboard.writeText(oid.oid);
                                }}
                              >
                                <Copy className="w-3 h-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-red-600 text-red-400 hover:bg-red-600/20"
                                onClick={() => handleDeleteOID(oid.id)}
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="flex items-center justify-center h-64">
                  <div className="text-center">
                    <AlertCircle className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                    <p className="text-gray-400">Select a template to view details</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SNMPConfigPage;