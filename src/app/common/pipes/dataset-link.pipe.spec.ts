/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestBed } from "@angular/core/testing";
import { provideRouter, Router } from "@angular/router";

import { DatasetLinkPipe } from "@common/pipes/dataset-link.pipe";

import { DatasetViewTypeEnum } from "src/app/dataset-view/dataset-view.interface";

describe("DatasetLinkPipe", () => {
    let pipe: DatasetLinkPipe;
    let router: Router;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [provideRouter([])],
        });
        router = TestBed.inject(Router);
        pipe = TestBed.runInInjectionContext(() => new DatasetLinkPipe());
    });

    it("should link the overview tab to the dataset root", () => {
        expect(
            router.serializeUrl(
                pipe.transform({ accountName: "acc", datasetName: "ds", tab: DatasetViewTypeEnum.Overview }),
            ),
        ).toEqual("/acc/ds");
    });

    it("should link a tab with its section", () => {
        expect(
            router.serializeUrl(
                pipe.transform({
                    accountName: "acc",
                    datasetName: "ds",
                    tab: DatasetViewTypeEnum.Metadata,
                    section: "schema",
                }),
            ),
        ).toEqual("/acc/ds/metadata/schema");
    });
});
