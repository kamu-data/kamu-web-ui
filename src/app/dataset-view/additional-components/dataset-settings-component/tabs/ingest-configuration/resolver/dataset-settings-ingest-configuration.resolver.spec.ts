/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestBed } from "@angular/core/testing";
import { RedirectCommand } from "@angular/router";

import { of } from "rxjs";

import { ApolloTestingModule } from "apollo-angular/testing";
import { provideToastr } from "ngx-toastr";

import { expectPageNotFoundRedirect, routeSnapshot, runResolver } from "@common/helpers/base-test.helpers.spec";
import {
    DatasetFlowType,
    FlowRetryBackoffType,
    GetDatasetFlowConfigsQuery,
    TimeUnit,
} from "@api/kamu.graphql.interface";
import { mockIngestGetDatasetFlowConfigsSuccess } from "@api/mock/dataset-flow.mock";

import { mockOverviewUpdate } from "src/app/dataset-view/additional-components/data-tabs.mock";
import { SettingsTabsEnum } from "src/app/dataset-view/additional-components/dataset-settings-component/dataset-settings.model";
import { DatasetFlowConfigService } from "src/app/dataset-view/additional-components/dataset-settings-component/services/dataset-flow-config.service";
import { DatasetSettingsIngestConfigurationTabData } from "src/app/dataset-view/additional-components/dataset-settings-component/tabs/ingest-configuration/dataset-settings-ingest-configuration-tab.data";
import { datasetSettingsIngestConfigurationResolverFn } from "src/app/dataset-view/additional-components/dataset-settings-component/tabs/ingest-configuration/resolver/dataset-settings-ingest-configuration.resolver";
import { DatasetService } from "src/app/dataset-view/dataset.service";
import { DatasetSubscriptionsService } from "src/app/dataset-view/dataset.subscriptions.service";
import {
    mockDatasetBasicsRootFragment,
    mockFullPowerDatasetPermissionsFragment,
    mockReadonlyDatasetPermissionsFragment,
} from "src/app/search/mock.data";

describe("datasetSettingsIngestConfigurationResolverFn", () => {
    let datasetSubsService: DatasetSubscriptionsService;
    let datasetFlowConfigService: DatasetFlowConfigService;

    let permissionsChangesSpy: jasmine.Spy;

    function resolve(): Promise<DatasetSettingsIngestConfigurationTabData | RedirectCommand> {
        const route = routeSnapshot({ data: { tab: SettingsTabsEnum.INGEST_CONFIGURATION } });
        return runResolver(datasetSettingsIngestConfigurationResolverFn, route);
    }

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
                                fetchNextIteration: false,
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
                                fetchNextIteration: false,
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
                                maxSliceSize: 1000000,
                                maxSliceRecords: 50000,
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

        spyOnProperty(TestBed.inject(DatasetService), "datasetChanges", "get").and.returnValue(
            of(mockDatasetBasicsRootFragment),
        );

        datasetSubsService = TestBed.inject(DatasetSubscriptionsService);
        spyOnProperty(datasetSubsService, "overviewChanges", "get").and.returnValue(of(mockOverviewUpdate));
        permissionsChangesSpy = spyOnProperty(datasetSubsService, "permissionsChanges", "get").and.returnValue(
            of(mockFullPowerDatasetPermissionsFragment),
        );

        datasetFlowConfigService = TestBed.inject(DatasetFlowConfigService);
    });

    it("should pass the redirect through without fetching flow configs when the tab is not accessible", async () => {
        permissionsChangesSpy.and.returnValue(of(mockReadonlyDatasetPermissionsFragment));
        const fetchDatasetFlowConfigsSpy = spyOn(datasetFlowConfigService, "fetchDatasetFlowConfigs");

        const data = await resolve();

        expectPageNotFoundRedirect(data);
        expect(fetchDatasetFlowConfigsSpy).not.toHaveBeenCalled();
    });

    it("should call fetchDatasetFlowConfigs with correct parameters", async () => {
        const fetchDatasetFlowConfigsSpy = spyOn(datasetFlowConfigService, "fetchDatasetFlowConfigs").and.returnValue(
            of(mockIngestGetDatasetFlowConfigsSuccess),
        );

        const data = await resolve();

        expect(fetchDatasetFlowConfigsSpy).toHaveBeenCalledOnceWith(
            mockDatasetBasicsRootFragment.id,
            DatasetFlowType.Ingest,
        );
        expect(data).toEqual({
            datasetBasics: mockDatasetBasicsRootFragment,
            datasetPermissions: mockFullPowerDatasetPermissionsFragment,
            ingestionRule: {
                __typename: "FlowConfigRuleIngest",
                fetchUncacheable: false,
                fetchNextIteration: false,
            },
            retryPolicy: null,
        });
    });

    it("should correctly map flowConfigs to ingestionRule and retryPolicy", async () => {
        spyOn(datasetFlowConfigService, "fetchDatasetFlowConfigs").and.returnValue(of(mockFlowConfigWithRetryPolicy));

        const data = await resolve();

        expect(data).toEqual({
            datasetBasics: mockDatasetBasicsRootFragment,
            datasetPermissions: mockFullPowerDatasetPermissionsFragment,
            ingestionRule: {
                __typename: "FlowConfigRuleIngest",
                fetchUncacheable: false,
                fetchNextIteration: false,
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

    it("should correctly map flowConfigs when no rule is defined (tests isNil branch)", async () => {
        spyOn(datasetFlowConfigService, "fetchDatasetFlowConfigs").and.returnValue(of(mockFlowConfigWithoutRule));

        const data = await resolve();

        expect(data).toEqual({
            datasetBasics: mockDatasetBasicsRootFragment,
            datasetPermissions: mockFullPowerDatasetPermissionsFragment,
            ingestionRule: { fetchUncacheable: false, fetchNextIteration: false },
            retryPolicy: null,
        });
    });

    it("should correctly map flowConfigs when rule has fetchUncacheable true", async () => {
        spyOn(datasetFlowConfigService, "fetchDatasetFlowConfigs").and.returnValue(
            of(mockFlowConfigWithFetchUncacheable),
        );

        const data = await resolve();

        expect(data).toEqual({
            datasetBasics: mockDatasetBasicsRootFragment,
            datasetPermissions: mockFullPowerDatasetPermissionsFragment,
            ingestionRule: {
                __typename: "FlowConfigRuleIngest",
                fetchUncacheable: true,
                fetchNextIteration: false,
            },
            retryPolicy: null,
        });
    });

    it("should throw error when rule has unexpected type", async () => {
        spyOn(datasetFlowConfigService, "fetchDatasetFlowConfigs").and.returnValue(of(mockFlowConfigWithWrongRuleType));

        await expectAsync(resolve()).toBeRejectedWithError(
            "Unexpected flow config rule type: FlowConfigRuleCompaction. Expected FlowConfigRuleIngest.",
        );
    });

    it("should handle errors from fetchDatasetFlowConfigs", async () => {
        const errorMessage = "Failed to fetch flow configs";
        spyOn(datasetFlowConfigService, "fetchDatasetFlowConfigs").and.throwError(errorMessage);

        await expectAsync(resolve()).toBeRejectedWithError(errorMessage);
    });
});
