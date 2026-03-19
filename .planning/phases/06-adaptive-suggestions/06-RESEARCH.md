# Phase 6: Adaptive Suggestions - Research

**Researched:** 2026-03-18
**Domain:** SQLite aggregation queries + React Native conditional UI
**Confidence:** HIGH

## Summary

Phase 6 implements DATA-05: the app adjusts what it shows based on accumulated user feedback for each craving. The plan 04-02 that was supposed to deliver this was never executed — the function `getCravingFeedbackSummary` and the adaptive note UI on `result.tsx` do not exist in the codebase.

The work is entirely within the existing codebase with no new dependencies. The pattern is: add one SQL aggregate query to `events.ts`, then consume it in `result.tsx` to show a conditional note to the user. The exact SQL, thresholds, and UI copy were already designed in the unexecuted plan 04-02 and are verified correct against the existing schema.

The full scope of Plan 04-02 is directly executable as-is: the function signature, SQL query, threshold logic (≥3 rated events; ≥60% yes = positive note; ≥5 events with <30% yes = struggling note), and the UI render block are already specified and compatible with the current architecture. No design decisions are left open.

**Primary recommendation:** Treat Plan 04-02's task specification as the source of truth. The SQL and component changes are minimal, correct, and fit the existing sync-only SQLite + React Native patterns perfectly.

## Standard Stack

No new libraries are needed. Phase 6 uses only what already exists.

### Core (already in use)
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| expo-sqlite | installed | SQLite persistence, sync API | All persistence in this app uses `db.getAllSync` / `db.runSync` |
| react-native | installed | UI components (View, Text) | All screens use this |
| expo-router | installed | Navigation (no changes needed) | Result screen already uses it |

### Supporting (already in use)
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| TypeScript strict mode | configured | Type safety | All files require explicit types, no `any` |

### Alternatives Considered
None — no new libraries required; this is internal logic only.

**Installation:**
```bash
# No installation needed — all dependencies already present
```

## Architecture Patterns

### Existing Project Structure (relevant files)
```
src/storage/
├── events.ts        # Add getCravingFeedbackSummary here
├── sqlite.ts        # db singleton (openDatabaseSync)
└── customMappings.ts
app/
├── result.tsx       # Add adaptive note UI here
└── index.tsx
```

### Pattern 1: Sync SQLite Aggregate Query (established pattern in this codebase)

**What:** All data reads use `db.getAllSync<T>()` with explicit TypeScript return type. No async, no Promises.
**When to use:** Every new storage function in this app follows this pattern — zero async on mount is a locked project decision.
**Example:**
```typescript
// Source: src/storage/events.ts (existing pattern — getTopCravings, getFeedbackStats)
export function getCravingFeedbackSummary(
  cravingId: string
): { yes: number; no: number; skip: number; total: number } {
  const rows = db.getAllSync<{ yes: number; no: number; skip: number; total: number }>(
    `SELECT
      SUM(CASE WHEN feedback = 'yes' THEN 1 ELSE 0 END) as yes,
      SUM(CASE WHEN feedback = 'no' THEN 1 ELSE 0 END) as no,
      SUM(CASE WHEN feedback = 'skip' THEN 1 ELSE 0 END) as skip,
      COUNT(*) as total
    FROM redirect_events
    WHERE craving_id = ?`,
    [cravingId]
  );
  return rows[0] ?? { yes: 0, no: 0, skip: 0, total: 0 };
}
```

**Critical detail:** `rows[0] ?? fallback` is required because SQLite aggregate queries on zero rows return one row of NULLs in some SQLite versions, or zero rows. The fallback handles both cases.

### Pattern 2: Calling sync storage in useEffect (established in result.tsx)

**What:** The existing `useEffect` in `result.tsx` already calls `logEvent()` synchronously inside the effect. Adding `getCravingFeedbackSummary()` to the same effect is the correct pattern — it runs once on mount, before the user sees the screen.
**When to use:** State that needs to be computed once on screen entry, using sync data.

