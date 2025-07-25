/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ApolloTestingModule } from "apollo-angular/testing";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { OffsetIntervalPropertyComponent } from "./offset-interval-property.component";
import { DatasetService } from "src/app/dataset-view/dataset.service";
import { NavigationService } from "src/app/services/navigation.service";
import { of } from "rxjs";
import { mockDatasetMainDataResponse } from "src/app/search/mock.data";
import { SharedTestModule } from "src/app/common/modules/shared-test.module";
import { findElementByDataTestId } from "src/app/common/helpers/base-test.helpers.spec";

describe("OffsetIntervalPropertyComponent", () => {
    let component: OffsetIntervalPropertyComponent;
    let fixture: ComponentFixture<OffsetIntervalPropertyComponent>;
    let datasetService: DatasetService;
    let navigationService: NavigationService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ApolloTestingModule, SharedTestModule, OffsetIntervalPropertyComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(OffsetIntervalPropertyComponent);
        component = fixture.componentInstance;
        datasetService = TestBed.inject(DatasetService);
        navigationService = TestBed.inject(NavigationService);
        component.data = {
            block: { __typename: "OffsetInterval", start: 0, end: 596125 },
            datasetId: "dddfdf",
        };
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should check call requestDatasetInfoById from datasetService in ngOnInit", () => {
        fixture.detectChanges();
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

    it("should check call navigateToQuery", () => {
        (component.data = {
            block: { __typename: "OffsetInterval", start: 0, end: 596125 },
            datasetId: null,
        }),
            fixture.detectChanges();
        const navigateToQuerySpy = spyOn(navigationService, "navigateToDatasetView");
        component.navigateToQuery();
        expect(navigateToQuerySpy).toHaveBeenCalledTimes(1);
    });

    it("should check block is null", () => {
        component.data = {
            block: null,
            datasetId: "dddfdf",
        };
        fixture.detectChanges();
        const emptyBlockElement = findElementByDataTestId(fixture, "empty-block");
        expect(emptyBlockElement?.textContent).toEqual("-");
    });
});
