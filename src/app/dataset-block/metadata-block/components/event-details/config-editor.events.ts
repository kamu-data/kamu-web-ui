import * as monaco from "monaco-editor";
export const sqlEditorOptions: monaco.editor.IStandaloneEditorConstructionOptions =
    {
        theme: "vs",
        language: "sql",
        renderLineHighlight: "none",
        minimap: {
            enabled: false,
        },
        scrollBeyondLastLine: false,
    };
