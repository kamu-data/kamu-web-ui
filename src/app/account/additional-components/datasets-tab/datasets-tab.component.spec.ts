/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ApolloTestingModule } from "apollo-angular/testing";
import { DatasetApi } from "src/app/api/dataset.api";
import { mockDatasetsAccountResponse, TEST_ACCOUNT_NAME } from "src/app/api/mock/dataset.mock";
import { NavigationService } from "src/app/services/navigation.service";
import { AccountTabs } from "../../account.constants";
import { DatasetsTabComponent } from "./datasets-tab.component";
import { DatasetListItemComponent } from "src/app/common/components/dataset-list-component/dataset-list-item/dataset-list-item.component";
import { NgbPopoverModule, NgbRatingModule } from "@ng-bootstrap/ng-bootstrap";
import { DisplayTimeModule } from "src/app/common/components/display-time/display-time.module";
import { MatChipsModule } from "@angular/material/chips";
import { MatDividerModule } from "@angular/material/divider";
import { ActivatedRoute, convertToParamMap, RouterModule } from "@angular/router";
import { DatasetVisibilityModule } from "src/app/common/components/dataset-visibility/dataset-visibility.module";
import { SimpleChanges } from "@angular/core";
import { PaginationModule } from "src/app/common/components/pagination-component/pagination.module";
import ProjectLinks from "src/app/project-links";

describe("DatasetsTabComponent", () => {
    let component: DatasetsTabComponent;
    let fixture: ComponentFixture<DatasetsTabComponent>;
    let navigationService: NavigationService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                ApolloTestingModule,
                NgbRatingModule,
                DisplayTimeModule,
                MatChipsModule,
                NgbPopoverModule,
                MatDividerModule,
                RouterModule,
                DatasetVisibilityModule,
                PaginationModule,
            ],
            providers: [
                DatasetApi,
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
            declarations: [DatasetsTabComponent, DatasetListItemComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(DatasetsTabComponent);
        navigationService = TestBed.inject(NavigationService);
        component = fixture.componentInstance;
        component.accountResolverResponse = {
            datasetsResponse: mockDatasetsAccountResponse,
            accountName: TEST_ACCOUNT_NAME,
        };
        const accountNameSimpleChanges: SimpleChanges = {
            accountName: {
                previousValue: undefined,
                currentValue: TEST_ACCOUNT_NAME,
                firstChange: true,
                isFirstChange: () => true,
            },
        };
        component.ngOnChanges(accountNameSimpleChanges);
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
