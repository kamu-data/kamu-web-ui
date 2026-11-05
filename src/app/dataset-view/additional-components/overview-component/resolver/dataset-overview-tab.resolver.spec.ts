/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestBed } from "@angular/core/testing";

import { of } from "rxjs";

import { Apollo } from "apollo-angular";

import { runResolver } from "@common/helpers/base-test.helpers.spec";

import { mockOverviewUpdate } from "src/app/dataset-view/additional-components/data-tabs.mock";
import { datasetOverviewTabResolverFn } from "src/app/dataset-view/additional-components/overview-component/resolver/dataset-overview-tab.resolver";
import { DatasetService } from "src/app/dataset-view/dataset.service";
import { DatasetSubscriptionsService } from "src/app/dataset-view/dataset.subscriptions.service";
import { mockDatasetBasicsRootFragment, mockFullPowerDatasetPermissionsFragment } from "src/app/search/mock.data";

describe("datasetOverviewTabResolverFn", () => {
    let datasetService: DatasetService;
    let datasetSubsService: DatasetSubscriptionsService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [Apollo],
        });
        datasetService = TestBed.inject(DatasetService);
        datasetSubsService = TestBed.inject(DatasetSubscriptionsService);
    });

    it("should resolve the dataset, its permissions and the overview", async () => {
        vi.spyOn(datasetService, "datasetChanges", "get").mockReturnValue(of(mockDatasetBasicsRootFragment));
        vi.spyOn(datasetSubsService, "permissionsChanges", "get").mockReturnValue(
            of(mockFullPowerDatasetPermissionsFragment),
        );
        vi.spyOn(datasetSubsService, "overviewChanges", "get").mockReturnValue(of(mockOverviewUpdate));

        const data = await runResolver(datasetOverviewTabResolverFn);

        expect(data).toEqual({
            datasetBasics: mockDatasetBasicsRootFragment,
            datasetPermissions: mockFullPowerDatasetPermissionsFragment,
            overviewUpdate: mockOverviewUpdate,
        });
    });
});
