# Task 4 Report: Wire carousel into TireModelStage

## Status

Implemented and committed on `feat/model-advantages-carousel`.

Commit: `951393d Wire full-bleed advantages carousel into tire model PDP.`

## Changes

- Moved the model advantages section outside the constrained `pageInner`.
- Added the constrained advantages intro above the full-width `ModelAdvantagesCarousel`.
- Kept the product stage, variants table, documents, and final CTA in their original order.
- Removed the retired advantages grid markup and CSS, including its mobile override.
- Preserved the documents and final CTA heading styles under their own selectors.

## Verification

- `npx tsc --noEmit` — PASS (exit 0).
- IDE diagnostics for both changed files — PASS, no errors.
- Desktop smoke at `/models/tbr/long-haul/dla968` — PASS: full-width carousel, constrained intro, autoplay advance, pause, next arrow, specs and CTA order, and no horizontal overflow.
- Mobile smoke at 390 × 844 — PASS: 390px carousel width, no horizontal overflow, and active slide text remained above the controls.

## Concerns

None within Task 4 scope.

## Review finding fix

- Added the clean-checkout dependencies imported by `TireModelStage`.
- Replaced the legacy model route with the catch-all tire route that mounts `TireModelStage`.
- Kept the route independent of unrelated CMS barrel changes by importing the tire catalog reader directly.
- `npx tsc --noEmit` — PASS (exit 0).
- Staged clean-snapshot check — Task 4 imports typecheck; remaining failures are pre-existing untracked shop dependencies outside Task 4 scope.
- `git show HEAD:src/components/catalog/TireModelStage.tsx` and direct-import `git ls-files` check — PASS.
