/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";

import { of, Subject } from "rxjs";

import { Apollo } from "apollo-angular";
import { ApolloTestingModule } from "apollo-angular/testing";
import type { Mock } from "vitest";

import {
    checkButtonDisabled,
    emitClickOnElementByDataTestId,
    findElementByDataTestId,
    setComponentInput,
} from "@common/helpers/base-test.helpers.spec";
import { SharedTestModule } from "@common/modules/shared-test.module";
import { DatasetByIdQuery } from "@api/kamu.graphql.interface";
import { mockDatasetByIdQuery, TEST_DATASET_NAME } from "@api/mock/dataset.mock";

import { OffsetIntervalPropertyComponent } from "src/app/dataset-block/metadata-block/components/event-details/components/common/offset-interval-property/offset-interval-property.component";
import { DatasetViewTypeEnum } from "src/app/dataset-view/dataset-view.interface";
import { DatasetService } from "src/app/dataset-view/dataset.service";
import { mockDatasetMainDataResponse } from "src/app/search/mock.data";
import { NavigationService } from "src/app/services/navigation.service";

describe("OffsetIntervalPropertyComponent", () => {
    let component: OffsetIntervalPropertyComponent;
    let fixture: ComponentFixture<OffsetIntervalPropertyComponent>;
    let navigationService: NavigationService;
    let requestDatasetInfoByIdSpy: Mock;

    const DATASET_ID = "did:odf:dataset";
    const DATA_TEST_ID = "interval";
    const OTHER_DATASET_ID = "did:odf:other";
    const OTHER_DATASET_NAME = "alberta.case-details";
    const mockOtherDatasetByIdQuery: DatasetByIdQuery = {
        datasets: { __typename: "Datasets", byId: mockDatasetMainDataResponse.datasets.byOwnerAndName },
    };
    const mockData = {
        block: { __typename: "OffsetInterval" as const, start: "0", end: "596125" },
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
        setComponentInput(fixture, "dataTestId", DATA_TEST_ID);
        requestDatasetInfoByIdSpy = vi
            .spyOn(TestBed.inject(DatasetService), "requestDatasetInfoById")
            .mockReturnValue(of(mockDatasetByIdQuery));
    });

    it("should load the dataset by its id and open its data for the interval", () => {
        setComponentInput(fixture, "data", mockData);
        fixture.detectChanges();
        const navigateSpy = vi.spyOn(navigationService, "navigateToDatasetView").mockImplementation(() => {});

        expect(requestDatasetInfoByIdSpy).toHaveBeenCalledTimes(1);

        expect(requestDatasetInfoByIdSpy).toHaveBeenCalledWith(DATASET_ID);
        expect(findElementByDataTestId(fixture, `${DATA_TEST_ID}-start`)?.textContent).toEqual("0");
        emitClickOnElementByDataTestId(fixture, "see-data");

        expect(navigateSpy).toHaveBeenCalledTimes(1);

        expect(navigateSpy).toHaveBeenCalledWith(
            expect.objectContaining({
                datasetName: TEST_DATASET_NAME,
                tab: DatasetViewTypeEnum.Data,
                state: { start: "0", end: "596125" },
            }),
        );
    });

    it("should not load the dataset again when only the interval changes", () => {
        setComponentInput(fixture, "data", mockData);
        fixture.detectChanges();
        setComponentInput(fixture, "data", { ...mockData, block: { ...mockData.block, end: "600000" } });
        fixture.detectChanges();

        expect(requestDatasetInfoByIdSpy).toHaveBeenCalledTimes(1);
        expect(findElementByDataTestId(fixture, `${DATA_TEST_ID}-end`)?.textContent).toEqual("600000");
    });

    it("should open the data of the dataset from the URL when there is no dataset id", () => {
        setComponentInput(fixture, "data", { ...mockData, datasetId: null });
        fixture.detectChanges();
        const navigateSpy = vi.spyOn(navigationService, "navigateToDatasetView").mockImplementation(() => {});

        emitClickOnElementByDataTestId(fixture, "see-data");

        expect(requestDatasetInfoByIdSpy).not.toHaveBeenCalled();
        expect(navigateSpy).toHaveBeenCalledTimes(1);
        expect(navigateSpy).toHaveBeenCalledWith({
            accountName: "accountName",
            datasetName: "datasetName",
            tab: DatasetViewTypeEnum.Data,
            state: { start: "0", end: "596125" },
        });
    });

    it("should show a dash when there is no interval", () => {
        setComponentInput(fixture, "data", { block: null, datasetId: DATASET_ID });
        fixture.detectChanges();

        expect(findElementByDataTestId(fixture, "empty-block")?.textContent).toEqual("-");
    });

    it("should keep See data disabled until the dataset for a new id loads, then open that dataset", () => {
        setComponentInput(fixture, "data", mockData);
        fixture.detectChanges();
        const otherResponse$ = new Subject<DatasetByIdQuery>();
        requestDatasetInfoByIdSpy.mockReturnValue(otherResponse$);
        const navigateSpy = vi.spyOn(navigationService, "navigateToDatasetView").mockImplementation(() => {});

        setComponentInput(fixture, "data", { ...mockData, datasetId: OTHER_DATASET_ID });
        fixture.detectChanges();
        checkButtonDisabled(fixture, "see-data", true);
        component.navigateToQuery();
        expect(navigateSpy).not.toHaveBeenCalled();

        otherResponse$.next(mockOtherDatasetByIdQuery);
        fixture.detectChanges();
        checkButtonDisabled(fixture, "see-data", false);
        emitClickOnElementByDataTestId(fixture, "see-data");
        expect(navigateSpy).toHaveBeenCalledTimes(1);
        expect(navigateSpy).toHaveBeenCalledWith(expect.objectContaining({ datasetName: OTHER_DATASET_NAME }));
    });

    it("should not open any dataset when the new id does not resolve to one", () => {
        setComponentInput(fixture, "data", mockData);
        fixture.detectChanges();
        requestDatasetInfoByIdSpy.mockReturnValue(of({ datasets: { __typename: "Datasets", byId: null } }));
        const navigateSpy = vi.spyOn(navigationService, "navigateToDatasetView").mockImplementation(() => {});

        setComponentInput(fixture, "data", { ...mockData, datasetId: OTHER_DATASET_ID });
        fixture.detectChanges();
        checkButtonDisabled(fixture, "see-data", true);
        component.navigateToQuery();

        expect(navigateSpy).not.toHaveBeenCalled();
    });
});
