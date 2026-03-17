# Feature Research: ADHD Craving Redirection App

> Research compiled from knowledge of existing apps and mental health UX patterns.
> **WebSearch was unavailable** — all findings are based on training knowledge (pre-2025). Confidence levels reflect this limitation.
> Last updated: 2026-03-17

---

## Competitor Feature Analysis

### ADHD-Specific Apps

| App | Core Function | Key Features | Relevance to ADHD Needs |
|-----|--------------|--------------|------------------------|
| **Tiimo** | Visual daily planner | Visual timers, routine builder, sensory-friendly UI, widget support | High — proves ADHD users need speed + visual simplicity |
| **Routinery** | Morning/evening routines | Step-by-step routine cards, time estimates per step, streaks | Medium — routine structure, but no craving/impulse handling |
| **Finch** | Self-care pet companion | Gentle check-ins, mood logging, micro-goals, gamification via virtual pet | Medium — emotional awareness angle, low-pressure interaction model |
| **Focusmate** | Body doubling | Video accountability sessions, scheduling | Low — productivity focus, not self-awareness |
| **Inflow** | ADHD coaching/education | CBT-based modules, habit tracking, community | Medium — educational framing of ADHD patterns |

**Confidence: MEDIUM** — Based on app knowledge through early 2025; feature sets may have evolved.

### Mood/Habit Tracking Apps

| App | Core Function | Key Features | Relevance |
|-----|--------------|--------------|-----------|
| **Daylio** | Micro-diary / mood tracker | Tap-based mood entry (no typing), activity tagging, pattern charts, streaks | HIGH — proves zero-friction logging works; pattern visualization model |
| **Bearable** | Health/symptom correlator | Multi-factor tracking (mood, symptoms, meds, sleep), correlation insights | Medium — correlation engine concept, but too complex for impulse moments |
| **Pixels** | Year-in-pixels mood grid | Single daily mood entry, visual year overview | Low — too simple, but the "one action" model is relevant |
| **I Am Sober** | Addiction/craving tracker | Craving log, timer since last use, motivation notes, milestone celebrations | HIGH — closest to craving-tracking; proves craving-specific UX exists |
| **Grounded** | Substance use tracker | Craving intensity scale, trigger identification, time-based patterns | HIGH — craving + trigger mapping is very close to our need-mapping concept |

**Confidence: MEDIUM** — Feature lists based on pre-2025 knowledge.

### Key Takeaway from Competitors

**No app combines craving interception with real-time need translation.** Addiction apps track cravings but don't redirect to underlying needs. ADHD apps handle routines/productivity but ignore impulse moments. Mood trackers log after the fact but don't intervene in real-time. The gap is clear: **in-the-moment craving-to-need translation is unoccupied territory.**

**Confidence: MEDIUM** — Based on broad app landscape knowledge; a niche app doing exactly this may exist.

---

## Table Stakes Features

These are features users expect from any mobile self-tracking / mental health app. Skipping these creates friction or abandonment.

| Feature | Complexity | Why It's Expected | Notes for ADHD Needs |
|---------|-----------|-------------------|---------------------|
| **Fast app launch to core action** | LOW | Every mental health app optimizes first-screen-to-action. Users abandon slow apps. | CRITICAL — 10-second constraint means this IS the product |
| **Tap-based input (minimal typing)** | LOW | Daylio proved mood tracking works with taps, not text. ADHD users especially resist typing. | Pre-built craving list with tap selection |
| **Local data persistence** | LOW | Users expect their data to survive app closes/restarts | Already in constraints — SQLite or AsyncStorage |
| **Basic history/log view** | LOW | Users expect to see past entries in chronological order | Simple list of past craving-to-need redirects |
| **Dark mode support** | LOW | Standard expectation for any modern mobile app, especially one used impulsively (often at night) | Use system theme detection |
| **Haptic/visual feedback on actions** | LOW | Users need confirmation that taps registered; especially important for impulsive interaction | Subtle haptics on selection, visual state changes |
| **Offline functionality** | LOW | Local-first means this is automatic, but users expect it explicitly | Already covered by local-only architecture |
| **Onboarding (minimal)** | MEDIUM | Users need to understand the concept — "craving != real need" — but ADHD users won't sit through slides | 1-2 screens max, skippable, or inline first-use guidance |

**Confidence: HIGH** — These are well-established UX expectations across the mobile app ecosystem.

---

## Differentiators (Competitive Advantage)

These are features that would make ADHD Needs stand apart. Not all are MVP.

