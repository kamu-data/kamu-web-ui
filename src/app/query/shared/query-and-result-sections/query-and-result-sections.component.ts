/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    inject,
    Input,
    OnChanges,
    OnInit,
    Output,
    SimpleChanges,
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { ToastrService } from "ngx-toastr";
import { switchMap, tap } from "rxjs";
import { LoggedUserService } from "src/app/auth/logged-user.service";
import { MaybeNull, MaybeUndefined } from "src/app/interface/app.types";
import AppValues from "src/app/common/values/app.values";
import { BaseComponent } from "src/app/common/components/base.component";
import { UploadPrepareResponse, UploadPrepareData } from "src/app/interface/ingest-via-file-upload.types";
import { DataRow, DatasetRequestBySql } from "src/app/interface/dataset.interface";
import ProjectLinks from "src/app/project-links";
import { FileUploadService } from "src/app/services/file-upload.service";
import { NavigationService } from "src/app/services/navigation.service";
import { Clipboard } from "@angular/cdk/clipboard";
import { AppConfigService } from "src/app/app-config.service";
import { SqlQueryResponseState, SqlQueryBasicResponse } from "src/app/query/global-query/global-query.model";
import { EngineDesc } from "src/app/api/kamu.graphql.interface";
import { map, Observable } from "rxjs";
import { EngineService } from "src/app/dataset-view/additional-components/metadata-component/components/set-transform/components/engine-section/engine.service";
import { LoadMoreComponent } from "../load-more/load-more.component";
import { DynamicTableComponent } from "../../../common/components/dynamic-table/dynamic-table.component";
import { RequestTimerComponent } from "../request-timer/request-timer.component";
import { SqlEditorComponent } from "../../../editor/components/sql-editor/sql-editor.component";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatDividerModule } from "@angular/material/divider";
import { MatMenuModule } from "@angular/material/menu";
import { MatIconModule } from "@angular/material/icon";
import { EngineSelectComponent } from "../../../dataset-view/additional-components/metadata-component/components/set-transform/components/engine-section/components/engine-select/engine-select.component";
import { NgIf, AsyncPipe, NgClass } from "@angular/common";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { FormsModule } from "@angular/forms";
import { MarkdownModule } from "ngx-markdown";
import { TooltipIconComponent } from "src/app/common/components/tooltip-icon/tooltip-icon.component";
import { MarkdownFormatPipe } from "src/app/common/pipes/markdown-format.pipe";

@Component({
    selector: "app-query-and-result-sections",
    templateUrl: "./query-and-result-sections.component.html",
    styleUrls: ["./query-and-result-sections.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        //-----//
        AsyncPipe,
        NgIf,
        NgClass,
        FormsModule,

        //-----//
        MatIconModule,
        MatMenuModule,
        MatDividerModule,
        MatProgressBarModule,
        MatSlideToggleModule,
        MarkdownModule,

        //-----//
        EngineSelectComponent,
        MarkdownFormatPipe,
        SqlEditorComponent,
        RequestTimerComponent,
        DynamicTableComponent,
        LoadMoreComponent,
        TooltipIconComponent,
    ],
})
export class QueryAndResultSectionsComponent extends BaseComponent implements OnInit, OnChanges {
    @Input({ required: true }) public sqlLoading: boolean;
    @Input({ required: true }) public sqlError: MaybeNull<string>;
    @Input({ required: true }) public sqlRequestCode: string;
    @Input({ required: true }) public sqlQueryResponse: MaybeNull<SqlQueryBasicResponse>;
    @Input({ required: true }) public monacoPlaceholder: string = "";
    @Output() public runSQLRequestEmit = new EventEmitter<DatasetRequestBySql>();

    private loggedUserService = inject(LoggedUserService);
    private fileUploadService = inject(FileUploadService);
    private navigationService = inject(NavigationService);
    private clipboard = inject(Clipboard);
    private toastService = inject(ToastrService);
    private appConfigService = inject(AppConfigService);
    private cdr = inject(ChangeDetectorRef);
    private engineService = inject(EngineService);

