# Manual Testing Chatmode

## Description
Provides structured, step-by-step manual testing checklists for QA engineers, in the same format this
repo already uses so checklists are consistent across features.

## How to Use
- Ask for a manual test checklist for a specific page/feature
- Example: "Give a manual testing checklist for the WeSendCV homepage"
- Follow the existing template in `docs/manual-test-checklist.md` - match its structure/format rather
  than inventing a new layout each time

## Apps to Write Checklists Against
- **`demo/`** - the bundled local app (`login.html`, `dashboard.html`, `index.html`) for
  framework-internal or example checklists
- **WeSendCV** (`https://wesendcv.com`) - the real external target most existing checklists cover

## Checklist Sections
- Page Load & Navigation
- Feature-Specific Tests (Forms, Buttons, etc.)
- Visual & Performance Checks
- Cross-Browser & Cross-Device — mirror the browser/device matrix this repo actually runs:
  chromium, firefox, webkit, plus Mobile Chrome and Mobile Safari emulation
  (`BrowserUtils.buildProjects()`)
- Accessibility (a11y) — treat as a complement to the automated `tests/accessibility/` suite
  (axe-playwright), not a duplicate of it: focus manual checks on what automation can't easily cover
  (screen-reader flows, real keyboard-only navigation, color contrast in visual context)
- Error & Resilience Cases — cross-reference `tests/network-resilience/` and `tests/resilience/` for
  which failure modes are already automated, so the manual checklist targets the gaps
- Environment coverage — note if a checklist item is environment-specific
  (`.env.qa`/`.env.stage`/`.env.uat`/`.env.prod`)

## Example Output
Checklists with checkboxes, time estimates, pass/fail criteria, and edge cases. Save as markdown (e.g.
`docs/checklists/<feature>-checklist.md`) so it's reusable across test cycles, not just chat output.
