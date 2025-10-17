export type OidDataType = 'INTEGER' | 'OCTET STRING' | 'STATE';

export interface OidDef {
  key: string;
  oid: string;
  syntax: OidDataType;
  category: 'General Info' | 'RF' | 'User Access' | 'TX State' | 'Audio';
  description?: string;
  range?: string;
  unit?: string;
  states?: Record<number, string>;
}

export const ELENOS_ETG_PRIMARY_OIDS: OidDef[] = [
  { key: 'transmitter_location', oid: '.1.3.6.1.4.1.31946.3.1.5', syntax: 'OCTET STRING', category: 'General Info' },
  { key: 'transmitter_identity', oid: '.1.3.6.1.4.1.31946.3.1.6', syntax: 'OCTET STRING', category: 'General Info' },
  { key: 'radio_name', oid: '.1.3.6.1.4.1.31946.3.1.7', syntax: 'OCTET STRING', category: 'General Info' },
  { key: 'txFrequency', oid: '.1.3.6.1.4.1.31946.4.2.6.10.14', syntax: 'INTEGER', category: 'General Info', range: '8750..10800', description: 'Transmission frequency in tens of KHz', unit: 'tens of kHz' },

  { key: 'forward_power', oid: '.1.3.6.1.4.1.31946.4.2.6.10.1', syntax: 'INTEGER', category: 'RF', description: 'Forward power in watts', unit: 'W' },
  { key: 'forwardPowerWarning', oid: '.1.3.6.1.4.1.31946.4.2.6.60.43', syntax: 'STATE', category: 'RF', states: { 1: 'state-off', 2: 'state-on' }, description: 'Forward power warning condition' },
  { key: 'reflected_power', oid: '.1.3.6.1.4.1.31946.4.2.6.10.2', syntax: 'INTEGER', category: 'RF', description: 'Reflected power in watts', unit: 'W' },
  { key: 'reflectedPowerWarning', oid: '.1.3.6.1.4.1.31946.4.2.6.60.44', syntax: 'STATE', category: 'RF', states: { 1: 'state-off', 2: 'state-on' } },

  { key: 'local_remote', oid: '.1.3.6.1.4.1.31946.4.2.6.10.4', syntax: 'STATE', category: 'User Access', states: { 1: 'remote', 2: 'local' }, description: 'Status of the control' },

  { key: 'onAir', oid: '.1.3.6.1.4.1.31946.4.2.6.60.20', syntax: 'STATE', category: 'TX State', states: { 1: 'off-the-air', 2: 'on-air' }, description: 'Device functioning properly and on air' },
  { key: 'onAirStatus', oid: '.1.3.6.1.4.1.31946.4.2.6.10.12', syntax: 'STATE', category: 'TX State', states: { 1: 'off-the-air', 2: 'on-air' }, description: 'Indicates if the transmitter is on air' },
  { key: 'standbyStatus', oid: '.1.3.6.1.4.1.31946.4.2.6.10.13', syntax: 'STATE', category: 'TX State', states: { 1: 'active', 2: 'stand-by' }, description: 'Indicates if the transmitter is in standby or normal' },

  { key: 'txMpxPeak', oid: '.1.3.6.1.4.1.31946.4.2.6.10.15', syntax: 'INTEGER', category: 'Audio', description: 'MPX Peak (1 sec. window) in KHz', unit: 'kHz' },
  { key: 'txLeftPeak', oid: '.1.3.6.1.4.1.31946.4.2.6.10.17', syntax: 'INTEGER', category: 'Audio', description: 'Left Input Peak (1 sec. window) in KHz', unit: 'kHz' },
  { key: 'txRightPeak', oid: '.1.3.6.1.4.1.31946.4.2.6.10.18', syntax: 'INTEGER', category: 'Audio', description: 'Right Input Peak (1 sec. window) in KHz', unit: 'kHz' },
  { key: 'no_Audio', oid: '.1.3.6.1.4.1.31946.4.2.6.60.30', syntax: 'STATE', category: 'Audio', states: { 1: 'state-off', 2: 'state-on' }, description: 'Audio signal absence' },
  { key: 'mpxNoAudio', oid: '.1.3.6.1.4.1.31946.4.2.6.60.55', syntax: 'STATE', category: 'Audio', states: { 1: 'state-off', 2: 'state-on' } },
  { key: 'aesEbuNoAudio', oid: '.1.3.6.1.4.1.31946.4.2.6.60.56', syntax: 'STATE', category: 'Audio', states: { 1: 'state-off', 2: 'state-on' } },
  { key: 'stereoNoAudio', oid: '.1.3.6.1.4.1.31946.4.2.6.60.57', syntax: 'STATE', category: 'Audio', states: { 1: 'state-off', 2: 'state-on' } },
];

export const ELENOS_ETG_OIDS_BY_KEY: Record<string, OidDef> = Object.fromEntries(
  ELENOS_ETG_PRIMARY_OIDS.map((d) => [d.key, d])
);

export const ELENOS_ETG_OIDS_BY_OID: Record<string, OidDef> = Object.fromEntries(
  ELENOS_ETG_PRIMARY_OIDS.map((d) => [d.oid, d])
);