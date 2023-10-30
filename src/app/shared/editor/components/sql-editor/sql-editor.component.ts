import { ChangeDetectionStrategy, Component, EventEmitter, Output } from "@angular/core";
import * as monaco from "monaco-editor";

import { getMonacoNamespace } from "../../services/monaco.service";
import { BaseEditorComponent } from "../base-editor/base-editor.componet";

const SQL_EDITOR_OPTIONS: monaco.editor.IStandaloneEditorConstructionOptions = {
    theme: "vs",
    language: "sql",
    renderLineHighlight: "none",
    minimap: {
        enabled: false,
    },
    scrollBeyondLastLine: false,
};

@Component({
    selector: "app-sql-editor",
    templateUrl: "./sql-editor.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SqlEditorComponent extends BaseEditorComponent {
    public readonly EDITOR_OPTIONS: monaco.editor.IStandaloneEditorConstructionOptions = SQL_EDITOR_OPTIONS;

    @Output() public onRunSql = new EventEmitter<null>();

    public onInitEditor(editor: monaco.editor.IStandaloneCodeEditor): void {
        this.onEditorLoaded.emit();

        const runQueryFn = () => {
            this.onRunSql.emit();
        };
        const monaco = getMonacoNamespace();
        if (!monaco) return;

        // eslint-disable-next-line @typescript-eslint/non-nullable-type-assertion-style
        this.editorModel = editor.getModel() as monaco.editor.ITextModel;

        editor.addAction({
            // An unique identifier of the contributed action.
            id: "run-sql",
            // A label of the action that will be presented to the user.
            label: "Run SQL",
            // An optional array of keybindings for the action.
            keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter],
            contextMenuGroupId: "navigation",
            contextMenuOrder: 1.5,
            // Method that will be executed when the action is triggered.
            // @param editor The editor instance is passed in as a convenience
            run: runQueryFn,
        });
    }
}
