/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestBed } from "@angular/core/testing";
import { provideAnimations } from "@angular/platform-browser/animations";
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from "@angular/router";

import { Observable, of } from "rxjs";

import { Apollo } from "apollo-angular";
import { provideToastr } from "ngx-toastr";
import { DatasetBasicsFragment } from "src/app/api/kamu.graphql.interface";
import { DatasetService } from "src/app/dataset-view/dataset.service";
import { mockDatasetBasicsRootFragment } from "src/app/search/mock.data";

import { addWebhookResolverFn } from "./add-webhook.resolver";

describe("addWebhookResolver", () => {
    let datasetService: DatasetService;

    const executeResolver: ResolveFn<DatasetBasicsFragment> = (...resolverParameters) =>
        TestBed.runInInjectionContext(() => addWebhookResolverFn(...resolverParameters));

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [Apollo, provideAnimations(), provideToastr()],
        });

        datasetService = TestBed.inject(DatasetService);
    });

    it("should be created", () => {
        expect(executeResolver).toBeTruthy();
    });

    it("should check resolver", () => {
        spyOnProperty(datasetService, "datasetChanges", "get").and.returnValue(of(mockDatasetBasicsRootFragment));
        const mockRoute = {} as ActivatedRouteSnapshot;
        const mockState = {} as RouterStateSnapshot;
        const result = executeResolver(mockRoute, mockState) as Observable<DatasetBasicsFragment>;
        result.subscribe((data) => {
            expect(data).toEqual(mockDatasetBasicsRootFragment);
        });
    });
});
