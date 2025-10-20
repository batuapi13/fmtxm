# v14 Architecture: Service Segregation (Polling vs Traps)

## Goals
- Reduce per-site bandwidth from ~19 GB/month to < 100 MB/month.
- Separate responsibilities: periodic polling only for essential power metrics; events via SNMP traps for all other OIDs.
- Improve responsiveness and scalability while reducing router load and data transfer.

## Overview
- Polling Service (central): periodically queries only "Forward Power" and "Reflected Power" OIDs from transmitters.
- Trap Gateway (site-local): receives SNMP traps for all other operational/status OIDs (alarms, temperatures, statuses, etc.), aggregates locally, and forwards minimal updates upstream.
- Aggregation/API (central): stores both polled metrics and trap-derived state/events, exposes lightweight APIs for UI.

## Services & Responsibilities
- Poller (central)
  - Scope: Fetch only power metrics (forward/reflected) at a configured interval.
  - Implementation: refactor `server/services/snmp-poller.ts` to restrict OIDs to the two power metrics.
  - Output: write to `power_metrics` table (new) with timestamp, siteId, transmitterId, forwardPowerW, reflectedPowerW.
- Trap Receiver/Gateway (per site)
  - Scope: Run on-site; receive traps for all other OIDs. Perform light normalization and dedup at the edge.
  - Transport Upstream: push summarized changes to central (HTTPS POST or MQTT). Use batching and backoff.
  - Alternative (central trap receiver): If site-local is not feasible, central receiver on UDP/162 is possible, but edges are strongly preferred to keep site egress small.
- Aggregation/API (central)
  - Store trap-derived state in `status_events` (append-only) and `device_state` (latest snapshot) tables.
  - Provide `/metrics/power` endpoints and `/devices/state` endpoints.

## OIDs
- Poller OIDs (only two):
  - `OID_FORWARD_POWER` (Watts)
  - `OID_REFLECTED_POWER` (Watts)
- Trap OIDs (examples, dependent on MIB mapping):
  - PA temperature, exciter status, alarms, changeover status, mains voltage, etc.

## Traffic Budget (Example per Site)
- Assumptions:
  - 2 transmitters per site; total polled OIDs = 2 per transmitter = 4 OIDs per poll.
  - SNMP response size ~ 500–1000 bytes per OID including overhead; use 800 bytes avg.
  - Poll interval: 60 seconds (tunable).
- Calculation:
  - Per poll: ~ 4 OIDs × 800 bytes ≈ 3.2 KB.
  - Per day: 1440 polls × 3.2 KB ≈ 4.6 MB/day.
  - Per month (30 days): ≈ 138 MB/month.
- Optimization knobs to hit < 100 MB/month:
  - Reduce poll interval to 90 seconds: 960 polls/day → ~ 3.1 MB/day → ~ 93 MB/month.
  - Use GET-BULK to reduce overhead (if supported).
  - Compress upstream storage payloads (internal, not network SNMP).
- Trap traffic:
  - Event-driven; typical trap PDUs ~ 200–800 bytes each.
  - With dedup and edge aggregation, expected < 10 MB/month per site under normal operation.

## Data Model Changes
- New tables:
  - `power_metrics`
    - `id`, `timestamp`, `site_id`, `transmitter_id`, `forward_power_w`, `reflected_power_w`
    - Index: (`site_id`, `transmitter_id`, `timestamp`)
  - `status_events`
    - `id`, `timestamp`, `site_id`, `transmitter_id`, `oid`, `value`, `severity`, `event_type`, `raw`
    - Retention: shorter window or summarized rollups
  - `device_state`
    - `site_id`, `transmitter_id`, `oid`, `value`, `updated_at`
    - Holds latest known state derived from traps (and power from poller)
- Migrations:
  - Drizzle migration scripts to add new tables and indexes.
  - Backfill last-known power metrics from existing history if needed.

## API Changes
- Power Metrics
  - `GET /api/metrics/power?siteId=<id>&transmitterId=<id>&from=<ts>&to=<ts>`
- Device State
  - `GET /api/devices/state?siteId=<id>` returns latest snapshot including trap-derived states and last polled power.
- Events
  - `GET /api/events?siteId=<id>&from=<ts>&to=<ts>&severity=<...>`
- Edge Ingest (from site trap gateways)
  - `POST /api/ingest/traps` accepts batched normalized trap payloads.

## Client Updates
- Cards/Map pages
  - Continue showing power from `metrics/power`.
  - Derive badges/status from `devices/state` (trap-derived) instead of frequent polling.
- Refresh strategy
  - Power charts: periodic fetch aligned with poll interval.
  - State: subscribe to server-sent events/WebSocket (optional) or poll snapshot every few minutes.

## Deployment Plan
1. Branch `major/14.0.0` (created).
2. Implement DB migrations for `power_metrics`, `status_events`, `device_state`.
3. Refactor central SNMP poller to power-only OIDs; make interval configurable.
4. Implement central trap receiver (for initial testing) with `net-snmp` Trap listener; normalize to events/state.
5. Implement site-local Trap Gateway container (preferred) and a secure upstream channel (HTTPS or MQTT).
6. Client changes to read new APIs and snapshot.
7. Observability: logs, metrics, trap drop counters, retry/backoff.
8. Cut v14.0.0-alpha for pilot sites; measure bandwidth; tune intervals.

## Risks & Mitigations
- Trap loss or storms: add buffering, backpressure, and deduplication; monitor drop rate.
- Device misconfig: validation tools to verify trap targets and community settings.
- Clock drift: enforce NTP and include timestamps in payloads.
- Central outages: site gateway queues and retries with exponential backoff.

## Configuration
- Poller (central)
  - `POLL_INTERVAL_SEC=60|90`
  - `OID_FORWARD_POWER`, `OID_REFLECTED_POWER`
- Trap Receiver (central or site)
  - `TRAP_LISTEN_PORT=162` (site) or alternative if centralized
  - `TRAP_UPSTREAM_URL` (site → central) or `MQTT_BROKER_URL`
  - `SITE_ID`, `AUTH_TOKEN`

## Acceptance Criteria
- Reduce per-site network usage to < 100 MB/month under normal operating conditions.
- UI reflects timely state changes via traps, while power charts remain accurate via polling.
- Stable APIs and migrations with observability around trap ingest and polling.