import { ChangeDetectionStrategy, Component, EventEmitter, Output } from "@angular/core";
import * as monaco from "monaco-editor";

import { getMonacoNamespace } from "../../services/monaco.service";
import { BaseEditorComponent } from "../base-editor/base-editor.component";
import { getSqlError } from "../../helpers/editor-error-formatter";

const SQL_EDITOR_OPTIONS: monaco.editor.IStandaloneEditorConstructionOptions = {
    theme: "vs",
    language: "sql",
    renderLineHighlight: "none",
    minimap: {
        enabled: false,
    },
    scrollBeyondLastLine: false,
    tabSize: 2,
};

@Component({
    selector: "app-sql-editor",
    templateUrl: "./sql-editor.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SqlEditorComponent extends BaseEditorComponent {
    public readonly EDITOR_OPTIONS: monaco.editor.IStandaloneEditorConstructionOptions = SQL_EDITOR_OPTIONS;
    public getErrorDetails = getSqlError;

    @Output() public onRunSql = new EventEmitter<null>();

    public onInitEditor(editor: monaco.editor.IStandaloneCodeEditor): void {
        super.onInitEditor(editor);

        const runQueryFn = () => {
            this.onRunSql.emit();
        };

        const monaco = getMonacoNamespace();
        /* istanbul ignore else */
        if (monaco) {
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
}