| Feature | Complexity | Why It Differentiates | Priority |
|---------|-----------|----------------------|----------|
| **Craving-to-need translation engine** | MEDIUM | No competitor does this. The core concept IS the differentiator. | MVP-critical |
| **Sub-10-second full interaction** | LOW | Most apps optimize for engagement/time-in-app. Optimizing for speed-to-exit is contrarian and correct for ADHD. | MVP-critical |
| **"Did that help?" feedback loop** | LOW | Closes the learning loop. Addiction apps track but don't learn. This refines the mapping over time. | MVP-critical |
| **Personal pattern learning** | MEDIUM | Mappings improve per-person over time. No competitor adapts craving responses to individual patterns. | v1.x |
| **Time-of-day / context awareness** | MEDIUM | "You crave sugar at 3pm — you're probably tired" is more useful than generic mapping. Requires enough data first. | v1.x |
| **Manual mapping editor** | LOW | Power-user feature: "I know that when I want X, I actually need Y." Unique self-knowledge tool. | MVP |
| **Pattern visualization** | MEDIUM | Show "your top cravings this week" and "what actually helped" — insight generation | v1.x |
| **Actionable suggestions** | LOW | After identifying the real need, suggest a concrete action: "Drink water," "Take a 5-min walk," "Set a 20-min timer" | MVP |

**Confidence: HIGH** — Differentiation assessment based on clear gap analysis.

---

## Anti-Features (Commonly Requested but Problematic)

Features that sound good but actively harm the product, especially for ADHD users.

| Anti-Feature | Why It Seems Good | Why It's Harmful | Recommendation |
|-------------|-------------------|-----------------|----------------|
| **Streaks / daily check-in requirements** | Drives engagement in habit apps (Duolingo, Daylio) | ADHD users WILL break streaks, then feel shame, then abandon the app entirely. Streak-shame is a known ADHD pain point. | NEVER add streaks. If tracking consistency, use "times used this week" without penalty framing. |
| **Notifications / reminders to log** | Standard engagement tool | Cravings are unpredictable — reminding someone to "check in" when they're not craving is noise. ADHD users are notification-overwhelmed already. | Only notify if user explicitly sets a reminder. Default: zero notifications. |
| **Social sharing / community** | Works for recovery apps (AA model) | Adds complexity, moderation burden, and shame risk. Out of scope per PROJECT.md. Personal tool first. | Out of scope for all foreseeable versions. |
| **Gamification (points, levels, badges)** | Drives engagement in Finch, Habitica | Adds dopamine-seeking ON TOP of a dopamine-regulation tool. Ironic and counterproductive. Can become the craving itself. | Avoid entirely. The reward is self-awareness, not points. |
| **AI-generated analysis / chatbot** | Trendy, impressive-sounding | Unpredictable responses in vulnerable moments. Liability risk. Slow (API calls break 10-second constraint). Already out of scope. | Out of scope. Mapping-based approach is faster and more reliable. |
| **Detailed journaling / free-text entry** | "Express your feelings" | ADHD users won't write paragraphs in a craving moment. Friction kills the tool. | Tap-only for core flow. Optional short notes at most. |
| **Complex data export / analytics** | Power users want it | Premature complexity. Build it when there's data worth exporting. | v2+ at earliest |
| **Onboarding tutorial longer than 30 seconds** | "Users need to understand the app" | ADHD users will skip it or uninstall. The app should be self-evident. | Inline contextual hints, not a tutorial flow |
| **Account creation / sign-up** | Standard app pattern | Friction barrier at the worst moment (first open). Local-only means no account needed. | No accounts in v1. Ever. |

**Confidence: HIGH** — Anti-features are well-documented in ADHD UX literature and lived experience communities.

---

## Feature Dependencies

```
[App Shell / Navigation]
    |
    v
[Craving Input Screen] --- tap-select from list
    |
    v
[Need Translation Engine] --- default mappings (JSON/static data)
    |                    \
    |                     +--- [Manual Mapping Editor] (can exist independently)
    v
[Result Screen] --- shows identified need + suggested action
    |
    v
[Feedback Prompt] --- "Did that help?" (yes/no/skip)
    |
    v
[Local Data Store] --- stores: craving, suggested need, feedback, timestamp
    |
    +---> [History Log] --- chronological list of past redirects
    |
    +---> [Pattern Visualization] --- requires sufficient stored data
    |
    +---> [Personal Pattern Learning] --- adjusts mappings based on feedback history
```

### Dependency Rules
- **Nothing depends on Pattern Visualization** — it's a read-only view of stored data
- **Feedback loop feeds Personal Pattern Learning** — learning requires feedback data to exist
- **Manual Mapping Editor is independent** — can be built/used without feedback loop
- **Core flow (Input -> Translation -> Result -> Feedback) is one linear pipeline** — ship this as a unit

---

## MVP Definition

### v1: Ship This (1-2 weeks target)

The absolute minimum to be useful for personal craving redirection.

| Feature | Complexity | Rationale |
|---------|-----------|-----------|
| Craving input via tap selection | LOW | Core interaction — list of ~10-15 common ADHD cravings |
| Default craving-to-need mappings | LOW | Static JSON data, ~20-30 mappings covering common patterns |
| Need result screen with suggested action | LOW | Show the identified need + 1-2 concrete actions to try |
| "Did that help?" feedback (yes/no) | LOW | Single tap after result; stored locally |
| Local data persistence | LOW | SQLite or AsyncStorage — store each interaction |
| Basic history log | LOW | Scrollable list of past redirects with timestamps |

**Total estimated complexity: LOW-MEDIUM. This is achievable in a focused sprint.**

### v1.x: Learn and Refine (weeks 3-6)