```typescript
// Source: existing pattern in app/result.tsx
useEffect(() => {
  if (craving && result && cravingId) {
    const id = logEvent(cravingId, craving.label, result.need);
    setEventId(id);
    // ADD: getCravingFeedbackSummary call here
  }
}, []);
```

**Critical ordering issue:** `logEvent()` is called first and INSERTS the current event. `getCravingFeedbackSummary()` must be called AFTER `logEvent()` if the current event should be included in the summary count. Based on Plan 04-02's intent (show historical help rate), calling it after is correct — the new event has no feedback yet (feedback = NULL) so it increments `total` but not `yes` or `no`. The threshold logic uses `yes + no` (not total), so it will not affect the result. Either order is functionally equivalent for the threshold check.

### Pattern 3: Conditional render for adaptive note (no new pattern — standard React)

**What:** Render a note block only when `adaptiveNote !== null`. Uses `useState<string | null>(null)`.
**When to use:** UI that depends on computed data loaded on mount.

```tsx
// Source: Plan 04-02 spec (fits existing result.tsx conventions)
{adaptiveNote && (
  <View style={{ marginTop: 16, paddingHorizontal: 4 }}>
    <Text style={{ color: '#666666', fontSize: 13, fontStyle: 'italic', textAlign: 'center' }}>
      {adaptiveNote}
    </Text>
  </View>
)}
```

**Placement:** Between the "Try this" suggestions section and the "Did that help?" feedback section (already specified in Plan 04-02).

### Threshold Logic (from Plan 04-02 — use exactly as specified)

```typescript
const summary = getCravingFeedbackSummary(cravingId);
const ratedTotal = summary.yes + summary.no; // skip excluded from rate calculation
if (ratedTotal >= 3) {
  const yesRate = summary.yes / ratedTotal;
  if (yesRate >= 0.6) {
    setAdaptiveNote(`✓ This redirect works for you ${Math.round(yesRate * 100)}% of the time`);
  } else if (ratedTotal >= 5 && yesRate < 0.3) {
    setAdaptiveNote(`Still struggling? Also try: a 5-minute walk or a full glass of water`);
  }
}
```

**Why these thresholds:**
- `ratedTotal >= 3`: minimum sample size — prevents noise from 1-2 events
- `yesRate >= 0.6`: 60% success is meaningfully good, worth positive reinforcement
- `ratedTotal >= 5 && yesRate < 0.3`: requires more data before showing "struggling" message — avoids false negative after 3 unlucky uses
- `skip` excluded from `ratedTotal`: skip means "didn't try it" — shouldn't dilute the yes/no signal

### Anti-Patterns to Avoid

- **Calling getCravingFeedbackSummary in a separate useEffect:** Don't add a second `useEffect` — add to the existing one. Two effects on mount creates a race condition risk and unnecessary re-renders.
- **Calling it outside useEffect (at module scope or inline):** The sync call is fine, but calling it inline during render means it runs on every render, not just mount. Must be inside `useEffect` with `[]` dependency.
- **Using `async/await` or `Promise`:** Violates the locked project constraint "Zero async on mount / Sync SQLite only". `db.getAllSync` is already sync; do not wrap it.
- **Importing from barrel (src/storage/index.ts):** The barrel re-exports events but this app's existing screens import directly from `../src/storage/events`. Follow the existing convention for consistency.

## Don't Hand-Roll

This phase has no "don't hand-roll" risks — all problems are solved with existing patterns.

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Feedback aggregation | Custom in-memory accumulation | SQL aggregate (SUM CASE WHEN) | Already pattern-established in getFeedbackStats(); SQLite handles it correctly with a single query |
| Rate calculation | Complex weighted average | Simple `yes / (yes + no)` | Skip represents non-attempt, not failure — excluding it is the correct domain logic |

**Key insight:** This phase is a textbook execution of the existing patterns. Every building block (sync SQLite query, conditional state in useEffect, conditional render) already exists in the codebase. There is nothing novel to design.

## Common Pitfalls

