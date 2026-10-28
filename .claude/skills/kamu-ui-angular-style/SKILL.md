---
name: kamu-ui-angular-style
description: Angular and TypeScript coding style for Kamu Web UI — component anatomy, dependency injection with inject(), OnPush change detection, subscriptions and DestroyRef, render hooks, DOM access and timers, base component classes, state in RxJS services, templates, file naming, constants and UI strings, path aliases and the license header. Use before writing or editing any TypeScript, template or style under src/app; the edit hook requires it for every such file.
---

# Kamu Angular Style

Follow the style of the surrounding code first; the rules below settle what surrounding code
leaves open. Layout and import order belong to prettier (with `@ianvs/prettier-plugin-sort-imports`),
which the post-edit hook runs on each edited file; `npm run lint` (typescript-eslint strict) and
`npm run stylelint` own what lints can see. This skill owns the rest.

## Rules

### Component anatomy

```ts
@Component({
    selector: "app-time-delta-form",
    templateUrl: "./time-delta-form.component.html",
    styleUrls: ["./time-delta-form.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        //-----//
        ReactiveFormsModule,
        //-----//
        FormValidationErrorsDirective,
    ],
})
export class TimeDeltaFormComponent extends BaseComponent implements OnInit {
    @Input({ required: true }) public form: FormGroup<TimeDeltaFormType>;
    @Input() public label: string = "Launch every:";

    private readonly cdr = inject(ChangeDetectorRef);
    ...
}
```

- Components are standalone; do not write `standalone: true` (the Angular default — the hook
  flags it) and do not add `NgModule`s.
- `changeDetection: ChangeDetectionStrategy.OnPush` on every new component. When state changes
  outside an input or an `async` pipe, call `cdr.markForCheck()`.
- Selector prefix `app-`; separate `templateUrl` / `styleUrls` (SCSS) files, no inline templates
  outside test host components.
- `imports` is written one entry per line, in groups, each group opened by a `//-----//` line:
  Angular building blocks (`AsyncPipe`, `NgClass`, `RouterLink`, forms modules), then Material
  and third-party modules, then app components, directives and pipes. The opening separator also
  keeps prettier from folding the array onto one line. When an edit or an automated migration
  empties a group, drop that group's separator but keep the others; never collapse the array.
  Import `AsyncPipe`, `NgClass` and the like individually, not `CommonModule`.
- Inputs and outputs use the decorators — `@Input({ required: true })`, `@Input()`, `@Output()`
  with an `EventEmitter` — matching the rest of the codebase. Do not migrate to signal inputs,
  `input()`/`output()` or signals unless the user asks for that migration.
- An input never takes the name of an HTML attribute (`class`, `style`, `title`, `id`): a static
  attribute such as `class="mr-4"` sets the input and the host element alike, so the classes apply
  twice. Name it for its target (`hashClass` on `app-display-hash`).
- An input, a service result or a helper parameter is typed with what really reaches it, so
  neither the app nor its specs need a cast to pass data in:
  - GraphQL data: the type rules are in `kamu-ui-graphql-api`, "Documents".
  - An input bound from a route or query parameter is `MaybeUndefined<T>`: the router sets it to
    `undefined` when the parameter is missing. A query parameter input also takes
    `transform: queryParamValue` (`kamu-ui-routing`, "Route anatomy").
- Templates use the built-in control flow: `@if` / `@else`, `@for` and `@switch`. Never
  `*ngIf`, `*ngFor` or `[ngSwitch]`, which Angular deprecates for removal. Pick the `@for`
  `track` expression by where the list comes from:
  - API data, which a re-fetch or poll replaces with new objects: its unique key
    (`dataset.id`, `block.blockHash`, `flow.flowId`, `event.eventId`);
  - constant option lists, `FormArray` controls and lists edited in place: the item itself
    (`track item`), since the object is the identity;
  - unique strings: the value; `$index` only for content with no identity at all;
  - a list rebuilt from state, whose items are new objects each time, such as the fields of the
    kind selected in a source event step: the thing each row stands for, here the form control
    (`track field.control`). A kind switch builds new controls, so their rows render afresh, while
    a control two kinds share keeps its row and what the user typed. Tracking by the rebuilt item
    re-creates every row, which Angular reports as NG0956, and a key built from component state
    (`currentKind + "." + name`) matches old rows to new ones, since Angular computes it for both
    after the state has changed.

  Write the key inline; keep a method only when choosing the key needs logic, and give it just
  the item.
