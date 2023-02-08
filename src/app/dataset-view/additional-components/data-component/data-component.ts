import {
    DataSqlErrorUpdate,
    DataUpdate,
} from "src/app/dataset-view/dataset.subscriptions.interface";
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Input,
    OnInit,
    Output,
} from "@angular/core";
import { DataRow, DatasetSchema } from "../../../interface/dataset.interface";
import DataTabValues from "./mock.data";
import { AppDatasetSubscriptionsService } from "../../dataset.subscriptions.service";
import { BaseComponent } from "src/app/common/base.component";
import { DatasetBasicsFragment } from "src/app/api/kamu.graphql.interface";
import * as monaco from "monaco-editor";
import { MaybeNull } from "src/app/common/app.types";

@Component({
    selector: "app-data",
    templateUrl: "./data-component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataComponent extends BaseComponent implements OnInit {

    @Input() public datasetBasics?: DatasetBasicsFragment;
    @Output() public runSQLRequestEmit = new EventEmitter<string>();
    public sqlEditorOptions = {
        theme: "vs",
        language: "sql",
        renderLineHighlight: "none",
        minimap: {
            enabled: false,
        },
    };
    public savedQueries = DataTabValues.savedQueries;
    public sqlRequestCode = `select\n  *\nfrom `;

    public sqlErrorMarker: MaybeNull<string> = null;
    public currentSchema: MaybeNull<DatasetSchema> = null;
    public currentData: DataRow[] = [];

    constructor(
        private appDatasetSubsService: AppDatasetSubscriptionsService,
        private cdr: ChangeDetectorRef,
    ) {
        super();
    }

    public onRunSQLRequest(sqlRequestCode?: string): void {
        this.runSQLRequestEmit.emit(sqlRequestCode ?? this.sqlRequestCode);
    }

    public ngOnInit(): void {
        if (this.datasetBasics) {
            this.sqlRequestCode += `'${this.datasetBasics.name as string}'`;
        }
        this.trackSubscriptions(
            this.appDatasetSubsService.onDatasetDataChanges.subscribe(
                (dataUpdate: DataUpdate) => {
                    this.currentData = dataUpdate.content;
                    this.currentSchema = dataUpdate.schema;
                    this.sqlErrorMarker = null;
                    this.cdr.markForCheck();
                },
            ),
            this.appDatasetSubsService.onDatasetDataSqlErrorOccured.subscribe(
                (dataSqlErrorUpdate: DataSqlErrorUpdate) => {
                    this.currentData = [];
                    this.currentSchema = null;
                    this.sqlErrorMarker = dataSqlErrorUpdate.error;
                    this.cdr.markForCheck();
                },
            ),
        );
    }

    onInitEditor(editor: monaco.editor.IStandaloneCodeEditor): void {
        const runQueryFn = () => {
            this.onRunSQLRequest();
        };
        editor.addAction({
            // An unique identifier of the contributed action.
            id: "run-sql",
            // A label of the action that will be presented to the user.
            label: "Run SQL",
            // An optional array of keybindings for the action.
            //keybindings: [KeyMod.CtrlCmd | KeyCode.Enter],
            keybindings: [2048 | 3],
            contextMenuGroupId: "navigation",
            contextMenuOrder: 1.5,
            // Method that will be executed when the action is triggered.
            // @param editor The editor instance is passed in as a convenience
            run: runQueryFn,
        });
    }
}
