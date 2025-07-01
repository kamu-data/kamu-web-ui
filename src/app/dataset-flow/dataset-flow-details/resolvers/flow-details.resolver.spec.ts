/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestBed } from "@angular/core/testing";
import { ActivatedRouteSnapshot, convertToParamMap, ResolveFn, RouterStateSnapshot } from "@angular/router";
import { flowDetailsResolverFn } from "./flow-details.resolver";
import { DatasetFlowByIdResponse } from "src/app/dataset-flow/dataset-flow-details/dataset-flow-details.types";
import { MaybeNull } from "src/app/interface/app.types";
import { Apollo } from "apollo-angular";
import { DatasetService } from "src/app/dataset-view/dataset.service";
import { of } from "rxjs";
import { mockDatasetBasicsRootFragment } from "src/app/search/mock.data";
import ProjectLinks from "src/app/project-links";
import { TEST_ACCOUNT_NAME, TEST_DATASET_NAME } from "src/app/api/mock/dataset.mock";
import { provideToastr } from "ngx-toastr";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { provideAnimations } from "@angular/platform-browser/animations";

describe("flowDetailsResolverFn", () => {
    let datasetService: DatasetService;

    const executeResolver: ResolveFn<MaybeNull<DatasetFlowByIdResponse>> = (...resolverParameters) =>
        TestBed.runInInjectionContext(() => flowDetailsResolverFn(...resolverParameters));

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [Apollo, provideAnimations(), provideToastr()],
            imports: [HttpClientTestingModule],
        });

        datasetService = TestBed.inject(DatasetService);
    });

    it("should be created", () => {
        expect(executeResolver).toBeTruthy();
    });

    it("should check resolver", async () => {
        const FLOW_ID = 3;
        const requestDatasetBasicDataWithPermissionsSpy = spyOn(
            datasetService,
            "requestDatasetBasicDataWithPermissions",
        );
        spyOnProperty(datasetService, "datasetChanges", "get").and.returnValue(of(mockDatasetBasicsRootFragment));
        const mockState = {} as RouterStateSnapshot;
        const mockRoute = {
            paramMap: convertToParamMap({
                [ProjectLinks.URL_PARAM_ACCOUNT_NAME]: TEST_ACCOUNT_NAME,
                [ProjectLinks.URL_PARAM_DATASET_NAME]: TEST_DATASET_NAME,
                [ProjectLinks.URL_PARAM_FLOW_ID]: FLOW_ID,
            }),
        } as ActivatedRouteSnapshot;

        await executeResolver(mockRoute, mockState);

        expect(requestDatasetBasicDataWithPermissionsSpy).toHaveBeenCalledTimes(1);
    });
});
