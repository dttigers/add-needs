# Project Milestones: ADHD Needs

## v1.1 Suggestion Selection + Quick Launch Widget (Shipped: 2026-03-24)

**Delivered:** Tappable suggestion selection replacing old yes/no/skip feedback, plus an iOS home screen and lock screen widget that deep-links to the craving flow — zero-friction launch from anywhere.

**Phases completed:** 8-9 (2 plans total)

**Key accomplishments:**

- Tappable suggestion cards on result screen — each tap records which specific suggestion helped
- "Other / none of these" fallback for when no suggestion fits
- getSuggestionStats() query ready for future suggestion reordering
- iOS WidgetKit widget (home screen + lock screen) via @bacons/apple-targets
- adhdneeds:// deep-link for instant widget-to-craving launch
- App version bumped to 1.1.0

**Stats:**

- 15 files created/modified (726 insertions, 70 deletions)
- 1,223 lines of TypeScript/Swift (total codebase)
- 2 phases, 2 plans, 4 tasks
- 5 days (2026-03-19 → 2026-03-24)
- 8 commits

**Git range:** `feat(08-01)` → `feat: update app version to 1.1.0`

**What's next:** TBD — user to define v1.2 scope

---

## v1.0 MVP (Shipped: 2026-03-19)

**Delivered:** Complete ADHD craving-to-need redirect app with 13 built-in cravings, custom mapping CRUD, feedback-driven adaptive suggestions, pattern analytics, and dark/light theme — all local-only on device.

**Phases completed:** 1-7 (12 plans total)

**Key accomplishments:**

- Complete craving-to-need redirect flow with 13 built-in cravings and instant-launch shell (<2s to input)
- SQLite-backed event logging with Yes/No/Skip feedback and viewable history with timestamps
- Pattern analytics with top cravings frequency, per-craving help-rate stats, and adaptive suggestion notes
- Custom mapping CRUD — users can add, edit, and delete their own craving→need connections
- System-aware dark/light theme across all 6 screens
- useFocusEffect wiring and integration fixes for reliable cross-screen data refresh

**Stats:**

- 73 files created/modified
- 1,027 lines of TypeScript
- 7 phases, 12 plans
- 3 days from project init to ship (2026-03-17 → 2026-03-19)
- 57 commits

**Git range:** `docs: initialize ADHD Needs` → `docs(07-01): complete integration fixes & cleanup plan`

**What's next:** TBD — user to define v1.1 scope

---
