# Technology Stack Research

**Research date**: 2026-03-17
**Domain**: ADHD self-awareness / craving redirection mobile app
**Constraints**: React Native, local-only data, cross-platform (iOS + Android), usable in <10 seconds

## Research Methodology

- React Native 0.84 confirmed as current stable via reactnative.dev (HIGH confidence)
- All other version numbers based on npm registry knowledge and ecosystem tracking through early 2025
- Versions marked with `~` are approximate and should be verified with `npm view <package> version` before installing
- Confidence levels: HIGH = official docs / widely confirmed, MEDIUM = strong community consensus, LOW = extrapolated or uncertain

---

## Recommended Stack

### Framework: Expo (managed workflow)

**Recommendation: Expo SDK ~52** (confidence: MEDIUM on exact version; HIGH on Expo as the right choice)

| Factor | Expo (Managed) | Bare React Native |
|--------|----------------|-------------------|
| Setup time | Minutes | Hours |
| OTA updates | Built-in (EAS Update) | Manual |
| Native modules | Expo Modules API + dev client | Full control |
| Build service | EAS Build (cloud) | Local Xcode/Android Studio |
| Maintenance burden | Low | High |
| Ejection needed? | Rarely with modern Expo | N/A |

**Why Expo for this project:**
- Local-only app with no exotic native modules needed
- Solo developer -- minimize infrastructure/build complexity
- Expo Router provides file-based routing out of the box
- `expo-sqlite` and `expo-secure-store` cover local storage needs natively
- Dev client allows custom native modules if ever needed without ejecting

**Source**: https://docs.expo.dev -- Expo has been the officially recommended way to start React Native projects since React Native 0.74+ docs updated their guidance.

---

## Core Technologies

| Category | Library | Version | Confidence | Rationale |
|----------|---------|---------|------------|-----------|
| **Runtime** | React Native | 0.84.x | HIGH | Current stable (confirmed via reactnative.dev) |
| **Framework** | Expo SDK | ~52 | MEDIUM | Latest stable SDK; bundles RN, build tools, and native APIs |
| **Router** | Expo Router | ~4.x | MEDIUM | File-based routing, deep linking, typed routes; built on React Navigation |
| **State (app)** | Zustand | ~5.x | MEDIUM | Minimal boilerplate, great React Native support, built-in persist middleware |
| **State (persist)** | react-native-mmkv | ~3.x | MEDIUM | Fastest key-value store for RN; 30x faster than AsyncStorage |
| **Database** | expo-sqlite | ~15.x | MEDIUM | SQLite via Expo's native module; no extra native deps needed |
| **Styling** | NativeWind | ~4.x | MEDIUM | Tailwind CSS for React Native; compiles to StyleSheet at build time |
| **Animations** | react-native-reanimated | ~3.x | HIGH | Industry standard for 60fps native animations in RN |
| **Gestures** | react-native-gesture-handler | ~2.x | HIGH | Required for navigation; native gesture system |
| **Haptics** | expo-haptics | ~13.x | LOW | Tactile feedback for craving redirect confirmations |
| **TypeScript** | TypeScript | ~5.5+ | HIGH | Included in Expo template; non-negotiable for maintainability |

---

## Supporting Libraries

| Category | Library | Version | Confidence | Purpose |
|----------|---------|---------|------------|---------|
| **Icons** | @expo/vector-icons | (bundled) | HIGH | Icon set included with Expo |
| **Date/time** | date-fns | ~4.x | HIGH | Lightweight date utilities for pattern tracking timestamps |
| **Charts** | react-native-gifted-charts | ~1.x | MEDIUM | Pattern visualization; pure JS, no native deps |
| **Secure storage** | expo-secure-store | (bundled) | HIGH | Encrypted key-value for any sensitive user preferences |
| **Testing** | Jest + React Native Testing Library | ~29.x / ~12.x | HIGH | Standard RN testing stack |
| **Linting** | ESLint + Prettier | ~9.x / ~3.x | HIGH | Code quality; Expo template includes config |
| **UUID generation** | expo-crypto | (bundled) | HIGH | `randomUUID()` for record IDs without extra deps |

---

## Development Tools

