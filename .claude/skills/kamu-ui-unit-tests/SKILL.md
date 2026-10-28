---
name: kamu-ui-unit-tests
description: Unit test conventions for Kamu Web UI — Vitest specs (browser mode, Chromium) next to their source, TestBed setup, CDK component harnesses (Material and custom *.harness.ts), data-test-id selectors and the shared DOM helpers, Apollo testing for api classes, mock fixtures and their typing (no type assertions on test data), fake async and frozen time, render hooks and timers in specs, and running a narrowed test set. Use before writing or editing any *.spec.ts, *.harness.ts or mock file.
---

# Kamu UI Unit Tests

Every component, service, api class, pipe, guard, resolver and directive has a `*.spec.ts`
beside it. Tests run in Vitest browser mode in headless Chromium through Playwright, built by
Angular's `unit-test` builder (`angular.json`) with the Vitest settings in `vitest-base.config.ts`.
The browser runs in UTC, so date formatting assertions are written for UTC. Vitest's globals
(`describe`, `it`, `expect`, `vi`) need no import; a type such as `Mock` is imported from `vitest`.

## Running

| Need | Command |
|---|---|
| Whole suite, as CI runs it | `npm test` |
| One spec file or folder | `npm test -- --include src/app/api/webhooks.api.spec.ts` (a glob or directory works too) |
| Tests whose name matches | `npm test -- --include <path> --filter "<regex>"` |

Run on the Node `.nvmrc` pins (AGENTS.md, "Node version"). Do not pipe the output into
`head`/`tail`; delegate a long run to the `ng-tester` sub-agent, which reports only failures.
Never commit `.only` or `.skip` (`describe.only`, `it.skip`, …) — eslint and the edit hook reject them.

Vitest prints the specs' console output only when its own output is a terminal, so a piped run
(an agent, CI) shows no warnings at all. Angular's dev-mode reports therefore do not rely on being
read: `src/test-setup.ts` fails any test during which a `console.warn` or `console.error` carries an
Angular runtime code: four digits for core (`NG0956`), five for the router and other packages
(`NG04002`, a failed navigation). Fix the cause; a test whose purpose is to provoke
such a message stubs the console method (`stubMethod(console, "warn")`), which keeps it from reaching the check.

## Component tests

```ts
beforeEach(async () => {
    await TestBed.configureTestingModule({
        imports: [SharedTestModule, FlowsTableComponent],
        providers: [Apollo, provideToastr(), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(FlowsTableComponent);
    component = fixture.componentInstance;
    loader = TestbedHarnessEnvironment.loader(fixture);
    setComponentInput(fixture, "nodes", mockFlowSummaryDataFragments);
    fixture.detectChanges();
});
```

(Adapted from `dataset-flow/flows-table/flows-table.component.spec.ts`.)

- Import the standalone component itself; add `SharedTestModule` (route snapshot mock) when the
  component or a base class reads the route. Provide only what the component's dependency tree
  needs: `provideToastr()`, `provideHttpClient()` + `provideHttpClientTesting()`, `Apollo` or `ApolloTestingModule` for anything reaching an api
  class. Material overlays need no animations provider.
- TestBed runs with zone-based change detection, like the app, and with exhaustive
  `checkNoChanges` (`src/test-providers.ts`). `fixture.detectChanges()` does not re-render an OnPush
  component whose state a test changed after the first render, and the exhaustive check fails such
  a spec with NG0100. Set inputs with `setComponentInput(fixture, "field", value)` from
  `@common/helpers/base-test.helpers.spec`; after changing internal state, call
  `fixture.debugElement.injector.get(ChangeDetectorRef).markForCheck()`.
