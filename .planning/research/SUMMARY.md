# Project Research Summary

**Project:** ADHD Needs
**Domain:** Mental health / ADHD self-awareness mobile app (craving redirection)
**Researched:** 2026-03-17
**Confidence:** HIGH

## Executive Summary

ADHD Needs occupies uncharted territory: no existing app combines craving interception with real-time need translation. Addiction apps (I Am Sober, Grounded) track cravings but don't redirect to underlying needs. ADHD apps (Tiimo, Routinery) handle routines but ignore impulse moments. Mood trackers (Daylio, Bearable) log after the fact but don't intervene in real-time. The gap is clear and the concept is strong.

The recommended stack is Expo (managed workflow) with Zustand for state, a two-layer local storage approach (MMKV for fast key-value data, SQLite for queryable event logs), NativeWind for styling, and Expo Router for navigation. This stack is well-established, minimizes build complexity for a solo developer, and supports the critical <10-second interaction constraint through synchronous reads and local-only data.

The biggest risk isn't technical — it's UX. Every pitfall documented in this research traces back to one principle: **the app must be usable in the user's worst executive-function state, not their best.** Zero-config onboarding, one-suggestion-at-a-time results, one-tap feedback, no gamification, no shame-inducing metrics. Speed is the feature; the app should optimize for getting the user OUT fast, not keeping them IN.

## Key Findings

### Recommended Stack

Expo managed workflow with React Native provides the fastest path to a cross-platform app with minimal build complexity. The two-layer storage architecture (MMKV + SQLite) is the critical technical decision — MMKV provides synchronous sub-millisecond reads for UI state, while SQLite handles structured event data for pattern tracking queries.

**Core technologies:**
- **Expo SDK ~52 + React Native 0.84:** Framework — managed workflow eliminates build complexity for solo dev
- **Zustand ~5.x:** State management — tiny, no boilerplate, built-in persist middleware pairs with MMKV
- **react-native-mmkv ~3.x:** Key-value storage — 30x faster than AsyncStorage, synchronous reads (no flash of empty state)
- **expo-sqlite ~15.x:** Structured database — queryable event logs for pattern tracking, zero extra native deps
- **Expo Router ~4.x:** Navigation — file-based routing, typed routes, deep linking
- **NativeWind ~4.x:** Styling — Tailwind CSS compiled to native StyleSheet, fast iteration
- **react-native-reanimated ~3.x:** Animations — 60fps native thread animations for fluid redirect flow

### Expected Features

**Must have (table stakes):**
- Fast app launch to core action (zero-config first use)
- Tap-based craving input (no typing required)
- Default craving-to-need mappings (~20-30 covering common ADHD patterns)
- Need result screen with actionable suggestion
- "Did that help?" one-tap feedback
- Local data persistence
- Basic history log

**Should have (competitive):**
- Manual mapping editor (add/edit personal craving-to-need connections)
- Personal pattern learning (adjust mappings based on accumulated feedback)
- Pattern visualization ("your top cravings this week" + "what actually helped")
- Time-of-day context awareness
- Dark mode

**Defer (v2+):**
- Home screen widget / quick-launch
- Data export
- Wearable support
- Shareable mapping packs

### Architecture Approach

A simple three-layer architecture: Expo Router screens at the top, Zustand stores in the middle, and a dual storage layer (MMKV + SQLite) at the bottom. The redirect flow engine is the core business logic — isolated as a lightweight state machine (plain reducer, not XState) so it's testable without React.

**Major components:**
1. **Redirect Flow Engine** — state machine managing craving input → guided exploration → need identification → feedback
2. **Mapping Store** — Zustand + MMKV holding default + user-customized craving→need mappings
3. **Event Logger** — SQLite recording each redirect event for pattern analysis
4. **Pattern Analyzer** — SQL queries aggregating events into time-based patterns

### Critical Pitfalls

1. **Onboarding that blocks first use** — any setup step before the first redirect is fatal for ADHD users. Zero-config first use is non-negotiable. The onboarding IS the first redirect.

2. **Building a tracker instead of an intervention tool** — the redirect flow IS the product, not the analytics. Pattern tracking is v1.1 at earliest. Every feature must answer: "Does this make the next redirect faster or more accurate?"

3. **Requiring executive function during cravings** — max 6-8 craving categories visible, large tap targets, show ONE need suggestion (not five), "I don't know" must be a first-class path. Design for the craving self, not the calm self.

4. **Feedback loop becoming a chore** — one-tap thumbs up/down, deferred to next app open, adaptive frequency if repeatedly skipped. System must work without feedback and improve with it.

