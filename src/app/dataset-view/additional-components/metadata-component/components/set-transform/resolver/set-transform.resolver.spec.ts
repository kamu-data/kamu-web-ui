/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestBed } from "@angular/core/testing";
import { ActivatedRoute, ActivatedRouteSnapshot, ResolveFn, Router } from "@angular/router";
import { setTransformResolverFn } from "./set-transform.resolver";
import { Apollo } from "apollo-angular";
import { EditSetTransformService } from "src/app/dataset-view/additional-components/metadata-component/components/set-transform/edit-set-transform..service";
import { of } from "rxjs";
import { TEST_ACCOUNT_NAME, TEST_DATASET_NAME } from "src/app/api/mock/dataset.mock";
import { SupportedEvents } from "src/app/dataset-block/metadata-block/components/event-details/supported.events";
import ProjectLinks from "src/app/project-links";

describe("setTransformResolverFn", () => {
    let editService: EditSetTransformService;
    let routeSnapshot: ActivatedRouteSnapshot;
    let router: Router;

    const executeResolver: ResolveFn<string> = (...resolverParameters) =>
        TestBed.runInInjectionContext(() => setTransformResolverFn(...resolverParameters));

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                Apollo,
                {
                    provide: ActivatedRoute,
                    useValue: {
                        paramMap: {},
                    },
                },
            ],
        });

        editService = TestBed.inject(EditSetTransformService);
        router = TestBed.inject(Router);
    });

    it("should be created", () => {
        expect(executeResolver).toBeTruthy();
    });

    it("should check resolver", async () => {
        routeSnapshot = new ActivatedRouteSnapshot();
        routeSnapshot.params = {
            [ProjectLinks.URL_PARAM_ACCOUNT_NAME]: TEST_ACCOUNT_NAME,
            [ProjectLinks.URL_PARAM_DATASET_NAME]: TEST_DATASET_NAME,
        };

        const getEventAsYamlSpy = spyOn(editService, "getEventAsYaml").and.returnValue(of());
        await executeResolver(routeSnapshot, router.routerState.snapshot);
        expect(getEventAsYamlSpy).toHaveBeenCalledOnceWith(
            { accountName: TEST_ACCOUNT_NAME, datasetName: TEST_DATASET_NAME },
            SupportedEvents.SetTransform,
        );
    });
});
