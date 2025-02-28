/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import * as monaco from "monaco-editor";

export const editorMock: monaco.editor.IStandaloneCodeEditor = {
    getModel(): monaco.editor.ITextModel {
        return {} as monaco.editor.ITextModel;
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    addAction(_: monaco.editor.IActionDescriptor): monaco.IDisposable {
        return {
            dispose() {
                // Do nothing
            },
        };
    },
} as monaco.editor.IStandaloneCodeEditor;

export const editorModelMock: monaco.editor.ITextModel = {} as monaco.editor.ITextModel;
