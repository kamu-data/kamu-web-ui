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
import type { Mock } from "vitest";

import {
    expectPageNotFoundRedirect,
    routeSnapshot,
    runResolver,
    stubMethod,
} from "@common/helpers/base-test.helpers.spec";
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

    let permissionsChangesSpy: Mock;

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

        vi.spyOn(TestBed.inject(DatasetService), "datasetChanges", "get").mockReturnValue(
            of(mockDatasetBasicsRootFragment),
        );

        datasetSubsService = TestBed.inject(DatasetSubscriptionsService);
        vi.spyOn(datasetSubsService, "overviewChanges", "get").mockReturnValue(of(mockOverviewUpdate));
        permissionsChangesSpy = vi
            .spyOn(datasetSubsService, "permissionsChanges", "get")
            .mockReturnValue(of(mockFullPowerDatasetPermissionsFragment));

        datasetFlowConfigService = TestBed.inject(DatasetFlowConfigService);
    });

    it("should pass the redirect through without fetching flow configs when the tab is not accessible", async () => {
        permissionsChangesSpy.mockReturnValue(of(mockReadonlyDatasetPermissionsFragment));
        const fetchDatasetFlowConfigsSpy = stubMethod(datasetFlowConfigService, "fetchDatasetFlowConfigs");

        const data = await resolve();

        expectPageNotFoundRedirect(data);
        expect(fetchDatasetFlowConfigsSpy).not.toHaveBeenCalled();
    });

    it("should call fetchDatasetFlowConfigs with correct parameters", async () => {
        const fetchDatasetFlowConfigsSpy = vi
            .spyOn(datasetFlowConfigService, "fetchDatasetFlowConfigs")
            .mockReturnValue(of(mockIngestGetDatasetFlowConfigsSuccess));

        const data = await resolve();

        expect(fetchDatasetFlowConfigsSpy).toHaveBeenCalledTimes(1);

        expect(fetchDatasetFlowConfigsSpy).toHaveBeenCalledWith(
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
        vi.spyOn(datasetFlowConfigService, "fetchDatasetFlowConfigs").mockReturnValue(
            of(mockFlowConfigWithRetryPolicy),
        );

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
        vi.spyOn(datasetFlowConfigService, "fetchDatasetFlowConfigs").mockReturnValue(of(mockFlowConfigWithoutRule));

        const data = await resolve();

        expect(data).toEqual({
            datasetBasics: mockDatasetBasicsRootFragment,
            datasetPermissions: mockFullPowerDatasetPermissionsFragment,
            ingestionRule: { fetchUncacheable: false, fetchNextIteration: false },
            retryPolicy: null,
        });
    });

    it("should correctly map flowConfigs when rule has fetchUncacheable true", async () => {
        vi.spyOn(datasetFlowConfigService, "fetchDatasetFlowConfigs").mockReturnValue(
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
        vi.spyOn(datasetFlowConfigService, "fetchDatasetFlowConfigs").mockReturnValue(
            of(mockFlowConfigWithWrongRuleType),
        );

        await expect(resolve()).rejects.toThrowError(
            "Unexpected flow config rule type: FlowConfigRuleCompaction. Expected FlowConfigRuleIngest.",
        );
    });

    it("should handle errors from fetchDatasetFlowConfigs", async () => {
        const errorMessage = "Failed to fetch flow configs";
        vi.spyOn(datasetFlowConfigService, "fetchDatasetFlowConfigs").mockImplementation(() => {
            throw new Error(errorMessage);
        });

        await expect(resolve()).rejects.toThrowError(errorMessage);
    });
});
