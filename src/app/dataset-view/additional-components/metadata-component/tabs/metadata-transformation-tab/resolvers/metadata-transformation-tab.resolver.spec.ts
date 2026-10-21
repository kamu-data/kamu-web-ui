/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestBed } from "@angular/core/testing";
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from "@angular/router";

import { firstValueFrom, Observable, of } from "rxjs";

import { Apollo } from "apollo-angular";

import { expectPageNotFoundRedirect } from "@common/helpers/base-test.helpers.spec";
import { DatasetBasicsFragment } from "@api/kamu.graphql.interface";

import { mockOverviewUpdate } from "src/app/dataset-view/additional-components/data-tabs.mock";
import { metadataTransformationTabResolverFn } from "src/app/dataset-view/additional-components/metadata-component/tabs/metadata-transformation-tab/resolvers/metadata-transformation-tab.resolver";
import { DatasetOverviewTabData } from "src/app/dataset-view/dataset-view.interface";
import { DatasetService } from "src/app/dataset-view/dataset.service";
import { DatasetSubscriptionsService } from "src/app/dataset-view/dataset.subscriptions.service";
import {
    mockDatasetBasicsDerivedFragment,
    mockDatasetBasicsRootFragment,
    mockFullPowerDatasetPermissionsFragment,
} from "src/app/search/mock.data";

describe("metadataTransformationTabResolverFn", () => {
    let datasetService: DatasetService;
    let datasetSubsService: DatasetSubscriptionsService;

    const routeSnapshot = {} as ActivatedRouteSnapshot;
    const mockState = {} as RouterStateSnapshot;

    const executeResolver: ResolveFn<DatasetOverviewTabData> = (...resolverParameters) =>
        TestBed.runInInjectionContext(() => metadataTransformationTabResolverFn(...resolverParameters));

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

    function resolve(datasetBasics: DatasetBasicsFragment): Promise<unknown> {
        spyOnProperty(datasetService, "datasetChanges", "get").and.returnValue(of(datasetBasics));
        return firstValueFrom(executeResolver(routeSnapshot, mockState) as Observable<unknown>);
    }

    it("should resolve the overview for a derivative dataset", async () => {
        const data = await resolve(mockDatasetBasicsDerivedFragment);

        expect(data).toEqual({
            datasetBasics: mockDatasetBasicsDerivedFragment,
            datasetPermissions: mockFullPowerDatasetPermissionsFragment,
            overviewUpdate: mockOverviewUpdate,
        });
    });

    it("should redirect to page not found for a root dataset", async () => {
        const data = await resolve(mockDatasetBasicsRootFragment);

        expectPageNotFoundRedirect(data);
    });
});