| Tool | Version | Confidence | Purpose |
|------|---------|------------|---------|
| **Node.js** | 20 LTS or 22 LTS | HIGH | Runtime; Expo requires Node 18+ |
| **Expo CLI** | (bundled with expo) | HIGH | `npx expo start`, `npx expo prebuild` |
| **EAS CLI** | ~13.x | MEDIUM | Build and submit to app stores |
| **Expo Go** | Latest | HIGH | Quick testing on physical device (limited to Expo SDK APIs) |
| **Expo Dev Client** | (via expo-dev-client) | HIGH | Custom dev client if native modules are added |
| **VS Code** | Latest | HIGH | With Expo Tools extension |

---

## Architecture Decisions

### State Management: Zustand (not Redux, not Jotai)

**Why Zustand:**
- Tiny bundle (~1KB), no provider wrapping needed
- Built-in `persist` middleware connects directly to MMKV for instant state hydration
- Perfect for small-to-medium apps; this app has maybe 5-8 stores max
- Selector-based renders prevent unnecessary re-renders (critical for <10s UX)

**Why not Redux Toolkit:**
- Overkill for a local-only app with no server state
- More boilerplate (slices, reducers, actions) for no benefit at this scale
- RTK Query is its main selling point, irrelevant here (no API calls)

**Why not Jotai:**
- Excellent library, but atom-based model is better for apps with lots of independent reactive state
- Zustand's store model maps more naturally to this app's domains (cravings store, settings store, history store)
- Zustand has more mature persist middleware with MMKV integration

### Local Database: expo-sqlite (not WatermelonDB, not Realm)

**Why expo-sqlite:**
- Zero additional native dependencies when using Expo
- SQLite is the most battle-tested embedded database in existence
- Perfect for structured data: craving logs, need mappings, feedback history
- Supports WAL mode for fast reads during writes
- `expo-sqlite` v14+ uses the new synchronous JSI-based API (fast)
- Can use Drizzle ORM on top for type-safe queries if desired

**Why not WatermelonDB:**
- Built on SQLite anyway, adds abstraction layer
- Main value is sync -- irrelevant for local-only v1
- More complex setup, harder to debug
- Overkill for this data model

**Why not Realm:**
- MongoDB acquired Realm, future uncertain (they announced device sync deprecation)
- Heavier runtime than raw SQLite
- Proprietary data format, harder to export/migrate
- Confidence: LOW -- Realm's long-term trajectory is unclear as of early 2025

### Key-Value Storage: react-native-mmkv (not AsyncStorage)

**Why MMKV:**
- 30x faster than AsyncStorage in benchmarks (synchronous native calls via JSI)
- Perfect for: user preferences, Zustand state persistence, cached UI state
- Written by WeChat team (Tencent), battle-tested at massive scale
- Synchronous API means state is available on first render (no flash of empty state)

**Why not AsyncStorage:**
- Asynchronous only -- causes flash-of-default-state on app open
- Slower reads/writes
- Being deprecated in favor of community alternatives

### Styling: NativeWind (not Tamagui, not StyleSheet)

**Why NativeWind:**
- Tailwind utility classes work the same as web -- huge ecosystem of patterns
- v4 compiles to native StyleSheet objects (no runtime overhead)
- Excellent dark mode support via CSS variables
- One-handed UI requires rapid iteration on spacing/sizing; utility classes excel here

**Why not Tamagui:**
- More opinionated component library; heavier setup
- Better suited for apps that need a full design system from day one
- NativeWind is more flexible for a custom UX (this app needs a unique feel, not a generic UI kit)

**Why not raw StyleSheet:**
- Verbose for rapid prototyping
- No design token system without building one manually
- Fine for production optimization later; NativeWind compiles down to it anyway

### Navigation: Expo Router (not React Navigation directly)

**Why Expo Router:**
- File-based routing (like Next.js) -- drop a file in `app/`, it's a route
- Built on React Navigation under the hood -- full access to stack/tab navigators
- Deep linking for free
- Typed routes with TypeScript
- Perfect for this app's simple navigation: home -> craving input -> need result -> feedback

---

## Data Architecture (for expo-sqlite)

