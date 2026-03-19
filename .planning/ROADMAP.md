# Roadmap: ADHD Needs

## Overview

Build a mobile app that intercepts ADHD cravings and translates them into real underlying needs, fast enough to act on before the impulse wins. Starting with project foundation and app shell, then the core redirect flow, followed by feedback and data persistence, pattern learning, and finally customization and polish. Each phase delivers a usable app — Phase 2 alone is a valid MVP.

## Domain Expertise

None

## Phases

- [x] **Phase 1: Foundation & App Shell** - Expo project, navigation, storage infrastructure, instant-launch shell
- [x] **Phase 2: Core Redirect Flow** - Craving selection → need identification → actionable suggestion
- [x] **Phase 3: Feedback & Persistence** - One-tap feedback, SQLite event logging, persistent history
- [x] **Phase 4: Pattern Learning & Visualization** - Adaptive suggestions, pattern views, "what helped"
- [x] **Phase 5: Customization & Polish** - Manual mapping CRUD, dark mode, UX refinement
- [x] **Phase 6: Adaptive Suggestions** - Feedback-driven suggestion reordering (DATA-05 gap closure)
- [x] **Phase 7: Integration Fixes & Cleanup** - useFocusEffect wiring, custom emoji lookup, dead code removal

## Phase Details

### Phase 1: Foundation & App Shell
**Goal**: Working Expo app with navigation, storage layer (MMKV + SQLite), and instant-launch shell that reaches craving input in under 2 seconds
**Depends on**: Nothing (first phase)
**Requirements**: FLOW-01
**Research**: Unlikely (established Expo patterns)
**Plans**: TBD

Plans:
- [ ] 01-01: TBD

### Phase 2: Core Redirect Flow
**Goal**: Complete craving-to-need redirect interaction — tap a craving, see the real underlying need with an actionable suggestion, all in under 10 seconds
**Depends on**: Phase 1
**Requirements**: FLOW-02, FLOW-03, FLOW-04, FLOW-05, UX-01
**Research**: Likely (default mapping content needs curation)
**Research topics**: Default craving-to-need mappings (~20-30 common ADHD patterns), craving category structure, actionable suggestion content
**Plans**: TBD

Plans:
- [ ] 02-01: TBD
- [ ] 02-02: TBD

### Phase 3: Feedback & Persistence
**Goal**: One-tap "did that help?" feedback after redirects, SQLite event logging for all redirect events, and viewable history log with local data persistence
**Depends on**: Phase 2
**Requirements**: FLOW-06, DATA-01, DATA-02
**Research**: Unlikely (standard SQLite + feedback patterns)
**Plans**: TBD

Plans:
- [ ] 03-01: TBD

### Phase 4: Pattern Learning & Visualization
**Goal**: App adjusts suggestions based on accumulated feedback, users can see their top cravings over time and what suggestions actually helped
**Depends on**: Phase 3
**Requirements**: DATA-03, DATA-04, DATA-05
**Research**: Likely (pattern analysis algorithms)
**Research topics**: Feedback weighting algorithms, time decay for mapping confidence, pattern aggregation queries, chart library choice (react-native-gifted-charts vs Victory Native)
**Plans**: TBD

Plans:
- [ ] 04-01: TBD

### Phase 5: Customization & Polish
**Goal**: Users can add, edit, and delete custom craving-to-need mappings, dark mode support, and final UX polish
**Depends on**: Phase 4
**Requirements**: FLOW-07, FLOW-08, FLOW-09, UX-02
**Research**: Unlikely (standard CRUD + theming patterns)
**Plans**: TBD

Plans:
- [ ] 05-01: TBD

### Phase 6: Adaptive Suggestions
**Goal**: App adjusts mapping suggestions based on accumulated user feedback — reorder/weight suggestions by historical help rate so the most effective need surfaces first
**Depends on**: Phase 3 (feedback data), Phase 4 (stats queries)
**Requirements**: DATA-05
**Gap Closure**: Closes DATA-05 from v1-MILESTONE-AUDIT.md (Plan 04-02 was never executed)
**Research**: Unlikely (feedback aggregation + reordering logic)
**Plans:** 1 plan

Plans:
- [x] 06-01-PLAN.md — Add getCravingFeedbackSummary query + adaptive note UI on result screen

### Phase 7: Integration Fixes & Cleanup
**Goal**: Fix cross-phase wiring issues — custom mappings refresh on home screen focus, custom emoji displays correctly in History/Stats, all list screens use useFocusEffect, remove dead MMKV code
**Depends on**: Phase 5 (custom mappings), Phase 3 (history/stats screens)
**Requirements**: (integration/flow fixes, no new requirements)
**Gap Closure**: Closes 3 integration issues + 1 broken flow from v1-MILESTONE-AUDIT.md

Plans:
- [x] 07-01-PLAN.md — useFocusEffect wiring, custom emoji lookup fix, dead MMKV removal

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4 → 5 → 6 → 7

| Phase | Plans Complete | Status | Completed |
|-------|---------------|--------|-----------|
| 1. Foundation & App Shell | 2/2 | Complete | 2026-03-17 |
| 2. Core Redirect Flow | 2/2 | Complete | 2026-03-17 |
| 3. Feedback & Persistence | 2/2 | Complete | 2026-03-17 |
| 4. Pattern Learning & Visualization | 2/2 | Complete | 2026-03-17 |
| 5. Customization & Polish | 3/3 | Complete | 2026-03-18 |
| 6. Adaptive Suggestions | 1/1 | Complete | 2026-03-19 |
| 7. Integration Fixes & Cleanup | 1/1 | Complete | 2026-03-19 |
