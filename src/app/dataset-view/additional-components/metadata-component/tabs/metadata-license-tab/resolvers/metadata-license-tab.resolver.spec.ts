/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestBed } from "@angular/core/testing";
import { ResolveFn } from "@angular/router";
import { metadataLicenseTabResolverFn } from "./metadata-license-tab.resolver";
import { LicenseFragment } from "src/app/api/kamu.graphql.interface";
import { MaybeNullOrUndefined } from "src/app/interface/app.types";

describe("metadataLicenseTabResolver", () => {
    const executeResolver: ResolveFn<MaybeNullOrUndefined<LicenseFragment>> = (...resolverParameters) =>
        TestBed.runInInjectionContext(() => metadataLicenseTabResolverFn(...resolverParameters));

    beforeEach(() => {
        TestBed.configureTestingModule({});
    });

    it("should be created", () => {
        expect(executeResolver).toBeTruthy();
    });
});
