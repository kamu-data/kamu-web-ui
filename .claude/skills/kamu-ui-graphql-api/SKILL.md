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
  before writing a new selection of the same type; a component receiving a slice of data types
  its input with the generated `XxxFragment`.
- Select what the screen uses. Include `__typename` where the code discriminates a union or an
  interface result (`... on CreateWebhookSubscriptionResultSuccess`).
- `.graphql` files use 2-space indentation. Prettier does not format them (`npm run prettier`
  covers `ts`, `scss`, `js`, `html`), so match the neighbouring documents by hand.

### Codegen

- After any `.graphql` change run `npm run gql-codegen` and keep the regenerated
  `kamu.graphql.interface.ts` in the same change. The file is generated — the edit hook refuses
  hand edits.
- Codegen config is `gql-codegen.yml`: `inlineFragmentTypes: combine`, unknown scalars default
  to `string`, `ExtraData` is `Record<string, any>`, `Uint64` is `number`. The generated header
  must import `gql` from `@apollo/client/core` (`gqlImport` in the config); if it ever shows
  `apollo-angular`, fix the config rather than the output.
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
            map((result: ObservableQuery.Result<DatasetWebhookSubscriptionsQuery>) => {
                return result.data as DatasetWebhookSubscriptionsQuery;
            }),
        );
}

public datasetWebhookCreateSubscription(datasetId: string, input: WebhookSubscriptionInput): Observable<DatasetWebhookCreateSubscriptionMutation> {
    return this.datasetWebhookCreateSubscriptionGQL.mutate({ variables: { datasetId, input } }).pipe(
        first(),
        map((result: ApolloLink.Result<DatasetWebhookCreateSubscriptionMutation>) => {
            return result.data as DatasetWebhookCreateSubscriptionMutation;
        }),
    );
}
```

- Queries: `.watch(...).valueChanges.pipe(onlyCompleteData(), first(), map(...))` — one complete
  value, then completion. Mutations: `.mutate(...).pipe(first(), map(...))`.
- Data that changes behind the UI's back (flows, statuses, lists the user just modified) uses
  `...noCacheFetchPolicy` from `@common/helpers/data.helpers`; stable data relies on the cache.
- Background polling and other requests that must not show the global spinner pass
  `context: { skipLoading: true }`.
- Mutations that change cached dataset fields update or evict them with `updateCacheHelper` /
  `resetCacheHelper` (`@common/helpers/apollo-cache.helper`). Type policies (`keyFields`,
  `merge`) live in `apolloCache()` in the same file — `Dataset` is keyed by `owner` and `id`.
- Domain logic, result mapping into view models and subject-based state belong in a domain
  service (`*.service.ts`) on top of the api class, not in the api class.
- GraphQL and network errors are handled globally by the error link in `src/main.ts` (toast,
  redirect on token errors). Result unions (`... Success` / `... Error` typenames) are domain
  outcomes and are handled by the caller.

### Tests

Every api method gets a case in `<domain>.api.spec.ts` using `ApolloTestingController`, with the
response fixture in `src/app/api/mock/<domain>.mock.ts` — the pattern is owned by
`kamu-ui-unit-tests`.

## Rejected approaches

| Approach | Why rejected |
|---|---|
| Injecting `XxxGQL` directly in components or domain services | Spreads fetch policy and result unwrapping across the app; the api class is the one place they live |
| Inline `gql` template literals in TypeScript | Codegen would not see them, so there would be no generated types or `Document` for tests |
| Editing `kamu.graphql.interface.ts` to unblock a build | Overwritten by the next codegen; fix the document or the schema instead |
| Returning `ObservableQuery.Result` / `ApolloLink.Result` from api methods | Callers would deal with Apollo envelopes; api methods return the operation data type |

## What lives elsewhere

- Specs, Apollo testing, mock fixtures: `kamu-ui-unit-tests`.
- Component and service style: `kamu-ui-angular-style`.
- How the backend implements the API: kamu-cli's `kamu-graphql-api` skill, in the kamu-cli
  repository.
