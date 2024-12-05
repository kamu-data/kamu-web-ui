import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    inject,
    Input,
    OnChanges,
    Output,
    SimpleChanges,
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { ToastrService } from "ngx-toastr";
import { switchMap, tap } from "rxjs";
import { MaybeNull, MaybeUndefined } from "src/app/common/app.types";
import AppValues from "src/app/common/app.values";
import { BaseComponent } from "src/app/common/base.component";
import { UploadPrepareResponse, UploadPrepareData } from "src/app/common/ingest-via-file-upload.types";
import { DataRow, DatasetRequestBySql } from "src/app/interface/dataset.interface";
import ProjectLinks from "src/app/project-links";
import { QueryExplainerService } from "src/app/query-explainer/query-explainer.service";
import { QueryExplainerProofResponse } from "src/app/query-explainer/query-explainer.types";
import { FileUploadService } from "src/app/services/file-upload.service";
import { NavigationService } from "src/app/services/navigation.service";
import { Clipboard } from "@angular/cdk/clipboard";
import { AppConfigService } from "src/app/app-config.service";
import { SqlQueryResponseState } from "src/app/query/global-query/global-query.model";

@Component({
    selector: "app-query-and-result-sections",
    templateUrl: "./query-and-result-sections.component.html",
    styleUrls: ["./query-and-result-sections.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QueryAndResultSectionsComponent extends BaseComponent implements OnChanges {
    @Input({ required: true }) public sqlLoading: boolean;
    @Input({ required: true }) sqlError: MaybeNull<string>;
    @Input({ required: true }) public sqlRequestCode: string;
    @Input({ required: true }) public sqlQueryResponse: MaybeNull<SqlQueryResponseState>;
    @Input({ required: true }) public monacoPlaceholder: string = "";
    @Output() public runSQLRequestEmit = new EventEmitter<DatasetRequestBySql>();

    private queryExplainerService = inject(QueryExplainerService);
    private fileUploadService = inject(FileUploadService);
    private navigationService = inject(NavigationService);
    private clipboard = inject(Clipboard);
    private toastService = inject(ToastrService);
    private appConfigService = inject(AppConfigService);
    private cdr = inject(ChangeDetectorRef);

    public skipRows: MaybeUndefined<number>;
    public rowsLimit: number = AppValues.SQL_QUERY_LIMIT;
    public editorLoaded = false;
    public currentData: DataRow[] = [];
    public isAllDataLoaded: boolean;

    ngOnChanges(changes: SimpleChanges): void {
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

    private resetRowsLimits(): void {
        this.skipRows = undefined;
        this.rowsLimit = AppValues.SQL_QUERY_LIMIT;
    }

    public runSQLRequest(params: DatasetRequestBySql, initialSqlRun = false): void {
        if (initialSqlRun) {
            this.resetRowsLimits();
        }
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
        this.queryExplainerService
            .processQueryWithProof(this.sqlRequestCode)
            .pipe(
                switchMap((response: QueryExplainerProofResponse) => {
                    const file = new File(
                        [
                            new Blob([JSON.stringify(response, null, 2)], {
                                type: "application/json",
                            }),
                        ],
                        "query-explainer.json",
                    );
                    return this.fileUploadService.uploadFilePrepare(file).pipe(
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
                    );
                }),

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
}
