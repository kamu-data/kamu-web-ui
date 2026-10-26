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

    function resolve(datasetBasics: DatasetBasicsFragment): Promise<DatasetOverviewTabData | RedirectCommand> {
        spyOnProperty(datasetService, "datasetChanges", "get").and.returnValue(of(datasetBasics));
        return runResolver(metadataTransformationTabResolverFn);
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

    it("should redirect to page not found when the dataset cannot be loaded", async () => {
        spyOnProperty(datasetService, "datasetChanges", "get").and.returnValue(throwError(() => new Error("fail")));

        const data = await runResolver(metadataTransformationTabResolverFn);

        expectPageNotFoundRedirect(data);
    });
});
