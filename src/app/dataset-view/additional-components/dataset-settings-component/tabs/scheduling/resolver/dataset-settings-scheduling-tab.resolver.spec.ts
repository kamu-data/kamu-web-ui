/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestBed } from "@angular/core/testing";
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from "@angular/router";

import { first, Observable, of } from "rxjs";

import { DatasetFlowType } from "@api/kamu.graphql.interface";
import { mockCronSchedule, mockGetDatasetFlowTriggerCronQuery } from "@api/mock/dataset-flow.mock";
import { ApolloTestingModule } from "apollo-angular/testing";
import { provideToastr } from "ngx-toastr";
import { mockOverviewUpdate } from "src/app/dataset-view/additional-components/data-tabs.mock";
import { SettingsTabsEnum } from "src/app/dataset-view/additional-components/dataset-settings-component/dataset-settings.model";
import { DatasetFlowTriggerService } from "src/app/dataset-view/additional-components/dataset-settings-component/services/dataset-flow-trigger.service";
import { DatasetSettingsSchedulingTabData } from "src/app/dataset-view/additional-components/dataset-settings-component/tabs/scheduling/dataset-settings-scheduling-tab.data";
import { datasetSettingsSchedulingTabResolverFn } from "src/app/dataset-view/additional-components/dataset-settings-component/tabs/scheduling/resolver/dataset-settings-scheduling-tab.resolver";
import { DatasetService } from "src/app/dataset-view/dataset.service";
import { DatasetSubscriptionsService } from "src/app/dataset-view/dataset.subscriptions.service";
import {
    mockDatasetBasicsRootFragment,
    mockFullPowerDatasetPermissionsFragment,
    mockReadonlyDatasetPermissionsFragment,
} from "src/app/search/mock.data";
import { NavigationService } from "src/app/services/navigation.service";

