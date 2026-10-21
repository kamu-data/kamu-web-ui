/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestBed } from "@angular/core/testing";
import { provideRouter, Router } from "@angular/router";

import { SourceEventEditorLinkPipe } from "@common/pipes/source-event-editor-link.pipe";

import { SourceEventEditor } from "src/app/project-links";

describe("SourceEventEditorLinkPipe", () => {
    let pipe: SourceEventEditorLinkPipe;
    let router: Router;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [provideRouter([])],
        });
        router = TestBed.inject(Router);
        pipe = TestBed.runInInjectionContext(() => new SourceEventEditorLinkPipe());
    });

    it("should link to the editor", () => {
        expect(
            router.serializeUrl(
                pipe.transform({ accountName: "acc", datasetName: "ds" }, SourceEventEditor.AddPollingSource),
            ),
        ).toEqual("/acc/ds/add-polling-source");
    });

    it("should link to an existing push source", () => {
        expect(
            router.serializeUrl(
                pipe.transform({ accountName: "acc", datasetName: "ds" }, SourceEventEditor.AddPushSource, "my-source"),
            ),
        ).toEqual("/acc/ds/add-push-source?name=my-source");
    });
});
