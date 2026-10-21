/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestBed } from "@angular/core/testing";
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from "@angular/router";

import { firstValueFrom, Observable, of } from "rxjs";

import { ApolloTestingModule } from "apollo-angular/testing";
import { provideToastr } from "ngx-toastr";

import { expectPageNotFoundRedirect } from "@common/helpers/base-test.helpers.spec";
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

describe("datasetSettingsTransformOptionsTabResolverFn", () => {
    const mockActivatedRouteSnapshot = new ActivatedRouteSnapshot();
    const mockRouterStateSnapshot = {} as RouterStateSnapshot;

    let datasetSubsService: DatasetSubscriptionsService;
    let datasetFlowTriggerService: DatasetFlowTriggerService;

    let permissionsChangesSpy: jasmine.Spy;

    const executeResolver: ResolveFn<DatasetSettingsTransformOptionsTabData> = (...resolverParameters) =>
        TestBed.runInInjectionContext(() => datasetSettingsTransformTabResolverFn(...resolverParameters));

    function resolve(): Promise<unknown> {
        return firstValueFrom(
            executeResolver(mockActivatedRouteSnapshot, mockRouterStateSnapshot) as Observable<unknown>,
        );
    }

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
    });

    it("should pass the redirect through without fetching flow triggers when the tab is not accessible", async () => {
        permissionsChangesSpy.and.returnValue(of(mockReadonlyDatasetPermissionsFragment));
        const fetchDatasetFlowTriggerSpy = spyOn(datasetFlowTriggerService, "fetchDatasetFlowTrigger");

        const data = await resolve();

        expectPageNotFoundRedirect(data);
        expect(fetchDatasetFlowTriggerSpy).not.toHaveBeenCalled();
    });

    it("should call fetchDatasetFlowTrigger with correct parameters", async () => {
        const fetchDatasetFlowTriggerSpy = spyOn(datasetFlowTriggerService, "fetchDatasetFlowTrigger").and.returnValue(
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

        const data = await resolve();

        expect(fetchDatasetFlowTriggerSpy).toHaveBeenCalledOnceWith(
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
        spyOn(datasetFlowTriggerService, "fetchDatasetFlowTrigger").and.returnValue(
            of(mockGetDatasetFlowTriggersBatchingQuery),
        );

        const data = await resolve();

        expect(data).toEqual({
            datasetBasics: mockDatasetBasicsDerivedFragment,
            datasetPermissions: mockFullPowerDatasetPermissionsFragment,
            reactive: mockBufferingBatchingReactiveRule,
            stopPolicy: {
                __typename: "FlowTriggerStopPolicyAfterConsecutiveFailures",
                maxFailures: 5,
            },
            paused: mockGetDatasetFlowTriggersBatchingQuery.datasets.byId?.flows.triggers.byType?.paused || false,
        });
    });

    it("should correctly map flowTriggers when no data is defined", async () => {
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
        spyOn(datasetFlowTriggerService, "fetchDatasetFlowTrigger").and.throwError(errorMessage);

        await expectAsync(resolve()).toBeRejectedWithError(errorMessage);
    });
});