    public skipRows: MaybeUndefined<number>;
    public rowsLimit: number = AppValues.SQL_QUERY_LIMIT;
    public editorLoaded = false;
    public currentData: DataRow[] = [];
    public isAllDataLoaded: boolean;
    public selectedEngine = AppValues.DEFAULT_ENGINE_NAME.toLowerCase();
    public knownEngines$: Observable<EngineDesc[]>;
    public enabledProof: boolean = false;
    public readonly GENERATE_PROOF_TOOLTIP: string = "Please log in to use this feature";

    public ngOnInit(): void {
        this.knownEngines$ = this.engineService.engines().pipe(map((result) => result.data.knownEngines));
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (
            changes.sqlQueryResponse &&
            changes.sqlQueryResponse.currentValue &&
            changes.sqlQueryResponse.currentValue !== changes.sqlQueryResponse.previousValue
        ) {
            const currentResponse = changes.sqlQueryResponse.currentValue as SqlQueryResponseState;
            this.isAllDataLoaded = currentResponse.content.length < this.rowsLimit;
            this.currentData = this.skipRows
                ? [...this.currentData, ...currentResponse.content]
                : currentResponse.content;
        }
    }

    public get isAdmin(): boolean {
        return this.loggedUserService.isAdmin;
    }

    public get isAuthenticated(): boolean {
        return this.loggedUserService.isAuthenticated;
    }

    private resetRowsLimits(): void {
        this.skipRows = undefined;
        this.rowsLimit = AppValues.SQL_QUERY_LIMIT;
    }

    public runSQLRequest(params: DatasetRequestBySql, initialSqlRun = false): void {
        if (initialSqlRun) {
            this.resetRowsLimits();
        }
        params.enabledProof = this.enabledProof;
        this.runSQLRequestEmit.emit(params);
    }

    public loadMore(limit: number): void {
        this.skipRows = this.currentData.length;
        this.rowsLimit = limit;

        const params = {
            query: this.sqlRequestCode,
            skip: this.skipRows,
            limit,
        };

        this.runSQLRequest(params);
    }

    public runSql(): void {
        if (this.sqlRequestCode) this.runSQLRequest({ query: this.sqlRequestCode }, true);
    }

    public verifyQueryResult(): void {
        let uploadToken: string;
        const file = new File(
            [
                new Blob([JSON.stringify(this.sqlQueryResponse?.proofResponse, null, 2)], {
                    type: "application/json",
                }),
            ],
            "query-explainer.json",
        );

        this.fileUploadService
            .uploadFilePrepare(file)
            .pipe(
                tap((data) => (uploadToken = data.uploadToken)),
                switchMap((uploadPrepareResponse: UploadPrepareResponse) =>
                    this.fileUploadService.prepareUploadData(uploadPrepareResponse, file),
                ),
                switchMap(({ uploadPrepareResponse, bodyObject, uploadHeaders }: UploadPrepareData) =>
                    this.fileUploadService.uploadFileByMethod(
                        uploadPrepareResponse.method,
                        uploadPrepareResponse.uploadUrl,
                        bodyObject,
                        uploadHeaders,
                    ),
                ),
                takeUntilDestroyed(this.destroyRef),
            )
            .subscribe(() => {
                this.navigationService.navigateToQueryExplainer(uploadToken);
            });
    }

    public shareQuery(): void {
        const url = new URL(`${window.location.href}`);
        url.searchParams.set(ProjectLinks.URL_QUERY_PARAM_SQL_QUERY, this.sqlRequestCode);
        this.clipboard.copy(url.href);
        this.toastService.success("Copied url to clipboard");
    }

    public copyCurlCommand(): void {
        // Removed all \n symbols and replaced all single quotes on \" in the sql query
        const sqlRequestReplacedCode = this.sqlRequestCode.replace(/\n/g, " ").replace(/'/g, '\\"');
        const command = `echo '{ "query": "${sqlRequestReplacedCode}", "include": ["proof"] }' | curl "${this.appConfigService.apiServerHttpUrl}/query" -X POST --data-binary @- -H "Content-Type: application/json"`;
        this.clipboard.copy(command);
        this.toastService.success("Copied command to clipboard");
    }

    public hideProgressBar(): void {
        this.editorLoaded = true;
        this.cdr.detectChanges();
    }

    public get isUserAuthenticated(): boolean {
        return this.loggedUserService.isAuthenticated;
    }

    public jsonWrapper(json: unknown): string {
        return "```json\n" + JSON.stringify(json, null, 2) + "\n```";
    }
}