```
Tables:
  cravings          -- id, label, category, created_at
  needs             -- id, label, category, description, created_at
  mappings          -- id, craving_id, need_id, is_default, confidence_score, created_at
  redirect_log      -- id, craving_id, suggested_need_id, accepted, feedback, timestamp
  user_preferences  -- key, value (stored in MMKV instead, but could be here)
```

MMKV handles: theme preference, onboarding state, last-used craving, Zustand store snapshots.
SQLite handles: all structured relational data (craving history, mappings, feedback logs).

---

## What NOT to Use

| Technology | Why Not |
|------------|---------|
| **AsyncStorage** | Deprecated trajectory; synchronous MMKV is strictly better |
| **Redux / Redux Toolkit** | Overkill for local-only app with no server state |
| **Realm** | Uncertain future post-MongoDB acquisition; proprietary format |
| **Firebase** | Cloud-first; contradicts local-only constraint |
| **Supabase / Appwrite** | Backend services; not needed for v1 |
| **React Native CLI (bare)** | Extra maintenance burden with no benefit for this app |
| **Styled Components** | Runtime overhead; NativeWind compiles away |
| **MobX** | Less ecosystem momentum than Zustand; more magic |
| **WatermelonDB** | Sync-focused; adds complexity without sync benefit |
| **React Native Paper / UI Kitten** | Generic Material/Eva design; this app needs custom UX for speed |

---

## Installation Commands

```bash
# Initialize project
npx create-expo-app@latest adhd-needs --template tabs

# Core dependencies
npx expo install expo-sqlite react-native-mmkv
npx expo install react-native-reanimated react-native-gesture-handler

# State management
npm install zustand

# Styling
npm install nativewind tailwindcss

# Utilities
npx expo install expo-haptics expo-secure-store expo-crypto
npm install date-fns

# Charts (for pattern tracking)
npm install react-native-gifted-charts react-native-linear-gradient react-native-svg

# Dev dependencies
npm install -D @types/react @testing-library/react-native jest-expo
```

Note: `npx expo install` ensures version compatibility with the current Expo SDK. Always prefer it over `npm install` for Expo-compatible packages.

---

## New Architecture Consideration

React Native's "New Architecture" (Fabric renderer + TurboModules) is enabled by default starting in RN 0.76+. As of RN 0.84:
- Expo SDK 52+ supports the New Architecture
- Most major libraries (Reanimated, Gesture Handler, MMKV) have been updated
- **Recommendation**: Use New Architecture (default) -- no reason to opt out for a new project

**Confidence**: MEDIUM -- New Architecture compatibility across the full recommended stack should be verified during project setup.

---

## Version Verification Checklist

Before starting development, run these commands to confirm latest versions:

```bash
npm view expo version
npm view react-native version
npm view zustand version
npm view react-native-mmkv version
npm view nativewind version
npm view expo-sqlite version
npm view expo-router version
npm view react-native-reanimated version
```

All version numbers in this document prefixed with `~` are estimates based on ecosystem knowledge through early 2025 and one confirmed web lookup (React Native 0.84). Verify before pinning.

---

## Sources

- https://reactnative.dev/docs/getting-started -- React Native 0.84 confirmed (HIGH)
- https://docs.expo.dev -- Expo as recommended RN framework (HIGH, not fetched this session)
- https://github.com/pmndrs/zustand -- Zustand state management (HIGH, from training knowledge)
- https://github.com/mrousavy/react-native-mmkv -- MMKV key-value storage (HIGH, from training knowledge)
- https://docs.expo.dev/versions/latest/sdk/sqlite/ -- expo-sqlite docs (MEDIUM, not fetched)
- https://www.nativewind.dev -- NativeWind styling (MEDIUM, not fetched)
- https://expo.github.io/router -- Expo Router docs (MEDIUM, not fetched)
- General React Native ecosystem knowledge through May 2025 training data (MEDIUM)

---

*Note: WebSearch and most WebFetch calls were denied during this research session. Version numbers should be verified via `npm view` before implementation. Core architectural recommendations (Expo + Zustand + MMKV + expo-sqlite + NativeWind) reflect strong community consensus as of early 2025 and are HIGH confidence directionally, even if exact version numbers may have incremented.*
