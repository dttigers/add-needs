# Pitfalls Research: ADHD Craving Redirection App

> Research compiled from developer post-mortems, ADHD community feedback, React Native local-first app experiences, and UX research on cognitive load for neurodivergent users.
>
> Confidence levels: HIGH = well-documented pattern across multiple sources, MEDIUM = reported by multiple developers but less documented, LOW = single-source or inferred from adjacent domains.

---

## Critical Pitfalls

### 1. The "Just One More Feature" Onboarding Trap

**What goes wrong:** Mental health apps front-load configuration, tutorials, or preference-setting before the user can do the one thing they downloaded the app for. For ADHD users, this is fatal — they downloaded it during a moment of motivation that will evaporate in under 60 seconds.

**Why it happens:** Developers want the app to feel "personalized" from the start. Product thinking says "collect preferences early so we can tailor the experience." This is correct for neurotypical users and catastrophically wrong for ADHD users.

**How to avoid:**
- Zero-config first use. The app opens, you tap a craving, you get a redirect. Default mappings handle everything.
- Defer ALL customization to post-use moments ("That helped? Want to adjust this mapping?")
- The onboarding IS the first redirect. No separate flow.
- Test: can a brand-new user complete a redirect in under 10 seconds with zero prior setup? If not, cut scope.

**Warning signs:** Any screen before the core flow. Any "let's set up your profile" step. Any multi-step tutorial.

**Phase to address:** Architecture/design phase. Must be a hard constraint before any code is written.

**Confidence:** HIGH

---

### 2. Building a Tracking App Instead of an Intervention App

**What goes wrong:** The app drifts toward being a habit tracker / journal / data dashboard rather than a real-time intervention tool. Developers (especially those with ADHD) get excited about the pattern-tracking and visualization features because they're more interesting to build. The core redirect flow stays basic while the analytics get elaborate.

**Why it happens:** Tracking features are fun to build and demo well. The redirect flow is deceptively simple — "just show a mapping" — so it feels done early. But the redirect flow IS the product; everything else is supporting infrastructure.

**How to avoid:**
- The redirect flow gets 80% of design iteration time in v1
- Pattern tracking is v1.1 at earliest — after the redirect flow has been used 50+ times by the builder
- Every feature proposal must answer: "Does this make the next redirect faster or more accurate?"
- Set a hard rule: no dashboard/analytics screens until the core loop has been personally validated

**Warning signs:** More code in analytics than in the redirect flow. Builder spending time on charts before using the redirect daily. Users (even the builder) opening the app to "check patterns" but not using it during actual cravings.

**Phase to address:** Planning and every sprint thereafter. Requires ongoing discipline.

**Confidence:** HIGH

---

### 3. Craving Moment UX That Requires Executive Function

**What goes wrong:** The craving input step requires the user to do something that ADHD brains are worst at during a craving: categorize, search, type, or make decisions from long lists. The user is in a low-executive-function state (that's why they're craving) and the app demands high-executive-function interaction.

**Why it happens:** Developers design for their rational self, not their craving self. When you're calmly building the app, typing "impulse buying" into a search bar feels trivial. When you're standing in Target with a cart full of things you don't need, it's impossible.

