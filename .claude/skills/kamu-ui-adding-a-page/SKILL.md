---
name: kamu-ui-adding-a-page
description: Step-by-step procedure for adding a new page, tab or settings section to Kamu Web UI end to end — URL constants, route and lazy loading, guard, resolver, GraphQL documents and api methods, domain service, component, mocks, harness and specs, feature flag. Use when a task introduces a new routed screen rather than changing an existing one.
---

# Adding A Page

A routed screen touches every layer. Work through the steps in order; each step names the skill
to load before editing and what proves it done. Skip steps that do not apply (a static page has
no GraphQL), but decide that explicitly.

| # | Step | Files | Load | Proven by |
|---|---|---|---|---|
| 1 | URL segment and params | `src/app/project-links.ts` (`URL_*`, `URL_PARAM_*`) | `kamu-ui-routing` | Constants used by the route and by `NavigationService`; no string literals |
| 2 | Decide lazy vs eager, and where the route hangs | the parent `*-routing.ts` | `kamu-ui-routing` | Written reason if eager |
| 3 | GraphQL documents | `src/app/api/gql/<domain>/*.graphql` (+ fragments) | `kamu-ui-graphql-api` | `npm run gql-codegen` succeeds; interface regenerated |
| 4 | Api methods | `src/app/api/<domain>.api.ts` | `kamu-ui-graphql-api` | Methods return operation data types |
| 5 | Response fixtures + api specs | `src/app/api/mock/<domain>.mock.ts`, `<domain>.api.spec.ts` | `kamu-ui-unit-tests` | `npm test -- --include src/app/api/<domain>.api.spec.ts` passes |
| 6 | Domain service (when state or mapping is needed) | `<feature>/<name>.service.ts` + spec | `kamu-ui-angular-style` | Spec passes |
| 7 | Resolver and key | `<feature>/resolver/<name>.resolver.ts`, `RoutingResolvers` | `kamu-ui-routing` | Resolver spec passes |
| 8 | Guard (when access differs from the parent) | functional `CanActivateFn` | `kamu-ui-routing` | Guard spec passes |
| 9 | Component | `.component.ts/.html/.scss`, resolver value as `@Input(RoutingResolvers.KEY)` | `kamu-ui-angular-style` | OnPush, `data-test-id` on everything a test touches |
| 10 | Routes | new `<feature>-routing.ts` with `loadChildren`, or `loadComponent` | `kamu-ui-routing` | `npm run build-prod` lists the new lazy chunk; initial chunks unchanged |
| 11 | Harness and component spec | `<name>.harness.ts` for reusable form or composite parts, `<name>.component.spec.ts` | `kamu-ui-unit-tests` | Spec passes |
| 12 | Navigation entry | `NavigationService` method, links or menu item | `kamu-ui-angular-style` | Reachable from the UI |
| 13 | Feature flag (unfinished or staged features) | `appFeatureFlag` on the entry point | `kamu-ui-angular-style` | Hidden when the flag is off |
| 14 | Hand-back validation | — | — | `npm run lint`, `npm run stylelint`, `npm test`, `npm run build-prod` all green |

## Traps

- **Codegen before code.** Writing the api class before running codegen means guessing
  generated names; run step 3 first.
- **A static import in the parent routes file** (a constant, an enum, a type with runtime
  value) pulls the new feature into the parent chunk. Keep shared constants in the new
  feature's own files, or in `common/` when other features need them.
- **Tab pages** follow the tab pattern (empty-path redirect, `data[URL_PARAM_TAB]`, active-tab
  resolver) — copy the closest existing tab set rather than inventing a new one.
- **Anonymous access.** Phase-2 routes are reachable anonymously when the runtime config allows
  it; anything needing a login needs `AuthenticatedGuard` explicitly.

## What lives elsewhere

Every step's rules live in the skill named in its row; this skill owns only the order.
