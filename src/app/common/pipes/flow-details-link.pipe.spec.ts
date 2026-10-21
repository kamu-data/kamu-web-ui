/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestBed } from "@angular/core/testing";
import { provideRouter, Router } from "@angular/router";

import { FlowDetailsLinkPipe } from "@common/pipes/flow-details-link.pipe";

import { FlowDetailsTabs } from "src/app/dataset-flow/dataset-flow-details/dataset-flow-details.types";

describe("FlowDetailsLinkPipe", () => {
    let pipe: FlowDetailsLinkPipe;
    let router: Router;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [provideRouter([])],
        });
        router = TestBed.inject(Router);
        pipe = TestBed.runInInjectionContext(() => new FlowDetailsLinkPipe());
    });

    it("should link to the history tab by default", () => {
        expect(router.serializeUrl(pipe.transform({ accountName: "acc", datasetName: "ds", flowId: "42" }))).toEqual(
            "/acc/ds/flow-details/42/history",
        );
    });

    it("should link to the given tab", () => {
        expect(
            router.serializeUrl(
                pipe.transform({ accountName: "acc", datasetName: "ds", flowId: "42", tab: FlowDetailsTabs.LOGS }),
            ),
        ).toEqual("/acc/ds/flow-details/42/logs");
    });
});
