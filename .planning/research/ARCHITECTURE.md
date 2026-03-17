# Architecture Research: ADHD Needs App

> Research compiled from established React Native / Expo patterns and local-first architecture knowledge.
> WebSearch was unavailable; findings are based on training data through early 2025.
> Confidence levels marked where applicable.

---

## System Overview

```
┌─────────────────────────────────────────────────────┐
│                    ADHD Needs App                    │
│                  (Expo / React Native)               │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌───────────┐   ┌──────────────┐   ┌───────────┐  │
│  │  Screens  │──▶│  Flow Engine │──▶│ Feedback   │  │
│  │  (Tabs)   │   │  (Redirect   │   │ Collector  │  │
│  │           │   │   Wizard)    │   │            │  │
│  └───────────┘   └──────┬───────┘   └─────┬──────┘  │
│        │                │                  │         │
│        ▼                ▼                  ▼         │
│  ┌──────────────────────────────────────────────┐   │
│  │              Zustand Store                    │   │
│  │  (in-memory state + persistence middleware)   │   │
│  └──────────────────┬───────────────────────────┘   │
│                     │                                │
│                     ▼                                │
│  ┌──────────────────────────────────────────────┐   │
│  │         Local Storage Layer                   │   │
│  │  ┌──────────┐          ┌──────────────────┐  │   │
│  │  │  MMKV    │          │  SQLite (op-     │  │   │
│  │  │ (config, │          │  sqlite or       │  │   │
│  │  │  prefs)  │          │  expo-sqlite)    │  │   │
│  │  └──────────┘          │  (event log,     │  │   │
│  │                        │   patterns)      │  │   │
│  │                        └──────────────────┘  │   │
│  └──────────────────────────────────────────────┘   │
│                                                     │
└─────────────────────────────────────────────────────┘
```

**Why this shape:** The app has two fundamentally different data needs — fast key-value access for preferences/state (MMKV) and queryable structured data for pattern tracking (SQLite). The flow engine is the core differentiator and gets its own layer rather than being spread across screens.

---

## Component Responsibilities

| Component | Responsibility | Key Tech |
|-----------|---------------|----------|
| **Expo Router** | Tab navigation + screen management | `expo-router` (file-based routing) |
| **Redirect Flow Engine** | Multi-step craving-to-need guided flow | Custom state machine or `XState` |
| **Mapping Store** | Default + user-customized craving→need mappings | Zustand + MMKV |
| **Event Logger** | Records each redirect event (craving, suggested need, feedback) | SQLite |
| **Pattern Analyzer** | Aggregates events into time-based patterns | SQLite queries + JS |
| **Visualization** | Charts/graphs for pattern display | `victory-native` or `react-native-gifted-charts` |
| **Feedback Collector** | Post-redirect "did this help?" micro-interaction | Inline component |
| **Mapping Editor** | CRUD for user's custom craving→need connections | Screen with forms |

---

## Recommended Project Structure

