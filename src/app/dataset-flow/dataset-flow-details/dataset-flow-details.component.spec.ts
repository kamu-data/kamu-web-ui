/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { Apollo, ApolloModule } from "apollo-angular";
import { ComponentFixture, TestBed, fakeAsync, flush, tick } from "@angular/core/testing";
import { DatasetFlowDetailsComponent } from "./dataset-flow-details.component";
import { ActivatedRoute } from "@angular/router";
import { ApolloTestingModule } from "apollo-angular/testing";
import { provideToastr } from "ngx-toastr";
import { of, shareReplay } from "rxjs";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { DatasetSubscriptionsService } from "src/app/dataset-view/dataset.subscriptions.service";
import {
    mockDatasetBasicsRootFragment,
    mockDatasetInfo,
    mockFullPowerDatasetPermissionsFragment,
} from "src/app/search/mock.data";
import { DatasetService } from "src/app/dataset-view/dataset.service";
import { FlowDetailsTabs } from "./dataset-flow-details.types";
import { mockDatasetFlowByIdResponse, mockFlowSummaryDataFragments } from "src/app/api/mock/dataset-flow.mock";
import { registerMatSvgIcons } from "src/app/common/helpers/base-test.helpers.spec";
import { NavigationService } from "src/app/services/navigation.service";
import { provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";

describe("DatasetFlowDetailsComponent", () => {
    let component: DatasetFlowDetailsComponent;
    let fixture: ComponentFixture<DatasetFlowDetailsComponent>;
    let datasetSubsService: DatasetSubscriptionsService;
    let datasetService: DatasetService;
    let navigationService: NavigationService;
    let navigateToFlowDetailsSpy: jasmine.Spy;
    const MOCK_FLOW_ID = "3";

    beforeEach(async () => {
        await TestBed.configureTestingModule({
    imports: [
        //-----//
        ApolloModule,
        ApolloTestingModule,
        //-----//
        DatasetFlowDetailsComponent],
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
                },
            },
        },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
    ]
}).compileComponents();

        registerMatSvgIcons();

        fixture = TestBed.createComponent(DatasetFlowDetailsComponent);
        datasetService = TestBed.inject(DatasetService);
        datasetSubsService = TestBed.inject(DatasetSubscriptionsService);
        navigationService = TestBed.inject(NavigationService);
        component = fixture.componentInstance;
        component.flowId = MOCK_FLOW_ID;
        component.activeTab = FlowDetailsTabs.HISTORY;
        component.flowDetails = mockDatasetFlowByIdResponse;
        component.datasetInfo = mockDatasetInfo;
        spyOnProperty(datasetSubsService, "permissionsChanges", "get").and.returnValue(
            of(mockFullPowerDatasetPermissionsFragment),
        );
        spyOnProperty(datasetService, "datasetChanges", "get").and.returnValue(of(mockDatasetBasicsRootFragment));
        navigateToFlowDetailsSpy = spyOn(navigationService, "navigateToFlowDetails");
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should check get all data for view menu", fakeAsync(() => {
        tick();
        fixture.detectChanges();
        component.datasetViewMenuData$.pipe(shareReplay()).subscribe((data) => {
            expect(data).toEqual({
                datasetBasics: mockDatasetBasicsRootFragment,
                datasetPermissions: mockFullPowerDatasetPermissionsFragment,
            });
        });
        flush();
    }));

    it(`should check extract flow id`, () => {
        expect(component.flowId).toEqual(MOCK_FLOW_ID);
    });

    it(`should check refresh flow now`, () => {
        component.refreshNow();
        expect(navigateToFlowDetailsSpy).toHaveBeenCalledTimes(1);
    });

    it(`should check created router link`, () => {
        const expectedResult = `/accountName/datasetName/flow-details/${MOCK_FLOW_ID}/history`;
        expect(component.getRouteLink(FlowDetailsTabs.HISTORY)).toEqual(expectedResult);
    });

    it(`should check flow type description`, () => {
        const expectedResult = "Polling ingest";
        expect(component.flowTypeDescription(mockFlowSummaryDataFragments[0])).toEqual(expectedResult);
    });

    it(`should check end of message`, () => {
        const expectedResult = "finished";
        expect(component.descriptionDatasetFlowEndOfMessage(mockFlowSummaryDataFragments[0])).toEqual(expectedResult);
    });

    it(`should check description options`, () => {
        const expectedResult = { icon: "check_circle", class: "completed-status" };
        expect(component.descriptionColumnOptions(mockFlowSummaryDataFragments[0])).toEqual(expectedResult);
    });
});
