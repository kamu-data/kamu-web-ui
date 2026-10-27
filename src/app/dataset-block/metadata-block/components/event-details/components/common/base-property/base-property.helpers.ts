/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { distinctUntilChanged, map, Observable, of, startWith, switchMap } from "rxjs";

import { isRecord } from "@common/helpers/app.helpers";
import { DatasetBasicsFragment, DatasetByIdQuery } from "@api/kamu.graphql.interface";
import { MaybeNull } from "@interface/app.types";

/**
 * Resolves each distinct dataset id to the dataset it names. For every new id it emits `null`
 * at once, then the loaded dataset, or nothing more when the id is `null`. A response for an id
 * that has since been replaced is dropped. `null` also stands for an id that matches no dataset.
 */
export function datasetByIdChanges(
    datasetIds$: Observable<MaybeNull<string>>,
    requestDatasetInfoById: (datasetId: string) => Observable<DatasetByIdQuery>,
): Observable<MaybeNull<DatasetBasicsFragment>> {
    return datasetIds$.pipe(
        distinctUntilChanged(),
        switchMap((datasetId: MaybeNull<string>) =>
            datasetId === null
                ? of(null)
                : requestDatasetInfoById(datasetId).pipe(
                      map((dataset: DatasetByIdQuery) => dataset.datasets.byId ?? null),
                      startWith(null),
                  ),
        ),
    );
}

/** Whether `data` is a GraphQL object of one of `typenames`, as Apollo tags every object it returns. */
export function hasTypename(data: unknown, ...typenames: string[]): boolean {
    return isRecord(data) && typeof data.__typename === "string" && typenames.includes(data.__typename);
}

/** Whether `data` is a list of GraphQL objects of `typename`. */
export function isListOfTypename(data: unknown, typename: string): boolean {
    return Array.isArray(data) && data.every((item) => hasTypename(item, typename));
}
