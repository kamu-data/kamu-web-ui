/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestBed } from "@angular/core/testing";
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from "@angular/router";

import { first, Observable, of } from "rxjs";

import { ApolloTestingModule } from "apollo-angular/testing";
import { provideToastr } from "ngx-toastr";

import { DatasetFlowType } from "@api/kamu.graphql.interface";
import {
    mockBufferingBatchingReactiveRule,
    mockGetDatasetFlowTriggersBatchingQuery,
} from "@api/mock/dataset-flow.mock";

import { mockOverviewUpdate } from "src/app/dataset-view/additional-components/data-tabs.mock";
import { SettingsTabsEnum } from "src/app/dataset-view/additional-components/dataset-settings-component/dataset-settings.model";
import { DatasetFlowTriggerService } from "src/app/dataset-view/additional-components/dataset-settings-component/services/dataset-flow-trigger.service";
import { DatasetSettingsTransformOptionsTabData } from "src/app/dataset-view/additional-components/dataset-settings-component/tabs/transform-options/dataset-settings-transform-options-tab.data";
import { datasetSettingsTransformTabResolverFn } from "src/app/dataset-view/additional-components/dataset-settings-component/tabs/transform-options/resolver/dataset-settings-transform-tab.resolver";
import { DatasetService } from "src/app/dataset-view/dataset.service";
import { DatasetSubscriptionsService } from "src/app/dataset-view/dataset.subscriptions.service";
import {
    mockDatasetBasicsDerivedFragment,
    mockFullPowerDatasetPermissionsFragment,
    mockReadonlyDatasetPermissionsFragment,
} from "src/app/search/mock.data";
import { NavigationService } from "src/app/services/navigation.service";

describe("datasetSettingsTransformOptionsTabResolverFn", () => {
    const mockActivatedRouteSnapshot = new ActivatedRouteSnapshot();
    const mockRouterStateSnapshot = {} as RouterStateSnapshot;

    let datasetSubsService: DatasetSubscriptionsService;
    let datasetFlowTriggerService: DatasetFlowTriggerService;
    let navigationService: NavigationService;

    let permissionsChangesSpy: jasmine.Spy;

    const executeResolver: ResolveFn<DatasetSettingsTransformOptionsTabData | null> = (...resolverParameters) =>
        TestBed.runInInjectionContext(() => datasetSettingsTransformTabResolverFn(...resolverParameters));

    type ResolverObservable = Observable<DatasetSettingsTransformOptionsTabData | null>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [ApolloTestingModule],
            providers: [provideToastr()],
        });

        mockActivatedRouteSnapshot.data = { tab: SettingsTabsEnum.TRANSFORM_SETTINGS };

        spyOnProperty(TestBed.inject(DatasetService), "datasetChanges", "get").and.returnValue(
            of(mockDatasetBasicsDerivedFragment),
        );

        datasetSubsService = TestBed.inject(DatasetSubscriptionsService);

        const cloneDataUpdate = structuredClone(mockOverviewUpdate);
        cloneDataUpdate.overview.metadata.currentTransform = {
            __typename: "SetTransform",
        };

        spyOnProperty(datasetSubsService, "overviewChanges", "get").and.returnValue(of(cloneDataUpdate));
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
            .subscribe((data: DatasetSettingsTransformOptionsTabData | null) => {
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
                                    reactive: null,
                                    stopPolicy: {
                                        __typename: "FlowTriggerStopPolicyNever",
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
            .subscribe((data: DatasetSettingsTransformOptionsTabData | null) => {
                expect(data).toEqual({
                    datasetBasics: mockDatasetBasicsDerivedFragment,
                    datasetPermissions: mockFullPowerDatasetPermissionsFragment,
                    reactive: null,
                    stopPolicy: {
                        __typename: "FlowTriggerStopPolicyNever",
                        dummy: false,
                    },
                    paused: true,
                });
            });

        expect(fetchDatasetFlowTriggerSpy).toHaveBeenCalledWith(
            mockDatasetBasicsDerivedFragment.id,
            DatasetFlowType.ExecuteTransform,
        );

        expect(resolverSubscription$.closed).toBeTrue();
    });

    it("should correctly map flowTriggers to paused and reactive", () => {
        spyOn(datasetFlowTriggerService, "fetchDatasetFlowTrigger").and.returnValue(
            of(mockGetDatasetFlowTriggersBatchingQuery),
        );

        const resolver$ = executeResolver(mockActivatedRouteSnapshot, mockRouterStateSnapshot);
        expect(resolver$).not.toBeNull();

        const resolverSubscription$ = (resolver$ as ResolverObservable)
            .pipe(first())
            .subscribe((data: DatasetSettingsTransformOptionsTabData | null) => {
                expect(data).toEqual({
                    datasetBasics: mockDatasetBasicsDerivedFragment,
                    datasetPermissions: mockFullPowerDatasetPermissionsFragment,
                    reactive: mockBufferingBatchingReactiveRule,
                    stopPolicy: {
                        __typename: "FlowTriggerStopPolicyAfterConsecutiveFailures",
                        maxFailures: 5,
                    },
                    paused:
                        mockGetDatasetFlowTriggersBatchingQuery.datasets.byId?.flows.triggers.byType?.paused || false,
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
            .subscribe((data: DatasetSettingsTransformOptionsTabData | null) => {
                expect(data).toEqual({
                    datasetBasics: mockDatasetBasicsDerivedFragment,
                    datasetPermissions: mockFullPowerDatasetPermissionsFragment,
                    reactive: null,
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
            next: (data: DatasetSettingsTransformOptionsTabData | null) => {
                fail("Expected an error, but got data: " + JSON.stringify(data));
            },
            error: (error: Error) => {
                expect(error.message).toEqual(errorMessage);
            },
        });

        expect(resolverSubscription$.closed).toBeTrue();
    });
});
