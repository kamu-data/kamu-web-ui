---
name: kamu-ui-unit-tests
description: Unit test conventions for Kamu Web UI — Karma + Jasmine specs next to their source, TestBed setup, CDK component harnesses (Material and custom *.harness.ts), data-test-id selectors and the shared DOM helpers, Apollo testing for api classes, mock fixtures, fake async and frozen time, and running a narrowed test set. Use before writing or editing any *.spec.ts, *.harness.ts or mock file.
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

Run on the Node `.nvmrc` pins (AGENTS.md, "Validation"). Do not pipe the output into
`head`/`tail`; delegate a long run to the `ng-tester` sub-agent, which reports only failures.
Never commit `fdescribe`/`fit`/`xdescribe`/`xit` — eslint and the edit hook reject them.

## Component tests

```ts
beforeEach(async () => {
    await TestBed.configureTestingModule({
        imports: [SharedTestModule, FlowsTableComponent],
        providers: [Apollo, provideToastr(), provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(FlowsTableComponent);
    component = fixture.componentInstance;
    loader = TestbedHarnessEnvironment.loader(fixture);
    component.nodes = mockFlowSummaryDataFragments;   // inputs set directly
    fixture.detectChanges();
});
```

(Abridged from `dataset-flow/flows-table/flows-table.component.spec.ts`.)

- Import the standalone component itself; add `SharedTestModule` (route snapshot mock) when the
  component or a base class reads the route. Provide only what the component's dependency tree
  needs: `provideToastr()`, `provideHttpClient(withInterceptorsFromDi())` +
  `provideHttpClientTesting()`, `Apollo` or `ApolloTestingModule` for anything reaching an api
  class. Material overlays need no animations provider.
- TestBed runs with zone-based change detection, like the app, and with exhaustive
  `checkNoChanges` (`src/test.ts`). `fixture.detectChanges()` does not re-render an OnPush
  component whose state a test changed after the first render, and the exhaustive check fails such
  a spec with NG0100. Set inputs with `fixture.componentRef.setInput()`; after changing internal
  state, call `fixture.debugElement.injector.get(ChangeDetectorRef).markForCheck()`.
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
`checkInputDisabled`, `findComponentInstance`, plus `routerMock`, `activeRouteMock`,
`snapshotParamMapMock` and `registerMatSvgIcons()`. Add an attribute to the template rather
than selecting by CSS class or element structure.

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

## Rejected approaches

| Approach | Why rejected |
|---|---|
| Selecting elements by CSS class or tag structure | Breaks on styling changes; `data-test-id` is the contract between template and test |
| Raw `nativeElement` clicks inside Material components | Depends on Material's internal DOM; the Material harnesses are the supported API |
| Hand-built Apollo response objects inline in specs | Not reusable and not type-checked against codegen; fixtures go to `api/mock/` |
| Testing private methods through `component["method"]` | Tests the implementation; drive the public inputs, outputs and DOM instead |
| DOM helpers for a new display-only component ("nothing to click, so no harness") | Assertions on texts, states and widths are as tied to DOM structure as clicks are, and the next spec that hosts the component has no API to reuse |

## What lives elsewhere

- Component and service style: `kamu-ui-angular-style`.
- Api classes and generated types: `kamu-ui-graphql-api`.
- Comments in specs: `kamu-ui-prose-and-comments`.
