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
    styleUrls: ["./sql-editor.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SqlEditorComponent implements OnChanges {
    @Input() protected readonly EDITOR_OPTIONS: monaco.editor.IStandaloneEditorConstructionOptions = SQL_EDITOR_OPTIONS;
    @Input() public sqlTemplate = "";
    @Input() public sqlError: MaybeNull<string>;

    @Output() public onCodeChange = new EventEmitter<string>();
    @Output() public onRunSql = new EventEmitter<null>();

    private editorModel: monaco.editor.ITextModel;

    constructor(private monacoService: MonacoService) {}

    public ngOnChanges(changes: SimpleChanges) {
        if (changes.sqlError) {
            this.monacoService.setErrorMarker(this.editorModel, this.sqlError);
        }
    }

    public onInitEditor(editor: monaco.editor.IStandaloneCodeEditor): void {
        const runQueryFn = () => {
            this.onRunSql.emit();
        };
        const monacoNamespace = getMonacoNamespace();
        this.editorModel = editor.getModel() as monaco.editor.ITextModel;
        editor.addAction({
            // An unique identifier of the contributed action.
            id: "run-sql",
            // A label of the action that will be presented to the user.
            label: "Run SQL",
            // An optional array of keybindings for the action.
            keybindings: [monacoNamespace.KeyMod.CtrlCmd | monacoNamespace.KeyCode.Enter],
            contextMenuGroupId: "navigation",
            contextMenuOrder: 1.5,
            // Method that will be executed when the action is triggered.
            // @param editor The editor instance is passed in as a convenience
            run: runQueryFn,
        });
    }

    public modelChange(): void {
        this.onCodeChange.emit(this.sqlTemplate);
    }
}
