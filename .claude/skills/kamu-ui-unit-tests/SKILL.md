---
name: kamu-ui-unit-tests
description: Unit test conventions for Kamu Web UI — Karma + Jasmine specs next to their source, TestBed setup, CDK component harnesses (Material and custom *.harness.ts), data-test-id selectors and the shared DOM helpers, Apollo testing for api classes, mock fixtures and their typing (no type assertions on test data), fake async and frozen time, render hooks and timers in specs, and running a narrowed test set. Use before writing or editing any *.spec.ts, *.harness.ts or mock file.
---

# Kamu UI Unit Tests

Every component, service, api class, pipe, guard, resolver and directive has a `*.spec.ts`
beside it. Tests run in Karma with Jasmine in headless Chrome; `karma.conf.js` sets
`TZ=Europe/Kyiv`, so date formatting assertions assume that zone.

## Running

| Need | Command |
|---|---|
| Whole suite, as CI runs it | `npm test` |
| One spec file or folder | `npm test -- --include src/app/api/webhooks.api.spec.ts` (a glob or directory works too) |

Run on the Node `.nvmrc` pins (AGENTS.md, "Node version"). Do not pipe the output into
`head`/`tail`; delegate a long run to the `ng-tester` sub-agent, which reports only failures.
Never commit `fdescribe`/`fit`/`xdescribe`/`xit` — eslint and the edit hook reject them.

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
  `checkNoChanges` (`src/test.ts`). `fixture.detectChanges()` does not re-render an OnPush
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
  tests a state the app never reaches. Older specs that still do it are fixed when next edited.
- `src/test.ts` sets `errorOnUnknownProperties` and `errorOnUnknownElements`, so binding an
  unknown property or using an undeclared element in a spec template throws instead of logging.
- The same NG0100 also flags a template value that differs on every evaluation, such as a getter
  returning `new Date()`: give the component a field it updates at a defined moment instead.
- Mock collaborators with `spyOn(service, "method").and.returnValue(of(...))` on the real
  injected service rather than hand-written fakes.
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
`getElementByDataTestId`, `findElementByDataTestId`, `emitClickOnElementByDataTestId`,
`checkVisible`, `setFieldValue`, `dispatchInputEvent`, `checkButtonDisabled`,
`checkInputDisabled`, `findComponentInstance`, `findComponentInstances`,
`findComponentInstanceByDataTestId`, plus `routerMock`, `snapshotParamMapMock` and
`registerMatSvgIcons()`. Add an attribute to the template rather than selecting by CSS class or
element structure.

A spec never casts a lookup result. `getElementByDataTestId`, `findElementByDataTestId` and
`findNativeElement` take the element class as an optional last argument
(`getElementByDataTestId(fixture, "save-btn", HTMLButtonElement)`) and return that type;
`nativeElementOf(debugElement, HTMLElement)` does the same for a `DebugElement`. Each checks the
class with `instanceof` and throws on a mismatch. A component instance comes from
`findComponentInstance` or `findComponentInstanceByDataTestId`, never from `componentInstance`.

A spec does not query `fixture.debugElement` inline (`query(By.directive(...))`,
`queryAll(...)`): rendered components and directives are reached through
`findComponentInstance` / `findComponentInstances`, and a query no helper covers yet becomes a
new helper in `base-test.helpers.spec.ts`.

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
  Stub the services it injects with `spyOn` / `spyOnProperty`.
- Build the route it receives with `routeSnapshot({ params, queryParams, data, parent, children })`:
  a real `ActivatedRouteSnapshot`, whose `paramMap`, `parent` and `pathFromRoot` work as in a
  navigation. `RouterStateSnapshot` has no public constructor, so the helpers pass the one
  stand-in `routerStateSnapshot(url)`; the app's guards and resolvers read only its `url`.
- A guard redirect is asserted by where it leads, not by `false`:
  `` expectRedirectTo(await runCanActivate(guard, route, url), `/${ProjectLinks.URL_LOGIN}`) ``
  (`account/guards/account.guard.spec.ts`).
- An expected resolver error is checked with
  `await expectAsync(runResolver(...)).toBeRejectedWithError(...)`. A page-not-found redirect is
  checked with `expectPageNotFoundRedirect(data)`; a resolver built on another one also gets a
  test that the `RedirectCommand` passes through and its own fetch is not called
  (`dataset-settings-scheduling-tab.resolver.spec.ts`). Narrow a `T | RedirectCommand` result
  with `instanceof`, never with a cast.
- Interceptors: `provideHttpClient(withInterceptors([fn]))` + `provideHttpClientTesting()`,
  requests driven through `HttpClient` and answered with `HttpTestingController`; timing runs in
  `fakeAsync` (`common/components/spinner/spinner.interceptor.spec.ts`).
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
  - a slice of GraphQL data with the generated `XxxFragment`, or with the union member a spec
    needs (`{ __typename: "AddData" } & AddDataEventFragment`); a part of a bigger fragment
    takes its named sub-fragment type, never `XxxFragment["field"]` (`kamu-ui-graphql-api`,
    "Documents");
  - a view model with its app interface (`OverviewUpdate`).

  A field the spec does not need takes its empty value (`schema: null`, `[]`); it is not dropped
  from the type with `Omit` or `Partial`.