- A paginated list that comes back empty on a page after the first shows `app-page-past-end`,
  which leads to the last page, instead of its pager or its "no items yet" message: the URL can
  ask for any page, and the list's own empty state would claim there are no items at all.
- Every element a test needs gets a `data-test-id="..."` attribute; tests select on it, never on
  CSS classes.

### Dependency injection

- `private foo = inject(Foo);` fields (optionally `readonly`). Never constructor parameter
  injection — the hook flags it.
- Every member states its accessibility: `public`, `protected` or `private` (eslint
  `explicit-member-accessibility`). Public static constants are `public static readonly`.
- A functional guard, resolver or interceptor opens with its `inject()` calls as one block, one
  service per `const`, then a blank line, then the logic. Read values from the injected services
  in the logic part, not inline as `inject(X).value`:

  ```ts
  export const accountPasswordProviderGuard: CanActivateFn = () => {
      const loggedUserService = inject(LoggedUserService);
      const navigationService = inject(NavigationService);

      const accountProvider = loggedUserService.maybeCurrentlyLoggedInUser?.accountProvider;
      return accountProvider === AccountProvider.Password || navigationService.homeUrlTree();
  };
  ```

- The SQL and YAML editor components carry their own Monaco config
  (`MONACO_EDITOR_CONFIG_PROVIDER` in `src/app/editor/editor.providers.ts`), so a page, modal or
  spec that hosts one adds no editor provider. Keep it there: in `main.ts` the config pulls
  ngx-monaco-editor-v2 into the initial bundle (a 4.4 kB initial chunk in a production build).

### Subscriptions and lifetimes

- Prefer the `async` pipe in templates over manual subscriptions.
- An observable a template reads with `async` is a `readonly` field built once, never a getter:
  `pipe()` and `asObservable()` return a new observable on each call, so the pipe unsubscribes
  and resubscribes on every change detection pass. A spec stubs the field's source before
  `TestBed.createComponent`, since the field reads it at construction.
- A manual `subscribe` in a component or directive pipes through
  `takeUntilDestroyed(this.destroyRef)`. `destroyRef` comes from the base classes below; outside
  them, `private destroyRef = inject(DestroyRef)`.
- API observables complete after one value (`first()`), so one-shot calls need no teardown. A
  mutation must not get one when its service reports the result itself, as a toast in its `map`:
  tear down only what follows it, such as the delay before a refresh, so the result still shows
  when the user leaves the page mid-request.

### Busy state of an action

A button whose action shows its result only later (a mutation, a delay, a refresh) stays
disabled until then, or a second click repeats the action against a stale label.

- Build the action as one observable chain, from the mutation to the refreshed data, and pipe it
  through `trackBusy(busy$)` for one action or `trackBusyKey(busyKeys$, key)` for one per item,
  both from `@common/helpers/app.helpers`. The template reads the subject with `async`
  (`(busy$ | async) ?? false`, or `@let busyIds = busyIds$ | async;` and
  `busyIds?.has(id) ?? false`). `finalize` ends the busy state on completion, error and
  unsubscribe, so no branch clears it by hand and an error still reaches the global handler.
- An action that did not happen, such as a failed trigger or a cancelled confirmation,
  completes without a value (`filter(Boolean)`, `EMPTY`) rather than emitting `false` for the
  caller to branch on.
- A confirmation the user answers first stays outside the busy chain:
  `confirm$.pipe(switchMap(() => action$.pipe(trackBusyKey(...))))`. The modal closes on Escape
  without calling its `handler`, so a busy state that began before it would never end.
- To wait for data loaded after some point, compose the streams the loading already has, for
  example `loadStarted$.pipe(take(1), switchMap(() => loaded$.pipe(take(1))))` under a
  `switchMap` that cancels older loads, not a counter or flag compared later.

### Render timing, DOM access and timers

Write code that works without zone.js. Angular re-renders after a template event, an `async`
pipe emission, a navigation or `markForCheck()` (see Component anatomy); a timer, a listener the
code added itself, or a third-party callback triggers none of them.

