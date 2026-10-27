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

import { requireValue } from "@common/helpers/app.helpers";
import {
    expectPageNotFoundRedirect,
    routeSnapshot,
    runResolver,
    stubMethod,
} from "@common/helpers/base-test.helpers.spec";
import { DatasetFlowType } from "@api/kamu.graphql.interface";
import { mockGetDatasetFlowTriggersBatchingQuery } from "@api/mock/dataset-flow.mock";

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

describe("datasetSettingsTransformOptionsTabResolverFn", () => {
    let datasetSubsService: DatasetSubscriptionsService;
    let datasetFlowTriggerService: DatasetFlowTriggerService;

    let permissionsChangesSpy: Mock;

    function resolve(): Promise<DatasetSettingsTransformOptionsTabData | RedirectCommand> {
        const route = routeSnapshot({ data: { tab: SettingsTabsEnum.TRANSFORM_SETTINGS } });
        return runResolver(datasetSettingsTransformTabResolverFn, route);
    }

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [ApolloTestingModule],
            providers: [provideToastr()],
        });

        vi.spyOn(TestBed.inject(DatasetService), "datasetChanges", "get").mockReturnValue(
            of(mockDatasetBasicsDerivedFragment),
        );

        datasetSubsService = TestBed.inject(DatasetSubscriptionsService);

        const cloneDataUpdate = structuredClone(mockOverviewUpdate);
        cloneDataUpdate.overview.metadata.currentTransform = {
            __typename: "SetTransform",
        };

        vi.spyOn(datasetSubsService, "overviewChanges", "get").mockReturnValue(of(cloneDataUpdate));
        permissionsChangesSpy = vi
            .spyOn(datasetSubsService, "permissionsChanges", "get")
            .mockReturnValue(of(mockFullPowerDatasetPermissionsFragment));

        datasetFlowTriggerService = TestBed.inject(DatasetFlowTriggerService);
    });

    it("should pass the redirect through without fetching flow triggers when the tab is not accessible", async () => {
        permissionsChangesSpy.mockReturnValue(of(mockReadonlyDatasetPermissionsFragment));
        const fetchDatasetFlowTriggerSpy = stubMethod(datasetFlowTriggerService, "fetchDatasetFlowTrigger");

        const data = await resolve();

        expectPageNotFoundRedirect(data);
        expect(fetchDatasetFlowTriggerSpy).not.toHaveBeenCalled();
    });

    it("should call fetchDatasetFlowTrigger with correct parameters", async () => {
        const fetchDatasetFlowTriggerSpy = vi
            .spyOn(datasetFlowTriggerService, "fetchDatasetFlowTrigger")
            .mockReturnValue(
                of({
                    __typename: "Query",
                    datasets: {
                        __typename: "Datasets",
                        byId: {
                            __typename: "Dataset",
                            flows: {
                                __typename: "DatasetFlows",
                                triggers: {
                                    __typename: "DatasetFlowTriggers",
                                    byType: {
                                        __typename: "FlowTrigger",
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

        const data = await resolve();

        expect(fetchDatasetFlowTriggerSpy).toHaveBeenCalledTimes(1);

        expect(fetchDatasetFlowTriggerSpy).toHaveBeenCalledWith(
            mockDatasetBasicsDerivedFragment.id,
            DatasetFlowType.ExecuteTransform,
        );
        expect(data).toEqual({
            datasetBasics: mockDatasetBasicsDerivedFragment,
            datasetPermissions: mockFullPowerDatasetPermissionsFragment,
            reactive: null,
            stopPolicy: {
                __typename: "FlowTriggerStopPolicyNever",
            },
            paused: true,
        });
    });

    it("should correctly map flowTriggers to paused and reactive", async () => {
        vi.spyOn(datasetFlowTriggerService, "fetchDatasetFlowTrigger").mockReturnValue(
            of(mockGetDatasetFlowTriggersBatchingQuery),
        );

        const data = await resolve();

        expect(data).toEqual({
            datasetBasics: mockDatasetBasicsDerivedFragment,
            datasetPermissions: mockFullPowerDatasetPermissionsFragment,
            reactive: requireValue(
                mockGetDatasetFlowTriggersBatchingQuery.datasets.byId?.flows.triggers.byType?.reactive,
            ),
            stopPolicy: {
                __typename: "FlowTriggerStopPolicyAfterConsecutiveFailures",
                maxFailures: 5,
            },
            paused: mockGetDatasetFlowTriggersBatchingQuery.datasets.byId?.flows.triggers.byType?.paused || false,
        });
    });

    it("should correctly map flowTriggers when no data is defined", async () => {
        vi.spyOn(datasetFlowTriggerService, "fetchDatasetFlowTrigger").mockReturnValue(
            of({
                __typename: "Query",
                datasets: {
                    __typename: "Datasets",
                    byId: {
                        __typename: "Dataset",
                        flows: {
                            __typename: "DatasetFlows",
                            triggers: {
                                __typename: "DatasetFlowTriggers",
                                byType: null,
                            },
                        },
                    },
                },
            }),
        );

        const data = await resolve();

        expect(data).toEqual({
            datasetBasics: mockDatasetBasicsDerivedFragment,
            datasetPermissions: mockFullPowerDatasetPermissionsFragment,
            reactive: null,
            stopPolicy: null,
            paused: true,
        });
    });

    it("should handle errors from fetchDatasetFlowTrigger", async () => {
        const errorMessage = "Failed to fetch flow triggers";
        vi.spyOn(datasetFlowTriggerService, "fetchDatasetFlowTrigger").mockImplementation(() => {
            throw new Error(errorMessage);
        });

        await expect(resolve()).rejects.toThrowError(errorMessage);
    });
});
