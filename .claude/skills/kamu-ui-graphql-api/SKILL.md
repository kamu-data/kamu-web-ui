---
name: kamu-ui-graphql-api
description: GraphQL work in Kamu Web UI — .graphql operation and fragment documents under src/app/api/gql, graphql-codegen and the generated kamu.graphql.interface.ts, *.api.ts classes over generated XxxGQL services, fetch policies, loader context, the Apollo cache helpers, and refreshing the schema from kamu-cli. Use before adding or changing a query, mutation or fragment, an api class, or the schema.
---

# Kamu GraphQL API

The UI talks to kamu-cli's GraphQL API through Apollo. Operations are written as `.graphql`
documents; `graphql-codegen` turns them, together with `resources/schema.graphql`, into typed
Angular services in `src/app/api/kamu.graphql.interface.ts`; hand-written `*.api.ts` classes wrap
those services for the rest of the app.

```
resources/schema.graphql  ──┐
src/app/api/gql/**/*.graphql ┴─ npm run gql-codegen ─→ src/app/api/kamu.graphql.interface.ts
                                                         (XxxGQL, XxxQuery, XxxDocument, XxxFragment)
                                                                │
                              src/app/api/<domain>.api.ts  ←────┘  ← services / components
```

## Rules

### Documents

- One operation per file under `src/app/api/gql/`, in the domain folder when one exists
  (`account/`, `webhooks/dataset/`, `flows-dataset/`, …). File names are kebab-case and match
  the operation: `dataset-webhook-by-id.graphql` holds `query datasetWebhookById(...)`.
- Operation names are camelCase and unique across the app — codegen derives every generated
  name from them (`datasetWebhookById` → `DatasetWebhookByIdGQL`, `DatasetWebhookByIdQuery`,
  `DatasetWebhookByIdDocument`).
- Reusable selections are fragments: `gql/fragments/fragment-<name>.graphql` (event fragments
  under `gql/fragments/events/`), spread as `...DatasetBasics`. Reuse an existing fragment
  before writing a new selection of the same type.
- Code that passes a slice of a result around types it with the generated `XxxFragment`: a
  component input, a service's return type, a helper's parameter. Never use the schema type of
  the same name (`DatasetFlowProcess`, `ViewDatasetEnvVar`): it lists every field the API has,
  not the ones the query fetched. When a slice the code passes around is selected inline, move
  the selection into a fragment and spread it, as `dataset-flows-processes.graphql` does with
  `...DatasetFlowProcessesData`.
- The same goes for a part of a bigger fragment or result: it gets its own named fragment, spread
  inside the parent (`...FlowTimingRecordsData` in `FlowSummaryData`). Code never cuts the type
  out of a generated one, either with indexed access (`FlowSummaryDataFragment["timing"]`,
  `XxxQuery["datasets"]["byId"]`) or with `Extract<XxxFragment, { __typename?: "…" }>` for a
  union member; eslint's `no-restricted-syntax` rejects both. A fragment is named after its type
  with the `Data` suffix (`FlowEventTaskChangedData on FlowEventTaskChanged`), and a `__typename`
  switch over a union of named fragments narrows as before.
- An api class reads its result without an assertion (see "`*.api.ts` classes"). A domain
  service reading into a result unwraps each nullable root once with `requireValue()` and a
  message, then reads plain properties:
  `requireValue(data.datasets.byId, "Dataset not found").flows.processes`. Unwrap only what the
  page guarantees (the dataset or account it already resolved, the `asVersionedFile` view on a
  versioned-file page); a field the schema leaves null as a real state, such as a versioned
  file's `latest` before the first upload, passes on as `null`.
- Select what the screen uses. Include `__typename` where the code discriminates a union or an
  interface result (`... on CreateWebhookSubscriptionResultSuccess`).
- `.graphql` files use 2-space indentation. Prettier does not format them (`npm run prettier`
  covers `ts`, `scss`, `js`, `html`), so match the neighbouring documents by hand.

### Codegen

- After any `.graphql` change run `npm run gql-codegen` and keep the regenerated
  `kamu.graphql.interface.ts` in the same change. The file is generated — the edit hook refuses
  hand edits.
- Codegen config is `gql-codegen.yml`: `inlineFragmentTypes: combine`, unknown scalars default
  to `string`, `ExtraData` is `Record<string, unknown>` (arbitrary JSON, narrowed where read),
  `Uint64` is `string`.
- `nonOptionalTypename` makes `__typename` a required literal on every generated object type,
  since Apollo adds it to every selection: a `switch` on it is exhaustive, and a typename lookup
  needs no cast. `skipTypeNameForRoot` leaves it off `Query` and `Mutation`, where Apollo does
  not add it. So a typed mock or a hand-built object carries `__typename` on every object except
  the operation root. The generated header
  must import `gql` from `@apollo/client/core` (`gqlImport` in the config); if it ever shows
  `apollo-angular`, fix the config rather than the output.
- `Uint64` stays `string` because the API sends it as a JSON string: a JSON number above 2^53
  loses precision in `JSON.parse`, and the backend rejects a number as input. Code that counts
  with one converts it, `Number()` for values known to be small (chain ids, byte sizes),
  `BigInt()` where the result must stay exact (offset arithmetic in `data.helpers.ts`).
- A codegen error means a document does not match the schema. Fix the document, or refresh the
  schema when the backend has moved on.

### Schema

- `resources/schema.graphql` is a copy of kamu-cli's `resources/schema.gql`.
  `npm run gql-update-schema` fetches it from kamu-cli `master`; commit the schema and the
  regenerated interface together. It is generated — never edited by hand.
