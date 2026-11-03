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

import {
    expectPageNotFoundRedirect,
    expectRedirectTo,
    routeSnapshot,
    runResolver,
} from "@common/helpers/base-test.helpers.spec";
import { DatasetApi } from "@api/dataset.api";
import { DatasetBasicsFragment } from "@api/kamu.graphql.interface";
import { mockGetDatasetMetadataAsOfQuery, mockOlderBlock } from "@api/mock/dataset.mock";

import { mockMetadataRootUpdate } from "src/app/dataset-view/additional-components/data-tabs.mock";
import { latestMetadataSnapshot } from "src/app/dataset-view/additional-components/metadata-component/metadata-snapshot.helpers";
import { MetadataTabs } from "src/app/dataset-view/additional-components/metadata-component/metadata.constants";
import { MetadataTabData } from "src/app/dataset-view/additional-components/metadata-component/metadata.types";
import { metadataPushSourcesTabResolverFn } from "src/app/dataset-view/additional-components/metadata-component/tabs/metadata-push-sources-tab/resolvers/metadata-push-sources-tab.resolver";
import { DatasetViewTypeEnum } from "src/app/dataset-view/dataset-view.interface";
import { DatasetService } from "src/app/dataset-view/dataset.service";
import { MetadataSchemaUpdate } from "src/app/dataset-view/dataset.subscriptions.interface";
import { DatasetSubscriptionsService } from "src/app/dataset-view/dataset.subscriptions.service";
import ProjectLinks from "src/app/project-links";
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

    it("should resolve the latest metadata for a root dataset without a polling source", async () => {
        const metadataUpdate = metadataUpdateWithoutPollingSource();

        const data = await resolve(mockDatasetBasicsRootFragment, metadataUpdate);

        expect(data).toEqual({
            datasetBasics: mockDatasetBasicsRootFragment,
            datasetPermissions: mockFullPowerDatasetPermissionsFragment,
            snapshot: latestMetadataSnapshot(metadataUpdate.metadataSummary),
        });
    });

    it("should redirect to page not found for a derivative dataset", async () => {
        const data = await resolve(mockDatasetBasicsDerivedFragment, metadataUpdateWithoutPollingSource());

        expectPageNotFoundRedirect(data);
    });

    it("should lead an older commit without push sources to its Schema section", async () => {
        const asOf = structuredClone(mockGetDatasetMetadataAsOfQuery);
        if (asOf.datasets.byOwnerAndName) {
            asOf.datasets.byOwnerAndName.metadata.metadataProjection = [];
        }
        vi.spyOn(TestBed.inject(DatasetApi), "getDatasetMetadataAsOf").mockReturnValue(of(asOf));
        vi.spyOn(datasetService, "datasetChanges", "get").mockReturnValue(of(mockDatasetBasicsRootFragment));
        vi.spyOn(datasetSubsService, "metadataSchemaChanges", "get").mockReturnValue(of(mockMetadataRootUpdate));

        const data = await runResolver(
            metadataPushSourcesTabResolverFn,
            routeSnapshot({ queryParams: { [ProjectLinks.URL_QUERY_PARAM_HEAD]: mockOlderBlock.blockHash } }),
        );

        expectRedirectTo(
            data,
            `/${mockDatasetBasicsRootFragment.owner.accountName}/${mockDatasetBasicsRootFragment.name}/${DatasetViewTypeEnum.Metadata}/${MetadataTabs.Schema}?head=${mockOlderBlock.blockHash}`,
        );
    });

    it("should redirect to page not found for a root dataset with a polling source", async () => {
        expect(mockMetadataRootUpdate.metadataSummary.metadata.currentPollingSource).toBeTruthy();

        const data = await resolve(mockDatasetBasicsRootFragment, mockMetadataRootUpdate);

        expectPageNotFoundRedirect(data);
    });
});
