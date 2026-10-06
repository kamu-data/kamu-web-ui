---
name: kamu-ui-angular-style
description: Angular and TypeScript coding style for Kamu Web UI — component anatomy, dependency injection with inject(), OnPush change detection, subscriptions and DestroyRef, base component classes, state in RxJS services, templates, file naming, constants and UI strings, path aliases and the license header. Use before writing or editing any TypeScript, template or style under src/app; the edit hook requires it for every such file.
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
        NgFor,
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
- `imports` is grouped by `//-----//` separators: Angular building blocks, then Material and
  third-party modules, then app components, directives and pipes. Import `NgIf`, `NgFor`,
  `AsyncPipe` individually, not `CommonModule`.
- Inputs and outputs use the decorators — `@Input({ required: true })`, `@Input()`, `@Output()`
  with an `EventEmitter` — matching the rest of the codebase. Do not migrate to signal inputs,
  `input()`/`output()` or signals unless the user asks for that migration.
- Templates use `*ngIf` / `*ngFor` (with `trackBy` for lists that re-render) like every other
  template; do not introduce `@if` / `@for` control flow piecemeal.
- Every element a test needs gets a `data-test-id="..."` attribute; tests select on it, never on
  CSS classes.

### Dependency injection

- `private foo = inject(Foo);` fields (optionally `readonly`). Never constructor parameter
  injection — the hook flags it.
- Every member states its accessibility: `public`, `protected` or `private` (eslint
  `explicit-member-accessibility`). Public static constants are `public static readonly`.

### Subscriptions and lifetimes

- Prefer the `async` pipe in templates over manual subscriptions.
- A manual `subscribe` in a component or directive pipes through
  `takeUntilDestroyed(this.destroyRef)`. `destroyRef` comes from the base classes below; outside
  them, `private destroyRef = inject(DestroyRef)`.
- API observables complete after one value (`first()`), so one-shot calls need no teardown.

### Base classes (`src/app/common/components/`)

| Class | Gives you | Extend when |
|---|---|---|
| `UnsubscribeDestroyRefAdapter` | `protected destroyRef` | The component subscribes and needs nothing else |
| `BaseComponent` | the above + `activatedRoute`, `getDatasetInfoFromUrl()`, `datasetInfoFromUrlChanges` | It reads route parameters |
| `BaseProcessingComponent` | `BaseComponent` + `navigationService`, `modalService` | It navigates or opens modals |
| `BaseDatasetDataComponent` | `BaseProcessingComponent` + `datasetService`, `datasetSubsService`, `datasetBasics$`, `datasetPermissions$` | It shows the current dataset |
| `BaseFormControlComponent<T>` | `BaseComponent` + `ControlValueAccessor` / `Validator` plumbing | It is a custom form control |

### State and services

- State lives in `@Injectable({ providedIn: "root" })` services as RxJS subjects
  (`ReplaySubject(1)` / `BehaviorSubject`) exposed through `get xxxChanges(): Observable<T>` and
  updated through `emitXxxChanged(value)` methods. No NgRx, no component-level stores.
- Components never inject generated `XxxGQL` classes; they go through an `*.api.ts` class
  (owned by `kamu-ui-graphql-api`) or a domain `*.service.ts` above it.
- Nullable values use `MaybeNull<T>` / `MaybeUndefined<T>` / `MaybeNullOrUndefined<T>` from
  `@interface/app.types`; unwrap guaranteed values with `requireValue()` from
  `@common/helpers/app.helpers`, not with `!`.

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

### Lints and suppressions

- No `console.log` (eslint `no-console`); no `eslint-disable` comments — fix the cause, or ask
  the user first (AGENTS.md, "Validation").
- Unused parameters are prefixed `_`; `any` is avoided in favour of real or generated types.

## Rejected approaches

| Approach | Why rejected |
|---|---|
| Migrating touched components to signals / `input()` / `@if` as part of an unrelated change | Mixed idioms in one feature make it harder to read; a migration is its own change, done when asked |
| Constructor injection | Inconsistent with the rest of the codebase; `inject()` works in base classes and field initializers |
| Default change detection on new components | Every feature is built for `OnPush`; Default hides missing `markForCheck` calls until a parent switches |
| Component-level `Subject` + `ngOnDestroy` teardown | `takeUntilDestroyed(this.destroyRef)` does the same with less code and cannot be forgotten in `ngOnDestroy` |

## What lives elsewhere

- GraphQL documents, `*.api.ts` classes, codegen: `kamu-ui-graphql-api`.
- Routes, lazy loading, guards and resolvers wiring: `kamu-ui-routing`.
- Specs, harnesses, mocks: `kamu-ui-unit-tests`.
- Comments: `kamu-ui-prose-and-comments`.
- A whole new page end to end: `kamu-ui-adding-a-page`.
