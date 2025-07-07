/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";
import { mockDatasetsAccountResponse, TEST_ACCOUNT_NAME } from "src/app/api/mock/dataset.mock";
import { NavigationService } from "src/app/services/navigation.service";
import { AccountTabs } from "../../account.constants";
import { DatasetsTabComponent } from "./datasets-tab.component";
import { ActivatedRoute, convertToParamMap } from "@angular/router";
import ProjectLinks from "src/app/project-links";

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
        component.accountResolverResponse = {
            datasetsResponse: mockDatasetsAccountResponse,
            accountName: TEST_ACCOUNT_NAME,
        };
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should check page changed", () => {
        const testPageNumber = 2;
        const navigateToOwnerViewSpy = spyOn(navigationService, "navigateToOwnerView");
        component.onPageChange(testPageNumber);

        expect(navigateToOwnerViewSpy).toHaveBeenCalledWith(TEST_ACCOUNT_NAME, AccountTabs.DATASETS, testPageNumber);
    });

    it("should check page changed without current page", () => {
        const navigateToOwnerViewSpy = spyOn(navigationService, "navigateToOwnerView");
        component.onPageChange();
        expect(navigateToOwnerViewSpy).toHaveBeenCalledWith(TEST_ACCOUNT_NAME, AccountTabs.DATASETS);
    });
});