| Need | Use | Not |
|---|---|---|
| Touch the DOM once a change has rendered: focus, scroll, mark invalid inputs touched | `afterNextRender(() => ...)` in a constructor, or with `{ injector }` from a method | `setTimeout(fn)`, `setTimeout(fn, 50)` |
| Read layout: `clientHeight`, `offsetTop`, `getBoundingClientRect()` | `afterNextRender({ read: () => ... })` | measuring in `ngOnInit` or `ngAfterViewInit` |
| Post-process what a library rendered, such as Run buttons on markdown | the library's completion output, e.g. ngx-markdown `(ready)` | DOM work in `ngAfterViewChecked`, `ngDoCheck` or `afterEveryRender` |
| Render a component chosen at runtime from data, such as a row's presentation component | `*ngComponentOutlet="type; inputs: { ... }"` in the template, which follows input changes; the rendered components handle a new input in `ngOnChanges` or getters, since `track $index` reuses them | `ViewContainerRef.createComponent` in `ngAfterViewInit` or `ngAfterViewChecked` |
| Open a component from code, such as the modal host on a service command | `ViewContainerRef.createComponent(Type)` | `ComponentFactoryResolver`, deprecated |
| Wait a fixed time for the backend, then refresh or navigate | `timer(ms).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(...)` | a bare `setTimeout`, which outlives the component |
| Change template state from a timer, `fromEvent`, `addEventListener` or third-party callback | `this.cdr.markForCheck()` after the change, or emit into a subject the template reads with `async` | relying on zone.js to notice |

- DOM queries start from the component's own element (`ElementRef`,
  `@ViewChild(X, { read: ElementRef })`), never `document.querySelector*` or `getElementById`:
  a document-wide query reaches other components' DOM.
- `afterNextRender` runs only after a render happens. A template event handler or a navigation
  produces one; from anywhere else, also call `markForCheck()`.
- `setTimeout` is acceptable only when its callback changes nothing a template shows: a pure DOM
  effect (resetting a copy icon), waiting out the browser's default action for the current event
  (refocusing after Tab), or a delay in a root service whose callback navigates or hands control
  back to a component that notifies Angular itself.

### Promises and `await`

- One `await` per expression, never used as the operand of another: no `await (await x()).y()`
  and no `(await x()).y`. Assign each awaited value to a `const` first, then use it on the
  next line. A single `await` passed as an argument, as in `expect(await harness.getTitle())`,
  is fine.

### Base classes (`src/app/common/components/`)

| Class | Gives you | Extend when |
|---|---|---|
| `UnsubscribeDestroyRefAdapter` | `protected destroyRef` | The component subscribes and needs nothing else |
| `BaseComponent` | the above + `activatedRoute`, `getDatasetInfoFromUrl()`, `datasetInfoFromUrlChanges`, `pageFromUrl()` | It reads route parameters |
| `BaseProcessingComponent` | `BaseComponent` + `navigationService`, `modalService` | It navigates or opens modals |
| `BaseDatasetDataComponent` | `BaseProcessingComponent` + `datasetService`, `datasetSubsService`, `datasetBasics$`, `datasetPermissions$` | It shows the current dataset |

### State and services

- State lives in `@Injectable({ providedIn: "root" })` services as RxJS subjects
  (`ReplaySubject(1)` / `BehaviorSubject`) exposed through `get xxxChanges(): Observable<T>` and
  updated through `emitXxxChanged(value)` methods. No NgRx, no component-level stores.
- Components never inject generated `XxxGQL` classes; they go through an `*.api.ts` class
  (owned by `kamu-ui-graphql-api`) or a domain `*.service.ts` above it.
- HTTP interceptors are functional `HttpInterceptorFn`s, registered in order in `main.ts` with
  `provideHttpClient(withInterceptors([...]))`. State that must outlive one request, such as the
  spinner's pending-request count, lives in a root service the interceptor injects.

### Nullable types

- Write a nullable type as `MaybeNull<T>`, `MaybeUndefined<T>` or `MaybeNullOrUndefined<T>` from
  `@interface/app.types`, never as an inline `T | null` / `T | undefined` union. This applies
  everywhere a type is written: fields, parameters, return types (`Promise<MaybeNull<string>>`),
  generics, and in specs and harnesses as much as in app code.
