/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestbedHarnessEnvironment } from "@angular/cdk/testing/testbed";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ActivatedRoute, convertToParamMap } from "@angular/router";

import { PagePastEndHarness } from "@common/components/page-past-end/page-past-end.harness";
import { setComponentInput, stubMethod } from "@common/helpers/base-test.helpers.spec";
import { mockDatasetsAccountResponse, TEST_ACCOUNT_NAME } from "@api/mock/dataset.mock";

import { AccountTabs } from "src/app/account/account.constants";
import { DatasetsTabComponent } from "src/app/account/additional-components/datasets-tab/datasets-tab.component";
import ProjectLinks from "src/app/project-links";
import { NavigationService } from "src/app/services/navigation.service";

describe("DatasetsTabComponent", () => {
    let component: DatasetsTabComponent;
    let fixture: ComponentFixture<DatasetsTabComponent>;
    let navigationService: NavigationService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [DatasetsTabComponent],
            providers: [
                {
                    provide: ActivatedRoute,
                    useValue: {
                        parent: {
                            parent: {
                                snapshot: {
                                    paramMap: convertToParamMap({
                                        [ProjectLinks.URL_PARAM_ACCOUNT_NAME]: TEST_ACCOUNT_NAME,
                                    }),
                                },
                            },
                        },
                    },
                },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(DatasetsTabComponent);
        navigationService = TestBed.inject(NavigationService);
        component = fixture.componentInstance;
        setComponentInput(fixture, "accountResolverResponse", {
            datasetsResponse: mockDatasetsAccountResponse,
            accountName: TEST_ACCOUNT_NAME,
        });
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should check page changed", () => {
        const testPageNumber = 2;
        const navigateToOwnerViewSpy = vi.spyOn(navigationService, "navigateToOwnerView").mockImplementation(() => {});
        component.onPageChange(testPageNumber);

        expect(navigateToOwnerViewSpy).toHaveBeenCalledWith(TEST_ACCOUNT_NAME, AccountTabs.DATASETS, testPageNumber);
    });

    it("should check page changed without current page", () => {
        const navigateToOwnerViewSpy = vi.spyOn(navigationService, "navigateToOwnerView").mockImplementation(() => {});
        component.onPageChange();
        expect(navigateToOwnerViewSpy).toHaveBeenCalledWith(TEST_ACCOUNT_NAME, AccountTabs.DATASETS);
    });

    it("should say a page past the last one has no datasets and lead to the last page", async () => {
        setComponentInput(fixture, "accountResolverResponse", {
            datasetsResponse: {
                ...structuredClone(mockDatasetsAccountResponse),
                datasets: [],
                pageInfo: { ...mockDatasetsAccountResponse.pageInfo, currentPage: 98, totalPages: 3 },
            },
            accountName: TEST_ACCOUNT_NAME,
        });
        const navigateToOwnerViewSpy = stubMethod(navigationService, "navigateToOwnerView");

        const pagePastEnd = await TestbedHarnessEnvironment.loader(fixture).getHarness(PagePastEndHarness);
        expect(await pagePastEnd.getMessage()).toEqual("There are no datasets on this page.");
        await pagePastEnd.goToLastPage();
        expect(navigateToOwnerViewSpy).toHaveBeenCalledWith(TEST_ACCOUNT_NAME, AccountTabs.DATASETS, 3);
    });

    it("should say the account has no datasets on the first page", async () => {
        setComponentInput(fixture, "accountResolverResponse", {
            datasetsResponse: {
                ...structuredClone(mockDatasetsAccountResponse),
                datasets: [],
                pageInfo: { ...mockDatasetsAccountResponse.pageInfo, currentPage: 0, totalPages: 0 },
            },
            accountName: TEST_ACCOUNT_NAME,
        });

        const pagePastEnd = await TestbedHarnessEnvironment.loader(fixture).getAllHarnesses(PagePastEndHarness);
        expect(pagePastEnd).toEqual([]);
    });
});
