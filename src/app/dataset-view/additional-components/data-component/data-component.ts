import AppValues from "src/app/common/app.values";
import { OffsetInterval } from "../../../api/kamu.graphql.interface";
import { Location } from "@angular/common";
import { DataSqlErrorUpdate, DataUpdate } from "src/app/dataset-view/dataset.subscriptions.interface";
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { DataRow, DatasetRequestBySql } from "../../../interface/dataset.interface";
import DataTabValues from "./mock.data";
import { AppDatasetSubscriptionsService } from "../../dataset.subscriptions.service";
import { BaseComponent } from "src/app/common/base.component";
import { DatasetBasicsFragment } from "src/app/api/kamu.graphql.interface";
import * as monaco from "monaco-editor";
import { MaybeUndefined } from "src/app/common/app.types";
import { sqlEditorOptions } from "src/app/dataset-block/metadata-block/components/event-details/config-editor.events";
import { Observable, map, tap } from "rxjs";

@Component({
    selector: "app-data",
    templateUrl: "./data-component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataComponent extends BaseComponent implements OnInit {
    @Input() public datasetBasics?: DatasetBasicsFragment;
    @Output() public runSQLRequestEmit = new EventEmitter<DatasetRequestBySql>();

    public sqlEditorOptions = sqlEditorOptions;
    public savedQueries = DataTabValues.savedQueries;
    public sqlRequestCode = `select\n  *\nfrom `;
    public currentData: DataRow[] = [];
    public isAllDataLoaded = false;

    private skipRows: MaybeUndefined<number>;
    private rowsLimit: number = AppValues.SQL_QUERY_LIMIT;
    private offsetColumnName = AppValues.DEFAULT_OFFSET_COLUMN_NAME;
    public sqlErrorMarker$: Observable<string>;
    public dataUpdate$: Observable<DataUpdate>;

    constructor(private appDatasetSubsService: AppDatasetSubscriptionsService, private location: Location) {
        super();
    }

    public runSQLRequest(params: DatasetRequestBySql, initialSqlRun = false): void {
        if (initialSqlRun) {
            this.resetRowsLimits();
        }
        this.runSQLRequestEmit.emit(params);
    }

    public ngOnInit(): void {
        this.sqlErrorMarker$ = this.appDatasetSubsService.onDatasetDataSqlErrorOccurred.pipe(
            map((data: DataSqlErrorUpdate) => data.error),
        );
        this.dataUpdate$ = this.appDatasetSubsService.onDatasetDataChanges.pipe(
            tap((dataUpdate: DataUpdate) => {
                if (dataUpdate.currentVocab?.offsetColumn) {
                    this.offsetColumnName = dataUpdate.currentVocab.offsetColumn;
                }
                this.isAllDataLoaded = dataUpdate.content.length < this.rowsLimit;
                this.currentData = this.skipRows ? [...this.currentData, ...dataUpdate.content] : dataUpdate.content;
                this.appDatasetSubsService.resetSqlError();
            }),
        );
        this.buildSqlRequestCode();
    }

    public loadMore(limit: number): void {
        this.skipRows = this.skipRows ? this.skipRows + limit : AppValues.SQL_QUERY_LIMIT;
        this.rowsLimit = limit;

        const params = {
            query: this.sqlRequestCode,
            skip: this.skipRows,
            limit,
        };

        this.runSQLRequest(params);
    }

    public onInitEditor(editor: monaco.editor.IStandaloneCodeEditor): void {
        const runQueryFn = () => {
            this.runSQLRequest({ query: this.sqlRequestCode });
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
        if (this.currentData.length > 0) {
            this.runSQLRequest({ query: this.sqlRequestCode });
        }
    }

    private buildSqlRequestCode(): void {
        if (this.datasetBasics) {
            this.sqlRequestCode += `'${this.datasetBasics.name}'`;
            const offset = this.location.getState() as Partial<OffsetInterval>;
            if (typeof offset.start !== "undefined" && typeof offset.end !== "undefined") {
                this.sqlRequestCode += `\nwhere ${this.offsetColumnName}>=${offset.start} and ${this.offsetColumnName}<=${offset.end}\norder by ${this.offsetColumnName} desc`;
            }
        }
    }

    private resetRowsLimits(): void {
        this.skipRows = undefined;
        this.rowsLimit = AppValues.SQL_QUERY_LIMIT;
    }
}
