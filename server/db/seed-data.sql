-- Seed data for FM Transmitter Monitoring System
-- This script populates the database with sample sites and transmitters

-- Insert sample sites
INSERT INTO sites (id, name, location, latitude, longitude, address, contact_info, is_active) VALUES
('site-001', 'Kuala Lumpur Main', 'Kuala Lumpur', 3.1390, 101.6869, 'Jalan Ampang, 50450 Kuala Lumpur', 'ops@klfm.my', true),
('site-002', 'Penang Island', 'Penang', 5.4164, 100.3327, 'Georgetown, 10200 Penang', 'penang@radiofm.my', true),
('site-003', 'Johor Bahru', 'Johor', 1.4927, 103.7414, 'Johor Bahru, 80000 Johor', 'johor@southfm.my', true),
('site-004', 'Kota Kinabalu', 'Sabah', 5.9804, 116.0735, 'Kota Kinabalu, 88000 Sabah', 'sabah@eastfm.my', true),
('site-005', 'Kuching', 'Sarawak', 1.5533, 110.3592, 'Kuching, 93000 Sarawak', 'sarawak@borneoradio.my', true);

-- Insert sample transmitters
INSERT INTO transmitters (id, site_id, name, frequency, power, status, snmp_host, snmp_port, snmp_community, snmp_version, oids, poll_interval, is_active) VALUES
('tx-001', 'site-001', 'KL Main TX1', 88.1, 10000, 'active', '192.168.1.101', 161, 'public', 1, '{"power": "1.3.6.1.4.1.12345.1.1.1", "frequency": "1.3.6.1.4.1.12345.1.1.2", "temperature": "1.3.6.1.4.1.12345.1.1.3", "vswr": "1.3.6.1.4.1.12345.1.1.4"}', 30000, true),
('tx-002', 'site-001', 'KL Main TX2', 95.8, 5000, 'standby', '192.168.1.102', 161, 'public', 1, '{"power": "1.3.6.1.4.1.12345.1.1.1", "frequency": "1.3.6.1.4.1.12345.1.1.2", "temperature": "1.3.6.1.4.1.12345.1.1.3", "vswr": "1.3.6.1.4.1.12345.1.1.4"}', 30000, true),
('tx-003', 'site-002', 'Penang TX1', 101.1, 8000, 'active', '192.168.2.101', 161, 'public', 1, '{"power": "1.3.6.1.4.1.12345.1.1.1", "frequency": "1.3.6.1.4.1.12345.1.1.2", "temperature": "1.3.6.1.4.1.12345.1.1.3", "vswr": "1.3.6.1.4.1.12345.1.1.4"}', 30000, true),
('tx-004', 'site-003', 'JB TX1', 93.3, 7500, 'fault', '192.168.3.101', 161, 'public', 1, '{"power": "1.3.6.1.4.1.12345.1.1.1", "frequency": "1.3.6.1.4.1.12345.1.1.2", "temperature": "1.3.6.1.4.1.12345.1.1.3", "vswr": "1.3.6.1.4.1.12345.1.1.4"}', 30000, true),
('tx-005', 'site-004', 'KK TX1', 97.7, 6000, 'active', '192.168.4.101', 161, 'public', 1, '{"power": "1.3.6.1.4.1.12345.1.1.1", "frequency": "1.3.6.1.4.1.12345.1.1.2", "temperature": "1.3.6.1.4.1.12345.1.1.3", "vswr": "1.3.6.1.4.1.12345.1.1.4"}', 30000, true),
('tx-006', 'site-005', 'Kuching TX1', 104.9, 9000, 'active', '192.168.5.101', 161, 'public', 1, '{"power": "1.3.6.1.4.1.12345.1.1.1", "frequency": "1.3.6.1.4.1.12345.1.1.2", "temperature": "1.3.6.1.4.1.12345.1.1.3", "vswr": "1.3.6.1.4.1.12345.1.1.4"}', 30000, true);

-- Insert sample transmitter metrics (recent data)
INSERT INTO transmitter_metrics (transmitter_id, timestamp, power_output, frequency, vswr, temperature, forward_power, reflected_power, status, snmp_data) VALUES
-- KL Main TX1 (active)
('tx-001', NOW() - INTERVAL '1 minute', 9850, 88.1, 1.2, 45.5, 9850, 120, 'active', '{"oid_values": {"power": 9850, "frequency": 88.1, "temperature": 45.5, "vswr": 1.2}}'),
('tx-001', NOW() - INTERVAL '2 minutes', 9820, 88.1, 1.3, 46.2, 9820, 130, 'active', '{"oid_values": {"power": 9820, "frequency": 88.1, "temperature": 46.2, "vswr": 1.3}}'),

-- KL Main TX2 (standby)
('tx-002', NOW() - INTERVAL '1 minute', 0, 95.8, 1.0, 25.0, 0, 0, 'standby', '{"oid_values": {"power": 0, "frequency": 95.8, "temperature": 25.0, "vswr": 1.0}}'),

-- Penang TX1 (active)
('tx-003', NOW() - INTERVAL '1 minute', 7950, 101.1, 1.4, 48.3, 7950, 180, 'active', '{"oid_values": {"power": 7950, "frequency": 101.1, "temperature": 48.3, "vswr": 1.4}}'),

-- JB TX1 (fault)
('tx-004', NOW() - INTERVAL '1 minute', 0, 93.3, 999, 85.0, 0, 0, 'fault', '{"oid_values": {"power": 0, "frequency": 93.3, "temperature": 85.0, "vswr": 999}, "error": "High temperature alarm"}'),

-- KK TX1 (active)
('tx-005', NOW() - INTERVAL '1 minute', 5900, 97.7, 1.1, 42.1, 5900, 65, 'active', '{"oid_values": {"power": 5900, "frequency": 97.7, "temperature": 42.1, "vswr": 1.1}}'),

-- Kuching TX1 (active)
('tx-006', NOW() - INTERVAL '1 minute', 8850, 104.9, 1.3, 44.8, 8850, 115, 'active', '{"oid_values": {"power": 8850, "frequency": 104.9, "temperature": 44.8, "vswr": 1.3}}');

-- Insert sample alarms
INSERT INTO alarms (transmitter_id, site_id, severity, type, message, is_active, created_at) VALUES
('tx-004', 'site-003', 'critical', 'temperature_high', 'Transmitter temperature exceeded 80°C threshold', true, NOW() - INTERVAL '5 minutes'),
('tx-004', 'site-003', 'critical', 'offline', 'Transmitter is offline - no power output detected', true, NOW() - INTERVAL '3 minutes'),
('tx-003', 'site-002', 'warning', 'vswr_high', 'VSWR reading above normal range (1.4)', true, NOW() - INTERVAL '10 minutes');