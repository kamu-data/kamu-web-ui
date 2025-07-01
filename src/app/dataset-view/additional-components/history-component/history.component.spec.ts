/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";
import { mockHistoryUpdate } from "../data-tabs.mock";
import { HistoryComponent } from "./history.component";
import { SharedTestModule } from "src/app/common/modules/shared-test.module";
import { PaginationComponent } from "src/app/common/components/pagination-component/pagination.component";
import { TimelineComponent } from "src/app/common/components/timeline-component/timeline.component";
import { NgbPaginationModule, NgbPopoverModule } from "@ng-bootstrap/ng-bootstrap";
import { DisplayHashComponent } from "src/app/common/components/display-hash/display-hash.component";
import { DisplayTimeComponent } from "src/app/common/components/display-time/display-time.component";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { provideToastr } from "ngx-toastr";
import { MatIconModule } from "@angular/material/icon";
import { RouterTestingModule } from "@angular/router/testing";
import { registerMatSvgIcons } from "src/app/common/helpers/base-test.helpers.spec";
import { MOCK_DATASET_INFO } from "../metadata-component/components/set-transform/mock.data";
import { NavigationService } from "src/app/services/navigation.service";
import { DatasetViewTypeEnum } from "../../dataset-view.interface";
import { DatasetService } from "../../dataset.service";
import { DatasetSubscriptionsService } from "../../dataset.subscriptions.service";
import { of } from "rxjs";
import { Apollo } from "apollo-angular";
import { ActivatedRoute } from "@angular/router";
import ProjectLinks from "src/app/project-links";
import { provideAnimations } from "@angular/platform-browser/animations";

describe("HistoryComponent", () => {
    let component: HistoryComponent;
    let fixture: ComponentFixture<HistoryComponent>;
    let navigationService: NavigationService;
    let datasetService: DatasetService;
    let datasetSubsService: DatasetSubscriptionsService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule,
                NgbPaginationModule,
                NgbPopoverModule,
                MatIconModule,
                RouterTestingModule,
                SharedTestModule,
                HistoryComponent,
                PaginationComponent,
                TimelineComponent,
                DisplayTimeComponent,
                DisplayHashComponent,
            ],
            providers: [
                Apollo,
                provideAnimations(),
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