5. **Shame-inducing data patterns** — no streaks, no red/green scoring, no "days since" metrics. Frame all data as neutral observation: "Movement worked 4/5 times when you craved sugar."

## Implications for Roadmap

Based on research, suggested phase structure:

### Phase 1: Project Setup + Core Flow
**Rationale:** The redirect flow is the entire product. Everything else is supporting infrastructure. Ship the minimum loop first: tap craving → see need → done.
**Delivers:** Working Expo app with craving selection, default mappings, and need result screen
**Addresses:** Table stakes features (fast launch, tap input, default mappings, result screen)
**Avoids:** Onboarding trap (zero-config first use), executive function overload (limited choices, large targets)

### Phase 2: Feedback + Data Foundation
**Rationale:** The learning loop requires persistent data and a feedback mechanism. Build the data layer and feedback prompt together so events are logged from day one.
**Delivers:** SQLite event logging, one-tap feedback prompt, history log
**Addresses:** Feedback loop, local persistence, basic history
**Avoids:** Feedback becoming a chore (one-tap, adaptive), building tracker before intervention is validated

### Phase 3: Pattern Learning + Visualization
**Rationale:** Only build analytics after the core flow has been personally validated through real use. Requires accumulated data from Phase 2.
**Delivers:** Personal pattern learning (mapping weight adjustment), basic pattern visualization
**Addresses:** Differentiator features (pattern learning, time-of-day context)
**Avoids:** Shame-inducing data (neutral framing, actionable insights only), premature tracking focus

### Phase 4: Polish + Personal Use Refinement
**Rationale:** Refinement based on real daily use. Manual mapping editor, dark mode, UX polish based on craving-state testing.
**Delivers:** Manual mapping CRUD, dark mode, refined UX, accessibility basics
**Addresses:** Power-user features, visual polish, one-handed use validation
**Avoids:** Overwhelming settings (max 5-7 options), customization hyperfocus trap

### Phase Ordering Rationale

- **Phase 1 before 2:** Can't collect feedback without a working redirect flow
- **Phase 2 before 3:** Pattern analysis requires accumulated event data
- **Phase 3 before 4:** Understanding usage patterns informs what polish matters most
- **Core principle:** Each phase should produce a usable app. Phase 1 alone is a valid MVP.

### Research Flags

Phases likely needing deeper research during planning:
- **Phase 1:** Default craving-to-need mapping content — the actual data that populates the app. Needs careful curation, not just technical implementation.
- **Phase 3:** Pattern analysis algorithms — how to weight feedback, time decay, confidence scoring for personalized suggestions.

Phases with standard patterns (skip research-phase):
- **Phase 2:** SQLite + feedback prompt — well-documented patterns, straightforward implementation.
- **Phase 4:** CRUD editor + dark mode — standard React Native patterns.

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | Expo + Zustand + MMKV + SQLite is well-established consensus for local-first RN apps |
| Features | HIGH | Gap analysis is clear; MVP scope is tight and well-defined |
| Architecture | HIGH | Standard patterns for small local-first apps; nothing exotic |
| Pitfalls | HIGH | ADHD-specific UX pitfalls are well-documented in community feedback |

**Overall confidence:** HIGH

### Gaps to Address

- **Default mapping content:** The actual craving-to-need mappings need curation during Phase 1 planning. This is domain content, not technical architecture.
- **Chart library choice:** react-native-gifted-charts vs. Victory Native should be evaluated during Phase 3. MEDIUM confidence on the pick.
- **Single-screen vs. multi-screen redirect flow:** Both approaches are viable. Should be tested during Phase 1 implementation. Architecture research recommends trying single-screen first for speed.
- **Version numbers:** Some library versions are approximate (based on early 2025 knowledge). Verify with `npm view` before installing.

## Sources

### Primary (HIGH confidence)
- React Native 0.84 confirmed via reactnative.dev
- Expo documentation (docs.expo.dev) — Expo as recommended RN framework
- Zustand, MMKV, expo-sqlite — established libraries with strong community consensus
- ADHD UX patterns — consistent across community feedback, app reviews, and design literature

### Secondary (MEDIUM confidence)
- Competitor app analysis (Daylio, Bearable, Tiimo, I Am Sober, Grounded) — based on pre-2025 training knowledge
- NativeWind v4, Expo Router v4 — specific versions may have incremented
- Chart library recommendations — react-native-gifted-charts needs evaluation during implementation

### Tertiary (LOW confidence)
- Expo SDK exact version number (~52) — verify at project start
- react-native-mmkv exact version — verify with npm view

---
*Research completed: 2026-03-17*
*Ready for roadmap: yes*