- An optional interface property stays `name?: T`.
- Unwrap guaranteed values with `requireValue()` from `@common/helpers/app.helpers`, not with `!`.

### Files, names and constants

- kebab-case file names with a role suffix: `.component.ts/.html/.scss`, `.service.ts`,
  `.api.ts`, `.guard.ts`, `.resolver.ts`, `.pipe.ts`, `.directive.ts`, `.helpers.ts`,
  `.model.ts`, `.types.ts`, `.interface.ts`, `.constants.ts`, `.text.ts`, `.values.ts`,
  `.harness.ts`, `.mock.ts`.
- Route segments and URL parameter names: `ProjectLinks` (`src/app/project-links.ts`, owned by
  `kamu-ui-routing`). App-wide constants: `AppValues` (`@common/values/app.values`). Error
  messages: `ErrorTexts` (`@common/values/errors.text`). Tooltip and longer UI texts: a
  `*.text.ts` file (`@common/tooltips/`) — not string literals scattered through templates.
- Imports use the path aliases `@common/*`, `@api/*`, `@interface/*`, `@env/*`; everything
  else is imported as `src/app/...`. Relative imports only for siblings in the same feature
  folder.
- Every new file under `src/app` starts with the license header from
  `src/docs/license-header-template.js` (eslint enforces it; the hook checks new files).
- Feature-gated UI uses the `appFeatureFlag="area.feature"` directive; the flag list comes from
  the runtime app config through `FeatureFlagsService`.

### Component styles

- A component's stylesheet styles only its own template; no `::ng-deep` (stylelint rejects it).
- Customise Material through its tokens, with the `mat.<component>-overrides(...)` mixins or the
  shared ones in `src/assets/styles/_material-overrides.scss`. The prebuilt theme sets checkbox,
  slide-toggle, menu and button-toggle tokens on `html`, so an override under `:host` reaches the
  subtree; it sets chip and radio tokens on the component element, so include those on the
  element in the template (`mat-chip.mat-mdc-standard-chip { ... }`).
- What no token covers (Material internals such as the checkbox box size) and third-party markup
  (`ngb-pagination`, `ng-select`, `angular2-multiselect`) get a specific global class in
  `src/assets/styles/components/`, which the template puts on the element.
- Check that a Material class still exists before styling it, or before deleting a rule as dead:
  search every bundle in `node_modules/@angular/material/fesm2022`, not only the component's
  own, since shared chunks set some classes (`mdc-form-field` comes from
  `_internal-form-field-chunk.mjs`). Pre-MDC names (`.mat-radio-label`,
  `.mat-slide-toggle-ripple`) match nothing.

### Lints and suppressions

- No `console.log` (eslint `no-console`); no `eslint-disable` comments — fix the cause, or ask
  the user first (AGENTS.md, "Validation").
- Unused parameters are prefixed `_`; `any` is avoided in favour of real or generated types.
- `.html` templates are linted too (the angular-eslint block in `eslint.config.mjs`);
  `npm run lint-and-fix` applies the rules that have fixers, such as self-closing tags and plain
  attributes for static strings. A template has at most 10 control-flow branches
  (`cyclomatic-complexity`): past that, move a branch's markup into a child component. The
  templates listed in that rule's block are over the limit until they are split; remove one
  once it is under, and add none.
- No type assertions (`x as T`); eslint's `consistent-type-assertions` rejects them. Narrow
  instead: `requireValue()` for a value that must be there, a `__typename` switch for a GraphQL
  union, `instanceof` for DOM elements and events, `enumValueOf(Enum, value)` for a string that
  should be an enum member (it returns `undefined` for any other), `oneOf(VALUES, value)` for a
  string literal union derived from an `as const` array, `isRecord()` for an object read by key,
  `openModal(ngbModal, XModalComponent)` from `@common/helpers/modal.helpers` for a modal whose
  inputs the caller sets, which returns its typed `instance` beside the `modalRef`.
  A typed form's value comes from `getRawValue()`, whose type is not `Partial`; a control that
  always holds a value is built `nonNullable`, and a getter returns the control's own type, not
  `AbstractControl`. A form whose controls depend on a selected kind, such as a step of the source
  event editor, declares every control a kind can add as optional (`url?: FormControl<string>`)
  and adds them from a config typed by those names (`SourceSection` and `JsonFormControl<T>` in
  `metadata-component/components/source-events`), so a config entry cannot name a missing control,
  build one of another type or render it with the wrong field. A shared field component takes the
  control itself as a typed `control` input, never a form and a control name; `SourceSection.fields`
  hands each field the control built for it. A value that arrives as `any` goes through `@common/helpers/untyped-boundary.helpers`: `parseJsonAs<T>()` for
  `JSON.parse`, `parseYamlAs<T>()` for YAML, `routeDataAs<T>()` for a value another route's
  resolver stored in route data. That file is the one place app code may assert, and eslint
  exempts it. Any other value that arrives as `any` or `unknown`, such as an HTTP error body or the
  detail a validator stored in its errors, is checked field by field with `isRecord()` and
  `typeof` (`parseVerifyQueryFailure` in `query-explainer.helpers.ts`).
