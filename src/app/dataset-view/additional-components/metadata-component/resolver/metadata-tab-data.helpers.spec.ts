/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestBed } from "@angular/core/testing";

import { firstValueFrom, of } from "rxjs";

import { Apollo } from "apollo-angular";

import { mockMetadataRootUpdate } from "src/app/dataset-view/additional-components/data-tabs.mock";
import { requestMetadataTabData } from "src/app/dataset-view/additional-components/metadata-component/resolver/metadata-tab-data.helpers";
import { DatasetService } from "src/app/dataset-view/dataset.service";
import { DatasetSubscriptionsService } from "src/app/dataset-view/dataset.subscriptions.service";
import { mockDatasetBasicsRootFragment, mockFullPowerDatasetPermissionsFragment } from "src/app/search/mock.data";

describe("requestMetadataTabData", () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [Apollo],
        });
        spyOnProperty(TestBed.inject(DatasetService), "datasetChanges", "get").and.returnValue(
            of(mockDatasetBasicsRootFragment),
        );
        const datasetSubsService = TestBed.inject(DatasetSubscriptionsService);
        spyOnProperty(datasetSubsService, "permissionsChanges", "get").and.returnValue(
            of(mockFullPowerDatasetPermissionsFragment),
        );
        spyOnProperty(datasetSubsService, "metadataSchemaChanges", "get").and.returnValue(of(mockMetadataRootUpdate));
    });

    it("should emit the dataset, its permissions and the metadata summary", async () => {
        const data = await firstValueFrom(TestBed.runInInjectionContext(() => requestMetadataTabData()));

        expect(data).toEqual({
            datasetBasics: mockDatasetBasicsRootFragment,
            datasetPermissions: mockFullPowerDatasetPermissionsFragment,
            metadataSummary: mockMetadataRootUpdate.metadataSummary,
        });
    });
});
