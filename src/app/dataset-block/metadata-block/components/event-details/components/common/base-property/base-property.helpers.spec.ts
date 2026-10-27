/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { of, Subject } from "rxjs";

import type { Mock } from "vitest";

import { DatasetBasicsFragment, DatasetByIdQuery } from "@api/kamu.graphql.interface";
import { mockDatasetByIdQuery } from "@api/mock/dataset.mock";
import { MaybeNull } from "@interface/app.types";

import {
    datasetByIdChanges,
    hasTypename,
    isListOfTypename,
} from "src/app/dataset-block/metadata-block/components/event-details/components/common/base-property/base-property.helpers";

describe("datasetByIdChanges", () => {
    const FIRST_DATASET_ID = "did:odf:first";
    const SECOND_DATASET_ID = "did:odf:second";
    const mockMissingDatasetByIdQuery: DatasetByIdQuery = {
        datasets: { __typename: "Datasets", byId: null },
    };

    let datasetIds$: Subject<MaybeNull<string>>;
    let requestSpy: Mock;
    let emitted: MaybeNull<DatasetBasicsFragment>[];
    let firstResponse$: Subject<DatasetByIdQuery>;
    let secondResponse$: Subject<DatasetByIdQuery>;

    beforeEach(() => {
        datasetIds$ = new Subject<MaybeNull<string>>();
        firstResponse$ = new Subject<DatasetByIdQuery>();
        secondResponse$ = new Subject<DatasetByIdQuery>();
        requestSpy = vi
            .fn()
            .mockImplementation((datasetId: string) =>
                datasetId === FIRST_DATASET_ID ? firstResponse$ : secondResponse$,
            );
        emitted = [];
        datasetByIdChanges(datasetIds$, requestSpy).subscribe((dataset) => emitted.push(dataset));
    });

    it("should emit null for a new id, then the dataset once it loads", () => {
        datasetIds$.next(FIRST_DATASET_ID);
        expect(requestSpy).toHaveBeenCalledTimes(1);
        expect(requestSpy).toHaveBeenCalledWith(FIRST_DATASET_ID);
        expect(emitted).toEqual([null]);

        firstResponse$.next(mockDatasetByIdQuery);
        expect(emitted).toEqual([null, mockDatasetByIdQuery.datasets.byId ?? null]);
    });

    it("should not request the same id twice in a row", () => {
        datasetIds$.next(FIRST_DATASET_ID);
        datasetIds$.next(FIRST_DATASET_ID);

        expect(requestSpy).toHaveBeenCalledTimes(1);
        expect(emitted).toEqual([null]);
    });

    it("should emit null without a request for a null id", () => {
        datasetIds$.next(null);

        expect(requestSpy).not.toHaveBeenCalled();
        expect(emitted).toEqual([null]);
    });

    it("should emit null when the id matches no dataset", () => {
        requestSpy.mockReturnValue(of(mockMissingDatasetByIdQuery));

        datasetIds$.next(FIRST_DATASET_ID);

        expect(emitted).toEqual([null, null]);
    });

    it("should drop the response for an id that was replaced before it arrived", () => {
        datasetIds$.next(FIRST_DATASET_ID);
        datasetIds$.next(SECOND_DATASET_ID);
        firstResponse$.next(mockDatasetByIdQuery);

        expect(emitted).toEqual([null, null]);
    });

    it("should drop a pending response once the id becomes null", () => {
        datasetIds$.next(FIRST_DATASET_ID);
        datasetIds$.next(null);
        firstResponse$.next(mockDatasetByIdQuery);

        expect(emitted).toEqual([null, null]);
    });
});

describe("hasTypename", () => {
    it("should accept an object of one of the typenames", () => {
        expect(
            hasTypename(
                { __typename: "EventTimeSourceFromPath" },
                "EventTimeSourceFromMetadata",
                "EventTimeSourceFromPath",
            ),
        ).toBe(true);
    });

    it("should reject an object of another typename, an untagged object and a primitive", () => {
        expect(hasTypename({ __typename: "DataSchema" }, "TemporalTable")).toBe(false);
        expect(hasTypename({ name: "a" }, "TemporalTable")).toBe(false);
        expect(hasTypename("TemporalTable", "TemporalTable")).toBe(false);
    });
});

describe("isListOfTypename", () => {
    it("should accept a list whose every item has the typename", () => {
        expect(isListOfTypename([{ __typename: "SqlQueryStep" }, { __typename: "SqlQueryStep" }], "SqlQueryStep")).toBe(
            true,
        );
        expect(isListOfTypename([], "SqlQueryStep")).toBe(true);
    });

    it("should reject a list with an item of another kind, and a value that is not a list", () => {
        expect(isListOfTypename([{ __typename: "SqlQueryStep" }, "query"], "SqlQueryStep")).toBe(false);
        expect(isListOfTypename({ __typename: "SqlQueryStep" }, "SqlQueryStep")).toBe(false);
    });
});