```
adhd-needs/
├── app/                          # Expo Router file-based routing
│   ├── _layout.tsx               # Root layout (tab navigator)
│   ├── (tabs)/
│   │   ├── _layout.tsx           # Tab bar configuration
│   │   ├── index.tsx             # Home / quick redirect entry
│   │   ├── patterns.tsx          # Pattern visualization screen
│   │   └── settings.tsx          # Mappings + preferences
│   └── redirect/
│       ├── _layout.tsx           # Flow layout (no tabs, modal-style)
│       ├── [step].tsx            # Dynamic step route OR
│       ├── craving.tsx           # Step 1: What are you craving?
│       ├── explore.tsx           # Step 2: Guided questions
│       ├── need.tsx              # Step 3: Here's your real need
│       └── feedback.tsx          # Step 4: Did that help?
│
├── src/
│   ├── components/
│   │   ├── ui/                   # Generic reusable (Button, Card, etc.)
│   │   ├── flow/                 # Flow-specific (StepIndicator, CravingPill)
│   │   └── charts/              # Pattern visualization components
│   │
│   ├── stores/
│   │   ├── useRedirectStore.ts   # Current redirect flow state
│   │   ├── useMappingStore.ts    # Craving→need mappings
│   │   └── useSettingsStore.ts   # User preferences
│   │
│   ├── data/
│   │   ├── database.ts           # SQLite setup + migrations
│   │   ├── queries.ts            # Named query functions
│   │   ├── defaultMappings.ts    # Built-in craving→need data
│   │   └── types.ts              # Data model types
│   │
│   ├── engine/
│   │   ├── flowMachine.ts        # Redirect flow logic (state machine)
│   │   └── patternAnalyzer.ts    # Aggregation logic for patterns
│   │
│   ├── hooks/
│   │   ├── useRedirectFlow.ts    # Hook wrapping flow machine
│   │   ├── usePatterns.ts        # Hook for pattern queries
│   │   └── useHaptics.ts         # Tactile feedback
│   │
│   ├── constants/
│   │   ├── theme.ts              # Colors, spacing, typography
│   │   └── categories.ts         # Craving/need category definitions
│   │
│   └── utils/
│       ├── time.ts               # Date/time helpers
│       └── analytics.ts          # Local pattern computation
│
├── assets/                       # Icons, images, fonts
├── app.json                      # Expo config
├── tsconfig.json
└── package.json
```

**Rationale:**
- `app/` uses Expo Router's file-based routing (the current standard for Expo apps as of SDK 51+). **HIGH confidence.**
- `src/` keeps business logic separate from routing — screens stay thin.
- `engine/` isolates the core flow logic so it's testable without React.
- `stores/` uses one file per domain rather than a monolithic store.
- The redirect flow gets its own route group so it can use a different layout (no tab bar, swipe-to-dismiss, etc.).

---

## Architectural Patterns

### 1. State Management: Zustand + Persist Middleware

**Why Zustand over Redux/Context:** Zustand is the dominant lightweight state manager for React Native as of 2024-2025. No boilerplate, no providers, trivially persistable. Perfect for solo dev projects. **HIGH confidence.**

```typescript
// src/stores/useMappingStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { zustandMMKVStorage } from './mmkvStorage';

interface MappingStore {
  mappings: CravingToNeedMapping[];
  addMapping: (mapping: CravingToNeedMapping) => void;
  updateMapping: (id: string, updates: Partial<CravingToNeedMapping>) => void;
  removeMapping: (id: string) => void;
}

export const useMappingStore = create<MappingStore>()(
  persist(
    (set) => ({
      mappings: DEFAULT_MAPPINGS,
      addMapping: (mapping) =>
        set((s) => ({ mappings: [...s.mappings, mapping] })),
      updateMapping: (id, updates) =>
        set((s) => ({
          mappings: s.mappings.map((m) =>
            m.id === id ? { ...m, ...updates } : m
          ),
        })),
      removeMapping: (id) =>
        set((s) => ({ mappings: s.mappings.filter((m) => m.id !== id) })),
    }),
    {
      name: 'mapping-store',
      storage: createJSONStorage(() => zustandMMKVStorage),
    }
  )
);
```

### 2. Local Storage: Two-Layer Approach

**MMKV for fast key-value data** (preferences, mappings, small config). Sub-millisecond reads, synchronous API. **HIGH confidence.**

**SQLite for structured event data** (redirect logs, pattern queries). Enables time-range queries, aggregations, and future export. **HIGH confidence.**

