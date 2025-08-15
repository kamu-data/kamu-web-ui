/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestBed } from "@angular/core/testing";
import { ResolveFn } from "@angular/router";
import { metadataTransformationTabResolverFn } from "./metadata-transformation-tab.resolver";
import { DatasetTransformFragment } from "src/app/api/kamu.graphql.interface";
import { MaybeNullOrUndefined } from "src/app/interface/app.types";

describe("metadataTransformationTabResolver", () => {
    const executeResolver: ResolveFn<MaybeNullOrUndefined<DatasetTransformFragment>> = (...resolverParameters) =>
        TestBed.runInInjectionContext(() => metadataTransformationTabResolverFn(...resolverParameters));

    beforeEach(() => {
        TestBed.configureTestingModule({});
    });

    it("should be created", () => {
        expect(executeResolver).toBeTruthy();
    });
});
