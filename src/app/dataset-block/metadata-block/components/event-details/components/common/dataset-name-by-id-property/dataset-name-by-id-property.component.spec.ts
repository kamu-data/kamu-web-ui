/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";

import { of } from "rxjs";

import { ApolloTestingModule } from "apollo-angular/testing";

import { SharedTestModule } from "@common/modules/shared-test.module";

import { DatasetNameByIdPropertyComponent } from "src/app/dataset-block/metadata-block/components/event-details/components/common/dataset-name-by-id-property/dataset-name-by-id-property.component";
import { DatasetService } from "src/app/dataset-view/dataset.service";
import { mockDatasetMainDataResponse } from "src/app/search/mock.data";

describe("DatasetIdAndNamePropertyComponent", () => {
    let component: DatasetNameByIdPropertyComponent;
    let fixture: ComponentFixture<DatasetNameByIdPropertyComponent>;
    let datasetService: DatasetService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ApolloTestingModule, SharedTestModule, DatasetNameByIdPropertyComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(DatasetNameByIdPropertyComponent);
        datasetService = TestBed.inject(DatasetService);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should check call requestDatasetInfoById from datasetService in ngOnInit", () => {
        const requestDatasetInfoByIdSpy = spyOn(datasetService, "requestDatasetInfoById").and.returnValue(
            of({
                __typename: "Query",
                datasets: {
                    __typename: "Datasets",
                    byId: mockDatasetMainDataResponse.datasets.byOwnerAndName,
                },
            }),
        );
        component.ngOnInit();
        expect(requestDatasetInfoByIdSpy).toHaveBeenCalledTimes(1);
    });
});
