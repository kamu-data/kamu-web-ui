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
import { datasetFlowsTabResolverFn } from "src/app/dataset-view/additional-components/flows-component/resolver/dataset-flows-tab.resolver";
import { DatasetOverviewTabData } from "src/app/dataset-view/dataset-view.interface";
import { DatasetService } from "src/app/dataset-view/dataset.service";
import { DatasetSubscriptionsService } from "src/app/dataset-view/dataset.subscriptions.service";
import { mockDatasetBasicsRootFragment, mockFullPowerDatasetPermissionsFragment } from "src/app/search/mock.data";

describe("datasetFlowsTabResolverFn", () => {
    let datasetService: DatasetService;
    let datasetSubsService: DatasetSubscriptionsService;

    const routeSnapshot = {} as ActivatedRouteSnapshot;
    const mockState = {} as RouterStateSnapshot;

    const executeResolver: ResolveFn<DatasetOverviewTabData> = (...resolverParameters) =>
        TestBed.runInInjectionContext(() => datasetFlowsTabResolverFn(...resolverParameters));

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [Apollo],
        });
        datasetService = TestBed.inject(DatasetService);
        datasetSubsService = TestBed.inject(DatasetSubscriptionsService);
        spyOnProperty(datasetSubsService, "permissionsChanges", "get").and.returnValue(
            of(mockFullPowerDatasetPermissionsFragment),
        );
        spyOnProperty(datasetSubsService, "overviewChanges", "get").and.returnValue(of(mockOverviewUpdate));
    });

    it("should resolve the dataset, its permissions and the overview", async () => {
        spyOnProperty(datasetService, "datasetChanges", "get").and.returnValue(of(mockDatasetBasicsRootFragment));

        const data = await firstValueFrom(executeResolver(routeSnapshot, mockState) as Observable<unknown>);

        expect(data).toEqual({
            datasetBasics: mockDatasetBasicsRootFragment,
            datasetPermissions: mockFullPowerDatasetPermissionsFragment,
            overviewUpdate: mockOverviewUpdate,
        });
    });

    it("should redirect to page not found when the dataset cannot be loaded", async () => {
        spyOnProperty(datasetService, "datasetChanges", "get").and.returnValue(throwError(() => new Error("fail")));

        const data = await firstValueFrom(executeResolver(routeSnapshot, mockState) as Observable<unknown>);

        expectPageNotFoundRedirect(data);
    });
});
