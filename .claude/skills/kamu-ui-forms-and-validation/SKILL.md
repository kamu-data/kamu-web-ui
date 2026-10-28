---
name: kamu-ui-forms-and-validation
description: Form fields and their validation in Kamu Web UI — which validators a field needs, the validators and patterns in src/app/common/validation, how a field shows its errors with appFieldError, matching the rules kamu-cli applies, server errors shown on a field, the config-driven fields of the source event editor, and the tests every validated field gets. Use before adding or changing a form field, a validator, an appFieldError element, or a source editor config entry.
---

# Kamu UI Forms And Validation

A field that accepts a value kamu-cli rejects fails late: as a GraphQL error, a toast, or a panic when an
ingest runs (an MQTT port of `-5`). A field whose validator has no message keeps the form invalid without
saying why. Every field therefore gets the rules kamu-cli applies, a message for each, and a test for each.

## Checklist for every field

Go through it for each field a change adds or touches.

| Question | Where the answer goes |
|---|---|
| Is it required? Can it be blank (only spaces)? | `Validators.required`; `notBlankValidator()`, or `trim="blur"` from `NgxTrimDirectiveModule` when kamu-cli trims |
| Is it a number? Whole? Its smallest and largest value? | `integerInRangeValidators(min, max)` and the same `min` / `max` on the input |
| Is it a name, key or identifier with a grammar? A length limit? | `odfNameValidators()`, `envVarKeyValidators()`, a `FormatRule` in `patterns.ts` with `formatValidator()`, `Validators.maxLength`; `maxBytesValidator(max)` where kamu-cli counts UTF-8 bytes |
| Is it a URL? Which schemes? Does kamu-cli substitute `${{ env.NAME }}` templates in it? | `urlValidator([...schemes])`, with `{ templates: true }` for the fetch URLs kamu-cli templates |
| Must it differ from existing values or other entries of the list? Ignoring case? | `uniqueValueValidator(() => existing, options)`, `uniqueItemsValidator(key, options)` |
| Does it depend on another field? | `requiredUnlessValidator`, `matchFieldsValidator`; revalidate on the sibling's changes |
| What does kamu-cli accept? | Look it up in kamu-cli (below), then match it: never looser, and stricter only with a reason |
| Can kamu-cli still reject it? | Map the typed error result onto the field with `setServerError` |
| Is every error shown? | An `appFieldError` element with a `fieldLabel` equal to the visible label |
| Is every rule tested? | One case per validator with the exact message, submit disabled while invalid, a valid value accepted |

## Where the rules live

Every validator, pattern and message is in [`src/app/common/validation/`](../../../src/app/common/validation),
each file with its spec:

| File | Holds |
|---|---|
| `patterns.ts` | `FormatRule`s (a regex and the message shown after the label) and limits taken from kamu-cli |
| `identifier.validators.ts` | dataset and account names, variable keys |
| `url.validators.ts`, `number.validators.ts`, `text.validators.ts` | URLs; whole numbers and ranges; blank, one ASCII character, a byte length, ASCII, regular expressions |
| `collection.validators.ts` | a value not among existing ones; list entries not repeated |
| `password.validators.ts`, `cross-field.validators.ts` | new passwords as kamu-cli checks them, matching confirmation; one of two fields required (`requiredUnless`) |
| `cron.validators.ts` | cron expressions as kamu-cli parses them |
| `form-validation-errors.directive.ts`, `.types.ts` | `appFieldError` and the message for each error key |
| `server-errors.helpers.ts` | `setServerError(control, message)`, and `FieldMutationResult<T>` for the services that return such a rejection |

A new rule is a validator here with a spec, whose error key is in `VALIDATION_ERRORS` with a message in
`validationErrorMessage`. eslint rejects `Validators.pattern` everywhere: a pattern is a `FormatRule` with its
message, checked by `formatValidator()`.

## Showing errors

- Put an element with `appFieldError` under the input: `[input]="#ref"` with `[group]` for a
  `formControlName` input, or `[fieldControl]="control"`. `fieldLabel` is a required input; it starts most
  messages, so it matches the label the user sees. Give it a `dataTestId` for the harness.
- The directive shows the control's first error once the control is touched or dirty. It takes no list of
  keys, so a new validator's error shows without a template change. An error key with no message throws in
  dev mode, so every spec that renders the field fails.
- [`src/app/form-fields.spec.ts`](../../../src/app/form-fields.spec.ts) fails for a form input that no
  `appFieldError` reports on, unless the input is listed there with the reason it needs no message.
- A rejection kamu-cli returns as a typed result for one field (a duplicate label, a name taken) goes on that
  field through `setServerError`; it clears on the next change. The service returns it as a
  `FieldMutationResult<T>` (`{ ok: false, fieldError }`) instead of showing a toast or emitting it through a
  subject of its own, and the component sets it on the control. When a rejection can belong to one of several
  fields, the service names the field beside the message (`WebhookFieldError` in `dataset-webhooks.service.ts`).
  A toast is for errors that belong to no field.

## Matching kamu-cli

The UI checks what kamu-cli checks, so a value the form accepts is a value the server accepts. Before
writing a rule, find kamu-cli's: names and the grammar in `src/odf/metadata/src/formats/grammar.rs`,
column lengths in the Postgres migrations, input checks in the use cases under `src/domain/*/services`,
flow limits in `src/domain/flow-system/domain`, source event fields in the ODF schemas
(open-data-fabric repository) and in `src/infra/core/src/services/ingest`. Note what kamu-cli doesn't
check at all; that is a kamu-cli issue to raise, while the UI still guards the field.

## The source event editor

Its steps build controls from config files (`steps/data/*-form-data.ts`) through `SourceSection`:

- An entry lists `required` and `validators`; a NUMBER entry must state its `min` (and `max`), and the
  section adds the whole-number and range validators and the input's attributes from them.
- `dependsOn` revalidates an entry when another control of the step changes; `shownWhen` hides an entry
  without removing its control.
- Field components take their typed `control` and change nothing in the form; list fields show an error
  under each entry and one for the list.
- `steps/data/source-form-data.spec.ts` checks each rule on the controls a real section builds; add the
  new rule's cases there.

## Tests

Each validated field gets, through the component's CDK harness (`kamu-ui-unit-tests`):

- one test per validator with the exact message, using kamu-cli's boundary values (both sides of a range);
- a test that submit is disabled, or does nothing, while the form is invalid;
- a test that a valid value is accepted and reaches the service call;
- for a server-mapped error, a test that the stubbed result shows on the field.

`NativeInputHarness` drives plain inputs and selects, and `FieldErrorHarness` reads a message by test id.

## Rejected approaches

| Approach | Why rejected |
|---|---|
| A list of error keys on each `appFieldError` | The MQTT port listed `min` while its config set only `required`; a key listed with no validator hid the gap, and a validator with no listed key blocked the form silently |
| `Validators.pattern` with a regex inline | Its message was looked up by the regex text: an unmapped pattern showed "Url undefined", and the URL regex's precedence bug (`foo https://` passed) went unseen |
| rxweb validators | Their errors carried their own message format, and the range validator was only attached after a unit was picked |
| A field component that adds or removes controls | The event-time pattern stayed required after the kind changed, keeping the form invalid with nothing shown |
