/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestBed } from "@angular/core/testing";
import { ActivatedRoute, ActivatedRouteSnapshot, ResolveFn, Router } from "@angular/router";
import { addPushSourceResolver } from "./add-push-source.resolver";
import { MaybeNullOrUndefined } from "src/app/interface/app.types";
import { EditAddPushSourceService } from "src/app/dataset-view/additional-components/metadata-component/components/source-events/add-push-source/edit-add-push-source.service";
import { Apollo } from "apollo-angular";
import { of } from "rxjs";
import { TEST_ACCOUNT_NAME, TEST_DATASET_NAME } from "src/app/api/mock/dataset.mock";
import { SupportedEvents } from "src/app/dataset-block/metadata-block/components/event-details/supported.events";
import ProjectLinks from "src/app/project-links";

describe("addPushSourceResolver", () => {
    let editService: EditAddPushSourceService;
    let routeSnapshot: ActivatedRouteSnapshot;
    let router: Router;

    const executeResolver: ResolveFn<MaybeNullOrUndefined<string>> = (...resolverParameters) =>
        TestBed.runInInjectionContext(() => addPushSourceResolver(...resolverParameters));

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
        editService = TestBed.inject(EditAddPushSourceService);
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
            SupportedEvents.AddPushSource,
            "",
        );
    });
});
