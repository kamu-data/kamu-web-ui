/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ActivatedRoute } from "@angular/router";

import { of } from "rxjs";

import { registerMatSvgIcons } from "@common/helpers/base-test.helpers.spec";
import { SharedTestModule } from "@common/modules/shared-test.module";
import { Apollo } from "apollo-angular";
import { provideToastr } from "ngx-toastr";
import ProjectLinks from "src/app/project-links";
import { NavigationService } from "src/app/services/navigation.service";

import { DatasetViewTypeEnum } from "../../dataset-view.interface";
import { DatasetService } from "../../dataset.service";
import { DatasetSubscriptionsService } from "../../dataset.subscriptions.service";
import { mockHistoryUpdate } from "../data-tabs.mock";
import { MOCK_DATASET_INFO } from "../metadata-component/components/set-transform/mock.data";
import { HistoryComponent } from "./history.component";

describe("HistoryComponent", () => {
    let component: HistoryComponent;
    let fixture: ComponentFixture<HistoryComponent>;
    let navigationService: NavigationService;
    let datasetService: DatasetService;
    let datasetSubsService: DatasetSubscriptionsService;

    beforeEach(async () => {
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
                                            return undefined;
                                    }
                                },
                            },
                        },
                    },
                },
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        }).compileComponents();

        registerMatSvgIcons();

        fixture = TestBed.createComponent(HistoryComponent);
        navigationService = TestBed.inject(NavigationService);
        datasetService = TestBed.inject(DatasetService);
        datasetSubsService = TestBed.inject(DatasetSubscriptionsService);

        component = fixture.componentInstance;
        component.datasetInfo = MOCK_DATASET_INFO;

        spyOn(datasetService, "requestDatasetHistory").and.returnValue(of());
        datasetSubsService.emitHistoryChanged(mockHistoryUpdate);
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should check change page", () => {
        const page = 2;
        const navigateToDatasetViewSpy = spyOn(navigationService, "navigateToDatasetView");
        component.onPageChange(page);
        expect(navigateToDatasetViewSpy).toHaveBeenCalledOnceWith({
            datasetName: MOCK_DATASET_INFO.datasetName,
            accountName: MOCK_DATASET_INFO.accountName,
            tab: DatasetViewTypeEnum.History,
            page,
        });
    });
});
