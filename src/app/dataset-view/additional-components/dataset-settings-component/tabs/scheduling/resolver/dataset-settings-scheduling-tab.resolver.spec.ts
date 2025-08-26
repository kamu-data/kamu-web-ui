/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestBed } from "@angular/core/testing";
import { ResolveFn } from "@angular/router";
import { datasetSettingsSchedulingTabResolverFn } from "./dataset-settings-scheduling-tab.resolver";
import { DatasetSettingsSchedulingTabData } from "../dataset-settings-scheduling-tab.data";
import { DatasetFlowTriggerService } from "../../../services/dataset-flow-trigger.service";
import { of, Observable, first } from "rxjs";
import { DatasetFlowType } from "src/app/api/kamu.graphql.interface";
import { ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { ApolloTestingModule } from "apollo-angular/testing";
import { provideToastr } from "ngx-toastr";
import { SettingsTabsEnum } from "../../../dataset-settings.model";
import { DatasetSubscriptionsService } from "src/app/dataset-view/dataset.subscriptions.service";
import { DatasetService } from "src/app/dataset-view/dataset.service";
import {
    mockDatasetBasicsRootFragment,
    mockFullPowerDatasetPermissionsFragment,
    mockReadonlyDatasetPermissionsFragment,
} from "src/app/search/mock.data";
import { mockOverviewUpdate } from "src/app/dataset-view/additional-components/data-tabs.mock";
import { NavigationService } from "src/app/services/navigation.service";
import { mockCronSchedule, mockGetDatasetFlowTriggersCronQuery } from "src/app/api/mock/dataset-flow.mock";

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

        const fetchDatasetFlowTriggersSpy: jasmine.Spy = spyOn(
            datasetFlowTriggerService,
            "fetchDatasetFlowTriggers",
        ).and.stub();

        const resolver$ = executeResolver(mockActivatedRouteSnapshot, mockRouterStateSnapshot);
        expect(resolver$).not.toBeNull();

        const resolverSubscription$ = (resolver$ as ResolverObservable)
            .pipe(first())
            .subscribe((data: DatasetSettingsSchedulingTabData | null) => {
                expect(data).toBeNull();
            });

        expect(fetchDatasetFlowTriggersSpy).not.toHaveBeenCalled();
        expect(resolverSubscription$.closed).toBeTrue();
    });

    it("should call fetchDatasetFlowTriggers with correct parameters", () => {
        const fetchDatasetFlowTriggersSpy: jasmine.Spy = spyOn(
            datasetFlowTriggerService,
            "fetchDatasetFlowTriggers",
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

        expect(fetchDatasetFlowTriggersSpy).toHaveBeenCalledWith(
            mockDatasetBasicsRootFragment.id,
            DatasetFlowType.Ingest,
        );

        expect(resolverSubscription$.closed).toBeTrue();
    });

    it("should correctly map flowTriggers to paused and schedule", () => {
        spyOn(datasetFlowTriggerService, "fetchDatasetFlowTriggers").and.returnValue(
            of(mockGetDatasetFlowTriggersCronQuery),
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
                    paused: mockGetDatasetFlowTriggersCronQuery.datasets.byId?.flows.triggers.byType?.paused || false,
                    stopPolicy: {
                        __typename: "FlowTriggerStopPolicyAfterConsecutiveFailures",
                        maxFailures: 1,
                    },
                });
            });
        expect(resolverSubscription$.closed).toBeTrue();
    });

    it("should correctly map flowTriggers when no data is defined", () => {
        spyOn(datasetFlowTriggerService, "fetchDatasetFlowTriggers").and.returnValue(
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

    it("should handle errors from fetchDatasetFlowTriggers", () => {
        const errorMessage = "Failed to fetch flow triggers";
        spyOn(datasetFlowTriggerService, "fetchDatasetFlowTriggers").and.throwError(errorMessage);

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
