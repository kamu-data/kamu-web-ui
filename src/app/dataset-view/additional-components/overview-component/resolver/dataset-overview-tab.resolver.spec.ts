/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestBed } from "@angular/core/testing";
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from "@angular/router";

import { firstValueFrom, Observable, of, throwError } from "rxjs";

import { Apollo } from "apollo-angular";

import { expectPageNotFoundRedirect } from "@common/helpers/base-test.helpers.spec";

import { mockOverviewUpdate } from "src/app/dataset-view/additional-components/data-tabs.mock";
import { datasetOverviewTabResolverFn } from "src/app/dataset-view/additional-components/overview-component/resolver/dataset-overview-tab.resolver";
import { DatasetOverviewTabData } from "src/app/dataset-view/dataset-view.interface";
import { DatasetService } from "src/app/dataset-view/dataset.service";
import { DatasetSubscriptionsService } from "src/app/dataset-view/dataset.subscriptions.service";
import { mockDatasetBasicsRootFragment, mockFullPowerDatasetPermissionsFragment } from "src/app/search/mock.data";

describe("datasetOverviewTabResolverFn", () => {
    let datasetService: DatasetService;
    let datasetSubsService: DatasetSubscriptionsService;

    const routeSnapshot = {} as ActivatedRouteSnapshot;
    const mockState = {} as RouterStateSnapshot;

    const executeResolver: ResolveFn<DatasetOverviewTabData> = (...resolverParameters) =>
        TestBed.runInInjectionContext(() => datasetOverviewTabResolverFn(...resolverParameters));

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
        spyOnProperty(datasetService, "datasetChanges", "get").and.returnValue(
            failing === "datasetChanges" ? failingStream() : of(mockDatasetBasicsRootFragment),
        );
        spyOnProperty(datasetSubsService, "permissionsChanges", "get").and.returnValue(
            failing === "permissionsChanges" ? failingStream() : of(mockFullPowerDatasetPermissionsFragment),
        );
        spyOnProperty(datasetSubsService, "overviewChanges", "get").and.returnValue(
            failing === "overviewChanges" ? failingStream() : of(mockOverviewUpdate),
        );
    }

    it("should resolve the dataset, its permissions and the overview", async () => {
        mockStreams();

        const data = await firstValueFrom(executeResolver(routeSnapshot, mockState) as Observable<unknown>);

        expect(data).toEqual({
            datasetBasics: mockDatasetBasicsRootFragment,
            datasetPermissions: mockFullPowerDatasetPermissionsFragment,
            overviewUpdate: mockOverviewUpdate,
        });
    });

    (["datasetChanges", "permissionsChanges", "overviewChanges"] as const).forEach((failing) => {
        it(`should redirect to page not found when ${failing} fails`, async () => {
            mockStreams(failing);

            const data = await firstValueFrom(executeResolver(routeSnapshot, mockState) as Observable<unknown>);

            expectPageNotFoundRedirect(data);
        });
    });
});
