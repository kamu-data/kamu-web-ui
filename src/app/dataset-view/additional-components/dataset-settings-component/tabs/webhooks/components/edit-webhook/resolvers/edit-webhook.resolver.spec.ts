/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestBed } from "@angular/core/testing";
import { ResolveFn } from "@angular/router";
import { editWebhookResolverFn } from "./edit-webhook.resolver";
import { EditWebhooksType } from "../edit-webhooks.types";

describe("editWebhookResolver", () => {
    const executeResolver: ResolveFn<EditWebhooksType> = (...resolverParameters) =>
        TestBed.runInInjectionContext(() => editWebhookResolverFn(...resolverParameters));

    beforeEach(() => {
        TestBed.configureTestingModule({});
    });

    it("should be created", () => {
        expect(executeResolver).toBeTruthy();
    });
});
