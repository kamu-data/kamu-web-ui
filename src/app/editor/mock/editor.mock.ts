/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import type * as monaco from "monaco-editor";
import type { Mocked } from "vitest";

import { createSpyObj } from "@common/helpers/base-test.helpers.spec";

/** A new model spy per call, so call records never carry over between specs. */
export function createEditorModelMock(selectedText: string = ""): Mocked<monaco.editor.ITextModel> {
    return createSpyObj<monaco.editor.ITextModel>({
        getValue: undefined,
        getValueInRange: selectedText,
    });
}

/** A new editor spy per call whose model returns `selectedText` and whose selection is empty when it is. */
export function createEditorMock(selectedText: string = ""): Mocked<monaco.editor.IStandaloneCodeEditor> {
    return createSpyObj<monaco.editor.IStandaloneCodeEditor>({
        getModel: createEditorModelMock(selectedText),
        addAction: { dispose: () => undefined },
        createContextKey: { set: () => undefined, reset: () => undefined, get: () => false },
        getSelection: createSpyObj<monaco.Selection>({ isEmpty: !selectedText }),
        onDidChangeCursorSelection: { dispose: () => undefined },
        focus: undefined,
    });
}
