/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestBed } from "@angular/core/testing";

import { of, throwError } from "rxjs";

import { Apollo } from "apollo-angular";

import { expectPageNotFoundRedirect, runResolver } from "@common/helpers/base-test.helpers.spec";

import { mockOverviewUpdate } from "src/app/dataset-view/additional-components/data-tabs.mock";
import { datasetFlowsTabResolverFn } from "src/app/dataset-view/additional-components/flows-component/resolver/dataset-flows-tab.resolver";
import { DatasetService } from "src/app/dataset-view/dataset.service";
import { DatasetSubscriptionsService } from "src/app/dataset-view/dataset.subscriptions.service";
import {
    mockDatasetBasicsRootFragment,
    mockFullPowerDatasetPermissionsFragment,
    mockReadonlyDatasetPermissionsFragment,
} from "src/app/search/mock.data";

describe("datasetFlowsTabResolverFn", () => {
    let datasetService: DatasetService;
    let datasetSubsService: DatasetSubscriptionsService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [Apollo],
        });
        datasetService = TestBed.inject(DatasetService);
        datasetSubsService = TestBed.inject(DatasetSubscriptionsService);
        spyOnProperty(datasetSubsService, "overviewChanges", "get").and.returnValue(of(mockOverviewUpdate));
    });

    it("should resolve the dataset, its permissions and the overview", async () => {
        spyOnProperty(datasetSubsService, "permissionsChanges", "get").and.returnValue(
            of(mockFullPowerDatasetPermissionsFragment),
        );
        spyOnProperty(datasetService, "datasetChanges", "get").and.returnValue(of(mockDatasetBasicsRootFragment));

        const data = await runResolver(datasetFlowsTabResolverFn);

        expect(data).toEqual({
            datasetBasics: mockDatasetBasicsRootFragment,
            datasetPermissions: mockFullPowerDatasetPermissionsFragment,
            overviewUpdate: mockOverviewUpdate,
        });
    });

    it("should redirect to page not found when the user may not view flows", async () => {
        spyOnProperty(datasetSubsService, "permissionsChanges", "get").and.returnValue(
            of(mockReadonlyDatasetPermissionsFragment),
        );
        spyOnProperty(datasetService, "datasetChanges", "get").and.returnValue(of(mockDatasetBasicsRootFragment));

        const data = await runResolver(datasetFlowsTabResolverFn);

        expectPageNotFoundRedirect(data);
    });

    it("should redirect to page not found when the dataset cannot be loaded", async () => {
        spyOnProperty(datasetSubsService, "permissionsChanges", "get").and.returnValue(
            of(mockFullPowerDatasetPermissionsFragment),
        );
        spyOnProperty(datasetService, "datasetChanges", "get").and.returnValue(throwError(() => new Error("fail")));

        const data = await runResolver(datasetFlowsTabResolverFn);

        expectPageNotFoundRedirect(data);
    });
});
