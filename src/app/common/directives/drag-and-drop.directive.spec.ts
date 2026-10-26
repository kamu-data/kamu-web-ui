/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { DragAndDropDirective } from "@common/directives/drag-and-drop.directive";

describe("DragAndDropDirective", () => {
    it("should create an instance", () => {
        const directive = new DragAndDropDirective();
        expect(directive).toBeTruthy();
    });

    it("should drop event", () => {
        const directive = new DragAndDropDirective();
        const fileDroppedSpy = vi.spyOn(directive.fileDropped, "emit").mockImplementation(() => {});
        const file = new File([""], "dummy.jpg");
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        directive.onDragLeave(new DragEvent("dragleave", { dataTransfer, cancelable: true }));
        directive.onDragOver(new DragEvent("dragover", { dataTransfer, cancelable: true }));
        directive.onDrop(new DragEvent("drop", { dataTransfer, cancelable: true }));

        expect(fileDroppedSpy).toHaveBeenCalledTimes(1);
    });
});
