# Plan 02-01 Summary — Craving Data Layer & Selection Screen

**Phase:** 02-core-redirect-flow
**Plan:** 01
**Status:** COMPLETE
**Date:** 2026-03-17
**Duration:** ~10 min

---

## What Was Built

### Task 1 — Craving Data Layer (`src/data/mappings.ts`)
- Created `src/data/` directory under existing `src/`
- Exported `CravingItem` and `NeedResult` TypeScript interfaces
- Exported `CRAVINGS: CravingItem[]` — 12 ADHD craving items with id, label, emoji
- Exported `MAPPINGS: Record<string, NeedResult>` — 12 entries mapping each craving id to its underlying need and exactly 2 actionable suggestions
- Named exports only; TypeScript strict mode; no `any`

### Task 2 — Craving Selection Screen (`app/index.tsx`)
- Replaced placeholder CTA button with a scrollable 2-column FlatList grid
- Preserved dark background (#0a0a0a) and "What are you craving?" headline from Phase 1 shell
- Added subtitle: "Tap one — we'll find the real need behind it" (inline UX-01 guidance, muted gray #666)
- Each tile: ~flex:1 width, 90px tall, #1a1a1a background, borderRadius 12, emoji + label
- On tap: `router.push({ pathname: '/result', params: { cravingId: item.id } })`
- Zero async on mount — renders synchronously from imported data

---

## Commits

| Hash | Message |
|------|---------|
| `c20235e` | feat(data): create craving-to-need mappings data layer |
| `0d0ea0e` | feat(ui): replace home screen shell with craving selection grid |

---

## Verification

- [x] `npx tsc --noEmit` passes with 0 errors
- [x] `src/data/mappings.ts` exports CRAVINGS (12 items) and MAPPINGS (12 entries)
- [x] `app/index.tsx` renders craving grid (FlatList, numColumns={2})
- [x] Tapping a tile calls `router.push` with `cravingId` param

---

## Files Modified

- `src/data/mappings.ts` — created (new file)
- `app/index.tsx` — replaced placeholder shell with craving grid

---

## Next

Plan 02-02: Result screen — reads `cravingId` param, looks up `MAPPINGS`, displays the underlying need and 2 suggestions.
