/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestBed } from "@angular/core/testing";
import { ResolveFn } from "@angular/router";
import { metadataPushSourcesTabResolverFn } from "./metadata-push-sources-tab.resolver";
import { DatasetOverviewTabData } from "src/app/dataset-view/dataset-view.interface";

describe("metadataPushSourcesTabComponentResolver", () => {
    const executeResolver: ResolveFn<DatasetOverviewTabData | null> = (...resolverParameters) =>
        TestBed.runInInjectionContext(() => metadataPushSourcesTabResolverFn(...resolverParameters));

    beforeEach(() => {
        TestBed.configureTestingModule({});
    });

    it("should be created", () => {
        expect(executeResolver).toBeTruthy();
    });
});
