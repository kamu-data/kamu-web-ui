/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import type * as monaco from "monaco-editor";

/** A new model spy per call, so call records never carry over between specs. */
export function createEditorModelMock(selectedText: string = ""): jasmine.SpyObj<monaco.editor.ITextModel> {
    return jasmine.createSpyObj<monaco.editor.ITextModel>("ITextModel", {
        getValue: undefined,
        getValueInRange: selectedText,
    });
}

/** A new editor spy per call whose model returns `selectedText` and whose selection is empty when it is. */
export function createEditorMock(selectedText: string = ""): jasmine.SpyObj<monaco.editor.IStandaloneCodeEditor> {
    return jasmine.createSpyObj<monaco.editor.IStandaloneCodeEditor>("IStandaloneCodeEditor", {
        getModel: createEditorModelMock(selectedText),
        addAction: { dispose: () => undefined },
        createContextKey: { set: () => undefined, reset: () => undefined, get: () => false },
        getSelection: jasmine.createSpyObj<monaco.Selection>("Selection", { isEmpty: !selectedText }),
        onDidChangeCursorSelection: { dispose: () => undefined },
        focus: undefined,
    });
}