```typescript
// src/data/database.ts
import * as SQLite from 'expo-sqlite';

const DB_NAME = 'adhd_needs.db';

export async function initDatabase() {
  const db = await SQLite.openDatabaseAsync(DB_NAME);

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS redirect_events (
      id TEXT PRIMARY KEY,
      craving_category TEXT NOT NULL,
      craving_text TEXT,
      suggested_need TEXT NOT NULL,
      accepted_need TEXT,
      helpful INTEGER,          -- null = no feedback, 1 = yes, 0 = no
      created_at TEXT NOT NULL,  -- ISO 8601
      time_of_day TEXT,          -- morning/afternoon/evening/night
      day_of_week INTEGER
    );

    CREATE INDEX IF NOT EXISTS idx_events_created
      ON redirect_events(created_at);
    CREATE INDEX IF NOT EXISTS idx_events_category
      ON redirect_events(craving_category);
  `);

  return db;
}
```

**Why not just MMKV for everything?** Pattern tracking requires queries like "show me cravings by time of day for the last 30 days." Flat key-value storage makes this painful. SQLite handles it natively. Once you exceed ~50 events, the query advantage is significant.

**Why not just SQLite for everything?** Synchronous reads for UI state (current theme, active mappings) are faster and simpler with MMKV. SQLite's async API adds unnecessary complexity for simple lookups.

### 3. Flow Engine: Lightweight State Machine

For the redirect flow (craving input -> guided exploration -> need identification -> feedback), a state machine keeps the logic predictable and testable.

**Option A: Plain reducer (recommended for v1).** Simplest, no dependency. **HIGH confidence this is sufficient.**

```typescript
// src/engine/flowMachine.ts
type FlowState =
  | { step: 'input'; craving: null }
  | { step: 'explore'; craving: string; questions: Question[] }
  | { step: 'result'; craving: string; suggestedNeed: Need }
  | { step: 'feedback'; craving: string; acceptedNeed: Need };

type FlowAction =
  | { type: 'SET_CRAVING'; craving: string }
  | { type: 'ANSWER_QUESTION'; questionId: string; answer: string }
  | { type: 'ACCEPT_NEED'; need: Need }
  | { type: 'REJECT_NEED' }
  | { type: 'SUBMIT_FEEDBACK'; helpful: boolean }
  | { type: 'RESET' };

export function flowReducer(state: FlowState, action: FlowAction): FlowState {
  switch (state.step) {
    case 'input':
      if (action.type === 'SET_CRAVING') {
        const questions = getQuestionsForCraving(action.craving);
        return { step: 'explore', craving: action.craving, questions };
      }
      break;
    case 'explore':
      if (action.type === 'ANSWER_QUESTION') {
        // Process answer, potentially advance to result
        const need = deriveNeedFromAnswers(state.craving, state.questions);
        if (need) return { step: 'result', craving: state.craving, suggestedNeed: need };
      }
      break;
    case 'result':
      if (action.type === 'ACCEPT_NEED')
        return { step: 'feedback', craving: state.craving, acceptedNeed: action.need };
      if (action.type === 'REJECT_NEED')
        return { step: 'explore', craving: state.craving, questions: getAlternativeQuestions(state.craving) };
      break;
    case 'feedback':
      if (action.type === 'SUBMIT_FEEDBACK') return { step: 'input', craving: null };
      break;
  }
  if (action.type === 'RESET') return { step: 'input', craving: null };
  return state;
}
```

**Option B: XState.** If the flow grows complex (branching paths, timeouts, parallel states), XState provides visualizable state charts. Heavier dependency. **MEDIUM confidence it's needed for v1** -- probably overkill unless the exploration step has many branches.

### 4. Navigation Pattern for Guided Flows

Two viable approaches with Expo Router:

**Approach A: Stack-based steps (recommended).** Each step is a screen. Natural back-button behavior. User can swipe back.

```
app/redirect/craving.tsx  →  app/redirect/explore.tsx  →  app/redirect/need.tsx
```

**Approach B: Single screen with animated transitions.** One screen, swap content with `react-native-reanimated` transitions. Faster perceived navigation, simpler state (no route params). Better for very short flows (<4 steps).

For a 3-4 step flow where speed is critical (under 10 seconds), **Approach B is likely better** — it avoids navigation mount/unmount overhead and feels more fluid. But Approach A is more maintainable. **MEDIUM confidence — test both.**

### 5. Pattern Tracking and Visualization

```typescript
// src/data/queries.ts
export async function getCravingsByTimeOfDay(
  db: SQLiteDatabase,
  daysBack: number = 30
): Promise<TimeOfDayPattern[]> {
  const cutoff = new Date(Date.now() - daysBack * 86400000).toISOString();
  return db.getAllAsync<TimeOfDayPattern>(`
    SELECT time_of_day, craving_category, COUNT(*) as count
    FROM redirect_events
    WHERE created_at > ? AND helpful IS NOT NULL
    GROUP BY time_of_day, craving_category
    ORDER BY count DESC
  `, [cutoff]);
}

