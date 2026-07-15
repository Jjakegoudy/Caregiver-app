# State Navigator Configs

**One file per state (plus DC). Adding a state never touches app code.**

This folder is how "nationwide from day one" actually works (spec §4.4 and
§7.3). The app resolves the family's state from their zip code
(`lib/zip-to-state.ts`) and loads `<STATE_CODE>.json` from this folder.
Medicaid/HCBS waiver stages, agency names, deadlines, and document types
all differ by state — so each state gets its own file rather than being
forced into one template.

## How to add a state

1. Copy `_template.json` to `<STATE_CODE>.json` (e.g. `OH.json`).
2. Fill in every field **from official state agency sources only** —
   record each source URL in `sources`.
3. Set `"verified": true` and `"last_reviewed"` to today's date only after
   a human has checked every fact against the listed sources.
4. That's it. No code changes.

## Build order

Per the build book: build and fully test **one** state's config first —
whichever state you personally know best or can most easily verify — then
use that file as the template every other state is copied from.
Replicating to all fifty states is Phase 6-and-beyond work, not a launch
blocker.

## Rules

- `verified: false` configs are never shown to parents. The app falls
  back gracefully ("Your state's roadmap is being verified") instead of
  showing unchecked information.
- No config file may contain medical advice — pipeline stages, agencies,
  documents, and timelines only.
- EVV (Electronic Visit Verification) tracking is deferred to a later
  release and deliberately absent from the template.
