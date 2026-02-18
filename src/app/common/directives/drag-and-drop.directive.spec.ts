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
        const fileDroppedSpy = spyOn(directive.fileDropped, "emit");
        const file = new File([""], "dummy.jpg");
        const fileDropEvent = {
            preventDefault: () => {},
            stopPropagation: () => {},
            dataTransfer: {
                files: [file],
            },
        } as unknown as DragEvent;
        directive.onDragLeave(fileDropEvent);
        directive.onDragOver(fileDropEvent);
        directive.onDrop(fileDropEvent);

        expect(fileDroppedSpy).toHaveBeenCalledTimes(1);
    });
});