- When the UI needs a backend change that is not on kamu-cli `master` yet, ask the user before
  copying the schema from a local kamu-cli checkout or branch, and say so in the hand-back:
  the UI then depends on an unreleased API.

### `*.api.ts` classes

One `@Injectable({ providedIn: "root" })` class per domain in `src/app/api/` (`DatasetApi`,
`AccountApi`, `WebhooksApi`, …). It injects the generated `XxxGQL` services and returns plain
`Observable`s of the operation result type.

```ts
public datasetWebhookSubscriptions(datasetId: string): Observable<DatasetWebhookSubscriptionsQuery> {
    return this.datasetWebhookSubscriptionsGQL
        .watch({ variables: { datasetId }, ...noCacheFetchPolicy })
        .valueChanges.pipe(
            onlyCompleteData(),
            first(),
            map((result: ObservableQuery.Result<DatasetWebhookSubscriptionsQuery, "complete">) => {
                return result.data;
            }),
        );
}

public datasetWebhookCreateSubscription(datasetId: string, input: WebhookSubscriptionInput): Observable<DatasetWebhookCreateSubscriptionMutation> {
    return this.datasetWebhookCreateSubscriptionGQL
        .mutate({ variables: { datasetId, input } })
        .pipe(first(), mutationData());
}
```

- Queries: `.watch(...).valueChanges.pipe(onlyCompleteData(), first(), map(...))` — one complete
  value, then completion. `onlyCompleteData()` narrows to the `"complete"` state, where `data` is
  the full `XxxQuery`; annotate the `map` parameter with that state, as above. The plain
  `ObservableQuery.Result<XxxQuery>` covers the empty and partial states too, so `data` turns
  back into `XxxQuery | undefined` and invites a cast.
- Mutations: `.mutate(...).pipe(first(), mutationData())` (`@common/helpers/apollo-error.helpers`),
  then a `map` over the `XxxMutation` when the method returns a part of it. apollo-angular types
  mutation `data` as possibly `undefined` whatever the error policy; with the default policy a
  failed mutation errors the observable instead, so `mutationData()` unwraps with a runtime check.
- Apollo emits a failed query as a result carrying `error`, and `onlyCompleteData()` drops it: the
  observable then neither emits nor errors, and a caller's `catchError` never runs. A query whose
  callers react to failure uses `completeDataOrError()` (`@common/helpers/apollo-error.helpers`)
  in its place (`getDatasetSchema`, `readEnabledLoginMethods`), and every caller handles the
  error. Cover it with a spec that answers through `ApolloTestingController`'s `graphqlErrors()` /
  `networkError()`; a mocked `throwError` skips the Apollo path.
- Data that changes behind the UI's back (flows, statuses, lists the user just modified) uses
  `...noCacheFetchPolicy` from `@common/helpers/data.helpers`; stable data relies on the cache.
- Background polling and other requests that must not show the global spinner pass
  `context: { skipLoading: true }`.
- Mutations that change cached dataset fields update or evict them with `updateCacheHelper` /
  `resetCacheHelper` (`@common/helpers/apollo-cache.helper`). Type policies (`keyFields`,
  `merge`) live in `apolloCache()` in the same file — `Dataset` is keyed by `owner` and `id`.
- Domain logic, result mapping into view models and subject-based state belong in a domain
  service (`*.service.ts`) on top of the api class, not in the api class.
- GraphQL and network errors are handled globally by the error link from
  `createApolloErrorLink` (`src/app/common/helpers/apollo-error.helpers.ts`), which `src/main.ts`
  adds to the Apollo link chain (toast, redirect on token errors). Result unions (`... Success` / `... Error` typenames) are domain
  outcomes and are handled by the caller.

### Tests

Every api method gets a case in `<domain>.api.spec.ts` using `ApolloTestingController`, with the
response fixture in `src/app/api/mock/<domain>.mock.ts` — the pattern is owned by
`kamu-ui-unit-tests`.

## Rejected approaches

| Approach | Why rejected |
|---|---|
| Injecting `XxxGQL` directly in components or domain services | Spreads fetch policy and result unwrapping across the app; the api class is the one place they live |
| Typing results with full schema types (`DatasetFlowProcesses`, `ViewDatasetEnvVar`) | The type promises fields the query never fetched, so the compiler cannot tell when code reads one, and every spec has to cast its fragment-shaped mocks up to the schema type, which hides a stale field as well. A fragment-typed input takes the same mocks with no cast |
| Typing a part of a result as `XxxFragment["field"]` or `Extract<XxxFragment, …>` | The type has no name to search for or read in a signature, chains grow with the nesting (`["datasets"]["byId"]…["byType"]`), and the selection it describes cannot be reused by another document. A named sub-fragment gives the part a name in both the document and the code |
| Inline `gql` template literals in TypeScript | Codegen would not see them, so there would be no generated types or `Document` for tests |
| Editing `kamu.graphql.interface.ts` to unblock a build | Overwritten by the next codegen; fix the document or the schema instead |
| Returning `ObservableQuery.Result` / `ApolloLink.Result` from api methods | Callers would deal with Apollo envelopes; api methods return the operation data type |
| `result.data as XxxQuery` / `as XxxMutation` in api methods | A wide `ObservableQuery.Result<XxxQuery>` annotation drops the `"complete"` narrowing `onlyCompleteData()` gives, so `data` looks optional and needs a cast; an unchecked cast also hides a stale field. The `"complete"` annotation and `mutationData()` give the full type with no assertion |

## What lives elsewhere

- Specs, Apollo testing, mock fixtures: `kamu-ui-unit-tests`.
- Component and service style: `kamu-ui-angular-style`.
- How the backend implements the API: kamu-cli's `kamu-graphql-api` skill, in the kamu-cli
  repository.
