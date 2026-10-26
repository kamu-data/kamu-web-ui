/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestBed } from "@angular/core/testing";
import { RedirectCommand } from "@angular/router";

import { of } from "rxjs";

import { Apollo } from "apollo-angular";

import { expectPageNotFoundRedirect, runResolver } from "@common/helpers/base-test.helpers.spec";
import { DatasetBasicsFragment } from "@api/kamu.graphql.interface";

import { mockMetadataRootUpdate } from "src/app/dataset-view/additional-components/data-tabs.mock";
import { MetadataTabData } from "src/app/dataset-view/additional-components/metadata-component/metadata.constants";
import { metadataPushSourcesTabResolverFn } from "src/app/dataset-view/additional-components/metadata-component/tabs/metadata-push-sources-tab/resolvers/metadata-push-sources-tab.resolver";
import { DatasetService } from "src/app/dataset-view/dataset.service";
import { MetadataSchemaUpdate } from "src/app/dataset-view/dataset.subscriptions.interface";
import { DatasetSubscriptionsService } from "src/app/dataset-view/dataset.subscriptions.service";
import {
    mockDatasetBasicsDerivedFragment,
    mockDatasetBasicsRootFragment,
    mockFullPowerDatasetPermissionsFragment,
} from "src/app/search/mock.data";

describe("metadataPushSourcesTabResolverFn", () => {
    let datasetService: DatasetService;
    let datasetSubsService: DatasetSubscriptionsService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [Apollo],
        });
        datasetService = TestBed.inject(DatasetService);
        datasetSubsService = TestBed.inject(DatasetSubscriptionsService);
        vi.spyOn(datasetSubsService, "permissionsChanges", "get").mockReturnValue(
            of(mockFullPowerDatasetPermissionsFragment),
        );
    });

    function metadataUpdateWithoutPollingSource(): MetadataSchemaUpdate {
        const metadataUpdate = structuredClone(mockMetadataRootUpdate);
        metadataUpdate.metadataSummary.metadata.currentPollingSource = null;
        metadataUpdate.metadataSummary.metadata.currentPushSources = [];
        return metadataUpdate;
    }

    function resolve(
        datasetBasics: DatasetBasicsFragment,
        metadataUpdate: MetadataSchemaUpdate,
    ): Promise<MetadataTabData | RedirectCommand> {
        vi.spyOn(datasetService, "datasetChanges", "get").mockReturnValue(of(datasetBasics));
        vi.spyOn(datasetSubsService, "metadataSchemaChanges", "get").mockReturnValue(of(metadataUpdate));
        return runResolver(metadataPushSourcesTabResolverFn);
    }

    it("should resolve the metadata summary for a root dataset without a polling source", async () => {
        const metadataUpdate = metadataUpdateWithoutPollingSource();

        const data = await resolve(mockDatasetBasicsRootFragment, metadataUpdate);

        expect(data).toEqual({
            datasetBasics: mockDatasetBasicsRootFragment,
            datasetPermissions: mockFullPowerDatasetPermissionsFragment,
            metadataSummary: metadataUpdate.metadataSummary,
        });
    });

    it("should redirect to page not found for a derivative dataset", async () => {
        const data = await resolve(mockDatasetBasicsDerivedFragment, metadataUpdateWithoutPollingSource());

        expectPageNotFoundRedirect(data);
    });

    it("should redirect to page not found for a root dataset with a polling source", async () => {
        expect(mockMetadataRootUpdate.metadataSummary.metadata.currentPollingSource).toBeTruthy();

        const data = await resolve(mockDatasetBasicsRootFragment, mockMetadataRootUpdate);

        expectPageNotFoundRedirect(data);
    });
});