**How to avoid:**
- Maximum 6-8 craving categories visible at once (Miller's Law, adjusted down for impaired state)
- Large tap targets, no typing required for the primary flow
- Visual/icon-based selection over text-heavy lists
- "I don't know what I'm craving" must be a first-class path, not an error state
- Recent/frequent cravings surface automatically (after enough data)
- Test the flow while genuinely distracted or agitated — simulate the actual use context

**Warning signs:** Any text input field in the primary redirect flow. More than 2 taps to get a redirect. Scrolling required to see options. Small tap targets.

**Phase to address:** Design phase, validated during implementation with real-state testing.

**Confidence:** HIGH

---

### 4. Feedback Loop That Becomes a Chore

**What goes wrong:** The "did this help?" feedback mechanism becomes another task the ADHD brain avoids. Users skip it, data quality collapses, the learning loop never improves, and the app stays stuck on defaults forever. Alternatively, the feedback request comes at the wrong time — right after the redirect when the user has already moved on.

**Why it happens:** Feedback is designed as a separate step rather than being woven into natural app usage. The timing assumption is wrong: developers think users will reflect immediately after trying a redirect, but ADHD users have already context-switched.

**How to avoid:**
- Feedback prompt appears on NEXT app open, not immediately after redirect ("Last time you were craving X, we suggested Y. Did that land?")
- Make feedback one tap: thumbs up / thumbs down. No text. No scales.
- Missing feedback is not failure — the system must work without it and improve with it
- After 3 skipped feedback prompts in a row, reduce frequency (respect the pattern)
- Consider implicit feedback: if the user picks the same craving repeatedly with the same redirect, it's probably not working

**Warning signs:** Feedback completion rate below 30%. Multi-step feedback forms. Required feedback before moving on. No fallback for missing feedback data.

**Phase to address:** Design phase for the interaction model, implementation phase for the adaptive frequency.

**Confidence:** HIGH

---

### 5. Shame-Inducing Data Patterns

**What goes wrong:** The pattern tracking feature inadvertently becomes a record of "failures" — how many times you craved, how often the redirect didn't help, streaks of unhealthy patterns. For ADHD users who already struggle with shame and rejection sensitivity (RSD), this turns the app into something they avoid opening.

**Why it happens:** Tracking UX defaults to quantified-self patterns designed for neurotypical goal-setters. Streak counters, frequency graphs, and "you craved X 47 times this week" are motivating for some people and devastating for others.

**How to avoid:**
- Frame ALL data as neutral information, never as success/failure
- No streak counters. No "days since" metrics. No red/green color coding on frequency.
- Show patterns as "your brain tends to do X when Y" rather than "you failed at Z"
- Emphasize what DID help: "Movement worked 4 out of 5 times when you craved sugar"
- Consider: does the user even need to see frequency data? What action would they take with it?
- Let the user choose to see detailed data rather than surfacing it by default

**Warning signs:** Any use of the word "streak." Red/negative coloring on high-frequency cravings. Comparisons to previous time periods ("you craved more this week"). Any metric that could be interpreted as a score.

**Phase to address:** Design phase for data visualization, ongoing UX review.

**Confidence:** HIGH

---

## Technical Debt Patterns

### Local-First Data Model Mistakes

**Pattern:** Starting with a simple key-value store or flat JSON and hitting walls when you need relational queries (e.g., "show me all times movement helped when I craved sugar on weekday evenings").

**Prevention:**
- Use a structured local database from day one (SQLite via expo-sqlite or WatermelonDB, not AsyncStorage for anything beyond settings)
- AsyncStorage is fine for preferences/settings. It is NOT a database — do not store craving logs there
- Design the schema for the queries you'll need in pattern tracking, even if you're not building pattern tracking yet
- Include timestamps, craving category, suggested need, actual need (if different), and feedback in every log entry
- Plan for schema migrations from the start — the data model WILL change

**Confidence:** HIGH

### React Native Navigation Performance Debt

**Pattern:** Using deep navigation stacks or tab-based navigation that adds transition time to the critical path. For a "10 seconds to redirect" requirement, every 200ms of navigation animation matters.

**Prevention:**
- The redirect flow should be a single screen with state transitions, not a multi-screen navigation flow
- Avoid nested navigators in the critical path
- If using React Navigation, pre-load screens that are in the critical path
- Measure time-to-interactive on a real device (not simulator) — simulators are misleadingly fast

**Confidence:** MEDIUM

### Premature Abstraction of Mapping Logic

**Pattern:** Building an elaborate, configurable mapping engine before validating that the default mappings are even useful. The mapping logic becomes over-engineered while the actual content (which craving maps to which need) remains unvalidated.

**Prevention:**
- Start with hardcoded mappings in a simple data file. Not a rules engine. Not a configurable system.
- The "engine" is a lookup. Craving -> [possible needs, ranked by default then by user feedback].
- Add complexity only when you have data showing the simple approach fails
- The mapping CONTENT matters 100x more than the mapping ARCHITECTURE in v1

**Confidence:** HIGH

---

## Integration Gotchas

### Expo/React Native Version Lock-in

**Problem:** Pinning to an Expo SDK version and then finding a critical library (SQLite, notifications) doesn't support it. Or upgrading Expo breaks native modules.

**Prevention:**
- Use Expo managed workflow if possible — it handles most native module compatibility
- Check that expo-sqlite (or your chosen DB) is compatible with your SDK version BEFORE starting
- Pin dependency versions explicitly; don't use `^` ranges for native-touching packages
- Budget a full day for Expo SDK upgrades — they're never as smooth as the changelog suggests

**Confidence:** MEDIUM

### Notification/Reminder Timing

**Problem:** If you add "check in" reminders or craving-time notifications later, the notification APIs on iOS and Android behave very differently. iOS notification scheduling has quirks with local notifications, and Android notification channels add complexity.

**Prevention:**
- Don't build notifications in v1. The app should be pull-based (user opens it when craving), not push-based.
- If/when you add notifications, use expo-notifications and test on BOTH platforms with the app backgrounded and killed
- Be aware that iOS limits local notification scheduling to 64 pending notifications

**Confidence:** MEDIUM

---

## Performance Traps

### Cold Start Time

**The 10-second requirement starts at app open, not at render.** Cold start on React Native can be 1-3 seconds on older devices. If you have a splash screen, heavy initialization, or eager data loading, you've burned half your budget before the user sees anything.

**Prevention:**
- Measure cold start time on a mid-range physical device regularly
- Lazy-load everything except the craving selection screen
- No network requests at startup (you're local-only, but watch for analytics SDKs or crash reporters that phone home)
- Keep the JS bundle small: audit dependencies monthly. Libraries like moment.js or lodash can add 500KB+ that you don't need
- Use Hermes engine (default in modern Expo/RN) — it significantly improves cold start

**Confidence:** HIGH

### SQLite Query Performance on Large Datasets

After months of daily use, craving logs can grow to thousands of entries. Unindexed queries for pattern analysis will become noticeably slow.

**Prevention:**
- Add indexes on timestamp, craving_category, and feedback columns from the start
- For pattern queries, consider pre-computing aggregates daily rather than querying raw logs every time
- Test with 1000+ synthetic entries during development, not just 5

**Confidence:** MEDIUM

### Animation Jank in the Redirect Flow

React Native animations using the JS thread will jank during state transitions. The redirect flow must feel instant and fluid.

**Prevention:**
- Use `react-native-reanimated` for any animations in the critical path (runs on UI thread)
- Avoid layout animations that trigger re-renders during the redirect flow
- Test on a low-end Android device — iPhone performance is misleading for Android users

**Confidence:** MEDIUM

---

## Security Mistakes

### Local Data Isn't Automatically Private

**Problem:** Local-only doesn't mean secure. On Android, app data can be accessible via backup, USB debugging, or if the device is rooted. Mental health data is sensitive — craving logs could reveal substance use patterns, compulsive behaviors, etc.

**Prevention:**
- Use encrypted storage for craving logs (expo-secure-store for small data, SQLCipher for the database)
- Disable Android backup for the app's data directory in app.json/AndroidManifest
- Don't log craving data to console in production builds
- Consider: if someone picks up the unlocked phone, can they see the craving history immediately? Should there be an app-level lock option (even if not v1)?

**Confidence:** HIGH

### Analytics SDK Data Leakage

**Problem:** Even without accounts/cloud sync, if you add crash reporting or analytics (Sentry, Firebase Crashlytics), craving data can leak into breadcrumbs, error contexts, or event properties.

**Prevention:**
- If using any analytics/crash reporting, explicitly scrub craving-related data from all payloads
- Better: don't add analytics in v1. You're the only user. You'll know if it crashes.
- Review any third-party SDK's default data collection behavior before including it

**Confidence:** MEDIUM

---

## UX Pitfalls (ADHD-Specific)

This is the highest-risk area for this project. These patterns come from ADHD community feedback on apps like Finch, Bearable, Habitica, and various habit trackers.

### Pitfall: The Paradox of Choice in Need Suggestions

**What happens:** The app suggests 5+ possible "real needs" for a craving, and the ADHD user — already in a low-executive-function state — now has to evaluate and choose between abstract concepts like "rest," "connection," "stimulation," and "accomplishment." They freeze, close the app, and follow the craving.

**Fix:** Show ONE best-guess need first, with a clear "not this — show me others" escape. Reduce decision load to yes/no rather than pick-from-list.

**Confidence:** HIGH

### Pitfall: Text-Heavy Explanations

**What happens:** The redirect screen explains WHY the mapping exists ("Research suggests that craving sugar often indicates..."). The ADHD user's eyes glaze over at any paragraph during a craving moment. This information is genuinely useful — but not at this moment.

**Fix:** The redirect screen is visual and actionable, not educational. Explanations go in a separate "learn more" section accessible when the user is calm and curious, never during the redirect flow.

**Confidence:** HIGH

### Pitfall: Inconsistent Visual Hierarchy

**What happens:** Every screen looks slightly different. Buttons move around. The craving selection screen has a different layout than the need suggestion screen. For ADHD users, spatial consistency is a major cognitive anchor — if things move, each use requires re-orientation, which adds friction.

**Fix:** The redirect flow should be spatially consistent: same screen areas for same functions every time. Primary actions always in the same position. Navigation elements don't shift between states.

**Confidence:** HIGH

### Pitfall: No "Escape Hatch" for the Wrong Moment

**What happens:** User opens the app but realizes they can't engage right now (someone's talking to them, they're driving, they're too agitated). There's no way to "bookmark" the craving for later without going through the full flow. They close the app and never come back to it.

**Fix:** A single "save for later" button that logs the timestamp and maybe a one-tap craving category. "I'm craving something but can't deal with it now" is a valid interaction. Process it on the next calm open.

**Confidence:** MEDIUM

### Pitfall: Gamification That Backfires

**What happens:** Points, badges, streaks, levels. These work for some neurotypical habit apps. For ADHD users, they create a dopamine dependency on the reward system itself, and a single broken streak triggers shame spiraling and app abandonment. Habitica's forums and Reddit are full of ADHD users describing this exact pattern.

**Fix:** No gamification elements in v1. If added later, make them opt-in and framed as observations ("You've been checking in regularly!") rather than achievements that can be lost.

**Confidence:** HIGH

### Pitfall: Notification Fatigue Leading to App Deletion

**What happens:** Reminder notifications feel helpful when configured but become noise within a week. ADHD brains are especially prone to "notification blindness" — they stop registering the notification entirely, and eventually the accumulated annoyance triggers app deletion.

**Fix:** No push notifications in v1. The app is used when the user remembers they're craving, not when the app tells them to check in. If notifications are added later, they must be adaptive (reduce frequency if dismissed repeatedly) and never guilt-inducing.

**Confidence:** HIGH

### Pitfall: Overwhelming Settings/Customization

**What happens:** The app offers extensive customization (custom categories, custom mappings, notification schedules, theme colors, data export formats). The ADHD user opens Settings once, gets overwhelmed, leaves everything on defaults, and never returns. Or worse, they spend 2 hours hyperfocusing on customization and never actually use the core feature.

**Fix:** Settings screen has maximum 5-7 options in v1. Customization happens through USE (feedback loops, adjusted mappings), not through configuration screens. The app learns from behavior, not from preferences.

**Confidence:** HIGH

---

## "Looks Done But Isn't" Checklist

These items commonly appear finished during development but cause real problems in actual use:

- [ ] **Tested during a real craving** — not just in development mode while calm. The builder must use the app during actual craving moments at least 10 times before considering the redirect flow "done."
- [ ] **Cold start measured on real device** — simulators hide 1-2 seconds of real startup time. Time it with a stopwatch on a physical phone.
- [ ] **Works one-handed** — can the full redirect flow be completed with one thumb? Test with both left and right hand.
- [ ] **Works in bright sunlight** — if the app is opened outdoors (walking to the store to impulse buy), is it readable?
- [ ] **Works when phone is on low battery mode** — iOS throttles CPU, which affects animation performance and cold start.
- [ ] **"I don't know" path is complete** — user can't name their craving. Does the app still help? This is a common ADHD state.
- [ ] **Data survives app updates** — local database persists through app updates without data loss. Test this explicitly.
- [ ] **Database migration path exists** — when (not if) the schema changes, existing user data migrates cleanly.
- [ ] **Feedback loop actually changes behavior** — does thumbs-down on a suggestion actually affect what's shown next time? Test the full cycle, not just the UI.
- [ ] **App doesn't become slower over time** — after 500+ logged cravings, is performance the same as day one?
- [ ] **Accessibility basics** — VoiceOver/TalkBack don't break the redirect flow. Font scaling doesn't break layout.
- [ ] **Background/foreground transitions** — app state is preserved when switching away and back. ADHD users WILL get distracted mid-flow.

---

## Recovery Strategies

### If the app feels slow to open
1. Profile with Flipper or React Native's built-in profiler
2. Check that Hermes is enabled
3. Audit imports — dynamic import anything not needed on first screen
4. Check for synchronous storage reads at startup

### If users (including you) stop using the app
1. The redirect flow probably takes too long or requires too much thought
2. Reduce the flow to its absolute minimum: tap craving -> see need -> done
3. Remove any steps that were added "because they'd be nice"
4. Ask yourself: when was the last time I WANTED to open this during a craving? If never, the value prop isn't landing.

### If the mappings feel wrong/unhelpful
1. This is expected — default mappings are population-level guesses
2. The feedback loop is the fix, but only if it's frictionless enough to actually use
3. Consider letting the user directly edit a mapping in-context ("This isn't right — when I crave X, I usually need ___")
4. Don't over-rotate on mapping accuracy too early; getting the user to pause and reflect IS the intervention, even if the specific suggestion is wrong

### If pattern tracking data is overwhelming
1. Show less, not more. Collapse to the single most actionable insight.
2. "When you crave [X], [Y] usually helps" is the only pattern that matters in v1
3. Remove time-series graphs if they're not driving behavior change

### If the codebase becomes hard to change
1. The app has very few features — if the code is already complex, abstractions were premature
2. Flatten component hierarchies. Remove state management libraries if you can use React Context.
3. For a single-user local app, you likely don't need Redux, MobX, or Zustand. useState + useContext is sufficient until it's provably not.

---

## Pitfall-to-Phase Mapping

| Phase | Critical Pitfalls | Priority |
|-------|------------------|----------|
| **Architecture/Design** | Zero-config onboarding, single-screen redirect flow, spatial consistency, one-handed use, no gamification | P0 |
| **Data Model** | SQLite over AsyncStorage, schema designed for pattern queries, migration support, encrypted storage | P0 |
| **Implementation (Core)** | One suggestion at a time (not choice overload), large tap targets, no text-heavy screens, "I don't know" path | P0 |
| **Implementation (Feedback)** | One-tap feedback, deferred to next open, adaptive frequency, works without feedback | P1 |
| **Implementation (Tracking)** | Neutral framing (no shame), minimal default view, actionable insights only | P1 |
| **Testing** | Real-craving testing, cold start measurement, one-handed test, 500+ entry performance test | P0 |
| **Post-Launch** | Watch for app abandonment, notification fatigue (if added), customization overwhelm, data leakage | P1 |
| **Ongoing** | Resist feature creep toward tracking/analytics, keep redirect flow under 10 seconds, don't add steps | P0 |

---

## Key Takeaway

The single most important lesson from failed ADHD apps: **the app must be usable in the user's worst executive-function state, not their best.** Every design decision should be tested against the question: "Would I use this when I'm already losing the fight against a craving?" If the answer is "only if I'm feeling motivated," the design has failed — because ADHD users are never feeling motivated when they need this app the most.

---

*Research compiled: 2026-03-17*
*Confidence note: All findings are based on established patterns from developer communities, ADHD user feedback forums, React Native ecosystem experience, and UX research. Items marked LOW confidence are explicitly noted. Most findings are HIGH confidence based on well-documented, repeatedly observed patterns.*
