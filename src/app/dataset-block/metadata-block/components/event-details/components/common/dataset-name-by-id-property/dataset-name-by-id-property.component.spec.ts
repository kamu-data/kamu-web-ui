/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";

import { of, Subject } from "rxjs";

import { ApolloTestingModule } from "apollo-angular/testing";
import type { Mock } from "vitest";

import {
    findElementByDataTestId,
    getElementByDataTestId,
    setComponentInput,
} from "@common/helpers/base-test.helpers.spec";
import { SharedTestModule } from "@common/modules/shared-test.module";
import { DatasetByIdQuery } from "@api/kamu.graphql.interface";
import { mockDatasetByIdQuery, TEST_DATASET_NAME } from "@api/mock/dataset.mock";

import { DatasetNameByIdPropertyComponent } from "src/app/dataset-block/metadata-block/components/event-details/components/common/dataset-name-by-id-property/dataset-name-by-id-property.component";
import { DatasetService } from "src/app/dataset-view/dataset.service";
import { mockDatasetMainDataResponse } from "src/app/search/mock.data";

describe("DatasetNameByIdPropertyComponent", () => {
    let fixture: ComponentFixture<DatasetNameByIdPropertyComponent>;
    let requestDatasetInfoByIdSpy: Mock;

    const FIRST_DATASET_ID = "did:odf:first";
    const SECOND_DATASET_ID = "did:odf:second";
    const THIRD_DATASET_ID = "did:odf:third";
    const OTHER_DATASET_NAME = "alberta.case-details";
    const mockOtherDatasetByIdQuery: DatasetByIdQuery = {
        datasets: { __typename: "Datasets", byId: mockDatasetMainDataResponse.datasets.byOwnerAndName },
    };
    const mockMissingDatasetByIdQuery: DatasetByIdQuery = { datasets: { __typename: "Datasets", byId: null } };

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ApolloTestingModule, SharedTestModule, DatasetNameByIdPropertyComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(DatasetNameByIdPropertyComponent);
        requestDatasetInfoByIdSpy = vi
            .spyOn(TestBed.inject(DatasetService), "requestDatasetInfoById")
            .mockReturnValue(of(mockDatasetByIdQuery));
        setComponentInput(fixture, "data", FIRST_DATASET_ID);
        fixture.detectChanges();
    });

    function datasetNameText(): string {
        return getElementByDataTestId(fixture, "dataset-name-property").innerText;
    }

    it("should show the dataset loaded by its id", () => {
        expect(requestDatasetInfoByIdSpy).toHaveBeenCalledTimes(1);
        expect(requestDatasetInfoByIdSpy).toHaveBeenCalledWith(FIRST_DATASET_ID);
        expect(datasetNameText()).toContain("/" + TEST_DATASET_NAME);
    });

    it("should load the dataset again when the id changes", () => {
        requestDatasetInfoByIdSpy.mockReturnValue(of(mockOtherDatasetByIdQuery));

        setComponentInput(fixture, "data", SECOND_DATASET_ID);
        fixture.detectChanges();

        expect(requestDatasetInfoByIdSpy).toHaveBeenCalledWith(SECOND_DATASET_ID);
        expect(datasetNameText()).toContain("/" + OTHER_DATASET_NAME);
    });

    it("should ignore the response for an id that was replaced before it arrived", () => {
        const secondResponse$ = new Subject<DatasetByIdQuery>();
        const thirdResponse$ = new Subject<DatasetByIdQuery>();
        requestDatasetInfoByIdSpy.mockImplementation((datasetId: string) =>
            datasetId === SECOND_DATASET_ID ? secondResponse$ : thirdResponse$,
        );

        setComponentInput(fixture, "data", SECOND_DATASET_ID);
        fixture.detectChanges();
        setComponentInput(fixture, "data", THIRD_DATASET_ID);
        fixture.detectChanges();

        secondResponse$.next(mockOtherDatasetByIdQuery);
        fixture.detectChanges();
        expect(findElementByDataTestId(fixture, "dataset-name-property")).toBeUndefined();

        thirdResponse$.next(mockOtherDatasetByIdQuery);
        fixture.detectChanges();
        expect(datasetNameText()).toContain("/" + OTHER_DATASET_NAME);
    });

    it("should not show the previous dataset while the dataset for a new id loads", () => {
        const secondResponse$ = new Subject<DatasetByIdQuery>();
        requestDatasetInfoByIdSpy.mockReturnValue(secondResponse$);

        setComponentInput(fixture, "data", SECOND_DATASET_ID);
        fixture.detectChanges();
        expect(findElementByDataTestId(fixture, "dataset-name-property")).toBeUndefined();

        secondResponse$.next(mockOtherDatasetByIdQuery);
        fixture.detectChanges();
        expect(datasetNameText()).toContain("/" + OTHER_DATASET_NAME);
    });

    it("should show no dataset when the new id does not resolve to one", () => {
        requestDatasetInfoByIdSpy.mockReturnValue(of(mockMissingDatasetByIdQuery));

        setComponentInput(fixture, "data", SECOND_DATASET_ID);
        fixture.detectChanges();

        expect(findElementByDataTestId(fixture, "dataset-name-property")).toBeUndefined();
    });
});
