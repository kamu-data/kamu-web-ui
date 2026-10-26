/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestBed } from "@angular/core/testing";
import { RedirectCommand } from "@angular/router";

import { of, throwError } from "rxjs";

import { Apollo } from "apollo-angular";

import { expectPageNotFoundRedirect, runResolver } from "@common/helpers/base-test.helpers.spec";
import { DatasetBasicsFragment } from "@api/kamu.graphql.interface";

import { mockOverviewUpdate } from "src/app/dataset-view/additional-components/data-tabs.mock";
import { metadataWatermarkTabResolverFn } from "src/app/dataset-view/additional-components/metadata-component/tabs/metadata-watermark-tab/resolvers/metadata-watermark-tab.resolver";
import { DatasetOverviewTabData } from "src/app/dataset-view/dataset-view.interface";
import { DatasetService } from "src/app/dataset-view/dataset.service";
import { DatasetSubscriptionsService } from "src/app/dataset-view/dataset.subscriptions.service";
import {
    mockDatasetBasicsDerivedFragment,
    mockDatasetBasicsRootFragment,
    mockFullPowerDatasetPermissionsFragment,
} from "src/app/search/mock.data";

describe("metadataWatermarkTabResolverFn", () => {
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
        vi.spyOn(datasetSubsService, "overviewChanges", "get").mockReturnValue(of(mockOverviewUpdate));
    });

    function resolve(datasetBasics: DatasetBasicsFragment): Promise<DatasetOverviewTabData | RedirectCommand> {
        vi.spyOn(datasetService, "datasetChanges", "get").mockReturnValue(of(datasetBasics));
        return runResolver(metadataWatermarkTabResolverFn);
    }

    it("should resolve the overview for a root dataset", async () => {
        const data = await resolve(mockDatasetBasicsRootFragment);

        expect(data).toEqual({
            datasetBasics: mockDatasetBasicsRootFragment,
            datasetPermissions: mockFullPowerDatasetPermissionsFragment,
            overviewUpdate: mockOverviewUpdate,
        });
    });

    it("should redirect to page not found for a derivative dataset", async () => {
        const data = await resolve(mockDatasetBasicsDerivedFragment);

        expectPageNotFoundRedirect(data);
    });

    it("should redirect to page not found when the dataset cannot be loaded", async () => {
        vi.spyOn(datasetService, "datasetChanges", "get").mockReturnValue(throwError(() => new Error("fail")));

        const data = await runResolver(metadataWatermarkTabResolverFn);

        expectPageNotFoundRedirect(data);
    });
});