describe("datasetSettingsSchedulingTabResolverFn", () => {
    const mockActivatedRouteSnapshot = new ActivatedRouteSnapshot();
    const mockRouterStateSnapshot = {} as RouterStateSnapshot;

    let datasetSubsService: DatasetSubscriptionsService;
    let datasetFlowTriggerService: DatasetFlowTriggerService;
    let navigationService: NavigationService;

    let permissionsChangesSpy: jasmine.Spy;

    const executeResolver: ResolveFn<DatasetSettingsSchedulingTabData | null> = (...resolverParameters) =>
        TestBed.runInInjectionContext(() => datasetSettingsSchedulingTabResolverFn(...resolverParameters));

    type ResolverObservable = Observable<DatasetSettingsSchedulingTabData | null>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [ApolloTestingModule],
            providers: [provideToastr()],
        });

        mockActivatedRouteSnapshot.data = { tab: SettingsTabsEnum.SCHEDULING };

        spyOnProperty(TestBed.inject(DatasetService), "datasetChanges", "get").and.returnValue(
            of(mockDatasetBasicsRootFragment),
        );

        datasetSubsService = TestBed.inject(DatasetSubscriptionsService);
        spyOnProperty(datasetSubsService, "overviewChanges", "get").and.returnValue(of(mockOverviewUpdate));
        permissionsChangesSpy = spyOnProperty(datasetSubsService, "permissionsChanges", "get").and.returnValue(
            of(mockFullPowerDatasetPermissionsFragment),
        );

        datasetFlowTriggerService = TestBed.inject(DatasetFlowTriggerService);
        navigationService = TestBed.inject(NavigationService);
    });

    it("should be created", () => {
        expect(executeResolver).toBeTruthy();
    });

    it("should return null when datasetSettingsGeneralTabResolverFn returns null", () => {
        permissionsChangesSpy.and.returnValue(of(mockReadonlyDatasetPermissionsFragment));
        spyOn(navigationService, "navigateToPageNotFound").and.stub();

        const fetchDatasetFlowTriggerSpy: jasmine.Spy = spyOn(
            datasetFlowTriggerService,
            "fetchDatasetFlowTrigger",
        ).and.stub();

        const resolver$ = executeResolver(mockActivatedRouteSnapshot, mockRouterStateSnapshot);
        expect(resolver$).not.toBeNull();

        const resolverSubscription$ = (resolver$ as ResolverObservable)
            .pipe(first())
            .subscribe((data: DatasetSettingsSchedulingTabData | null) => {
                expect(data).toBeNull();
            });

        expect(fetchDatasetFlowTriggerSpy).not.toHaveBeenCalled();
        expect(resolverSubscription$.closed).toBeTrue();
    });

    it("should call fetchDatasetFlowTrigger with correct parameters", () => {
        const fetchDatasetFlowTriggerSpy: jasmine.Spy = spyOn(
            datasetFlowTriggerService,
            "fetchDatasetFlowTrigger",
        ).and.returnValue(
            of({
                datasets: {
                    byId: {
                        flows: {
                            triggers: {
                                byType: {
                                    paused: true,
                                    schedule: null,
                                    stopPolicy: {
                                        __typename: "FlowTriggerStopPolicyNever",
                                        dummy: false,
                                    },
                                },
                            },
                        },
                    },
                },
            }),
        );

        const resolver$ = executeResolver(mockActivatedRouteSnapshot, mockRouterStateSnapshot);
        expect(resolver$).not.toBeNull();

        const resolverSubscription$ = (resolver$ as ResolverObservable)
            .pipe(first())
            .subscribe((data: DatasetSettingsSchedulingTabData | null) => {
                expect(data).toEqual({
                    datasetBasics: mockDatasetBasicsRootFragment,
                    datasetPermissions: mockFullPowerDatasetPermissionsFragment,
                    schedule: null,
                    stopPolicy: {
                        __typename: "FlowTriggerStopPolicyNever",
                        dummy: false,
                    },
                    paused: true,
                });
            });

        expect(fetchDatasetFlowTriggerSpy).toHaveBeenCalledWith(
            mockDatasetBasicsRootFragment.id,
            DatasetFlowType.Ingest,
        );

        expect(resolverSubscription$.closed).toBeTrue();
    });

    it("should correctly map flowTriggers to paused and schedule", () => {
        spyOn(datasetFlowTriggerService, "fetchDatasetFlowTrigger").and.returnValue(
            of(mockGetDatasetFlowTriggerCronQuery),
        );

        const resolver$ = executeResolver(mockActivatedRouteSnapshot, mockRouterStateSnapshot);
        expect(resolver$).not.toBeNull();

        const resolverSubscription$ = (resolver$ as ResolverObservable)
            .pipe(first())
            .subscribe((data: DatasetSettingsSchedulingTabData | null) => {
                expect(data).toEqual({
                    datasetBasics: mockDatasetBasicsRootFragment,
                    datasetPermissions: mockFullPowerDatasetPermissionsFragment,
                    schedule: mockCronSchedule,
                    paused: mockGetDatasetFlowTriggerCronQuery.datasets.byId?.flows.triggers.byType?.paused || false,
                    stopPolicy: {
                        __typename: "FlowTriggerStopPolicyAfterConsecutiveFailures",
                        maxFailures: 1,
                    },
                });
            });
        expect(resolverSubscription$.closed).toBeTrue();
    });

    it("should correctly map flowTriggers when no data is defined", () => {
        spyOn(datasetFlowTriggerService, "fetchDatasetFlowTrigger").and.returnValue(
            of({
                datasets: {
                    __typename: "Datasets",
                    byId: {
                        flows: {
                            triggers: {
                                byType: null,
                            },
                        },
                    },
                },
            }),
        );

        const resolver$ = executeResolver(mockActivatedRouteSnapshot, mockRouterStateSnapshot);
        expect(resolver$).not.toBeNull();

        const resolverSubscription$ = (resolver$ as ResolverObservable)
            .pipe(first())
            .subscribe((data: DatasetSettingsSchedulingTabData | null) => {
                expect(data).toEqual({
                    datasetBasics: mockDatasetBasicsRootFragment,
                    datasetPermissions: mockFullPowerDatasetPermissionsFragment,
                    schedule: null,
                    stopPolicy: null,
                    paused: true,
                });
            });
        expect(resolverSubscription$.closed).toBeTrue();
    });

    it("should handle errors from fetchDatasetFlowTrigger", () => {
        const errorMessage = "Failed to fetch flow triggers";
        spyOn(datasetFlowTriggerService, "fetchDatasetFlowTrigger").and.throwError(errorMessage);

        const resolver$ = executeResolver(mockActivatedRouteSnapshot, mockRouterStateSnapshot);
        expect(resolver$).not.toBeNull();

        const resolverSubscription$ = (resolver$ as ResolverObservable).pipe(first()).subscribe({
            next: (data: DatasetSettingsSchedulingTabData | null) => {
                fail("Expected an error, but got data: " + JSON.stringify(data));
            },
            error: (error: Error) => {
                expect(error.message).toEqual(errorMessage);
            },
        });

        expect(resolverSubscription$.closed).toBeTrue();
    });
});
