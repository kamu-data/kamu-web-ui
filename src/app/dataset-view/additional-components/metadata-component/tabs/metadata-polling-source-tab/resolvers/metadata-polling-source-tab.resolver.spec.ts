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

import {
    mockMetadataDerivedUpdate,
    mockMetadataRootUpdate,
} from "src/app/dataset-view/additional-components/data-tabs.mock";
import { MetadataTabData } from "src/app/dataset-view/additional-components/metadata-component/metadata.constants";
import { metadataPollingSourceTabResolverFn } from "src/app/dataset-view/additional-components/metadata-component/tabs/metadata-polling-source-tab/resolvers/metadata-polling-source-tab.resolver";
import { DatasetService } from "src/app/dataset-view/dataset.service";
import { MetadataSchemaUpdate } from "src/app/dataset-view/dataset.subscriptions.interface";
import { DatasetSubscriptionsService } from "src/app/dataset-view/dataset.subscriptions.service";
import {
    mockDatasetBasicsDerivedFragment,
    mockDatasetBasicsRootFragment,
    mockFullPowerDatasetPermissionsFragment,
} from "src/app/search/mock.data";

describe("metadataPollingSourceTabResolverFn", () => {
    let datasetService: DatasetService;
    let datasetSubsService: DatasetSubscriptionsService;

    const routeSnapshot = {} as ActivatedRouteSnapshot;
    const mockState = {} as RouterStateSnapshot;

    const executeResolver: ResolveFn<MetadataTabData> = (...resolverParameters) =>
        TestBed.runInInjectionContext(() => metadataPollingSourceTabResolverFn(...resolverParameters));

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [Apollo],
        });
        datasetService = TestBed.inject(DatasetService);
        datasetSubsService = TestBed.inject(DatasetSubscriptionsService);
        spyOnProperty(datasetSubsService, "permissionsChanges", "get").and.returnValue(
            of(mockFullPowerDatasetPermissionsFragment),
        );
    });

    function resolve(datasetBasics: DatasetBasicsFragment, metadataUpdate: MetadataSchemaUpdate): Promise<unknown> {
        spyOnProperty(datasetService, "datasetChanges", "get").and.returnValue(of(datasetBasics));
        spyOnProperty(datasetSubsService, "metadataSchemaChanges", "get").and.returnValue(of(metadataUpdate));
        return firstValueFrom(executeResolver(routeSnapshot, mockState) as Observable<unknown>);
    }

    it("should resolve the metadata summary for a root dataset", async () => {
        const data = await resolve(mockDatasetBasicsRootFragment, mockMetadataRootUpdate);

        expect(data).toEqual({
            datasetBasics: mockDatasetBasicsRootFragment,
            datasetPermissions: mockFullPowerDatasetPermissionsFragment,
            metadataSummary: mockMetadataRootUpdate.metadataSummary,
        });
    });

    it("should redirect to page not found for a derivative dataset", async () => {
        const data = await resolve(mockDatasetBasicsDerivedFragment, mockMetadataDerivedUpdate);

        expectPageNotFoundRedirect(data);
    });
});