export async function getMostEffectiveNeeds(
  db: SQLiteDatabase,
  cravingCategory: string
): Promise<NeedEffectiveness[]> {
  return db.getAllAsync<NeedEffectiveness>(`
    SELECT accepted_need,
           COUNT(*) as total,
           SUM(CASE WHEN helpful = 1 THEN 1 ELSE 0 END) as helped,
           ROUND(SUM(CASE WHEN helpful = 1 THEN 1.0 ELSE 0.0 END) / COUNT(*) * 100) as help_rate
    FROM redirect_events
    WHERE craving_category = ? AND helpful IS NOT NULL
    GROUP BY accepted_need
    ORDER BY help_rate DESC
  `, [cravingCategory]);
}
```

**Visualization libraries (HIGH confidence on recommendations):**

| Library | Best For | Bundle Size | Notes |
|---------|----------|-------------|-------|
| `victory-native` | Flexible charting, good defaults | ~150KB | Most popular, good docs. Requires `react-native-svg`. |
| `react-native-gifted-charts` | Simple bar/line/pie | ~80KB | Lighter, less flexible. |
| `react-native-svg` raw | Fully custom visuals | ~60KB | Most control, most work. |

For a small app with a few chart types, `react-native-gifted-charts` is likely the sweet spot — lighter than Victory, covers bar charts and line charts, which is all pattern tracking needs.

---

## Data Flow

### Redirect Flow (Primary User Journey)

```
User opens app
       │
       ▼
┌──────────────┐     ┌─────────────────┐     ┌──────────────┐
│  Home Screen │────▶│  Select/Type    │────▶│  Exploration │
│  (one tap)   │     │  Craving        │     │  Questions   │
└──────────────┘     └─────────────────┘     └──────┬───────┘
                                                     │
                            ┌────────────────────────┘
                            ▼
                     ┌──────────────┐     ┌──────────────┐
                     │  Show Real   │────▶│  Feedback:   │
                     │  Need + Tips │     │  Did it help?│
                     └──────────────┘     └──────┬───────┘
                                                  │
                                                  ▼
                                           ┌──────────────┐
                                           │  Log event   │
                                           │  to SQLite   │
                                           └──────────────┘
```

**Target: Input to Need in 2-3 taps, under 10 seconds.**

### State Flow

```
                    ┌──────────────────┐
                    │   React Component │
                    │   (Screen/View)   │
                    └────────┬─────────┘
                      reads  │  │ dispatches
                             │  │
                    ┌────────▼──▼───────┐
                    │   Zustand Store    │───── sync ────▶ MMKV
                    │   (reactive)      │                 (persisted)
                    └────────┬─────────┘
                             │ writes events
                             ▼
                    ┌──────────────────┐
                    │     SQLite       │◀──── reads ──── Pattern Screen
                    │   (event log)   │
                    └──────────────────┘