### Pitfall 1: NULL result from aggregate on empty table
**What goes wrong:** SQLite aggregate functions (`SUM`, `COUNT`) on zero matching rows return a single row with NULL values for SUM columns. If not handled, `rows[0].yes` is `null`, and `null + null = 0` in JavaScript — which looks correct but breaks TypeScript strict mode.
**Why it happens:** SQLite aggregate semantics return one row even with no matching rows when there's no GROUP BY clause.
**How to avoid:** Use `rows[0] ?? { yes: 0, no: 0, skip: 0, total: 0 }` fallback. The TypeScript return type `{ yes: number; ... }` will flag any nullable issues at compile time.
**Warning signs:** `tsc` error about `number | null` not assignable to `number`.

### Pitfall 2: TypeScript strict — `useState` hook before conditional returns
**What goes wrong:** Placing `const [adaptiveNote, setAdaptiveNote] = useState<string | null>(null)` after the early-return guard (`if (!cravingId || !craving || !result) return ...`) violates Rules of Hooks.
**Why it happens:** Early returns in components are fine, but all hooks must come before any conditional return.
**How to avoid:** Place the new `useState` with the existing `useState` calls at the top of the function, before the early-return block. This is already the pattern in result.tsx — `const [eventId, setEventId] = useState<number | null>(null)` is placed before the conditional return.
**Warning signs:** React hooks error at runtime: "Rendered more hooks than during the previous render."

### Pitfall 3: Off-by-one in threshold after logEvent
**What goes wrong:** If `getCravingFeedbackSummary` is called BEFORE `logEvent`, the current session is missing from the summary. If called AFTER, the current session's NULL feedback is included in `total` but not `yes`/`no` — which is correct for the threshold logic.
**Why it happens:** The INSERT happens in the same useEffect.
**How to avoid:** Call `getCravingFeedbackSummary` after `logEvent` in the same effect body. This is safe because the new event has NULL feedback and `ratedTotal = yes + no` excludes it.
**Warning signs:** Note appears one session too early or one session too late (hard to notice without counting exact events).

### Pitfall 4: DimensionValue — not relevant here but keep in mind
**What goes wrong:** This pitfall affected bar chart widths in Phase 4, not applicable to Phase 6. No percentage-width styles needed.
**Note:** If any bar-chart-style UI were added to show the help rate visually, `DimensionValue` cast would be required. Phase 6 spec uses only a text note, so this is not a concern.

## Code Examples

### Complete getCravingFeedbackSummary function
```typescript
// Source: Derived from existing getFeedbackStats pattern in src/storage/events.ts
export function getCravingFeedbackSummary(
  cravingId: string
): { yes: number; no: number; skip: number; total: number } {
  const rows = db.getAllSync<{ yes: number; no: number; skip: number; total: number }>(
    `SELECT
      SUM(CASE WHEN feedback = 'yes' THEN 1 ELSE 0 END) as yes,
      SUM(CASE WHEN feedback = 'no' THEN 1 ELSE 0 END) as no,
      SUM(CASE WHEN feedback = 'skip' THEN 1 ELSE 0 END) as skip,
      COUNT(*) as total
    FROM redirect_events
    WHERE craving_id = ?`,
    [cravingId]
  );
  return rows[0] ?? { yes: 0, no: 0, skip: 0, total: 0 };
}
```

### Updated useEffect in result.tsx
```typescript
// Source: Plan 04-02 specification; hooks rule requires useState before conditional returns
const [eventId, setEventId] = useState<number | null>(null);
const [adaptiveNote, setAdaptiveNote] = useState<string | null>(null);  // ADD THIS

// ... existing early-return guard ...

useEffect(() => {
  if (craving && result && cravingId) {
    const id = logEvent(cravingId, craving.label, result.need);
    setEventId(id);
    // ADD THIS BLOCK:
    const summary = getCravingFeedbackSummary(cravingId);
    const ratedTotal = summary.yes + summary.no;
    if (ratedTotal >= 3) {
      const yesRate = summary.yes / ratedTotal;
      if (yesRate >= 0.6) {
        setAdaptiveNote(`✓ This redirect works for you ${Math.round(yesRate * 100)}% of the time`);
      } else if (ratedTotal >= 5 && yesRate < 0.3) {
        setAdaptiveNote(`Still struggling? Also try: a 5-minute walk or a full glass of water`);
      }
    }
  }
}, []);
```