- Test data is never asserted into shape: no `{ ... } as T`, no `mock.a?.b as T`, no
  `as unknown as T`. Replace each one as follows:

  | The value | Use |
  |---|---|
  | sits behind optional chaining in a typed fixture | `requireValue(mock.a?.b ?? null)` from `@common/helpers/app.helpers` |
  | is one member of a `__typename` union | a mock typed with that member, or an `if` on `__typename` |
  | is a variant of a typed mock | a spread: `{ ...structuredClone(mockX), field: value }` |
  | is a browser object such as `File` | the constructor: `new File(["a,b"], "data.csv", { type: "text/csv" })` |
  | still does not fit the component's input | a wrong input type: type the input with what reaches it (`kamu-ui-angular-style`, "Component anatomy"), not the value with a cast |

- `as const` on a literal and `satisfies T` on a typed local constant are fine: neither hides a
  field.
- Specs and mocks that still hold assertions are legacy. Remove the ones in the tests and mock
  entries you change, and never add new ones.

## Mocks and fixtures

- GraphQL response fixtures: `src/app/api/mock/<domain>.mock.ts`, named `mock<OperationName>`
  and typed with the generated result type, so codegen changes break them at compile time.
  Shared constants such as `TEST_DATASET_ID` live there too.
- Feature-local view-model fixtures: `<name>.mock.ts` beside the code. Older files use other
  names (`mock.data.ts`, `*.mocks.ts`); leave them, but name new ones `.mock.ts`.

## Async and time

- `fakeAsync` with `tick()` / `flush()` for timers, debounces and Apollo responses outside
  harness tests.
- Freeze the clock with `timekeeper.freeze("2024-03-14T11:22:29+00:00")` and
  `timekeeper.reset()` in `afterEach` for anything that renders relative or current time.
- `fakeAsync` swaps in its own `Date`, which ignores timekeeper. A component rendered with
  relative time outside `fakeAsync` and re-checked inside it shows two different clocks; use an
  `async` test with `await fixture.whenStable()` there instead.
- A render hook (`afterNextRender`) registered by a component is queued when that component's
  view refreshes and runs at the end of an `ApplicationRef` tick. `fixture.detectChanges()`
  alone does not run it reliably, so follow it with `TestBed.inject(ApplicationRef).tick()`
  before asserting. Spy on DOM methods (`spyOn(HTMLElement.prototype, "scrollIntoView")`) before
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
| `fixture.componentRef.setInput("name", value)` with `satisfies` added by hand | The name is a string and the value `unknown`, so nothing is checked unless someone remembers `satisfies`, and an unknown name only logged NG0303. Moving 397 calls to the typed helper exposed 16 mismatches, among them a GitHub callback input typed `string` that the router sets to `undefined` |
| Calling `ngOnChanges` with a hand-built `SimpleChanges` | Tests a change Angular never sends. The base-editor specs ran the hook twice per change, once through change detection and once by hand. The request-timer spec hid that the hook threw when only its `class` input changed |
| Casting test data to the expected type (`{ ... } as T`, `mock.a?.b as T`) | Hides missing, misspelled and stale fields. The overview mocks kept `addedOutputData` after the schema renamed it to `newData`, and carried a polling source the query never fetches. The casts in the flows and secrets specs covered component inputs typed with full schema types that the app's data never matched |
| Selecting elements by CSS class or tag structure | Breaks on styling changes; `data-test-id` is the contract between template and test |
| Raw `nativeElement` clicks inside Material components | Depends on Material's internal DOM; the Material harnesses are the supported API |
| Hand-built Apollo response objects inline in specs | Not reusable and not type-checked against codegen; fixtures go to `api/mock/` |
| Testing private methods through `component["method"]` | Tests the implementation; drive the public inputs, outputs and DOM instead |
| Asserting a render hook's effect right after `fixture.detectChanges()` | The hook runs at the end of an application tick that zone.js schedules afterwards; whether that tick happens depends on what earlier specs left behind, so such a spec passed alone and failed in random-order full runs |
| `expect(...)` inside `subscribe` on a resolver or service observable | Passes without asserting anything when the observable never emits, and `await` on an observable does not subscribe at all: the block-metadata resolver spec checked nothing this way. `firstValueFrom` fails the test instead |
| Asserting only that a guard returned `false`, or that a `navigateTo…` spy was called | Says nothing about the destination: the account guard built its redirect from the whole URL, query string included, and its spec still passed |
| DOM helpers for a new display-only component ("nothing to click, so no harness") | Assertions on texts, states and widths are as tied to DOM structure as clicks are, and the next spec that hosts the component has no API to reuse |

## What lives elsewhere

- Component and service style: `kamu-ui-angular-style`.
- Api classes and generated types: `kamu-ui-graphql-api`.
- Comments in specs: `kamu-ui-prose-and-comments`.
