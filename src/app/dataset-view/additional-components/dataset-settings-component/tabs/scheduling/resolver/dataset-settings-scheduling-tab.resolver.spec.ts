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
import { mockCronSchedule, mockGetDatasetFlowTriggerCronQuery } from "@api/mock/dataset-flow.mock";

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

describe("datasetSettingsSchedulingTabResolverFn", () => {
    const mockActivatedRouteSnapshot = new ActivatedRouteSnapshot();
    const mockRouterStateSnapshot = {} as RouterStateSnapshot;

    let datasetSubsService: DatasetSubscriptionsService;
    let datasetFlowTriggerService: DatasetFlowTriggerService;

    let permissionsChangesSpy: jasmine.Spy;

    const executeResolver: ResolveFn<DatasetSettingsSchedulingTabData> = (...resolverParameters) =>
        TestBed.runInInjectionContext(() => datasetSettingsSchedulingTabResolverFn(...resolverParameters));

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

        const data = await resolve();

        expect(fetchDatasetFlowTriggerSpy).toHaveBeenCalledOnceWith(
            mockDatasetBasicsRootFragment.id,
            DatasetFlowType.Ingest,
        );
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

    it("should correctly map flowTriggers to paused and schedule", async () => {
        spyOn(datasetFlowTriggerService, "fetchDatasetFlowTrigger").and.returnValue(
            of(mockGetDatasetFlowTriggerCronQuery),
        );

        const data = await resolve();

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
            datasetBasics: mockDatasetBasicsRootFragment,
            datasetPermissions: mockFullPowerDatasetPermissionsFragment,
            schedule: null,
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
