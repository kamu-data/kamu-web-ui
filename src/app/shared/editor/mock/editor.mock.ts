import * as monaco from "monaco-editor";

export const editorMock: monaco.editor.IStandaloneCodeEditor = {
    getModel(): monaco.editor.ITextModel {
        return {} as monaco.editor.ITextModel;
    },
} as monaco.editor.IStandaloneCodeEditor;
