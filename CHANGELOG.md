# Changelog

## v13.1.1.3 (2025-10-20)

Release summary:
- Verified TX card drag-and-drop persistence end-to-end.
- Client DnD wiring confirmed:
  - `SiteCard` uses `DndContext` with `PointerSensor` (activation constraint `distance: 4`).
  - `TransmitterCard` attaches drag handle via `dragHandleRef` and `dragHandleListeners` on a `GripVertical` icon.
- Persistence path validated:
  - Client `updateTransmitter` sends `PUT /api/snmp/transmitters/:id` with `displayOrder`.
  - Server `PUT /transmitters/:id` parses `displayOrder` and calls `databaseService.upsertTransmitter`.
  - DB schema ensures `display_label` and `display_order` columns; `getAllTransmitters` orders by `displayOrder`.
- Display order respected on pages:
  - `CardsPage` and `MapPage` sort transmitters by `displayOrder` via `convertMetricsToSiteData`.

Changes:
- Version bump to `13.1.1.3`.
- Updated `package-lock.json` to reflect version change.
- UI: moved TX card drag handle to top-right; ensured 2-line label visibility.

Links:
- Tag: `v13.1.1.3`
- Commit: `6aa72bb` on `main`
- Repo: https://github.com/batuapi13/fmtxm

Notes:
- This release precedes a major change. Subsequent work will land in a separate branch or a new major version.