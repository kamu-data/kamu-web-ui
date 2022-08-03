import {
    Component,
    EventEmitter,
    HostListener,
    Input,
    OnInit,
    Output,
} from "@angular/core";
import {
    DatasetNameInterface,
    DataViewSchema,
} from "../../../interface/search.interface";
import DataTabValues from "./mock.data";
import { DatasetViewContentInterface } from "../../dataset-view.interface";

@Component({
    selector: "app-data",
    templateUrl: "./data-component.html",
})
export class DataComponent implements OnInit {
    @Input() public tableData: DatasetViewContentInterface;
    @Input() public datasetName: DatasetNameInterface;
    @Input() public currentSchema: DataViewSchema;
    // tslint:disable-next-line:no-output-on-prefix
    @Output() onSelectDatasetEmit: EventEmitter<string> = new EventEmitter();
    // tslint:disable-next-line:no-output-on-prefix
    @Output() onRunSQLRequestEmit: EventEmitter<string> = new EventEmitter();
    public sqlEditorOptions = {
        theme: "vs",
        language: "sql",
        minimap: {
            enabled: false,
        },
    };
    public savedQueries = DataTabValues.savedQueries;
    public sqlRequestCode: string = `select\n  *\nfrom `;

    public onSelectDataset(id: string): void {
        this.onSelectDatasetEmit.emit(id);
    }

    public onRunSQLRequest(sqlRequestCode?: string): void {
        this.onRunSQLRequestEmit.emit(sqlRequestCode || this.sqlRequestCode);
    }

    public ngOnInit(): void {
        if (this.datasetName) {
            this.sqlRequestCode += `'${this.datasetName.name}'`;
        }
    }

    onInitEditor(editor: any): void {
        let self = this;
        let runQueryFn = function (_editor: any) {
            self.onRunSQLRequest();
        };
        editor.addAction({
            // An unique identifier of the contributed action.
            id: "run-sql",
            // A label of the action that will be presented to the user.
            label: "Run SQL",
            // An optional array of keybindings for the action.
            keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter],
            // A precondition for this action.
            precondition: null,
            // A rule to evaluate on top of the precondition in order to dispatch the keybindings.
            keybindingContext: null,
            contextMenuGroupId: "navigation",
            contextMenuOrder: 1.5,
            // Method that will be executed when the action is triggered.
            // @param editor The editor instance is passed in as a convenience
            run: runQueryFn,
        });
    }
}
