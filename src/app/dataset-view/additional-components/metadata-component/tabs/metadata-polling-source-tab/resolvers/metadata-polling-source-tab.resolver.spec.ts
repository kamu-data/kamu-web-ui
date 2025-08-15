/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestBed } from "@angular/core/testing";
import { ResolveFn } from "@angular/router";
import { metadataPollingSourceTabResolverFn } from "./metadata-polling-source-tab.resolver";
import { SetPollingSourceEventFragment } from "src/app/api/kamu.graphql.interface";
import { MaybeNullOrUndefined } from "src/app/interface/app.types";

describe("metadataPollingSourceTabResolver", () => {
    const executeResolver: ResolveFn<MaybeNullOrUndefined<SetPollingSourceEventFragment>> = (...resolverParameters) =>
        TestBed.runInInjectionContext(() => metadataPollingSourceTabResolverFn(...resolverParameters));

    beforeEach(() => {
        TestBed.configureTestingModule({});
    });

    it("should be created", () => {
        expect(executeResolver).toBeTruthy();
    });
});
