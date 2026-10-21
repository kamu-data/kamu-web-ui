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

import { emitClickOnElementByDataTestId, findElementByDataTestId } from "@common/helpers/base-test.helpers.spec";
import { SharedTestModule } from "@common/modules/shared-test.module";
import { mockDatasetByIdQuery, TEST_DATASET_NAME } from "@api/mock/dataset.mock";

import { OffsetIntervalPropertyComponent } from "src/app/dataset-block/metadata-block/components/event-details/components/common/offset-interval-property/offset-interval-property.component";
import { DatasetViewTypeEnum } from "src/app/dataset-view/dataset-view.interface";
import { DatasetService } from "src/app/dataset-view/dataset.service";
import { NavigationService } from "src/app/services/navigation.service";

describe("OffsetIntervalPropertyComponent", () => {
    let component: OffsetIntervalPropertyComponent;
    let fixture: ComponentFixture<OffsetIntervalPropertyComponent>;
    let navigationService: NavigationService;
    let requestDatasetInfoByIdSpy: jasmine.Spy;

    const DATASET_ID = "did:odf:dataset";
    const DATA_TEST_ID = "interval";
    const mockData = {
        block: { __typename: "OffsetInterval" as const, start: 0, end: 596125 },
        datasetId: DATASET_ID,
    };

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            providers: [Apollo],
            imports: [SharedTestModule, OffsetIntervalPropertyComponent, ApolloTestingModule],
        }).compileComponents();

        fixture = TestBed.createComponent(OffsetIntervalPropertyComponent);
        component = fixture.componentInstance;
        navigationService = TestBed.inject(NavigationService);
        fixture.componentRef.setInput("dataTestId", DATA_TEST_ID);
        requestDatasetInfoByIdSpy = spyOn(TestBed.inject(DatasetService), "requestDatasetInfoById").and.returnValue(
            of(mockDatasetByIdQuery),
        );
    });

    it("should load the dataset by its id and open its data for the interval", () => {
        fixture.componentRef.setInput("data", mockData);
        fixture.detectChanges();
        const navigateSpy = spyOn(navigationService, "navigateToDatasetView");

        expect(requestDatasetInfoByIdSpy).toHaveBeenCalledOnceWith(DATASET_ID);
        expect(findElementByDataTestId(fixture, `${DATA_TEST_ID}-start`)?.textContent).toEqual("0");
        emitClickOnElementByDataTestId(fixture, "see-data");

        expect(navigateSpy).toHaveBeenCalledOnceWith(
            jasmine.objectContaining({
                datasetName: TEST_DATASET_NAME,
                tab: DatasetViewTypeEnum.Data,
                state: { start: 0, end: 596125 },
            }),
        );
    });

    it("should not load the dataset again when only the interval changes", () => {
        fixture.componentRef.setInput("data", mockData);
        fixture.detectChanges();
        fixture.componentRef.setInput("data", { ...mockData, block: { ...mockData.block, end: 600000 } });
        fixture.detectChanges();

        expect(requestDatasetInfoByIdSpy).toHaveBeenCalledTimes(1);
        expect(findElementByDataTestId(fixture, `${DATA_TEST_ID}-end`)?.textContent).toEqual("600000");
    });

    it("should open the data of the dataset from the URL when there is no dataset id", () => {
        fixture.componentRef.setInput("data", { ...mockData, datasetId: null });
        fixture.detectChanges();
        const navigateSpy = spyOn(navigationService, "navigateToDatasetView");

        component.navigateToQuery();

        expect(requestDatasetInfoByIdSpy).not.toHaveBeenCalled();
        expect(navigateSpy).toHaveBeenCalledTimes(1);
    });

    it("should show a dash when there is no interval", () => {
        fixture.componentRef.setInput("data", { block: null, datasetId: DATASET_ID });
        fixture.detectChanges();

        expect(findElementByDataTestId(fixture, "empty-block")?.textContent).toEqual("-");
    });
});
