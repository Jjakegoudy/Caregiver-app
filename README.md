# Caregiver App

A second-brain app for parents and caregivers of special needs kids —
starting with autism, **nationwide from day one**. Free tier that genuinely
helps immediately; a $9/mo tier powered by an AI engine.

**Governing philosophy: Traction, not friction.** Every screen, feature,
and line of code exists to remove friction for an exhausted, overwhelmed
parent — never to add a menu, a decision, or a delay.

## The five tabs

| Tab | Function | Tier |
| --- | --- | --- |
| **Journal** (home) | Massive central mic button, chronological voice logs | Free |
| **Briefcase** | AI dossiers, IEP/paperwork decoder, State Navigator | $9/mo |
| **Library** | The 30-chapter manuscript, browsable and indexed | Free, forever |
| **Compass** | Activity Finder — sensory load, cost, age filters | Free |
| **Board** | Classifieds, stories, structured AI-checked replies | Free |

## Running it on your phone

1. Install [Node.js](https://nodejs.org) and the **Expo Go** app on your
   phone.
2. In this folder: `npm install`, then `npx expo start`.
3. Scan the QR code with your phone's camera and open it in Expo Go.

## Wiring the backend (Build Order, Step 1)

1. Create a project at [supabase.com](https://supabase.com).
2. In the Supabase dashboard: **Database → Extensions** → enable `vector`.
3. Open the **SQL Editor**, paste in `supabase/schema.sql`, and run it.
4. Enable Google and Apple sign-in under **Authentication → Providers**.
5. Copy `.env.example` to `.env` and fill in the URL and anon key from
   **Settings → API**.

Until those credentials exist, the app runs fully on-device: onboarding,
theming, and all five tabs work so the chassis can be verified on a real
phone first (Milestone 1).

## Project layout

```
app/                  Screens (expo-router file-based routing)
  onboarding.tsx      3-field soft onboarding → lands on the Journal
  (tabs)/             The five-tab navigation
components/           Shared UI (Screen, Header, PrimaryButton, …)
lib/
  theme.tsx           Dark-default red-shifted palette + light toggle
  supabase.ts         Backend client (reads .env)
  profile.ts          On-device profile store
  zip-to-state.ts     Zip → state resolution (the "nationwide" switch)
state-configs/        One JSON per state — adding a state is never a code change
supabase/schema.sql   Full Postgres schema + row-level security
```

## Build status (per the Build Order)

- [x] **Phase 1 — The Frame & The Engine**: Expo chassis, five-tab nav,
      dark/light toggle, 3-field onboarding, Supabase schema + client
      (provisioning the actual Supabase project is a dashboard task — see
      above).
- [ ] **Phase 2 — Voice to text + the Library** (mic → Whisper → Journal;
      import the manuscript)
- [ ] **Phase 3 — The Triangulation Matrix** (tagging, embeddings,
      pattern detection, TTS)
- [ ] **Phase 4 — Paid tier** (Optical Parser, dossiers, State Navigator)
- [ ] **Phase 5 — Community** (Tips, Activity Finder, structured replies)
- [ ] **Phase 6 — Monetization** (sponsored row, affiliates, paywall)

## Guardrails (non-negotiable)

- **No medical diagnoses, ever.** Pattern detection only ever says "this
  overlaps with signs of [Condition] — you may want to ask your clinician
  about screening."
- The authoritative Library is **visually protected** — community content
  never wears its styling.
- Sponsored partners are **boxed, labeled, and segregated** — never inside
  organic results.
- Every community reply passes a civility + substance check before it
  posts.
