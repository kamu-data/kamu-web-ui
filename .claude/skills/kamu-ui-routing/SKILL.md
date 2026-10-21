---
name: kamu-ui-routing
description: Angular routing in Kamu Web UI and the lazy bundle structure it defines — the three route phases in app-routing.ts, per-feature *-routing.ts files loaded with loadChildren, loadComponent pages, when a route may stay eager, guards, resolver functions bound to component inputs, tab routes, ProjectLinks and RoutingResolvers constants, and proving the chunk split with a production build. Use before adding, moving or changing any route, guard wiring, resolver key or URL constant.
---

# Kamu UI Routing

Routes decide how the app is split into JavaScript bundles: everything a route file imports
statically lands in that file's chunk, and every `loadChildren` / `loadComponent` starts a new
lazy chunk. A misplaced static import can pull a heavy feature (Monaco, lineage graphs, PDF
viewer, wallet SDKs) into the initial bundle that every visitor downloads. Treat routing changes
as bundle changes.

## The route tree

`src/main.ts` registers routes in three phases, in this order:

| Phase | Defined in `src/app/app-routing.ts` | Holds |
|---|---|---|
| 1 | `PUBLIC_ROUTES` (passed to `provideRouter`) | Home redirect, login, GitHub callback, return-to-CLI, not-found pages — reachable by anyone |
| 2 | `ANONYMOUS_GUARDED_ROUTES` via `provideConditionalGuardedRoutes()` | Everything else; wrapped in `forbidAnonymousAccessGuardFn` unless the runtime config sets `allowAnonymous` |
| 3 | `provideCatchAllRoute()` | `**` → `PageNotFoundComponent`; must stay last |

Router features in `main.ts`: `withComponentInputBinding()` (route data and resolver results
arrive as component inputs), `onSameUrlNavigation: "reload"`, and `KamuUrlSerializer`, which
masks dots in account and dataset names so they survive as single path segments.

Inside phase 2, features hang off `:accountName` and `:accountName/:datasetName`, each through
its own routes file:

| Routes file | Exported constant |
|---|---|
| `account/additional-components/account-select-routing.ts` | `ACCOUNT_SELECT_ROUTES` |
| `account/settings/account-settings-routing.ts` | `ACCOUNT_SETTINGS_ROUTES` |
| `dataset-view/dataset-view-routing.ts` | `DATASET_VIEW_ROUTES` |
| `dataset-view/additional-components/metadata-component/metadata.routing.ts` | `METADATA_ROUTES` |
| `…/metadata-component/components/source-events/source-events-routing.ts` | `SOURCE_EVENTS_ROUTES` |
| `…/dataset-settings-component/dataset-settings-routing.ts` | `DATASET_SETTINGS_ROUTES` |
| `…/dataset-settings-component/tabs/webhooks/dataset-settings-webhooks-tab-routing.ts` | `WEBHOOKS_TAB_ROUTING` |
| `dataset-flow/dataset-flow-details/flow-details-routing.ts` | `FLOW_DETAILS_ROUTES` |

## Rules

### Lazy by default

- A new feature area gets its own `<feature>-routing.ts` exporting `export const XXX_ROUTES:
  Routes`, attached from its parent with `loadChildren`:

  ```ts
  {
      path: `${ProjectLinks.URL_SETTINGS}`,
      canActivate: [authenticatedGuard],
      runGuardsAndResolvers: "always",
      loadChildren: () =>
          import(
              /* webpackChunkName: "account-settings" */
              "./account/settings/account-settings-routing"
          ).then((m) => m.ACCOUNT_SETTINGS_ROUTES),
  },
  ```

- A single page with no child routes uses `loadComponent` the same way.
- The `/* webpackChunkName */` comments are kept for consistency with existing routes, but the
  esbuild `application` builder ignores them: chunks are named after the imported file
  (`account-settings-routing`, `metadata-block-component`). Name the routes file so that the
  name reads well in the build output.
- A parent routes file must not import a child feature's components, services or constants
  statically — only its routes file, through `import()`. One static import is enough to merge
  the child into the parent chunk.
- `component:` (eager) is allowed only when the component is the default view of its parent or
  is already part of the parent chunk, and it carries a comment saying why — see the Overview
  and Data tabs in `DATASET_VIEW_ROUTES`. `AdminDashboardComponent` in `app-routing.ts` is eager
  for historical reasons; do not copy it.
- New routes files start with `/* istanbul ignore file */`, as most existing ones do (they are
  configuration, covered through the components they load).

### Route anatomy

- Paths and parameter names come from `ProjectLinks` (`src/app/project-links.ts`): `URL_*`
  constants for segments, `URL_PARAM_*` for `:params`. No string literals in routes or
  `router.navigate` calls.
- Data-dependent pages load through resolver functions — `export const xxxResolverFn:
  ResolveFn<T> = (route) => { const s = inject(S); return s.fetch(...); };` in a `resolver/`
  folder beside the component. Register them under a key from `RoutingResolvers`
  (`src/app/common/resolvers/routing-resolvers.ts`), and receive the value as an input:
  `@Input(RoutingResolvers.FLOW_DETAILS_LOGS_KEY) public flowDetails: DatasetFlowByIdResponse;`.
