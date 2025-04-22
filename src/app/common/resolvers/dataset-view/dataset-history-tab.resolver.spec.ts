/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestBed } from "@angular/core/testing";
import { ActivatedRouteSnapshot, convertToParamMap, ResolveFn, RouterStateSnapshot } from "@angular/router";
import { datasetHistoryTabResolver } from "./dataset-history-tab.resolver";
import { DatasetHistoryUpdate } from "src/app/dataset-view/dataset.subscriptions.interface";
import { MaybeNull } from "src/app/interface/app.types";
import { Apollo } from "apollo-angular";
import { DatasetService } from "src/app/dataset-view/dataset.service";
import { of } from "rxjs";
import { mockHistoryEditPollingSourceService } from "src/app/search/mock.data";
import { TEST_ACCOUNT_NAME, TEST_DATASET_NAME } from "src/app/api/mock/dataset.mock";
import ProjectLinks from "src/app/project-links";

describe("datasetHistoryTabResolver", () => {
    let datasetService: DatasetService;

    const executeResolver: ResolveFn<MaybeNull<DatasetHistoryUpdate>> = (...resolverParameters) =>
        TestBed.runInInjectionContext(() => datasetHistoryTabResolver(...resolverParameters));

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [Apollo],
        });

        datasetService = TestBed.inject(DatasetService);
    });

    it("should be created", () => {
        expect(executeResolver).toBeTruthy();
    });

    it("should check resolver without page", async () => {
        const getDatasetHistorySpy = spyOn(datasetService, "getDatasetHistory").and.returnValue(
            of(mockHistoryEditPollingSourceService),
        );

        const routeSnapshot = {
            parent: {
                paramMap: convertToParamMap({
                    [ProjectLinks.URL_PARAM_ACCOUNT_NAME]: TEST_ACCOUNT_NAME,
                    [ProjectLinks.URL_PARAM_DATASET_NAME]: TEST_DATASET_NAME,
                }),
            },
            queryParamMap: convertToParamMap({}),
        } as ActivatedRouteSnapshot;
        const mockState = {} as RouterStateSnapshot;

        await executeResolver(routeSnapshot, mockState);

        expect(getDatasetHistorySpy).toHaveBeenCalledOnceWith(
            { accountName: TEST_ACCOUNT_NAME, datasetName: TEST_DATASET_NAME },
            10,
            0,
        );
    });

    it("should check resolver with page", async () => {
        const getDatasetHistorySpy = spyOn(datasetService, "getDatasetHistory").and.returnValue(
            of(mockHistoryEditPollingSourceService),
        );

        const routeSnapshot = {
            parent: {
                paramMap: convertToParamMap({
                    [ProjectLinks.URL_PARAM_ACCOUNT_NAME]: TEST_ACCOUNT_NAME,
                    [ProjectLinks.URL_PARAM_DATASET_NAME]: TEST_DATASET_NAME,
                }),
            },
            queryParamMap: convertToParamMap({
                [ProjectLinks.URL_QUERY_PARAM_PAGE]: "3",
            }),
        } as ActivatedRouteSnapshot;
        const mockState = {} as RouterStateSnapshot;

        await executeResolver(routeSnapshot, mockState);

        expect(getDatasetHistorySpy).toHaveBeenCalledOnceWith(
            { accountName: TEST_ACCOUNT_NAME, datasetName: TEST_DATASET_NAME },
            10,
            2,
        );
    });
});
