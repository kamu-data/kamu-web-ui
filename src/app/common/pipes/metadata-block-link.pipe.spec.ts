/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestBed } from "@angular/core/testing";
import { provideRouter, Router } from "@angular/router";

import { MetadataBlockLinkPipe } from "@common/pipes/metadata-block-link.pipe";

describe("MetadataBlockLinkPipe", () => {
    let pipe: MetadataBlockLinkPipe;
    let router: Router;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [provideRouter([])],
        });
        router = TestBed.inject(Router);
        pipe = TestBed.runInInjectionContext(() => new MetadataBlockLinkPipe());
    });

    it("should link to the metadata block", () => {
        expect(
            router.serializeUrl(pipe.transform({ accountName: "acc", datasetName: "ds", blockHash: "f1620" })),
        ).toEqual("/acc/ds/block/f1620");
    });
});
