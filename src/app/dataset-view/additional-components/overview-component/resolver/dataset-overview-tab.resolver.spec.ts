/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestBed } from "@angular/core/testing";

import { Observable, of, throwError } from "rxjs";

import { Apollo } from "apollo-angular";

import { expectPageNotFoundRedirect, runResolver } from "@common/helpers/base-test.helpers.spec";

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

    function failingStream(): Observable<never> {
        return throwError(() => new Error("fail"));
    }

    function mockStreams(failing?: "datasetChanges" | "permissionsChanges" | "overviewChanges"): void {
        vi.spyOn(datasetService, "datasetChanges", "get").mockReturnValue(
            failing === "datasetChanges" ? failingStream() : of(mockDatasetBasicsRootFragment),
        );
        vi.spyOn(datasetSubsService, "permissionsChanges", "get").mockReturnValue(
            failing === "permissionsChanges" ? failingStream() : of(mockFullPowerDatasetPermissionsFragment),
        );
        vi.spyOn(datasetSubsService, "overviewChanges", "get").mockReturnValue(
            failing === "overviewChanges" ? failingStream() : of(mockOverviewUpdate),
        );
    }

    it("should resolve the dataset, its permissions and the overview", async () => {
        mockStreams();

        const data = await runResolver(datasetOverviewTabResolverFn);

        expect(data).toEqual({
            datasetBasics: mockDatasetBasicsRootFragment,
            datasetPermissions: mockFullPowerDatasetPermissionsFragment,
            overviewUpdate: mockOverviewUpdate,
        });
    });

    (["datasetChanges", "permissionsChanges", "overviewChanges"] as const).forEach((failing) => {
        it(`should redirect to page not found when ${failing} fails`, async () => {
            mockStreams(failing);

            const data = await runResolver(datasetOverviewTabResolverFn);

            expectPageNotFoundRedirect(data);
        });
    });
});