- A resolver that cannot produce its data redirects by emitting a `RedirectCommand`, usually
  `navigationService.pageNotFoundRedirect()` from `map` or `catchError`. Keep `MaybeNull` out of
  `ResolveFn<T>` when `null` would only mean "redirected"; the router never hands a
  `RedirectCommand` to the component. A resolver built on another one passes its
  `RedirectCommand` through (`if (data instanceof RedirectCommand) return of(data);`) before its
  own follow-up fetch.
- Access to a dataset page is decided in its resolver, not by hiding the menu link: the menu only
  mirrors the rule. Build on `requestDatasetWithPermissions` / `requestEditableDataset`
  (`dataset-view/resolvers/dataset-access.helpers.ts`) for pages outside the dataset view, and
  `resolveSettingsTabAccess` (`dataset-settings-component/resolvers/settings-tab-access.helpers.ts`)
  for settings tabs and their sub-pages. A rule that needs no dataset data, such as who may open
  an account's settings tab, is a guard (`accountSettingsTabGuard`).
- Tabs are child routes: an empty-path `redirectTo` the default tab with `pathMatch: "full"`,
  then one child per tab with `data: { [ProjectLinks.URL_PARAM_TAB]: XxxTabs.SOME_TAB }` and an
  `xxxActiveTabResolverFn` on the parent.
- Routes whose data must refresh when only query parameters change set
  `runGuardsAndResolvers: "always"`, as their neighbours do.
- Guards are functional `CanActivateFn`s in a `guards/` folder (`authenticatedGuard`,
  `adminGuard`, `accountGuard`). A guard returns `true` or the `UrlTree` to redirect to, built by
  a `NavigationService` `…UrlTree()` method such as `homeUrlTree()` or `loginUrlTree()`.
- Navigation from code goes through `NavigationService` methods; add a method there for a new
  destination instead of calling `router.navigate` with assembled segments in components. Its
  `navigateTo…()` methods serve components and handlers that run outside any navigation (the
  Apollo error link, `ErrorHandlerService`); guards and resolvers use its `…UrlTree()` and
  `…Redirect()` builders, so the redirect happens inside the navigation being checked.
- Every URL of a dataset page or sub-page comes from a `NavigationService` builder
  (`datasetViewUrlTree`, `metadataBlockUrlTree`, `flowDetailsUrlTree`, `webhooksUrlTree`,
  `sourceEventEditorUrlTree`); its `navigateTo…()` twin navigates to the same tree. Templates
  reach the builders through the pure pipes in `common/pipes/` (`datasetLink`,
  `metadataBlockLink`, `flowDetailsLink`, `webhooksLink`, `sourceEventEditorLink`), never through
  hand-built `['/', account, dataset, …]` arrays. Query parameters and the fragment go into the
  builder's params: `routerLink` ignores `[queryParams]` and `fragment` when given a `UrlTree`.

### Proving the chunk split

After changing what a route loads, run `npm run build-prod` and read the **Initial chunk files**
and **Lazy chunk files** tables it prints (add `-- --verbose` to list every lazy chunk). Check
that:

1. the new feature appears as its own lazy chunk, named after its routes file or component;
2. the initial chunk total did not grow by the size of the feature;
3. no other lazy chunk grew unexpectedly, which would mean a shared static import.

For a deeper look, `npm run build-prod:stats` writes the esbuild metafile `dist/kamu-platform/stats.json`,
and `npm run analyze` renders it as a treemap of every chunk's modules in `dist/kamu-platform/stats.html`.
The dev build (`npm run build`) does not optimize and its chunk sizes are not representative.

## Rejected approaches

| Approach | Why rejected |
|---|---|
| `NgModule`-based routing (`RouterModule.forChild`) | The app is standalone; routes files exporting `Routes` constants are lazy-loadable directly |
| Statically importing a feature component into a parent routes file "just for one route" | Merges the whole feature, and everything it imports, into the parent chunk |
| Fetching page data in `ngOnInit` instead of a resolver | The page renders empty first and the data does not refresh with `runGuardsAndResolvers`; resolvers keep loading and navigation in one place |
| Relying on `webpackChunkName` to name chunks | Ignored by the esbuild builder; the file name decides |
| A guard or resolver that calls `navigateTo…()` and then returns `false`, `EMPTY` or `null` | Starts a second navigation from inside the first, which the router then cancels. A resolver returning `EMPTY` cancels the navigation on its own, so the 404 page appeared only because the second navigation won. A `UrlTree` or `RedirectCommand` redirects within the same navigation, and a spec can check where it leads |

## What lives elsewhere

- A complete new page, from route to tests: `kamu-ui-adding-a-page`.
- Component style, base classes reading route params: `kamu-ui-angular-style`.
- Resolver and guard specs: `kamu-ui-unit-tests`.
