/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import type * as monaco from "monaco-editor";

export const editorModelMock: jasmine.SpyObj<monaco.editor.ITextModel> = jasmine.createSpyObj<monaco.editor.ITextModel>(
    "ITextModel",
    ["getValue", "getValueInRange"],
);

export const editorMock: jasmine.SpyObj<monaco.editor.IStandaloneCodeEditor> =
    jasmine.createSpyObj<monaco.editor.IStandaloneCodeEditor>("IStandaloneCodeEditor", {
        getModel: editorModelMock,
        addAction: { dispose: () => undefined },
        createContextKey: { set: () => undefined, reset: () => undefined, get: () => false },
        getSelection: jasmine.createSpyObj<monaco.Selection>("Selection", { isEmpty: true }),
        onDidChangeCursorSelection: { dispose: () => undefined },
        focus: undefined,
    });
