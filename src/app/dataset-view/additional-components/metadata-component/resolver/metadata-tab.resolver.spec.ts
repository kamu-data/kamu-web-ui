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

import { mockMetadataRootUpdate } from "src/app/dataset-view/additional-components/data-tabs.mock";
import { mockLatestRootSnapshot } from "src/app/dataset-view/additional-components/metadata-component/metadata.mock";
import { metadataTabResolverFn } from "src/app/dataset-view/additional-components/metadata-component/resolver/metadata-tab.resolver";
import { DatasetService } from "src/app/dataset-view/dataset.service";
import { DatasetSubscriptionsService } from "src/app/dataset-view/dataset.subscriptions.service";
import { mockDatasetBasicsRootFragment, mockFullPowerDatasetPermissionsFragment } from "src/app/search/mock.data";

describe("metadataTabResolverFn", () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [Apollo],
        });
        vi.spyOn(TestBed.inject(DatasetService), "datasetChanges", "get").mockReturnValue(
            of(mockDatasetBasicsRootFragment),
        );
        const datasetSubsService = TestBed.inject(DatasetSubscriptionsService);
        vi.spyOn(datasetSubsService, "permissionsChanges", "get").mockReturnValue(
            of(mockFullPowerDatasetPermissionsFragment),
        );
        vi.spyOn(datasetSubsService, "metadataSchemaChanges", "get").mockReturnValue(of(mockMetadataRootUpdate));
    });

    it("should resolve the dataset with its latest metadata", async () => {
        const data = await runResolver(metadataTabResolverFn);

        expect(data).toEqual({
            datasetBasics: mockDatasetBasicsRootFragment,
            datasetPermissions: mockFullPowerDatasetPermissionsFragment,
            snapshot: mockLatestRootSnapshot,
        });
    });
});
