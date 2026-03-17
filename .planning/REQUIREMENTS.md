# Requirements: ADHD Needs

**Defined:** 2026-03-17
**Core Value:** In-the-moment clarity — translate misdirected ADHD cravings into the real underlying need, fast enough to act on before the impulse wins.

## v1 Requirements

Requirements for initial release. Each maps to roadmap phases.

### Core Redirect Flow

- [ ] **FLOW-01**: User can launch app and reach craving input in under 2 seconds with zero setup on first use
- [ ] **FLOW-02**: User can select a craving from a tap-based list of ~10-15 common ADHD cravings without typing
- [ ] **FLOW-03**: App translates selected craving to an underlying need using default mappings (~20-30 common patterns)
- [ ] **FLOW-04**: User sees the identified real need with 1-2 concrete actionable suggestions
- [ ] **FLOW-05**: Full interaction (open → craving → need → done) completes in under 10 seconds
- [ ] **FLOW-06**: After seeing result, user can give one-tap feedback ("did that help?" yes/no/skip)
- [ ] **FLOW-07**: User can add custom craving-to-need mappings
- [ ] **FLOW-08**: User can edit existing craving-to-need mappings
- [ ] **FLOW-09**: User can delete custom craving-to-need mappings

### Data & Persistence

- [ ] **DATA-01**: All user data persists locally on device across app closes and restarts
- [ ] **DATA-02**: User can view chronological history of past craving redirects with timestamps
- [ ] **DATA-03**: User can see pattern visualization of top cravings over a time period
- [ ] **DATA-04**: User can see what suggestions actually helped most often
- [ ] **DATA-05**: App adjusts mapping suggestions based on accumulated user feedback

### Onboarding & UX

- [ ] **UX-01**: First-time user understands the concept (craving ≠ real need) through minimal inline guidance without blocking first use
- [ ] **UX-02**: App supports dark mode via system theme detection

## v2 Requirements

Deferred to future release. Tracked but not in current roadmap.

### Context & Intelligence

- **CTX-01**: App surfaces time-of-day patterns (e.g., "afternoon sugar = fatigue")

### UX Polish

- **UXP-01**: App provides haptic/visual feedback on tap actions

## Out of Scope

Explicitly excluded. Documented to prevent scope creep.

| Feature | Reason |
|---------|--------|
| Streaks / daily check-ins | Shame spiral risk — ADHD users break streaks then abandon app |
| Push notifications | ADHD users are already notification-overwhelmed; cravings are unpredictable |
| Gamification (points, badges, levels) | Adds dopamine-seeking to a dopamine-regulation tool — counterproductive |
| Social sharing / community | Complexity + moderation burden + shame risk; personal tool first |
| AI chatbot / generated analysis | Slow (breaks 10-sec constraint), unpredictable, liability risk |
| Detailed journaling / free-text | Friction kills the tool in craving moments |
| Account creation / sign-up | Unnecessary friction barrier; local-only means no account needed |
| Home screen widget | Defer to v2+ — useful but not core |
| Data export | Premature — build when there's data worth exporting |
| Wearable support | High effort, defer to v2+ |
| Web app | Phone-first per PROJECT.md constraints |

## Traceability

Which phases cover which requirements. Updated by create-roadmap.

| Requirement | Phase | Status |
|-------------|-------|--------|
| FLOW-01 | Phase 1 | Pending |
| FLOW-02 | Phase 2 | Pending |
| FLOW-03 | Phase 2 | Pending |
| FLOW-04 | Phase 2 | Pending |
| FLOW-05 | Phase 2 | Pending |
| FLOW-06 | Phase 3 | Pending |
| FLOW-07 | Phase 5 | Pending |
| FLOW-08 | Phase 5 | Pending |
| FLOW-09 | Phase 5 | Pending |
| DATA-01 | Phase 3 | Pending |
| DATA-02 | Phase 3 | Pending |
| DATA-03 | Phase 4 | Pending |
| DATA-04 | Phase 4 | Pending |
| DATA-05 | Phase 4 | Pending |
| UX-01 | Phase 2 | Pending |
| UX-02 | Phase 5 | Pending |

**Coverage:**
- v1 requirements: 16 total
- Mapped to phases: 16
- Unmapped: 0 ✓

---
*Requirements defined: 2026-03-17*
*Last updated: 2026-03-17 after initial definition*
