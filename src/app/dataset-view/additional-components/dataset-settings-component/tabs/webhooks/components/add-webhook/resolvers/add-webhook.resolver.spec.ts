/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestBed } from "@angular/core/testing";
import { ResolveFn } from "@angular/router";
import { addWebhookResolverFn } from "./add-webhook.resolver";
import { DatasetBasicsFragment } from "src/app/api/kamu.graphql.interface";

describe("addWebhookResolver", () => {
    const executeResolver: ResolveFn<DatasetBasicsFragment> = (...resolverParameters) =>
        TestBed.runInInjectionContext(() => addWebhookResolverFn(...resolverParameters));

    beforeEach(() => {
        TestBed.configureTestingModule({});
    });

    it("should be created", () => {
        expect(executeResolver).toBeTruthy();
    });
});
