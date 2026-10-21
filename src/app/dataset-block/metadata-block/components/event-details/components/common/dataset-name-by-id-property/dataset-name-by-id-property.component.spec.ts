/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";

import { of, Subject } from "rxjs";

import { ApolloTestingModule } from "apollo-angular/testing";

import { getElementByDataTestId } from "@common/helpers/base-test.helpers.spec";
import { SharedTestModule } from "@common/modules/shared-test.module";
import { DatasetByIdQuery } from "@api/kamu.graphql.interface";
import { mockDatasetByIdQuery, TEST_DATASET_NAME } from "@api/mock/dataset.mock";

import { DatasetNameByIdPropertyComponent } from "src/app/dataset-block/metadata-block/components/event-details/components/common/dataset-name-by-id-property/dataset-name-by-id-property.component";
import { DatasetService } from "src/app/dataset-view/dataset.service";
import { mockDatasetMainDataResponse } from "src/app/search/mock.data";

describe("DatasetNameByIdPropertyComponent", () => {
    let fixture: ComponentFixture<DatasetNameByIdPropertyComponent>;
    let requestDatasetInfoByIdSpy: jasmine.Spy;

    const FIRST_DATASET_ID = "did:odf:first";
    const SECOND_DATASET_ID = "did:odf:second";
    const THIRD_DATASET_ID = "did:odf:third";
    const OTHER_DATASET_NAME = "alberta.case-details";
    const mockOtherDatasetByIdQuery: DatasetByIdQuery = {
        datasets: { __typename: "Datasets", byId: mockDatasetMainDataResponse.datasets.byOwnerAndName },
    };

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ApolloTestingModule, SharedTestModule, DatasetNameByIdPropertyComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(DatasetNameByIdPropertyComponent);
        requestDatasetInfoByIdSpy = spyOn(TestBed.inject(DatasetService), "requestDatasetInfoById").and.returnValue(
            of(mockDatasetByIdQuery),
        );
        fixture.componentRef.setInput("data", FIRST_DATASET_ID);
        fixture.detectChanges();
    });

    function datasetNameText(): string {
        return getElementByDataTestId(fixture, "dataset-name-property").innerText;
    }

    it("should show the dataset loaded by its id", () => {
        expect(requestDatasetInfoByIdSpy).toHaveBeenCalledOnceWith(FIRST_DATASET_ID);
        expect(datasetNameText()).toContain("/" + TEST_DATASET_NAME);
    });

    it("should load the dataset again when the id changes", () => {
        requestDatasetInfoByIdSpy.and.returnValue(of(mockOtherDatasetByIdQuery));

        fixture.componentRef.setInput("data", SECOND_DATASET_ID);
        fixture.detectChanges();

        expect(requestDatasetInfoByIdSpy).toHaveBeenCalledWith(SECOND_DATASET_ID);
        expect(datasetNameText()).toContain("/" + OTHER_DATASET_NAME);
    });

    it("should ignore the response for an id that was replaced before it arrived", () => {
        const secondResponse$ = new Subject<DatasetByIdQuery>();
        const thirdResponse$ = new Subject<DatasetByIdQuery>();
        requestDatasetInfoByIdSpy.and.callFake((datasetId: string) =>
            datasetId === SECOND_DATASET_ID ? secondResponse$ : thirdResponse$,
        );

        fixture.componentRef.setInput("data", SECOND_DATASET_ID);
        fixture.detectChanges();
        fixture.componentRef.setInput("data", THIRD_DATASET_ID);
        fixture.detectChanges();

        secondResponse$.next(mockOtherDatasetByIdQuery);
        fixture.detectChanges();
        expect(datasetNameText()).toContain("/" + TEST_DATASET_NAME);

        thirdResponse$.next(mockOtherDatasetByIdQuery);
        fixture.detectChanges();
        expect(datasetNameText()).toContain("/" + OTHER_DATASET_NAME);
    });
});
