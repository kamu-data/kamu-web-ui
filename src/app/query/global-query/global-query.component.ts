import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { ToastrService } from "ngx-toastr";
import { debounceTime, distinctUntilChanged, finalize, map, Observable, OperatorFunction, switchMap, tap } from "rxjs";
import { LoggedUserService } from "src/app/auth/logged-user.service";
import { BaseComponent } from "src/app/common/base.component";
import { DatasetService } from "src/app/dataset-view/dataset.service";
import { DataRow, DataSchemaField, DatasetRequestBySql, DatasetSchema } from "src/app/interface/dataset.interface";
import ProjectLinks from "src/app/project-links";
import { Clipboard } from "@angular/cdk/clipboard";
import { AppConfigService } from "src/app/app-config.service";
import { QueryExplainerService } from "src/app/query-explainer/query-explainer.service";
import { FileUploadService } from "src/app/services/file-upload.service";
import { UploadPrepareResponse, UploadPrepareData } from "src/app/common/ingest-via-file-upload.types";
import { QueryExplainerOutputType, QueryExplainerProofResponse } from "src/app/query-explainer/query-explainer.types";
import { NavigationService } from "src/app/services/navigation.service";
import { DatasetSubscriptionsService } from "src/app/dataset-view/dataset.subscriptions.service";
import { DataSqlErrorUpdate } from "src/app/dataset-view/dataset.subscriptions.interface";
import { extractSchemaFieldsFromData } from "src/app/common/table.helper";
import AppValues from "src/app/common/app.values";
import { MaybeNull, MaybeUndefined } from "src/app/common/app.types";
import { GlobalQueryService } from "src/app/services/global-query.service";
import { NgbTypeaheadSelectItemEvent } from "@ng-bootstrap/ng-bootstrap";
import { GetDatasetSchemaQuery, DatasetBasicsFragment } from "src/app/api/kamu.graphql.interface";
import { parseCurrentSchema } from "src/app/common/app.helpers";
import { DatasetAutocompleteItem, TypeNames } from "src/app/interface/search.interface";
import { SearchApi } from "src/app/api/search.api";
import { GlobalQuerySearchItem } from "./global-query.model";