### Conditional render placement in result.tsx JSX
```tsx
{/* Suggestions section — already exists */}
<View style={{ marginTop: 32 }}>
  {/* ... existing suggestion cards ... */}
</View>

{/* ADD: Adaptive note — between suggestions and feedback */}
{adaptiveNote && (
  <View style={{ marginTop: 16, paddingHorizontal: 4 }}>
    <Text style={{ color: '#666666', fontSize: 13, fontStyle: 'italic', textAlign: 'center' }}>
      {adaptiveNote}
    </Text>
  </View>
)}

{/* Feedback section — already exists */}
<View style={{ marginTop: 32 }}>
  {/* ... existing yes/no/skip buttons ... */}
</View>
```

### Import line update in result.tsx
```typescript
// Before:
import { logEvent, setFeedback } from '../src/storage/events';
// After:
import { logEvent, setFeedback, getCravingFeedbackSummary } from '../src/storage/events';
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Static suggestions always shown | Adaptive note based on feedback history | Phase 6 (this phase) | DATA-05 satisfied |
| getFeedbackStats() (per-craving aggregate) | getCravingFeedbackSummary() (single-craving aggregate with WHERE clause) | Phase 6 (new function) | Targeted per-session query instead of full table scan |

**Deprecated/outdated:**
- None — no existing code is being replaced. This is purely additive.

## Open Questions

1. **Color hardcoded as `'#666666'`**
   - What we know: Plan 04-02 specifies `color: '#666666'` for the adaptive note text. The existing `colors.textMuted` from `useThemeColors()` is the project's standard for muted text.
   - What's unclear: Whether `'#666666'` or `colors.textMuted` is preferred. In light mode they are likely equivalent; in dark mode `colors.textMuted` would adapt automatically.
   - Recommendation: Use `colors.textMuted` from the existing `useThemeColors()` hook (already imported in result.tsx) instead of the hardcoded `'#666666'` — it's consistent with the rest of the screen and handles dark mode. This is a minor deviation from the Plan 04-02 spec but strictly better.

2. **No "middle" case displayed**
   - What we know: The threshold logic only shows a note when `yesRate >= 0.6` (positive) or `yesRate < 0.3` (struggling). The range 0.3–0.6 shows nothing.
   - What's unclear: Is this intentional UX (avoid noise for ambiguous data)?
   - Recommendation: Yes, intentional — no note in the middle range is correct. Ambiguous feedback should not show a message. No action needed.

## Sources

### Primary (HIGH confidence)
- Direct code inspection: `src/storage/events.ts` — confirmed `getFeedbackStats()` pattern for SUM CASE WHEN SQL; confirmed `db.getAllSync<T>()` sync API usage
- Direct code inspection: `app/result.tsx` — confirmed `useState` placement, `useEffect` structure, JSX layout sections
- Direct code inspection: `src/storage/sqlite.ts` — confirmed `openDatabaseSync` singleton
- `.planning/phases/04-pattern-learning/04-02-PLAN.md` — confirmed exact spec for unexecuted plan (function signature, SQL, threshold logic, UI copy, placement)
- `.planning/v1-MILESTONE-AUDIT.md` — confirmed DATA-05 is unsatisfied, getCravingFeedbackSummary does not exist

### Secondary (MEDIUM confidence)
- None needed — all information derived from direct codebase inspection

### Tertiary (LOW confidence)
- None

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — no new libraries; verified against installed package.json and existing import patterns
- Architecture: HIGH — patterns directly observed in existing working code (events.ts, result.tsx)
- Pitfalls: HIGH — Rules of Hooks issue is a known React constraint; NULL aggregate issue is verifiable SQLite behavior; both observed in prior phase summaries

**Research date:** 2026-03-18
**Valid until:** 2026-04-17 (30 days — stable; no external dependencies)