```

Key principle: **Zustand stores own UI state. SQLite owns historical data. They don't duplicate.** A redirect event is first managed by the Zustand redirect store during the flow, then written to SQLite once complete (on feedback submission). The pattern screen reads directly from SQLite.

---

## Scaling Considerations

These are "keep in mind" items, not things to build now.

| Concern | When It Matters | Mitigation |
|---------|----------------|------------|
| SQLite row count | >10K events (~1-2 years of heavy use) | Pagination on queries, archive old data |
| Mapping list size | >100 custom mappings | Virtualized list (FlashList) |
| Chart rendering | >1000 data points in a single chart | Pre-aggregate in SQL, limit display range |
| App startup time | If store hydration exceeds 100ms | Lazy-load non-critical stores |
| Future cloud sync | v2+ if multi-device is needed | SQLite + CRDT (e.g., cr-sqlite) or simple export/import JSON |
| Future sharing | v2+ if social features added | Abstract data layer behind repository pattern |

**For v1: None of these are likely to be issues.** A single user generating a few events per day won't stress any of these limits for years.

---

## Anti-Patterns to Avoid

### 1. Over-abstraction
**Don't:** Create a generic "repository pattern" with interfaces for every data access.
**Do:** Write direct Zustand stores and SQLite query functions. Refactor to abstractions only when you have 2+ concrete implementations.

### 2. Premature state normalization
**Don't:** Normalize mappings into separate entities/relations in SQLite like a backend database.
**Do:** Keep mappings as a JSON blob in MMKV via Zustand. They're small, read-heavy, and rarely queried relationally.

### 3. Navigation-driven state
**Don't:** Pass flow state through route params (`router.push('/result', { craving, need, answers })`).
**Do:** Keep flow state in a Zustand store or `useReducer`. Navigation triggers transitions, store holds the data.

### 4. Giant components
**Don't:** Build a 400-line `RedirectScreen` that handles input, exploration, results, and feedback.
**Do:** Split into focused components. Each step can be its own component even if they live on one screen.

### 5. Premature optimization
**Don't:** Add `React.memo`, `useMemo`, or `useCallback` everywhere from the start.
**Do:** Build it simply first. Profile with React DevTools if something feels slow. Optimize what's measured, not what's imagined.

### 6. Skipping TypeScript strictness
**Don't:** Use `any` types for flow state or event data.
**Do:** Define discriminated unions for flow steps (as shown in the flow machine example). TypeScript catches impossible states at compile time.

### 7. Storing derived data
**Don't:** Store computed pattern statistics in a separate persistent cache.
**Do:** Compute patterns from raw events via SQL queries. The dataset is small enough that queries will be fast (<10ms for months of data).

---

## Integration Points

For v1 these are all internal integrations (no external services). Documenting them as module boundaries.

| Integration | From | To | Mechanism | Notes |
|-------------|------|-----|-----------|-------|
| Flow start | Home Screen | Flow Engine | Zustand action / navigation | One tap to begin |
| Craving lookup | Flow Engine | Mapping Store | Zustand selector | Sync, fast |
| Event logging | Flow completion | SQLite | Async insert | Fire-and-forget after feedback |
| Pattern queries | Pattern Screen | SQLite | Async query via hook | `usePatterns()` hook |
| Feedback write-back | Feedback step | Mapping Store | Zustand action | Adjusts confidence weights |
| Haptic feedback | Flow transitions | Device | `expo-haptics` | Subtle tactile confirmation |
| Notifications (future) | System | App | `expo-notifications` | LOW confidence on v1 need |

### External Libraries (Recommended Stack)

| Purpose | Library | Confidence |
|---------|---------|------------|
| Framework | Expo SDK 52+ | HIGH |
| Routing | `expo-router` v4+ | HIGH |
| State | `zustand` | HIGH |
| KV Storage | `react-native-mmkv` | HIGH |
| Database | `expo-sqlite` | HIGH |
| Charts | `react-native-gifted-charts` | MEDIUM (evaluate vs Victory) |
| Animations | `react-native-reanimated` | HIGH |
| Haptics | `expo-haptics` | HIGH |
| Icons | `@expo/vector-icons` | HIGH |

---

## Key Takeaways

1. **Two storage layers** (MMKV + SQLite) is the right split for this app's data needs.
2. **Zustand is the right state manager** — minimal boilerplate, built-in persistence, great DX for solo dev.
3. **The flow engine is the core logic** — isolate it, make it testable, keep it separate from UI.
4. **Expo Router file-based routing** is the current standard and handles the tab + flow navigation well.
5. **Don't build what you don't need yet** — no backend, no auth, no complex caching. Ship fast, iterate.
6. **Speed is the feature** — every architectural decision should be evaluated against "can the user get from craving to need in under 10 seconds?"

---

*Research compiled: 2026-03-17*
*Source: Training knowledge through early 2025. WebSearch unavailable.*
*Confidence: HIGH on core patterns (Zustand, Expo Router, SQLite + MMKV split). MEDIUM on specific library choices for charts. LOW on nothing — these are well-established patterns.*
