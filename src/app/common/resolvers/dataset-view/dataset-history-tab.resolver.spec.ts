/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestBed } from "@angular/core/testing";
import { ResolveFn } from "@angular/router";
import { datasetHistoryTabResolver } from "./dataset-history-tab.resolver";
import { DatasetHistoryUpdate } from "src/app/dataset-view/dataset.subscriptions.interface";
import { MaybeNull } from "src/app/interface/app.types";

describe("datasetHistoryTabResolver", () => {
    const executeResolver: ResolveFn<MaybeNull<DatasetHistoryUpdate>> = (...resolverParameters) =>
        TestBed.runInInjectionContext(() => datasetHistoryTabResolver(...resolverParameters));

    beforeEach(() => {
        TestBed.configureTestingModule({});
    });

    it("should be created", () => {
        expect(executeResolver).toBeTruthy();
    });
});
