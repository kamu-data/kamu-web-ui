import * as monaco from "monaco-editor";
export const sqlEditorOptionsForEvents: monaco.editor.IStandaloneEditorConstructionOptions =
    {
        theme: "vs",
        language: "sql",
        contextmenu: false,
        wordWrap: "on",
        readOnly: true,
        renderLineHighlight: "none",
        lineNumbers: "off",
        minimap: {
            enabled: false,
        },
    };
