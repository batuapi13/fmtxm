# Changelog

## v13.2.0.0

- Cleanup: removed obsolete `server/snmp-poller.ts` to avoid confusion; consolidated on `server/services/snmp-poller.ts` which is used by `server/routes/snmp.ts`.
- No API surface changes; SNMP routes continue to use the same service.
- Represents the cleaned-up codebase after dev routing fixes in v13.1.1.7.

Tag: `v13.2.0.0`

## v13.1.1.7

- Dev routing stabilized for SPA: catch-all serves `index.html` only for HTML requests; non-HTML asset requests bypass the catch-all.
- Express dev server handles `HEAD /` health checks cleanly and avoids noise from Vite ping requests.
- Vite dev config updates:
  - Added explicit React alias/dedupe to prevent multiple React instances.
  - Included `react`, `react-dom`, and `@tanstack/react-query` in `optimizeDeps` for faster cold starts.
  - Relaxed `server.fs` restrictions in dev to allow client assets to resolve correctly.
- Verified pages `/map` and `/cards` load without errors; navigation uses `useLocation` correctly.
- Improved HMR stability and consistent asset routing during development.

Tags: `v13.1.1.7`, `v13.2.0.0`