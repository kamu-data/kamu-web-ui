/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestBed } from "@angular/core/testing";

import { of, throwError } from "rxjs";

import { Apollo } from "apollo-angular";

import { expectPageNotFoundRedirect, routeSnapshot, runResolver } from "@common/helpers/base-test.helpers.spec";
import { TEST_ACCOUNT_NAME, TEST_DATASET_NAME } from "@api/mock/dataset.mock";

import { DatasetViewTypeEnum } from "src/app/dataset-view/dataset-view.interface";
import { DatasetService } from "src/app/dataset-view/dataset.service";
import { DatasetSubscriptionsService } from "src/app/dataset-view/dataset.subscriptions.service";
import { datasetViewResolverFn } from "src/app/dataset-view/resolvers/dataset-view.resolver";
import ProjectLinks from "src/app/project-links";
import { mockDatasetBasicsRootFragment, mockFullPowerDatasetPermissionsFragment } from "src/app/search/mock.data";

describe("datasetViewResolverFn", () => {
    let datasetService: DatasetService;
    let datasetSubService: DatasetSubscriptionsService;

    const route = routeSnapshot({
        params: {
            [ProjectLinks.URL_PARAM_ACCOUNT_NAME]: TEST_ACCOUNT_NAME,
            [ProjectLinks.URL_PARAM_DATASET_NAME]: TEST_DATASET_NAME,
        },
    });
    const url = `/${TEST_ACCOUNT_NAME}/${TEST_DATASET_NAME}/${DatasetViewTypeEnum.Overview}`;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [Apollo],
        });
        datasetService = TestBed.inject(DatasetService);
        datasetSubService = TestBed.inject(DatasetSubscriptionsService);
        vi.spyOn(datasetService, "datasetChanges", "get").mockReturnValue(of(mockDatasetBasicsRootFragment));
        vi.spyOn(datasetSubService, "permissionsChanges", "get").mockReturnValue(
            of(mockFullPowerDatasetPermissionsFragment),
        );
    });

    it("should request the dataset from the route and resolve it with permissions", async () => {
        const requestDatasetMainDataSpy = vi
            .spyOn(datasetService, "requestDatasetMainData")
            .mockReturnValue(of(void 0));

        const data = await runResolver(datasetViewResolverFn, route, url);

        expect(requestDatasetMainDataSpy).toHaveBeenCalledTimes(1);

        expect(requestDatasetMainDataSpy).toHaveBeenCalledWith({
            accountName: TEST_ACCOUNT_NAME,
            datasetName: TEST_DATASET_NAME,
        });
        expect(data).toEqual({
            datasetBasics: mockDatasetBasicsRootFragment,
            datasetPermissions: mockFullPowerDatasetPermissionsFragment,
        });
    });

    it("should redirect to page not found when the dataset cannot be loaded", async () => {
        vi.spyOn(datasetService, "requestDatasetMainData").mockReturnValue(throwError(() => new Error("failed")));

        const data = await runResolver(datasetViewResolverFn, route, url);

        expectPageNotFoundRedirect(data);
    });
});
