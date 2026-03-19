# ADHD Needs

## What This Is

A mobile app that helps people with ADHD recognize what they actually need when their brain sends misleading cravings or urges. Tap a craving, see the real underlying need with actionable suggestions, track what actually helps, and build custom mappings over time — all in under 10 seconds from launch.

## Core Value

In-the-moment clarity: translate misdirected ADHD cravings into the real underlying need, fast enough to act on before the impulse wins.

## Requirements

### Validated

- ✓ Quick redirect flow — tap a craving, see the real need with suggestions in under 10 seconds — v1.0
- ✓ Default craving-to-need mappings — 13 common ADHD patterns (stimulants, impulse buying, doomscrolling, THC, etc.) — v1.0
- ✓ Feedback loop — Yes/No/Skip after each redirect, drives adaptive suggestion notes — v1.0
- ✓ Manual mapping — users can add, edit, and delete custom craving→need connections — v1.0
- ✓ Pattern tracking — top cravings frequency, per-craving help-rate stats with bar charts — v1.0
- ✓ Mobile-first phone app — Expo/React Native, instant launch, one-handed, minimal friction — v1.0

### Active

(None — all v1.0 requirements validated. Next milestone will define new requirements.)

### Out of Scope

- Multi-user/social features — building for personal use first, sharing comes later
- Web app — phone-first; browser version is a future consideration, not v1
- Clinical/medical advice — this is a self-awareness tool, not a diagnostic or treatment tool
- AI-generated need detection — start with mapping-based approach, not open-ended AI interpretation
- Offline mode — app works locally already; cloud sync is future scope

## Context

Shipped v1.0 with 1,027 LOC TypeScript across 73 files.
Tech stack: Expo (React Native), expo-router (Stack navigation), expo-sqlite (sync), TypeScript strict mode.
All data stored locally on device via SQLite. No accounts, no cloud, no async on launch.
Builder (Jameson) has ADHD and is the primary user — direct lived experience informs design decisions.

## Constraints

- **Platform**: Expo / React Native — runs on phone via Expo Go or dev build
- **UX**: Must be usable in under 10 seconds from open to redirect — competing with an impulse
- **Data**: All user data stored locally on device — no accounts or cloud sync for v1
- **Content**: Default mappings labeled as common patterns, not medical advice

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Phone app, not web | Cravings happen away from desk; phone is always accessible | ✓ Good |
| Hybrid mapping approach (defaults + feedback + manual) | Science is limited and individual; defaults get you started, personalization makes it accurate | ✓ Good |
| Build for self first | Nail the UX through lived experience before designing for others | ✓ Good |
| Local-only data storage | Simplicity for v1; no auth/backend complexity | ✓ Good |
| Stack navigation (no tabs) | Linear craving → result flow matches mental model | ✓ Good |
| TypeScript strict mode from start | Catches bugs early; zero errors always | ✓ Good |
| Zero async on mount | Instant launch — no loading states competing with impulse | ✓ Good |
| Sync SQLite only (runSync/getAllSync) | Simplicity; no async/await complexity in storage layer | ✓ Good |
| Module-level SQLite table init | No explicit setup calls; tables ready at import time | ✓ Good |
| useFocusEffect on all data screens | Reliable data refresh on navigation return | ✓ Good |
| Single screen for add + edit mappings | Reduces code duplication; id param drives mode | ✓ Good |
| System-aware dark/light theme | Respects user preference via useColorScheme() | ✓ Good |

---
*Last updated: 2026-03-19 after v1.0 milestone*
