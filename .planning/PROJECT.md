# ADHD Needs

## What This Is

A mobile app that helps people with ADHD recognize what they actually need when their brain sends misleading cravings or urges. You tell it what you're craving, it guides you to the real underlying need, and over time it learns your personal patterns to build lasting self-awareness.

## Core Value

In-the-moment clarity: translate misdirected ADHD cravings into the real underlying need, fast enough to act on before the impulse wins.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Quick redirect flow — user inputs a craving, app guides them to the real need through a short interactive process
- [ ] Default craving-to-need mappings based on common ADHD patterns (stimulants → food/sleep/movement, impulse buying → dopamine/novelty/accomplishment, doomscrolling → rest/connection/stimulation, and more)
- [ ] Feedback loop — after a redirect, ask "did that help?" to refine future suggestions
- [ ] Manual mapping — users can add, edit, and remove their own craving → real need connections
- [ ] Pattern tracking — visualize personal craving patterns over time (what, when, what actually helped)
- [ ] Mobile-first phone app — accessible in the moment, one-handed, minimal friction

### Out of Scope

- Multi-user/social features — building for personal use first, sharing comes later
- Web app — phone-first; browser version is a future consideration, not v1
- Clinical/medical advice — this is a self-awareness tool, not a diagnostic or treatment tool
- AI-generated need detection — start with mapping-based approach, not open-ended AI interpretation

## Context

- The science on ADHD craving redirection is limited; most mappings are experiential rather than research-backed
- Common ADHD patterns exist across individuals (e.g., stimulant cravings often mask hunger or fatigue) but the specifics vary person to person
- The app needs to work in a moment of impulse — speed and simplicity are critical; if it takes too long, the craving wins
- Builder (Jameson) has ADHD and is the primary user — direct lived experience informs design decisions
- Craving categories include but aren't limited to: stimulants, impulse buying, doomscrolling/phone addiction, sugar/junk food, procrastination behaviors, restlessness/fidgeting

## Constraints

- **Platform**: React Native or equivalent cross-platform mobile framework — needs to run on phone
- **UX**: Must be usable in under 10 seconds from open to redirect — competing with an impulse
- **Data**: All user data stored locally on device — no accounts or cloud sync for v1
- **Content**: Default mappings must be clearly labeled as common patterns, not medical advice

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Phone app, not web | Cravings happen away from desk; phone is always accessible | — Pending |
| Hybrid mapping approach (defaults + feedback + manual) | Science is limited and individual; defaults get you started, personalization makes it accurate | — Pending |
| Build for self first | Nail the UX through lived experience before designing for others | — Pending |
| Local-only data storage | Simplicity for v1; no auth/backend complexity | — Pending |

---
*Last updated: 2026-03-17 after initialization*