- Templates hold no non-null assertions (`x!`, `(x$ | async)!`) and no `$any()`; eslint's
  angular-eslint template rules reject both in `.html` files. Angular's template type-check does
  not narrow a deep path such as `a.b.c` under `@if (a.b.c?.length)`, nor an `@let` variable, so
  narrow through an alias
  (`@if (a.b.c; as c)`), give a value whose absence means a default its default
  (`@let rows = (rows$ | async) ?? [];`), or type the input with what really reaches it.

## Rejected approaches

| Approach | Why rejected |
|---|---|
| Migrating touched components to signals / `input()` as part of an unrelated change | Mixed idioms in one feature make it harder to read; a migration is its own change, done when asked |
| `*ngIf` / `*ngFor` / `[ngSwitch]` | Deprecated in Angular 20 with removal intended in v22; every template uses block control flow, which also needs no directive imports |
| Class interceptors through `HTTP_INTERCEPTORS` and `withInterceptorsFromDi()` | Their order follows provider registration rather than a list, and they need the DI bridge that Angular keeps only for compatibility |
| Constructor injection | Inconsistent with the rest of the codebase; `inject()` works in base classes and field initializers |
| Default change detection on new components | Every feature is built for `OnPush`; Default hides missing `markForCheck` calls until a parent switches |
| A busy flag set before an action and cleared in its callbacks, or a counter of loads compared later | The flag missed the error, cancel and leave paths until each got its own branch, and a later poll response could clear it early; the counter was mutable bookkeeping for what `switchMap` and two subjects already express. `trackBusy` / `trackBusyKey` over the whole chain cover every path through `finalize` |
| Component-level `Subject` + `ngOnDestroy` teardown | `takeUntilDestroyed(this.destroyRef)` does the same with less code and cannot be forgotten in `ngOnDestroy` |
| `setTimeout(fn, N)` to wait until the view has rendered | Guesses the timing: too short on a slow machine, wasted time on a fast one, and without zone.js it triggers no change detection; `afterNextRender` runs exactly after the render |
| DOM work in `ngAfterViewChecked` | Runs after every change detection pass in the app: the markdown Run-button helper queried the whole document on each pass, and the dynamic event view recreated all its property components each time |
| `::ng-deep` in component styles | Deprecated by Angular, and it turns encapsulation off: a rule not nested under `:host` leaked app-wide once its component loaded (the data-access tab resized every checkbox, the account flows page every `ng-select`), and rules written for pre-MDC class names silently matched nothing in Material 21. Tokens and specific global classes (Component styles) cover every case it was used for |
| Creating data-driven components into `@ViewChildren` containers in `ngAfterViewInit` | Runs once: when the input changed, the metadata event rows kept showing the previous event's values. `NgComponentOutlet` re-applies its `inputs` on every change and recreates the component when the type or the tracked item changes |

## What lives elsewhere

- GraphQL documents, `*.api.ts` classes, codegen: `kamu-ui-graphql-api`.
- Routes, lazy loading, guards and resolvers wiring: `kamu-ui-routing`.
- Specs, harnesses, mocks: `kamu-ui-unit-tests`.
- Comments: `kamu-ui-prose-and-comments`.
- Form fields and their validation rules: `kamu-ui-forms-and-validation`.
- A whole new page end to end: `kamu-ui-adding-a-page`.
