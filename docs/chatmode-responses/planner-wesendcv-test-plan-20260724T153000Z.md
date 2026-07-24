# Planner Agent Response — WeSendCV Test Plan

Timestamp: 2026-07-24T15:30:00Z

## Objective
Create a comprehensive, maintainable Playwright regression suite for the public WeSendCV website at https://wesendcv.com.

## Scope
### In-scope
- Homepage rendering and core messaging
- Navigation and footer link integrity
- Country/service selection flow
- Resume order entry flow
- Account login flow
- Mobile and responsive coverage
- Accessibility baseline validation

### Out of scope
- Billing/payment gateway processing
- Live operational fulfillment workflows
- Internal admin-only functions

## Coverage Strategy
### Priority levels
- P0: homepage, country selection, resume distribution entry flow
- P1: login flow, navigation, accessibility
- P2: footer policy pages, network resilience

## Recommended POM Structure
- `WeSendCVPage`
- `CountrySelectionPage`
- `CheckoutPage`
- `AccountPage`

## High-value scenarios
1. Homepage loads and shows the hero section and CTA
2. Navigation links remain reachable
3. Country selection route opens the expected product page
4. Resume distribution flow advances without broken steps
5. Invalid login shows the expected error state
6. Mobile project smoke passes on Pixel 5 / iPhone 12 emulation

## Repo placement
- `tests/wesendcv/` for site-specific specs
- `tests/mobile/` for mobile-specific validation
- `tests/accessibility/` for a11y runs
- `tests/network-resilience/` for live-site resilience checks

## Notes
- Use `getByRole` / `getByLabel` / `getByText` selectors only
- Keep selector logic in page objects
- Assert in the spec or `ValidationHelpers`
