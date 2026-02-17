/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";

import { of } from "rxjs";

import { Apollo } from "apollo-angular";
import { ApolloTestingModule } from "apollo-angular/testing";
import { findElementByDataTestId } from "@common/helpers/base-test.helpers.spec";
import { SharedTestModule } from "@common/modules/shared-test.module";
import { DatasetService } from "src/app/dataset-view/dataset.service";
import { mockDatasetMainDataResponse } from "src/app/search/mock.data";
import { NavigationService } from "src/app/services/navigation.service";

import { OffsetIntervalPropertyComponent } from "./offset-interval-property.component";

describe("OffsetIntervalPropertyComponent", () => {
    let component: OffsetIntervalPropertyComponent;
    let fixture: ComponentFixture<OffsetIntervalPropertyComponent>;
    let datasetService: DatasetService;
    let navigationService: NavigationService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            providers: [Apollo],
            imports: [SharedTestModule, OffsetIntervalPropertyComponent, ApolloTestingModule],
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
        component.data = {
            block: { __typename: "OffsetInterval", start: 0, end: 596125 },
            datasetId: null,
        };
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