- `setComponentInput` goes through `ComponentRef.setInput()`, so `ngOnChanges`, setters and
  OnPush re-rendering run as in the app. It names the input by its class field, so the compiler
  checks the name and the value's type, including misspelled properties of an object literal; an
  alias (`@Input(RoutingResolvers.X)`) is resolved for you, and a field that is not an input
  throws. eslint rejects a direct `componentRef.setInput()` in a spec, since it takes the name as
  a string and the value as `unknown`. A value that does not fit is never cast to fit; see
  [Types in specs and mocks](#types-in-specs-and-mocks).
- Lifecycle hooks run through change detection, never by hand. To test how a component reacts to
  an input change, set the input and call `fixture.detectChanges()`. Never call `ngOnChanges`
  with a hand-built `SimpleChanges` (eslint rejects it). Never call `ngOnInit()` again on a
  component the first `detectChanges()` already initialised: it subscribes a second time and
  tests a state the app never reaches.
- The builder's TestBed setup turns on `errorOnUnknownProperties` and `errorOnUnknownElements`, so binding an
  unknown property or using an undeclared element in a spec template throws instead of logging.
- The same NG0100 also flags a template value that differs on every evaluation, such as a getter
  returning `new Date()`: give the component a field it updates at a defined moment instead.
- Mock collaborators with `vi.spyOn(service, "method").mockReturnValue(of(...))` on the real
  injected service rather than hand-written fakes. See [Spies](#spies) for what a spy without a
  return value does.
- A test that needs a fixture other than the one `beforeEach` built, such as one whose first
  response is deferred, calls `fixture.destroy()` before `TestBed.createComponent`. Harness calls
  run change detection for the whole app, so a shared fixture left alive re-renders too: in the
  dataset access spec, its pager corrected a page and started a real navigation.
- A component with required inputs or content projection is tested through a small host
  `@Component` declared in the spec (see `time-delta-form.component.spec.ts`).

### Driving the DOM: harnesses first

**A new component spec drives the component through CDK harnesses — this is the default, not
an option.** That holds for display-only components too: reading texts, states, links and widths
goes through harness methods as much as clicking and typing does. A harness keeps the test about
behaviour rather than DOM structure, and is reused by every spec that hosts the component. Older
specs written with the DOM helpers stay as they are until they are rewritten for another reason.

- **Material components:** use the Material harnesses — `MatRadioButtonHarness`,
  `MatSlideToggleHarness`, `MatCheckboxHarness`, `MatTableHarness`, … from
  `@angular/material/<component>/testing`, narrowed with
  `.with({ selector: '[data-test-id="yaml-toggle"]' })`.
- **App components:** a custom harness lives next to the component as
  `<name>.harness.ts`:

  ```ts
  /* istanbul ignore file */

  export class TimeDeltaFormHarness extends ComponentHarness {
      public static readonly hostSelector = "app-time-delta-form";

      private static readonly EVERY_INPUT_TEST_ID = "time-delta-every";
      private static readonly ERROR_TEST_ID = "time-delta-error-message";

      private readonly locatorEveryInput = this.locatorFor(`[data-test-id="${TimeDeltaFormHarness.EVERY_INPUT_TEST_ID}"]`);
      private readonly locatorError = this.locatorForOptional(`[data-test-id="${TimeDeltaFormHarness.ERROR_TEST_ID}"]`);

      public async setTimeDelta(every: number, unit: TimeUnit): Promise<void> { ... }
      public async isEveryInputInvalid(): Promise<boolean> { ... }
  }
  ```

  Locators select by `data-test-id`. The harness declares each id it reads once, as a
  `private static readonly` constant (a prefix constant for ids built per item), and builds every
  selector from it; the template keeps the literal. Specs never write `data-test-id` selectors for
  a component that has a harness, they call its methods. Existing harnesses with inline selector
  literals switch to constants when they are next edited. Public methods speak the component's domain
  (`setTimeDelta`, `getAvailableUnits`), never return raw elements, and compose child harnesses
  (`EditSchemaTableHarness` uses `TypeEditorHarness`). References:
  `common/components/time-delta-form/time-delta-form.harness.ts`,
  `common/components/edit-schema-table/edit-schema-table.harness.ts`, and for id constants,
  per-item ids and a menu rendered in the CDK overlay,
  `common/components/search-additional-buttons/search-additional-buttons-nav.harness.ts`.
- A new component with anything to assert beyond "it renders" gets its own harness; extend an
  existing harness when the component already has one.
- Load a child's harness with `TestbedHarnessEnvironment.loader(fixture)` then
  `await loader.getHarness(XHarness)`; for the fixture's own component use
  `await TestbedHarnessEnvironment.harnessForFixture(fixture, XHarness)`
  (`account/settings/tabs/storage-tab/storage-tab.component.spec.ts`). Harness calls run change
  detection themselves, so tests using them are `async`, not `fakeAsync`.

### DOM helpers

In specs that already use them, and in a new spec only for a single trivial check (one element
present or absent, with no harness to extend), the helpers in
`@common/helpers/base-test.helpers.spec` select by `data-test-id`:
`getElementByDataTestId`, `findElementByDataTestId`, `findAllElementsByDataTestId`,
`emitClickOnElementByDataTestId`, `checkVisible`, `setFieldValue`, `dispatchInputEvent`,
`checkButtonDisabled`, `checkInputDisabled`, `findComponentInstance`, `findComponentInstances`,
`findComponentInstanceByDataTestId`, plus `snapshotParamMapMock` and `registerMatSvgIcons()`. Add an attribute to the template rather than selecting by CSS class or
element structure.

A spec never casts a lookup result. `getElementByDataTestId`, `findElementByDataTestId` and
`findNativeElement` take the element class as an optional last argument
(`getElementByDataTestId(fixture, "save-btn", HTMLButtonElement)`) and return that type;
`findAllElementsByDataTestId(fixture, "block-hash", HTMLElement)` requires it and returns every
match. Each checks the class with `instanceof` and throws on a mismatch. A component instance
comes from `findComponentInstance` or `findComponentInstanceByDataTestId`, never from a
`DebugElement`'s `componentInstance`.

A spec does not query `fixture.debugElement` inline (`query(By.directive(...))`,
`queryAll(...)`): elements are reached through the lookups above, rendered components and
directives through `findComponentInstance` / `findComponentInstances`, and a query no helper
covers yet becomes a new helper in `base-test.helpers.spec.ts`.

## API class tests

```ts
TestBed.configureTestingModule({ providers: [WebhooksApi], imports: [ApolloTestingModule] });
controller = TestBed.inject(ApolloTestingController);
afterEach(() => controller.verify());

it("should check get webhooks by id", () => {
    service.datasetWebhookSubscriptions(DATASET_ID).subscribe((res) => { expect(...); });
    const op = controller.expectOne(DatasetWebhookSubscriptionsDocument);
    expect(op.operation.variables.datasetId).toEqual(DATASET_ID);
    op.flush({ data: mockDatasetWebhookSubscriptionsQuery });
});
```

One case per api method: assert the variables sent, flush a fixture typed with the generated
`XxxQuery` / `XxxMutation`, assert the mapped result.

## Guard, resolver and interceptor tests

- Run a functional guard or resolver with `runCanActivate(guard, route, url)` or
  `runResolver(resolver, route, url)` from `@common/helpers/base-test.helpers.spec`, in an
  `async` test: they run it in the TestBed injector and await an observable or promise result.
  Stub the services it injects with `vi.spyOn` (`vi.spyOn(service, "prop", "get")` for a getter).
- Build the route it receives with `routeSnapshot({ params, queryParams, data, parent, children })`:
  a real `ActivatedRouteSnapshot`, whose `paramMap`, `parent` and `pathFromRoot` work as in a
  navigation. The router state they pass is a stand-in that carries only `url`, the one field
  the app's guards and resolvers read.
- A guard redirect is asserted by where it leads, not by `false`:
  `` expectRedirectTo(await runCanActivate(guard, route, url), `/${ProjectLinks.URL_LOGIN}`) ``
  (`auth/guards/authenticated.guard.spec.ts`).
- An expected resolver error is checked with
  `await expect(runResolver(...)).rejects.toThrow(...)`. A page-not-found redirect is
  checked with `expectPageNotFoundRedirect(data)`; a resolver built on another one also gets a
  test that the `RedirectCommand` passes through and its own fetch is not called
  (`dataset-settings-scheduling-tab.resolver.spec.ts`). Narrow a `T | RedirectCommand` result
  with `instanceof`, never with a cast.
- Interceptors: `provideHttpClient(withInterceptors([fn]))` + `provideHttpClientTesting()`,
  requests driven through `HttpClient` and answered with `HttpTestingController`; timing runs in
  `fakeAsync` (`common/components/spinner/spinner.interceptor.spec.ts`).
- Every value a URL can carry gets a malformed, a missing and, for query parameters, a repeated
  case. Parsers are tested in `common/helpers/url-params.helpers.spec.ts`. A route that rejects
  a URL gets a row in the "URL validation" table of `app-routing.spec.ts`, which asserts that the
  page-not-found component is activated and that the stubbed resolvers were not called; a redirect
  with `skipLocationChange` leaves the mocked `Location` on the previous URL, so it does not assert
  on that. `route-config.spec.ts` walks every route, lazy ones included, and fails when a path
  parameter has no `validRouteParams` check or a parent route has no empty-path child.
- Route wiring is tested end to end in `app-routing.spec.ts` through the real `Router`. The
  router looks a functional resolver up in the injector before calling it, so
  `{ provide: someResolverFn, useValue: { resolve: () => of(data) } }` replaces it there. A URL
  that reaches a `loadChildren` or `loadComponent` route needs an `async` test with `await
  router.navigate(...)`, since `tick()` does not wait for a lazy chunk.

## Types in specs and mocks

The compiler is the first check a spec gets: test data typed as the app's data catches a stale
or misspelled field before any test runs. A type assertion switches that check off.

- Every exported mock is declared with its type:
  - a response fixture with the generated `XxxQuery` / `XxxMutation`;
  - a slice of GraphQL data with the fragment type the code under test takes
    (`kamu-ui-graphql-api`, "Documents"), or with the union member a spec needs
    (`{ __typename: "AddData" } & AddDataEventFragment`);
  - a view model with its app interface (`OverviewUpdate`).

  A field the spec does not need takes its empty value (`schema: null`, `[]`); it is not dropped
  from the type with `Omit` or `Partial`.
- Specs, mocks, harnesses and the test modules in `common/modules` hold no type assertions at
  all: no `{ ... } as T`, no `mock.a?.b as T`, no `as unknown as T`, no `as HTMLButtonElement`.
  eslint's `consistent-type-assertions` rejects every one. Replace each as follows:

  | The value | Use |
  |---|---|
  | sits behind optional chaining in a typed fixture | `requireValue(mock.a?.b)` from `@common/helpers/app.helpers` |
  | is one member of a `__typename` union | a mock typed with that member, or an `if` on `__typename` |
  | is a variant of a typed mock | a spread: `{ ...structuredClone(mockX), field: value }` |
  | is a browser object such as `File` | the constructor: `new File(["a,b"], "data.csv", { type: "text/csv" })` |
  | is a DOM element or a component instance | the typed lookups ("DOM helpers") |
  | is a DOM property a harness reads, such as a `<select>` value | a lookup in the enum's values that throws on anything else (`time-delta-form.harness.ts`) |
  | is a spy's call arguments | the spy `vi.spyOn` returned, typed as `Mock<Service["method"]>`; the last call is `requireValue(spy.mock.lastCall)` |
  | is an object of a library type the code under test calls a few methods on (`NgbModalRef`, a Monaco editor) | `createSpyObj<T>({ method: returnValue }, { property: value })` from `base-test.helpers.spec.ts` |
  | still does not fit the component's input | a wrong input type: type the input with what reaches it (`kamu-ui-angular-style`, "Component anatomy"), not the value with a cast |

- `as const` on a literal and `satisfies T` on a typed local constant are fine: neither hides a
  field, and the rule allows both.
- A value that cannot be typed honestly, such as a router snapshot with no public constructor,
  gets a named helper in `base-test.helpers.spec.ts`, the one file the rule exempts.

## Mocks and fixtures

- GraphQL response fixtures: `src/app/api/mock/<domain>.mock.ts`, named `mock<OperationName>`
  and typed with the generated result type, so codegen changes break them at compile time.
  Shared constants such as `TEST_DATASET_ID` live there too.
- A spec file is never imported by another file (eslint `no-restricted-imports`): spec files share
  one module cache, so an imported spec runs its tests inside the importing file, and Vitest then
  fails it with "No test suite found". Anything other specs need goes into a `.mock.ts` file
  (`schema-editor.mock.ts`). `base-test.helpers.spec.ts` and `base-editor.component.spec.ts`
  hold no tests of their own; the test target excludes them, and only they may be imported.
- Feature-local view-model fixtures: `<name>.mock.ts` beside the code. Older files use other
  names (`mock.data.ts`, `*.mocks.ts`); leave them, but name new ones `.mock.ts`.

## Spies

- `vi.spyOn(object, "method")` calls the real method and records the call. To replace the
  method, give the spy a result: `.mockReturnValue(...)`, `.mockResolvedValue(...)`,
  `.mockImplementation(...)`.
- A method the test only expects to be called, whose real work must not run (a navigation, a
  toast, a mutation), is stubbed with `stubMethod(object, "method")` from
  `@common/helpers/base-test.helpers.spec`, which replaces it with one returning `undefined`,
  whatever the method returns. Not with an empty function such as
  `.mockImplementation(() => {})`, which older specs still use until they are next edited.
- A getter is spied with `vi.spyOn(object, "prop", "get")`.
- Every spy is restored after each test (`restoreMocks` in `vitest-base.config.ts`), so a spy on
  a root service or a prototype does not reach the next test.
- A call's `this` is in `spy.mock.contexts`; a fail-on-reach callback is `expect.fail("...")`.

## Async and time

- `fakeAsync` with `tick()` / `flush()` for timers, debounces and Apollo responses outside
  harness tests.
- `fakeAsync` runs under Vitest through the zone.js Vitest plugin that `src/test-setup.ts` loads.
  It drains only zone-aware promises, so `vitest-base.config.ts` has Vite downlevel `async`/`await`
  in the pre-bundled dependencies; a dependency's native `await` would leave a navigation or a
  resolver pending through every `tick()`.
- Pending microtasks run after every DOM event a test dispatches, as in a browser. A form
  control bound with `ngModel` (an input, an `ng-select`) writes its value in a microtask after
  the first render, so `await fixture.whenStable()` before typing or selecting; otherwise that
  write lands in the middle of the test and overwrites the input
  (`search-and-schemas-section.component.spec.ts`).
- Freeze the clock with `timekeeper.freeze("2024-03-14T11:22:29+00:00")` and
  `timekeeper.reset()` in `afterEach` for anything that renders relative or current time.
- `fakeAsync` swaps in its own `Date`, which ignores timekeeper. A component rendered with
  relative time outside `fakeAsync` and re-checked inside it shows two different clocks; use an
  `async` test with `await fixture.whenStable()` there instead.
- A render hook (`afterNextRender`) registered by a component is queued when that component's
  view refreshes and runs at the end of an `ApplicationRef` tick. `fixture.detectChanges()`
  alone does not run it reliably, so follow it with `TestBed.inject(ApplicationRef).tick()`
  before asserting. Spy on DOM methods (`vi.spyOn(HTMLElement.prototype, "scrollIntoView")`) before
  the render and assert after the tick; a focus check compares `document.activeElement`, which
  works because the fixture is attached to the document. A host component in the spec covers a
  directive (`common/directives/auto-focus.directive.spec.ts`).
- An RxJS `timer(ms)` in the code under test advances with `tick(ms)` inside `fakeAsync`, the
  same as `setTimeout`.
- ngx-markdown renders asynchronously: `await fixture.whenStable()` before asserting on what it
  rendered or on DOM added from its `(ready)` output.

## Rejected approaches

| Approach | Why rejected |
|---|---|
| Assigning an input field directly (`component.foo = x`) | Skips `ngOnChanges` and setters and does not re-render an OnPush view: readme-section specs asserted on a state `ngOnChanges` would have overwritten, and clicked a button the real view hides |
| `fixture.componentRef.setInput("name", value)` with `satisfies` added by hand | The name is a string and the value `unknown`, so nothing is checked unless someone remembers `satisfies`, and an unknown name only logs NG0303. Values that do not fit their inputs pass unnoticed, such as `undefined` for a GitHub callback input typed `string` that the router does set to `undefined` |
| Calling `ngOnChanges` with a hand-built `SimpleChanges` | Tests a change Angular never sends. Combined with change detection it runs the hook twice per change, and a hand-picked change set hides a hook that throws on a change Angular does send, such as one where only the request timer's `timerClass` input changed |
| Casting test data to the expected type (`{ ... } as T`, `mock.a?.b as T`) | Hides missing, misspelled and stale fields: a cast mock keeps a field the schema has renamed (`addedOutputData` for `newData`) or one the query never fetches, and still compiles. It also hides a wrong input type, such as a component input typed with a full schema type that the app's data never matches |
| Selecting elements by CSS class or tag structure | Breaks on styling changes; `data-test-id` is the contract between template and test |
| Raw `nativeElement` clicks inside Material components | Depends on Material's internal DOM; the Material harnesses are the supported API |
| Hand-built Apollo response objects inline in specs | Not reusable and not type-checked against codegen; fixtures go to `api/mock/` |
| Testing private methods through `component["method"]` | Tests the implementation; drive the public inputs, outputs and DOM instead |
| A bare `vi.spyOn` for a method whose real work must not run | A Vitest spy calls through: it records the call while the navigation, toast or mutation still happens. Stub it (see [Spies](#spies)) |
| Asserting on the real browser `Location` in a router spec | The specs share Vitest's page, whose URL is the runner's, not the app's: the initial navigation's result depended on it, and pushed URLs reach later spec files. `provideLocationMocks()` gives each TestBed its own `SpyLocation` (`app-routing.spec.ts`) |
| Asserting a render hook's effect right after `fixture.detectChanges()` | The hook runs at the end of an application tick that zone.js schedules afterwards; whether that tick happens depends on what earlier specs left behind, so such a spec passed alone and failed in random-order full runs |
| `expect(...)` inside `subscribe` on a resolver or service observable | Passes without asserting anything when the observable never emits, and `await` on an observable does not subscribe at all: the block-metadata resolver spec checked nothing this way. `firstValueFrom` fails the test instead |
| Asserting only that a guard returned `false`, or that a `navigateTo…` spy was called | Says nothing about the destination: the account guard built its redirect from the whole URL, query string included, and its spec still passed |
| DOM helpers for a new display-only component ("nothing to click, so no harness") | Assertions on texts, states and widths are as tied to DOM structure as clicks are, and the next spec that hosts the component has no API to reuse |

## What lives elsewhere

- Component and service style: `kamu-ui-angular-style`.
- Api classes and generated types: `kamu-ui-graphql-api`.
- Comments in specs: `kamu-ui-prose-and-comments`.
