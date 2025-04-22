/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestBed } from "@angular/core/testing";
import { ActivatedRouteSnapshot, convertToParamMap, ResolveFn, RouterStateSnapshot } from "@angular/router";
import { datasetLineageTabResolver } from "./dataset-lineage-tab.resolver";
import { LineageGraphUpdate } from "src/app/dataset-view/additional-components/lineage-component/lineage-model";
import { MaybeNull } from "src/app/interface/app.types";
import { LineageGraphBuilderService } from "src/app/dataset-view/additional-components/lineage-component/services/lineage-graph-builder.service";
import { DatasetService } from "src/app/dataset-view/dataset.service";
import { Apollo } from "apollo-angular";
import { TEST_ACCOUNT_NAME, TEST_DATASET_NAME } from "src/app/api/mock/dataset.mock";
import ProjectLinks from "src/app/project-links";
import { of } from "rxjs";

describe("datasetLineageTabResolver", () => {
    let lineageGraphBuilderService: LineageGraphBuilderService;
    let datasetService: DatasetService;

    const executeResolver: ResolveFn<MaybeNull<LineageGraphUpdate>> = (...resolverParameters) =>
        TestBed.runInInjectionContext(() => datasetLineageTabResolver(...resolverParameters));

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [Apollo],
        });

        lineageGraphBuilderService = TestBed.inject(LineageGraphBuilderService);
        datasetService = TestBed.inject(DatasetService);
    });

    it("should be created", () => {
        expect(executeResolver).toBeTruthy();
    });

    it("should check resolver", async () => {
        spyOn(lineageGraphBuilderService, "buildGraph").and.returnValue(of(null));
        const requestDatasetLineageSpy = spyOn(datasetService, "requestDatasetLineage").and.returnValue(of().pipe());
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
        expect(requestDatasetLineageSpy).toHaveBeenCalledTimes(1);
    });
});