| Feature | Complexity | Rationale |
|---------|-----------|-----------|
| Manual mapping editor | LOW | Add/edit/delete personal craving-to-need mappings |
| Personal pattern learning | MEDIUM | Adjust mapping weights based on accumulated feedback |
| Pattern visualization (basic) | MEDIUM | "Your top cravings this week" + "What helped most" |
| Time-of-day context | MEDIUM | Tag interactions with time; surface patterns like "afternoon sugar = fatigue" |
| Dark mode | LOW | System theme detection |

### v2+: Expand If Validated (month 2+)

| Feature | Complexity | Rationale |
|---------|-----------|-----------|
| Widget / quick-launch | MEDIUM | Skip app open entirely — craving input from home screen |
| Custom craving categories | LOW | Beyond the defaults — user defines their own craving types |
| Data export | LOW | CSV export of history for personal analysis |
| Apple Watch / wearable | HIGH | Even faster access, but significant platform work |
| Shareable mapping packs | MEDIUM | Let others benefit from your learned mappings (anonymized) |

---

## Feature Prioritization Matrix

Scored on two axes: **Impact on core value** (1-5) and **Implementation effort** (1-5, where 1 = easy).

| Feature | Impact | Effort | Score (Impact/Effort) | Ship When |
|---------|--------|--------|----------------------|-----------|
| Craving tap input | 5 | 1 | 5.0 | v1 |
| Default mappings | 5 | 1 | 5.0 | v1 |
| Need result + action | 5 | 1 | 5.0 | v1 |
| Feedback prompt | 4 | 1 | 4.0 | v1 |
| Local persistence | 4 | 1 | 4.0 | v1 |
| History log | 3 | 1 | 3.0 | v1 |
| Manual mapping editor | 3 | 2 | 1.5 | v1.x |
| Pattern learning | 4 | 3 | 1.3 | v1.x |
| Pattern visualization | 3 | 3 | 1.0 | v1.x |
| Time-of-day context | 3 | 2 | 1.5 | v1.x |
| Dark mode | 2 | 1 | 2.0 | v1.x |
| Home screen widget | 3 | 3 | 1.0 | v2+ |
| Data export | 1 | 1 | 1.0 | v2+ |
| Wearable support | 2 | 5 | 0.4 | v2+ |

---

## UX Patterns That Work for ADHD Users

Based on patterns observed in successful ADHD and mental health apps:

1. **Reduce to one action per screen.** Tiimo and Routinery both succeed by showing one step at a time. Never present a dashboard as the first screen.

2. **Use large tap targets.** Minimum 48x48pt, ideally larger. ADHD users tap impulsively and inaccurately when distracted.

3. **Muted, calming color palette.** Avoid high-contrast attention-grabbing UI. The user is already overstimulated. Finch uses pastels for a reason.

4. **No loading spinners.** If the app can't respond instantly, it loses the craving moment. All computation must be local and synchronous.

5. **Progressive disclosure.** Show the minimum needed at each step. History, settings, and patterns are secondary screens, not cluttering the core flow.

6. **Forgiving interaction model.** Easy undo, back navigation, no "are you sure?" confirmations that add friction. Let users make mistakes cheaply.

7. **Time-to-value under 5 seconds.** First-time user should be able to complete one craving redirect within seconds of opening, with zero setup.

**Confidence: HIGH** — Based on established mobile UX principles and ADHD-specific design guidance.

---

## Key Risks and Open Questions

| Question | Impact | How to Resolve |
|----------|--------|---------------|
| Are ~15 default cravings enough to cover most moments? | HIGH | Start with 15, add based on personal use. Can always expand. |
| Will users (self included) actually tap "did that help?" after acting on the suggestion? | HIGH | Make it frictionless (single tap). Accept low response rates. Even partial feedback has value. |
| Is a static mapping good enough, or does the value require personalization? | MEDIUM | Ship static first. If it helps even once, it's validated. Personalization is enhancement, not requirement. |
| React Native vs. Flutter vs. native? | MEDIUM | Covered in tech research, not feature research. Both can meet the UX constraints. |
| How to handle "none of these match my craving"? | MEDIUM | Include "Other" option + free-text fallback. Use this input to discover missing mappings. |

---

## Sources and Confidence Summary

| Source Type | Confidence | Notes |
|------------|-----------|-------|
| App feature analysis (Daylio, Bearable, Tiimo, etc.) | MEDIUM | Based on pre-2025 training knowledge. Features may have changed. WebSearch was unavailable for verification. |
| ADHD UX patterns | HIGH | Well-established in design literature and ADHD community discussions |
| Anti-feature analysis | HIGH | Consistent across ADHD user feedback, app reviews, and UX research |
| Competitive gap analysis | MEDIUM | A niche competitor may exist that wasn't found. The broad landscape assessment is sound. |
| MVP prioritization | HIGH | Directly derived from PROJECT.md constraints and first-principles analysis |

---

*This document should be re-validated with live web research when WebSearch access is available. Key searches to run: "ADHD craving redirection app 2026", "craving tracking app features", "ADHD app UX research 2025 2026".*
