/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestBed } from "@angular/core/testing";
import { ResolveFn } from "@angular/router";
import { datasetSettingsIngestConfigurationResolverFn } from "./dataset-settings-ingest-configuration.resolver";
import { DatasetSettingsIngestConfigurationTabData } from "../dataset-settings-ingest-configuration-tab.data";
import { DatasetFlowConfigService } from "../../../services/dataset-flow-config.service";
import { of, Observable, first } from "rxjs";
import {
    DatasetFlowType,
    GetDatasetFlowConfigsQuery,
    FlowRetryBackoffType,
    TimeUnit,
} from "src/app/api/kamu.graphql.interface";
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
import { mockIngestGetDatasetFlowConfigsSuccess } from "src/app/api/mock/dataset-flow.mock";

describe("datasetSettingsIngestConfigurationResolverFn", () => {
    const mockActivatedRouteSnapshot = new ActivatedRouteSnapshot();
    const mockRouterStateSnapshot = {} as RouterStateSnapshot;

    let datasetSubsService: DatasetSubscriptionsService;
    let datasetFlowConfigService: DatasetFlowConfigService;
    let navigationService: NavigationService;

    let permissionsChangesSpy: jasmine.Spy;

    const executeResolver: ResolveFn<DatasetSettingsIngestConfigurationTabData | null> = (...resolverParameters) =>
        TestBed.runInInjectionContext(() => datasetSettingsIngestConfigurationResolverFn(...resolverParameters));

    type ResolverObservable = Observable<DatasetSettingsIngestConfigurationTabData | null>;

    // Mock data for different scenarios
    const mockFlowConfigWithRetryPolicy: GetDatasetFlowConfigsQuery = {
        datasets: {
            __typename: "Datasets",
            byId: {
                ...mockDatasetBasicsRootFragment,
                flows: {
                    __typename: "DatasetFlows",
                    configs: {
                        __typename: "DatasetFlowConfigs",
                        byType: {
                            __typename: "FlowConfiguration",
                            rule: {
                                __typename: "FlowConfigRuleIngest",
                                fetchUncacheable: false,
                            },
                            retryPolicy: {
                                __typename: "FlowRetryPolicy",
                                maxAttempts: 3,
                                backoffType: FlowRetryBackoffType.Fixed,
                                minDelay: {
                                    __typename: "TimeDelta",
                                    every: 10,
                                    unit: TimeUnit.Minutes,
                                },
                            },
                        },
                    },
                },
            },
        },
    };

    const mockFlowConfigWithoutRule: GetDatasetFlowConfigsQuery = {
        datasets: {
            __typename: "Datasets",
            byId: {
                ...mockDatasetBasicsRootFragment,
                flows: {
                    __typename: "DatasetFlows",
                    configs: {
                        __typename: "DatasetFlowConfigs",
                        byType: null,
                    },
                },
            },
        },
    };

    const mockFlowConfigWithFetchUncacheable: GetDatasetFlowConfigsQuery = {
        datasets: {
            __typename: "Datasets",
            byId: {
                ...mockDatasetBasicsRootFragment,
                flows: {
                    __typename: "DatasetFlows",
                    configs: {
                        __typename: "DatasetFlowConfigs",
                        byType: {
                            __typename: "FlowConfiguration",
                            rule: {
                                __typename: "FlowConfigRuleIngest",
                                fetchUncacheable: true,
                            },
                            retryPolicy: null,
                        },
                    },
                },
            },
        },
    };

    const mockFlowConfigWithWrongRuleType: GetDatasetFlowConfigsQuery = {
        datasets: {
            __typename: "Datasets",
            byId: {
                ...mockDatasetBasicsRootFragment,
                flows: {
                    __typename: "DatasetFlows",
                    configs: {
                        __typename: "DatasetFlowConfigs",
                        byType: {
                            __typename: "FlowConfiguration",
                            rule: {
                                __typename: "FlowConfigRuleCompaction",
                                compactionMode: {
                                    __typename: "FlowConfigCompactionModeFull",
                                    maxSliceSize: 1000000,
                                    maxSliceRecords: 50000,
                                    recursive: false,
                                },
                            },
                            retryPolicy: null,
                        },
                    },
                },
            },
        },
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [ApolloTestingModule],
            providers: [provideToastr()],
        });

        mockActivatedRouteSnapshot.data = { tab: SettingsTabsEnum.INGEST_CONFIGURATION };

        spyOnProperty(TestBed.inject(DatasetService), "datasetChanges", "get").and.returnValue(
            of(mockDatasetBasicsRootFragment),
        );

        datasetSubsService = TestBed.inject(DatasetSubscriptionsService);
        spyOnProperty(datasetSubsService, "overviewChanges", "get").and.returnValue(of(mockOverviewUpdate));
        permissionsChangesSpy = spyOnProperty(datasetSubsService, "permissionsChanges", "get").and.returnValue(
            of(mockFullPowerDatasetPermissionsFragment),
        );

        datasetFlowConfigService = TestBed.inject(DatasetFlowConfigService);
        navigationService = TestBed.inject(NavigationService);
    });

    it("should be created", () => {
        expect(executeResolver).toBeTruthy();
    });

    it("should return null when datasetSettingsGeneralTabResolverFn returns null", () => {
        permissionsChangesSpy.and.returnValue(of(mockReadonlyDatasetPermissionsFragment));
        spyOn(navigationService, "navigateToPageNotFound").and.stub();

        const fetchDatasetFlowConfigsSpy: jasmine.Spy = spyOn(
            datasetFlowConfigService,
            "fetchDatasetFlowConfigs",
        ).and.stub();

        const resolver$ = executeResolver(mockActivatedRouteSnapshot, mockRouterStateSnapshot);
        expect(resolver$).not.toBeNull();

        const resolverSubscription$ = (resolver$ as ResolverObservable)
            .pipe(first())
            .subscribe((data: DatasetSettingsIngestConfigurationTabData | null) => {
                expect(data).toBeNull();
            });

        expect(fetchDatasetFlowConfigsSpy).not.toHaveBeenCalled();
        expect(resolverSubscription$.closed).toBeTrue();
    });

    it("should call fetchDatasetFlowConfigs with correct parameters", () => {
        const fetchDatasetFlowConfigsSpy: jasmine.Spy = spyOn(
            datasetFlowConfigService,
            "fetchDatasetFlowConfigs",
        ).and.returnValue(of(mockIngestGetDatasetFlowConfigsSuccess));

        const resolver$ = executeResolver(mockActivatedRouteSnapshot, mockRouterStateSnapshot);
        expect(resolver$).not.toBeNull();

        const resolverSubscription$ = (resolver$ as ResolverObservable)
            .pipe(first())
            .subscribe((data: DatasetSettingsIngestConfigurationTabData | null) => {
                expect(data).toEqual({
                    datasetBasics: mockDatasetBasicsRootFragment,
                    datasetPermissions: mockFullPowerDatasetPermissionsFragment,
                    ingestionRule: {
                        __typename: "FlowConfigRuleIngest",
                        fetchUncacheable: false,
                    },
                    retryPolicy: null,
                });
            });

        expect(fetchDatasetFlowConfigsSpy).toHaveBeenCalledWith(
            mockDatasetBasicsRootFragment.id,
            DatasetFlowType.Ingest,
        );

        expect(resolverSubscription$.closed).toBeTrue();
    });

    it("should correctly map flowConfigs to ingestionRule and retryPolicy", () => {
        spyOn(datasetFlowConfigService, "fetchDatasetFlowConfigs").and.returnValue(of(mockFlowConfigWithRetryPolicy));

        const resolver$ = executeResolver(mockActivatedRouteSnapshot, mockRouterStateSnapshot);
        expect(resolver$).not.toBeNull();

        const resolverSubscription$ = (resolver$ as ResolverObservable)
            .pipe(first())
            .subscribe((data: DatasetSettingsIngestConfigurationTabData | null) => {
                expect(data).toEqual({
                    datasetBasics: mockDatasetBasicsRootFragment,
                    datasetPermissions: mockFullPowerDatasetPermissionsFragment,
                    ingestionRule: {
                        __typename: "FlowConfigRuleIngest",
                        fetchUncacheable: false,
                    },
                    retryPolicy: {
                        __typename: "FlowRetryPolicy",
                        maxAttempts: 3,
                        backoffType: FlowRetryBackoffType.Fixed,
                        minDelay: {
                            __typename: "TimeDelta",
                            every: 10,
                            unit: TimeUnit.Minutes,
                        },
                    },
                });
            });
        expect(resolverSubscription$.closed).toBeTrue();
    });

    it("should correctly map flowConfigs when no rule is defined (tests isNil branch)", () => {
        spyOn(datasetFlowConfigService, "fetchDatasetFlowConfigs").and.returnValue(of(mockFlowConfigWithoutRule));

        const resolver$ = executeResolver(mockActivatedRouteSnapshot, mockRouterStateSnapshot);
        expect(resolver$).not.toBeNull();

        const resolverSubscription$ = (resolver$ as ResolverObservable)
            .pipe(first())
            .subscribe((data: DatasetSettingsIngestConfigurationTabData | null) => {
                expect(data).toEqual({
                    datasetBasics: mockDatasetBasicsRootFragment,
                    datasetPermissions: mockFullPowerDatasetPermissionsFragment,
                    ingestionRule: { fetchUncacheable: false },
                    retryPolicy: null,
                });
            });
        expect(resolverSubscription$.closed).toBeTrue();
    });

    it("should correctly map flowConfigs when rule has fetchUncacheable true", () => {
        spyOn(datasetFlowConfigService, "fetchDatasetFlowConfigs").and.returnValue(
            of(mockFlowConfigWithFetchUncacheable),
        );

        const resolver$ = executeResolver(mockActivatedRouteSnapshot, mockRouterStateSnapshot);
        expect(resolver$).not.toBeNull();

        const resolverSubscription$ = (resolver$ as ResolverObservable)
            .pipe(first())
            .subscribe((data: DatasetSettingsIngestConfigurationTabData | null) => {
                expect(data).toEqual({
                    datasetBasics: mockDatasetBasicsRootFragment,
                    datasetPermissions: mockFullPowerDatasetPermissionsFragment,
                    ingestionRule: {
                        __typename: "FlowConfigRuleIngest",
                        fetchUncacheable: true,
                    },
                    retryPolicy: null,
                });
            });
        expect(resolverSubscription$.closed).toBeTrue();
    });

    it("should throw error when rule has unexpected type", () => {
        spyOn(datasetFlowConfigService, "fetchDatasetFlowConfigs").and.returnValue(of(mockFlowConfigWithWrongRuleType));

        const resolver$ = executeResolver(mockActivatedRouteSnapshot, mockRouterStateSnapshot);
        expect(resolver$).not.toBeNull();

        const resolverSubscription$ = (resolver$ as ResolverObservable).pipe(first()).subscribe({
            next: (data: DatasetSettingsIngestConfigurationTabData | null) => {
                fail("Expected an error, but got data: " + JSON.stringify(data));
            },
            error: (error: Error) => {
                expect(error.message).toEqual(
                    "Unexpected flow config rule type: FlowConfigRuleCompaction. Expected FlowConfigRuleIngest.",
                );
            },
        });

        expect(resolverSubscription$.closed).toBeTrue();
    });

    it("should handle errors from fetchDatasetFlowConfigs", () => {
        const errorMessage = "Failed to fetch flow configs";
        spyOn(datasetFlowConfigService, "fetchDatasetFlowConfigs").and.throwError(errorMessage);

        const resolver$ = executeResolver(mockActivatedRouteSnapshot, mockRouterStateSnapshot);
        expect(resolver$).not.toBeNull();

        const resolverSubscription$ = (resolver$ as ResolverObservable).pipe(first()).subscribe({
            next: (data: DatasetSettingsIngestConfigurationTabData | null) => {
                fail("Expected an error, but got data: " + JSON.stringify(data));
            },
            error: (error: Error) => {
                expect(error.message).toEqual(errorMessage);
            },
        });

        expect(resolverSubscription$.closed).toBeTrue();
    });
});
