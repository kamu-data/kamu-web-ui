/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestBed } from "@angular/core/testing";
import { ActivatedRouteSnapshot, convertToParamMap, ResolveFn, RouterStateSnapshot } from "@angular/router";

import { Observable } from "rxjs";

import { Apollo } from "apollo-angular";
import { mockOverviewUpdate } from "src/app/dataset-view/additional-components/data-tabs.mock";
import { datasetFlowsTabResolverFn } from "src/app/dataset-view/additional-components/flows-component/resolver/dataset-flows-tab.resolver";
import { DatasetOverviewTabData, DatasetViewTypeEnum } from "src/app/dataset-view/dataset-view.interface";
import { DatasetService } from "src/app/dataset-view/dataset.service";
import { DatasetSubscriptionsService } from "src/app/dataset-view/dataset.subscriptions.service";
import ProjectLinks from "src/app/project-links";
import { mockDatasetBasicsRootFragment, mockFullPowerDatasetPermissionsFragment } from "src/app/search/mock.data";

import { TEST_ACCOUNT_NAME } from "@api/mock/dataset.mock";

describe("datasetFlowsTabResolverFn", () => {
    let datasetService: DatasetService;
    let datasetSubsService: DatasetSubscriptionsService;
    const executeResolver: ResolveFn<DatasetOverviewTabData> = (...resolverParameters) =>
        TestBed.runInInjectionContext(() => datasetFlowsTabResolverFn(...resolverParameters));

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [Apollo],
        });
        datasetService = TestBed.inject(DatasetService);
        datasetSubsService = TestBed.inject(DatasetSubscriptionsService);
    });

    it("should be created", () => {
        expect(executeResolver).toBeTruthy();
    });

    it("should check resolver", async () => {
        datasetService.emitDatasetChanged(mockDatasetBasicsRootFragment);
        datasetSubsService.emitPermissionsChanged(mockFullPowerDatasetPermissionsFragment);
        datasetSubsService.emitOverviewChanged(mockOverviewUpdate);
        const routeSnapshot = {
            paramMap: convertToParamMap({ [ProjectLinks.URL_PARAM_ACCOUNT_NAME]: TEST_ACCOUNT_NAME }),
            queryParamMap: convertToParamMap({}),
        } as ActivatedRouteSnapshot;
        const mockState = {
            url: `/kamu/datasetName/${DatasetViewTypeEnum.Flows}`,
        } as RouterStateSnapshot;
        const result = (await executeResolver(routeSnapshot, mockState)) as Observable<DatasetOverviewTabData>;
        result.subscribe((data) => {
            expect(data).toEqual({
                datasetBasics: mockDatasetBasicsRootFragment,
                datasetPermissions: mockFullPowerDatasetPermissionsFragment,
                overviewUpdate: mockOverviewUpdate,
            });
        });
    });
});
