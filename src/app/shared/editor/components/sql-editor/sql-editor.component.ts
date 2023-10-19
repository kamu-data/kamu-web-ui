import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    Input,
    OnChanges,
    Output,
    SimpleChanges,
} from "@angular/core";
import * as monaco from "monaco-editor";

import { getMonacoNamespace, MonacoService } from "../../services/monaco.service";
import { SQL_EDITOR_OPTIONS } from "./config-editor.events";
import { MaybeNull } from "src/app/common/app.types";

@Component({
    selector: "app-sql-editor",
    templateUrl: "./sql-editor.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SqlEditorComponent implements OnChanges {
    @Input() public readonly EDITOR_OPTIONS: monaco.editor.IStandaloneEditorConstructionOptions = SQL_EDITOR_OPTIONS;
    @Input() public sqlTemplate = "";
    @Input() public sqlError: MaybeNull<string>;

    @Output() public sqlTemplateChange = new EventEmitter<string>();
    @Output() public onRunSql = new EventEmitter<null>();

    private editorModel: monaco.editor.ITextModel;

    constructor(private monacoService: MonacoService) {}

    public ngOnChanges(changes: SimpleChanges) {
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (changes.sqlError) {
            if (this.sqlError) {
                this.monacoService.setErrorMarker(this.editorModel, this.sqlError);
            }

            if (!this.sqlError) {
                this.monacoService.clearErrorMarker(this.editorModel);
            }
        }
    }

    public onInitEditor(editor: monaco.editor.IStandaloneCodeEditor): void {
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

    public modelChange(): void {
        this.sqlTemplateChange.emit(this.sqlTemplate);
    }
}
