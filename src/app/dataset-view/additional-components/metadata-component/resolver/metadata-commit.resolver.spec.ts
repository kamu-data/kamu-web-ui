/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestBed } from "@angular/core/testing";

import { of } from "rxjs";

import { Apollo } from "apollo-angular";

import { expectRedirectTo, routeSnapshot, runResolver } from "@common/helpers/base-test.helpers.spec";

import { mockMetadataRootUpdate } from "src/app/dataset-view/additional-components/data-tabs.mock";
import { MetadataTabs } from "src/app/dataset-view/additional-components/metadata-component/metadata.constants";
import {
    mockCommitNeighbours,
    mockLatestRootSnapshot,
} from "src/app/dataset-view/additional-components/metadata-component/metadata.mock";
import { CommitStepMode } from "src/app/dataset-view/additional-components/metadata-component/metadata.types";
import { metadataCommitResolverFn } from "src/app/dataset-view/additional-components/metadata-component/resolver/metadata-commit.resolver";
import { MetadataSnapshotService } from "src/app/dataset-view/additional-components/metadata-component/services/metadata-snapshot.service";
import { DatasetViewTypeEnum } from "src/app/dataset-view/dataset-view.interface";
import { DatasetService } from "src/app/dataset-view/dataset.service";
import { DatasetSubscriptionsService } from "src/app/dataset-view/dataset.subscriptions.service";
import ProjectLinks from "src/app/project-links";
import { mockDatasetBasicsRootFragment, mockFullPowerDatasetPermissionsFragment } from "src/app/search/mock.data";

describe("metadataCommitResolverFn", () => {
    let metadataSnapshotService: MetadataSnapshotService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [Apollo],
        });
        metadataSnapshotService = TestBed.inject(MetadataSnapshotService);
        vi.spyOn(TestBed.inject(DatasetService), "datasetChanges", "get").mockReturnValue(
            of(mockDatasetBasicsRootFragment),
        );
        const datasetSubsService = TestBed.inject(DatasetSubscriptionsService);
        vi.spyOn(datasetSubsService, "permissionsChanges", "get").mockReturnValue(
            of(mockFullPowerDatasetPermissionsFragment),
        );
        vi.spyOn(datasetSubsService, "metadataSchemaChanges", "get").mockReturnValue(of(mockMetadataRootUpdate));
    });

    it("should resolve the shown commit, its neighbours and the step mode", async () => {
        const neighboursSpy = vi
            .spyOn(metadataSnapshotService, "requestNeighbours")
            .mockReturnValue(of(mockCommitNeighbours));
        const route = routeSnapshot({
            queryParams: { [ProjectLinks.URL_QUERY_PARAM_STEPS]: CommitStepMode.AllBlocks },
        });

        const data = await runResolver(metadataCommitResolverFn, route);

        expect(data).toEqual({
            snapshot: mockLatestRootSnapshot,
            neighbours: mockCommitNeighbours,
            steps: CommitStepMode.AllBlocks,
        });
        expect(neighboursSpy).toHaveBeenCalledWith(
            {
                accountName: mockDatasetBasicsRootFragment.owner.accountName,
                datasetName: mockDatasetBasicsRootFragment.name,
            },
            mockLatestRootSnapshot,
            CommitStepMode.AllBlocks,
        );
    });

    it("should pass the redirect for a malformed head through without looking for neighbours", async () => {
        const neighboursSpy = vi.spyOn(metadataSnapshotService, "requestNeighbours");
        const route = routeSnapshot({
            queryParams: { [ProjectLinks.URL_QUERY_PARAM_HEAD]: "not a hash" },
            // The route inherits the dataset view's tab under the same key
            data: { [ProjectLinks.URL_PARAM_TAB]: DatasetViewTypeEnum.Metadata },
            children: [routeSnapshot({ data: { [ProjectLinks.URL_PARAM_TAB]: MetadataTabs.Watermark } })],
        });

        const data = await runResolver(metadataCommitResolverFn, route);

        expectRedirectTo(
            data,
            `/${mockDatasetBasicsRootFragment.owner.accountName}/${mockDatasetBasicsRootFragment.name}/${DatasetViewTypeEnum.Metadata}/${MetadataTabs.Watermark}`,
        );
        expect(neighboursSpy).not.toHaveBeenCalled();
    });
});
