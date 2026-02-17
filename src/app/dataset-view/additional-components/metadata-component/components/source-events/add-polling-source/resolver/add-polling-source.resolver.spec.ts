/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestBed } from "@angular/core/testing";
import { ActivatedRoute, ActivatedRouteSnapshot, ResolveFn, Router } from "@angular/router";

import { of } from "rxjs";

import { Apollo } from "apollo-angular";
import { EditPollingSourceService } from "src/app/dataset-view/additional-components/metadata-component/components/source-events/add-polling-source/edit-polling-source.service";
import { addPollingSourceResolverFn } from "src/app/dataset-view/additional-components/metadata-component/components/source-events/add-polling-source/resolver/add-polling-source.resolver";
import ProjectLinks from "src/app/project-links";

import { TEST_ACCOUNT_NAME, TEST_DATASET_NAME } from "@api/mock/dataset.mock";
import { MaybeNull } from "@interface/app.types";

describe("addPollingSourceResolverFn", () => {
    let editService: EditPollingSourceService;
    let routeSnapshot: ActivatedRouteSnapshot;
    let router: Router;

    const executeResolver: ResolveFn<MaybeNull<string>> = (...resolverParameters) =>
        TestBed.runInInjectionContext(() => addPollingSourceResolverFn(...resolverParameters));

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
        editService = TestBed.inject(EditPollingSourceService);
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
        expect(getEventAsYamlSpy).toHaveBeenCalledOnceWith({
            accountName: TEST_ACCOUNT_NAME,
            datasetName: TEST_DATASET_NAME,
        });
    });
});
