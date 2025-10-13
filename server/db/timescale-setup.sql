-- TimescaleDB Setup for FM Transmitter Monitoring
-- This script configures TimescaleDB hypertables and optimizations

-- Create hypertable for transmitter_metrics
-- Note: The table must exist before creating hypertable
SELECT create_hypertable('transmitter_metrics', 'timestamp', 
  chunk_time_interval => INTERVAL '1 day',
  if_not_exists => TRUE
);

-- Create continuous aggregates for 5-minute intervals
CREATE MATERIALIZED VIEW IF NOT EXISTS transmitter_metrics_5min
WITH (timescaledb.continuous) AS
SELECT 
  transmitter_id,
  time_bucket('5 minutes', timestamp) AS bucket,
  AVG(forward_power) AS avg_forward_power,
  MAX(forward_power) AS max_forward_power,
  MIN(forward_power) AS min_forward_power,
  AVG(reflected_power) AS avg_reflected_power,
  AVG(vswr) AS avg_vswr,
  AVG(temperature) AS avg_temperature,
  COUNT(*) AS sample_count
FROM transmitter_metrics
GROUP BY transmitter_id, bucket;

-- Create continuous aggregates for 1-hour intervals  
CREATE MATERIALIZED VIEW IF NOT EXISTS transmitter_metrics_1hour
WITH (timescaledb.continuous) AS
SELECT 
  transmitter_id,
  time_bucket('1 hour', timestamp) AS bucket,
  AVG(forward_power) AS avg_forward_power,
  MAX(forward_power) AS max_forward_power,
  MIN(forward_power) AS min_forward_power,
  AVG(reflected_power) AS avg_reflected_power,
  AVG(vswr) AS avg_vswr,
  AVG(temperature) AS avg_temperature,
  COUNT(*) AS sample_count
FROM transmitter_metrics
GROUP BY transmitter_id, bucket;

-- Add refresh policies for continuous aggregates
SELECT add_continuous_aggregate_policy('transmitter_metrics_5min',
  start_offset => INTERVAL '1 hour',
  end_offset => INTERVAL '5 minutes',
  schedule_interval => INTERVAL '5 minutes',
  if_not_exists => TRUE);

SELECT add_continuous_aggregate_policy('transmitter_metrics_1hour',
  start_offset => INTERVAL '4 hours', 
  end_offset => INTERVAL '1 hour',
  schedule_interval => INTERVAL '1 hour',
  if_not_exists => TRUE);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS transmitter_metrics_transmitter_time_idx 
ON transmitter_metrics (transmitter_id, timestamp DESC);

-- Add data retention policy (keep data for 1 year)
SELECT add_retention_policy('transmitter_metrics', INTERVAL '1 year', if_not_exists => TRUE);

-- Create helper functions for common queries
CREATE OR REPLACE FUNCTION get_latest_transmitter_metrics(tx_id VARCHAR)
RETURNS TABLE (
  transmitter_id VARCHAR,
  ts TIMESTAMP,
  forward_power REAL,
  reflected_power REAL,
  vswr REAL,
  temperature REAL,
  frequency REAL,
  status VARCHAR,
  alarm_state VARCHAR
) AS $$
BEGIN
  RETURN QUERY
  SELECT tm.transmitter_id, tm.timestamp, tm.forward_power, tm.reflected_power, 
         tm.vswr, tm.temperature, tm.frequency, tm.status, tm.alarm_state
  FROM transmitter_metrics tm
  WHERE tm.transmitter_id = tx_id
  ORDER BY tm.timestamp DESC
  LIMIT 1;
END;
$$ LANGUAGE plpgsql STABLE;

CREATE OR REPLACE FUNCTION get_transmitter_metrics_range(
  tx_id VARCHAR,
  start_time TIMESTAMP,
  end_time TIMESTAMP
)
RETURNS TABLE (
  transmitter_id VARCHAR,
  ts TIMESTAMP,
  forward_power REAL,
  reflected_power REAL,
  vswr REAL,
  temperature REAL,
  frequency REAL,
  status VARCHAR,
  alarm_state VARCHAR
) AS $$
BEGIN
  RETURN QUERY
  SELECT tm.transmitter_id, tm.timestamp, tm.forward_power, tm.reflected_power,
         tm.vswr, tm.temperature, tm.frequency, tm.status, tm.alarm_state
  FROM transmitter_metrics tm
  WHERE tm.transmitter_id = tx_id
    AND tm.timestamp >= start_time
    AND tm.timestamp <= end_time
  ORDER BY tm.timestamp DESC;
END;
$$ LANGUAGE plpgsql STABLE;