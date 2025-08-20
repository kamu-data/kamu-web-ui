/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestBed } from "@angular/core/testing";
import { ResolveFn } from "@angular/router";
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
    mockDatasetBasicsDerivedFragment,
    mockFullPowerDatasetPermissionsFragment,
    mockReadonlyDatasetPermissionsFragment,
} from "src/app/search/mock.data";
import { mockOverviewUpdate } from "src/app/dataset-view/additional-components/data-tabs.mock";
import { NavigationService } from "src/app/services/navigation.service";
import {
    mockBufferingBatchingReactiveRule,
    mockGetDatasetFlowTriggersBatchingQuery,
} from "src/app/api/mock/dataset-flow.mock";
import { DatasetSettingsTransformOptionsTabData } from "../dataset-settings-transform-options-tab.data";
import { datasetSettingsTransformTabResolverFn } from "./dataset-settings-transform-tab.resolver";

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

        const fetchDatasetFlowTriggersSpy: jasmine.Spy = spyOn(
            datasetFlowTriggerService,
            "fetchDatasetFlowTriggers",
        ).and.stub();

        const resolver$ = executeResolver(mockActivatedRouteSnapshot, mockRouterStateSnapshot);
        expect(resolver$).not.toBeNull();

        const resolverSubscription$ = (resolver$ as ResolverObservable)
            .pipe(first())
            .subscribe((data: DatasetSettingsTransformOptionsTabData | null) => {
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
                                    reactive: null,
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
                    paused: true,
                });
            });

        expect(fetchDatasetFlowTriggersSpy).toHaveBeenCalledWith(
            mockDatasetBasicsDerivedFragment.id,
            DatasetFlowType.ExecuteTransform,
        );

        expect(resolverSubscription$.closed).toBeTrue();
    });

    it("should correctly map flowTriggers to paused and reactive", () => {
        spyOn(datasetFlowTriggerService, "fetchDatasetFlowTriggers").and.returnValue(
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
                    paused:
                        mockGetDatasetFlowTriggersBatchingQuery.datasets.byId?.flows.triggers.byType?.paused || false,
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
            .subscribe((data: DatasetSettingsTransformOptionsTabData | null) => {
                expect(data).toEqual({
                    datasetBasics: mockDatasetBasicsDerivedFragment,
                    datasetPermissions: mockFullPowerDatasetPermissionsFragment,
                    reactive: null,
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
