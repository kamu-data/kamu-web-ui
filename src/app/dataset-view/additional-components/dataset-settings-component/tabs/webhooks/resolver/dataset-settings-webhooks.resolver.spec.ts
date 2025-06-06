/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestBed } from "@angular/core/testing";
import { ResolveFn } from "@angular/router";
import { datasetSettingsWebhooksResolverFn } from "./dataset-settings-webhooks.resolver";
import { DatasetViewData } from "src/app/dataset-view/dataset-view.interface";

describe("datasetSettingsWebhooksResolver", () => {
    const executeResolver: ResolveFn<DatasetViewData | null> = (...resolverParameters) =>
        TestBed.runInInjectionContext(() => datasetSettingsWebhooksResolverFn(...resolverParameters));

    beforeEach(() => {
        TestBed.configureTestingModule({});
    });

    it("should be created", () => {
        expect(executeResolver).toBeTruthy();
    });
});
