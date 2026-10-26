/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestBed } from "@angular/core/testing";

import { firstValueFrom, of } from "rxjs";

import { ApolloTestingModule } from "apollo-angular/testing";
import { provideToastr } from "ngx-toastr";
import type { Mock } from "vitest";

import { expectPageNotFoundRedirect, stubMethod } from "@common/helpers/base-test.helpers.spec";
import AppValues from "@common/values/app.values";
import { DatasetFlowType } from "@api/kamu.graphql.interface";
import { mockCronSchedule, mockGetDatasetFlowTriggerCronQuery } from "@api/mock/dataset-flow.mock";

import { AppConfigService } from "src/app/app-config.service";
import { mockOverviewUpdate } from "src/app/dataset-view/additional-components/data-tabs.mock";
import { SettingsTabsEnum } from "src/app/dataset-view/additional-components/dataset-settings-component/dataset-settings.model";
import { requestFlowTriggerTabData } from "src/app/dataset-view/additional-components/dataset-settings-component/resolvers/flow-trigger-tab.helpers";
import { DatasetFlowTriggerService } from "src/app/dataset-view/additional-components/dataset-settings-component/services/dataset-flow-trigger.service";
import { DatasetService } from "src/app/dataset-view/dataset.service";
import { DatasetSubscriptionsService } from "src/app/dataset-view/dataset.subscriptions.service";
import {
    mockDatasetBasicsRootFragment,
    mockFullPowerDatasetPermissionsFragment,
    mockReadonlyDatasetPermissionsFragment,
} from "src/app/search/mock.data";

describe("requestFlowTriggerTabData", () => {
    let datasetFlowTriggerService: DatasetFlowTriggerService;
    let permissionsChangesSpy: Mock;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [ApolloTestingModule],
            providers: [provideToastr()],
        });
        vi.spyOn(TestBed.inject(AppConfigService), "featureFlags", "get").mockReturnValue(
            AppValues.DEFAULT_UI_CONFIGURATION.featureFlags,
        );
        vi.spyOn(TestBed.inject(DatasetService), "datasetChanges", "get").mockReturnValue(
            of(mockDatasetBasicsRootFragment),
        );
        const datasetSubsService = TestBed.inject(DatasetSubscriptionsService);
        vi.spyOn(datasetSubsService, "overviewChanges", "get").mockReturnValue(of(mockOverviewUpdate));
        permissionsChangesSpy = vi
            .spyOn(datasetSubsService, "permissionsChanges", "get")
            .mockReturnValue(of(mockFullPowerDatasetPermissionsFragment));
        datasetFlowTriggerService = TestBed.inject(DatasetFlowTriggerService);
    });

    function resolve(): Promise<unknown> {
        return firstValueFrom(
            TestBed.runInInjectionContext(() =>
                requestFlowTriggerTabData(SettingsTabsEnum.SCHEDULING, DatasetFlowType.Ingest, (trigger) => ({
                    schedule: trigger?.schedule ?? null,
                })),
            ),
        );
    }

    it("should emit the dataset with the trigger state and the picked rule", async () => {
        const fetchDatasetFlowTriggerSpy = vi
            .spyOn(datasetFlowTriggerService, "fetchDatasetFlowTrigger")
            .mockReturnValue(of(mockGetDatasetFlowTriggerCronQuery));

        const data = await resolve();

        expect(fetchDatasetFlowTriggerSpy).toHaveBeenCalledTimes(1);

        expect(fetchDatasetFlowTriggerSpy).toHaveBeenCalledWith(
            mockDatasetBasicsRootFragment.id,
            DatasetFlowType.Ingest,
        );
        expect(data).toEqual({
            datasetBasics: mockDatasetBasicsRootFragment,
            datasetPermissions: mockFullPowerDatasetPermissionsFragment,
            paused: mockGetDatasetFlowTriggerCronQuery.datasets.byId?.flows.triggers.byType?.paused ?? true,
            stopPolicy: mockGetDatasetFlowTriggerCronQuery.datasets.byId?.flows.triggers.byType?.stopPolicy ?? null,
            schedule: mockCronSchedule,
        });
    });

    it("should pass the redirect through without fetching the trigger when the tab is not accessible", async () => {
        permissionsChangesSpy.mockReturnValue(of(mockReadonlyDatasetPermissionsFragment));
        const fetchDatasetFlowTriggerSpy = stubMethod(datasetFlowTriggerService, "fetchDatasetFlowTrigger");

        const data = await resolve();

        expectPageNotFoundRedirect(data);
        expect(fetchDatasetFlowTriggerSpy).not.toHaveBeenCalled();
    });
});
