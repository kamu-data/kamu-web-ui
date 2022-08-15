import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { DataViewSchema } from "../../../interface/search.interface";
import DataTabValues from "./mock.data";
import { AppDatasetSubsService } from "../../datasetSubs.service";
import { DataUpdate } from "../../datasetSubs.interface";
import { DatasetBasicsFragment } from "src/app/api/kamu.graphql.interface";

@Component({
    selector: "app-data",
    templateUrl: "./data-component.html",
})
export class DataComponent implements OnInit {
    @Input() public datasetBasics?: DatasetBasicsFragment;
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
    public currentSchema?: DataViewSchema;
    public currentData: Object[] = [];

    constructor(private appDatasetSubsService: AppDatasetSubsService) {}

    public onSelectDataset(id: string): void {
        this.onSelectDatasetEmit.emit(id);
    }

    public onRunSQLRequest(sqlRequestCode?: string): void {
        this.onRunSQLRequestEmit.emit(sqlRequestCode || this.sqlRequestCode);
    }

    public ngOnInit(): void {
        if (this.datasetBasics) {
            this.sqlRequestCode += `'${this.datasetBasics.name}'`;
        }
        this.appDatasetSubsService.onDatasetDataChanges.subscribe(
            (dataUpdate: DataUpdate) => {
                this.currentData = dataUpdate.content;
                this.currentSchema = dataUpdate.schema;
            },
        );
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
