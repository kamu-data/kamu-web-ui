/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { mockDatasetBasicsDerivedFragment, mockFullPowerDatasetPermissionsFragment } from "../search/mock.data";
import { DatasetService } from "./dataset.service";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ActivatedRoute } from "@angular/router";
import { Apollo } from "apollo-angular";
import { DatasetViewComponent } from "./dataset-view.component";
import { NavigationService } from "../services/navigation.service";
import { DatasetViewTypeEnum } from "./dataset-view.interface";
import { of } from "rxjs";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { ChangeDetectionStrategy } from "@angular/core";
import { DatasetSubscriptionsService } from "./dataset.subscriptions.service";
import { provideToastr } from "ngx-toastr";
import { registerMatSvgIcons } from "../common/helpers/base-test.helpers.spec";
import { MOCK_DATASET_INFO } from "./additional-components/metadata-component/components/set-transform/mock.data";
import { provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";

describe("DatasetViewComponent", () => {
    let component: DatasetViewComponent;
    let fixture: ComponentFixture<DatasetViewComponent>;
    let datasetService: DatasetService;
    let datasetSubsServices: DatasetSubscriptionsService;
    let navigationService: NavigationService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [DatasetViewComponent],
            providers: [
                Apollo,
                provideToastr(),
                {
                    provide: ActivatedRoute,
                    useValue: {
                        snapshot: {
                            queryParamMap: {
                                get: (key: string) => {
                                    switch (key) {
                                        case "tab":
                                            return null;
                                        case "page":
                                            return "2";
                                    }
                                },
                            },
                            paramMap: {
                                get: (key: string) => {
                                    switch (key) {
                                        case "accountName":
                                            return mockDatasetBasicsDerivedFragment.owner.accountName;
                                        case "datasetName":
                                            return mockDatasetBasicsDerivedFragment.name;
                                    }
                                },
                            },
                        },
                    },
                },
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        })
            .overrideComponent(DatasetViewComponent, {
                set: { changeDetection: ChangeDetectionStrategy.Default },
            })
            .compileComponents();

        // Note: for some reason this icon is not loaded when activating Settings tab, so stub it
        registerMatSvgIcons();

        datasetSubsServices = TestBed.inject(DatasetSubscriptionsService);
        datasetSubsServices.emitPermissionsChanged(mockFullPowerDatasetPermissionsFragment);
        datasetService = TestBed.inject(DatasetService);
        spyOnProperty(datasetService, "datasetChanges", "get").and.returnValue(of(mockDatasetBasicsDerivedFragment));

        fixture = TestBed.createComponent(DatasetViewComponent);
        navigationService = TestBed.inject(NavigationService);
        component = fixture.componentInstance;
        component.datasetViewType = DatasetViewTypeEnum.Overview;
        component.datasetViewData = {
            datasetBasics: mockDatasetBasicsDerivedFragment,
            datasetPermissions: mockFullPowerDatasetPermissionsFragment,
        };
        component.datasetInfo = MOCK_DATASET_INFO;
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should check navigate to owner view", () => {
        fixture.detectChanges();
        const navigateToOwnerViewSpy = spyOn(navigationService, "navigateToOwnerView");
        component.showOwnerPage(mockDatasetBasicsDerivedFragment.owner.accountName);
        expect(navigateToOwnerViewSpy).toHaveBeenCalledWith(mockDatasetBasicsDerivedFragment.owner.accountName);
    });

    it(`should check remove daaset sql code`, () => {
        const removeDatasetSqlCodeSpy = spyOn(sessionStorage, "removeItem");

        component.ngOnDestroy();
        expect(removeDatasetSqlCodeSpy).toHaveBeenCalledTimes(1);
    });
});
