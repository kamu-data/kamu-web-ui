/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { provideHttpClient } from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { importProvidersFrom } from "@angular/core";
import { ComponentFixture, discardPeriodicTasks, fakeAsync, flush, TestBed, tick } from "@angular/core/testing";
import { ActivatedRoute, Router } from "@angular/router";

import { of, shareReplay } from "rxjs";

import { Apollo } from "apollo-angular";
import { ApolloTestingModule } from "apollo-angular/testing";
import { provideToastr } from "ngx-toastr";

import { registerMatSvgIcons } from "@common/helpers/base-test.helpers.spec";
import RoutingResolvers from "@common/resolvers/routing-resolvers";
import { FlowStatus } from "@api/kamu.graphql.interface";
import { mockDatasetFlowByIdResponse, mockFlowSummaryDataFragments } from "@api/mock/dataset-flow.mock";

import { DatasetFlowDetailsComponent } from "src/app/dataset-flow/dataset-flow-details/dataset-flow-details.component";
import {
    DatasetFlowByIdResponse,
    FlowDetailsTabs,
} from "src/app/dataset-flow/dataset-flow-details/dataset-flow-details.types";
import { DatasetService } from "src/app/dataset-view/dataset.service";
import { DatasetSubscriptionsService } from "src/app/dataset-view/dataset.subscriptions.service";
import ProjectLinks from "src/app/project-links";
import {
    mockDatasetBasicsRootFragment,
    mockDatasetInfo,
    mockFullPowerDatasetPermissionsFragment,
} from "src/app/search/mock.data";
import { NavigationService } from "src/app/services/navigation.service";

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
                DatasetFlowDetailsComponent,
            ],
            providers: [
                Apollo,
                importProvidersFrom(ApolloTestingModule),
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
                provideHttpClient(),
                provideHttpClientTesting(),
            ],
        }).compileComponents();

        registerMatSvgIcons();

        fixture = TestBed.createComponent(DatasetFlowDetailsComponent);
        datasetService = TestBed.inject(DatasetService);
        datasetSubsService = TestBed.inject(DatasetSubscriptionsService);
        navigationService = TestBed.inject(NavigationService);
        component = fixture.componentInstance;
        fixture.componentRef.setInput(ProjectLinks.URL_PARAM_FLOW_ID, MOCK_FLOW_ID);
        fixture.componentRef.setInput(RoutingResolvers.FLOW_DETAILS_ACTIVE_TAB_KEY, FlowDetailsTabs.HISTORY);
        fixture.componentRef.setInput(RoutingResolvers.FLOW_DETAILS_KEY, mockDatasetFlowByIdResponse);
        fixture.componentRef.setInput(RoutingResolvers.DATASET_INFO_KEY, mockDatasetInfo);
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

    describe("Auto refresh", () => {
        const interval = DatasetFlowDetailsComponent.REFRESH_INTERVAL_MS;

        it("should refresh a finished flow a few more times, then stop", fakeAsync(() => {
            navigateToFlowDetailsSpy.calls.reset();
            component.ngOnInit();

            tick(interval * 5);
            expect(navigateToFlowDetailsSpy).toHaveBeenCalledTimes(DatasetFlowDetailsComponent.REFRESHES_AFTER_FINISH);
        }));

        it("should keep refreshing an unfinished flow until shortly after it finishes", fakeAsync(() => {
            fixture.componentRef.setInput(RoutingResolvers.FLOW_DETAILS_KEY, {
                ...mockDatasetFlowByIdResponse,
                flow: { ...mockFlowSummaryDataFragments[0], status: FlowStatus.Running },
            } satisfies DatasetFlowByIdResponse);
            navigateToFlowDetailsSpy.calls.reset();
            component.ngOnInit();

            tick(interval * 3);
            expect(navigateToFlowDetailsSpy).toHaveBeenCalledTimes(3);

            fixture.componentRef.setInput(RoutingResolvers.FLOW_DETAILS_KEY, mockDatasetFlowByIdResponse);
            tick(interval * 5);
            expect(navigateToFlowDetailsSpy).toHaveBeenCalledTimes(
                3 + DatasetFlowDetailsComponent.REFRESHES_AFTER_FINISH,
            );
            discardPeriodicTasks();
        }));
    });

    it(`should check created router link`, () => {
        const expectedResult = `/accountName/datasetName/flow-details/${MOCK_FLOW_ID}/history`;
        expect(TestBed.inject(Router).serializeUrl(component.getRouteLink(FlowDetailsTabs.HISTORY))).toEqual(
            expectedResult,
        );
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