@Component({
    selector: "app-global-query",
    templateUrl: "./global-query.component.html",
    styleUrls: ["./global-query.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GlobalQueryComponent extends BaseComponent implements OnInit {
    public sqlRequestCode = `select * from 'account.tokens.portfolio'`;

    public sqlLoading = false;
    public isAllDataLoaded = false;
    public editorLoaded = false;
    public sqlErrorMarker$: Observable<string>;
    private skipRows: MaybeUndefined<number>;
    private rowsLimit: number = AppValues.SQL_QUERY_LIMIT;
    public output: QueryExplainerOutputType;
    public searchResult: GlobalQuerySearchItem[] = [];

    //Search
    public inputDatasets = new Set<string>();
    public searchDataset = "";
    private readonly delayTime: number = AppValues.SHORT_DELAY_MS;

    private datasetService = inject(DatasetService);
    private cdr = inject(ChangeDetectorRef);
    private loggedUserService = inject(LoggedUserService);
    private clipboard = inject(Clipboard);
    private toastService = inject(ToastrService);
    private appConfigService = inject(AppConfigService);
    private queryExplainerService = inject(QueryExplainerService);
    private fileUploadService = inject(FileUploadService);
    private navigationService = inject(NavigationService);
    private datasetSubsService = inject(DatasetSubscriptionsService);
    private globalQueryService = inject(GlobalQueryService);
    private appSearchAPI = inject(SearchApi);

    ngOnInit(): void {
        this.sqlErrorMarker$ = this.globalQueryService.sqlErrorOccurrences.pipe(
            map((data: DataSqlErrorUpdate) => data.error),
        );
    }

    public deleteDataset(datasetAlias: string): void {
        this.searchResult = this.searchResult.filter(
            (item: GlobalQuerySearchItem) => item.datasetAlias !== datasetAlias,
        );
        this.inputDatasets.forEach((item) => {
            if (item.includes(datasetAlias)) {
                this.inputDatasets.delete(item);
            }
        });
    }

    public search: OperatorFunction<string, readonly DatasetAutocompleteItem[]> = (text$: Observable<string>) => {
        return text$.pipe(
            debounceTime(this.delayTime),
            distinctUntilChanged(),
            switchMap((term: string) => this.appSearchAPI.autocompleteDatasetSearch(term)),
        );
    };

    public formatter(x: DatasetAutocompleteItem | string): string {
        return typeof x !== "string" ? x.dataset.name : x;
    }

    public onSelectItem(event: NgbTypeaheadSelectItemEvent): void {
        const value = event.item as DatasetAutocompleteItem;
        const id = value.dataset.id;
        const name = value.dataset.name;
        const inputDataset = JSON.stringify({
            datasetRef: id,
            alias: name,
        });
        if (value.__typename !== TypeNames.allDataType && !this.inputDatasets.has(inputDataset)) {
            this.inputDatasets.add(inputDataset);

            this.datasetService
                .requestDatasetSchema(id)
                .pipe(takeUntilDestroyed(this.destroyRef))
                .subscribe((data: GetDatasetSchemaQuery) => {
                    if (data.datasets.byId) {
                        const datasetAlias = (data.datasets.byId as DatasetBasicsFragment).alias;
                        const schema: MaybeNull<DatasetSchema> = parseCurrentSchema(
                            data.datasets.byId.metadata.currentSchema,
                        );
                        if (schema) {
                            this.searchResult = [...this.searchResult, { datasetAlias, schema }];
                            this.cdr.detectChanges();
                        }
                    }
                });
        }
    }

    public clearSearch(): void {
        this.searchDataset = "";
    }

    public hideProgressBar(): void {
        this.editorLoaded = true;
        this.cdr.detectChanges();
    }

    public get isAdmin(): boolean {
        return this.loggedUserService.isAdmin;
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

    public loadMore(limit: number): void {
        this.skipRows = this.output.data.length;
        this.rowsLimit = limit;

        const params = {
            query: this.sqlRequestCode,
            skip: this.skipRows,
            limit,
        };

        this.runSQLRequest(params);
    }

    private resetRowsLimits(): void {
        this.skipRows = undefined;
        this.rowsLimit = AppValues.SQL_QUERY_LIMIT;
    }

    public runSQLRequest(params: DatasetRequestBySql, initialSqlRun = false): void {
        if (initialSqlRun) {
            this.resetRowsLimits();
        }
        this.sqlLoading = true;
        this.globalQueryService
            .processQueryWithInputAndSchema(params)
            .pipe(
                tap(() => this.globalQueryService.resetSqlError()),
                finalize(() => {
                    this.sqlLoading = false;
                }),
                takeUntilDestroyed(this.destroyRef),
            )
            .subscribe((x) => {
                if (x.output) {
                    if (this.skipRows) {
                        this.isAllDataLoaded = x.output.data.length < this.rowsLimit;
                        this.output.data = [...this.output.data, ...x.output.data];
                    } else {
                        this.output = x.output;
                    }
                }
            });
    }

    public runSql(): void {
        this.runSQLRequest({ query: this.sqlRequestCode }, true);
    }

    public tableSource(output: QueryExplainerOutputType): DataRow[] {
        const columnNames: string[] = output.schema.fields.map((item) => item.name);
        return this.parseDataFromJsonAoSFormat(output.data, columnNames);
    }

    public schemaFields(output: QueryExplainerOutputType): DataSchemaField[] {
        return extractSchemaFieldsFromData(this.tableSource(output)[0]);
    }

    private parseDataFromJsonAoSFormat(data: object[], columnNames: string[]): DataRow[] {
        return data.map((dataItem: object) => {
            const arr = columnNames.map((value: string) => ({
                [value]: dataItem[value as keyof typeof dataItem],
            }));
            return arr.reduce((resultObj, obj) => Object.assign(resultObj, obj), {});
        });
    }
}
