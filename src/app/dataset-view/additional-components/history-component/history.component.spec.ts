/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestbedHarnessEnvironment } from "@angular/cdk/testing/testbed";
import { provideHttpClient } from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ActivatedRoute } from "@angular/router";

import { of } from "rxjs";

import { Apollo } from "apollo-angular";
import { provideToastr } from "ngx-toastr";
import { Mock } from "vitest";

import { PagePastEndHarness } from "@common/components/page-past-end/page-past-end.harness";
import { registerMatSvgIcons, setComponentInput, stubMethod } from "@common/helpers/base-test.helpers.spec";
import { SharedTestModule } from "@common/modules/shared-test.module";
import { MaybeNull } from "@interface/app.types";

import { mockHistoryUpdate } from "src/app/dataset-view/additional-components/data-tabs.mock";
import { HistoryComponent } from "src/app/dataset-view/additional-components/history-component/history.component";
import { MOCK_DATASET_INFO } from "src/app/dataset-view/additional-components/metadata-component/components/set-transform/mock.data";
import { DatasetViewTypeEnum } from "src/app/dataset-view/dataset-view.interface";
import { DatasetService } from "src/app/dataset-view/dataset.service";
import { DatasetHistoryUpdate } from "src/app/dataset-view/dataset.subscriptions.interface";
import { DatasetSubscriptionsService } from "src/app/dataset-view/dataset.subscriptions.service";
import ProjectLinks from "src/app/project-links";
import { NavigationService } from "src/app/services/navigation.service";

describe("HistoryComponent", () => {
    let component: HistoryComponent;
    let fixture: ComponentFixture<HistoryComponent>;
    let navigationService: NavigationService;
    let datasetService: DatasetService;
    let datasetSubsService: DatasetSubscriptionsService;
    let requestDatasetHistorySpy: Mock<DatasetService["requestDatasetHistory"]>;
    let pageParam: MaybeNull<string>;

    beforeEach(async () => {
        pageParam = null;
        await TestBed.configureTestingModule({
            imports: [SharedTestModule, HistoryComponent],
            providers: [
                Apollo,
                provideToastr(),
                {
                    provide: ActivatedRoute,
                    useValue: {
                        snapshot: {
                            paramMap: {
                                get: (key: string) => {
                                    switch (key) {
                                        case "accountName":
                                            return "accountName";
                                        case "datasetName":
                                            return "datasetName";
                                    }
                                },
                            },
                            queryParamMap: {
                                get: (key: string) => {
                                    switch (key) {
                                        case ProjectLinks.URL_QUERY_PARAM_PAGE:
                                            return pageParam;
                                    }
                                },
                            },
                        },
                    },
                },
                provideHttpClient(),
                provideHttpClientTesting(),
            ],
        }).compileComponents();

        registerMatSvgIcons();

        navigationService = TestBed.inject(NavigationService);
        datasetService = TestBed.inject(DatasetService);
        datasetSubsService = TestBed.inject(DatasetSubscriptionsService);
        requestDatasetHistorySpy = vi.spyOn(datasetService, "requestDatasetHistory").mockReturnValue(of());
    });

    function createComponent(historyUpdate: DatasetHistoryUpdate = mockHistoryUpdate): void {
        fixture = TestBed.createComponent(HistoryComponent);
        component = fixture.componentInstance;
        setComponentInput(fixture, "datasetInfo", MOCK_DATASET_INFO);
        datasetSubsService.emitHistoryChanged(historyUpdate);
        fixture.detectChanges();
    }

    it("should create", () => {
        createComponent();
        expect(component).toBeTruthy();
    });

    it("should request the page from the URL", () => {
        pageParam = "3";
        createComponent();
        expect(requestDatasetHistorySpy).toHaveBeenCalledWith(MOCK_DATASET_INFO, 10, 2);
    });

    ["abc", "0", "-2", "1.5", ""].forEach((invalidPage: string) => {
        it(`should request the first page when the URL page is "${invalidPage}"`, () => {
            pageParam = invalidPage;
            createComponent();
            expect(requestDatasetHistorySpy).toHaveBeenCalledWith(MOCK_DATASET_INFO, 10, 0);
        });
    });

    it("should say a page past the last one has no commits and lead to the last page", async () => {
        pageParam = "99";
        const navigateToDatasetViewSpy = stubMethod(navigationService, "navigateToDatasetView");
        createComponent({
            history: [],
            pageInfo: { ...mockHistoryUpdate.pageInfo, currentPage: 98, totalPages: 3 },
        });

        const pagePastEnd = await TestbedHarnessEnvironment.loader(fixture).getHarness(PagePastEndHarness);
        expect(await pagePastEnd.getMessage()).toEqual("There are no commits on this page.");
        await pagePastEnd.goToLastPage();
        expect(navigateToDatasetViewSpy).toHaveBeenCalledWith({
            accountName: MOCK_DATASET_INFO.accountName,
            datasetName: MOCK_DATASET_INFO.datasetName,
            tab: DatasetViewTypeEnum.History,
            page: 3,
        });
    });

    it("should check change page", () => {
        createComponent();
        const page = 2;
        const navigateToDatasetViewSpy = stubMethod(navigationService, "navigateToDatasetView");
        component.onPageChange(page);
        expect(navigateToDatasetViewSpy).toHaveBeenCalledTimes(1);
        expect(navigateToDatasetViewSpy).toHaveBeenCalledWith({
            datasetName: MOCK_DATASET_INFO.datasetName,
            accountName: MOCK_DATASET_INFO.accountName,
            tab: DatasetViewTypeEnum.History,
            page,
        });
    });
});
