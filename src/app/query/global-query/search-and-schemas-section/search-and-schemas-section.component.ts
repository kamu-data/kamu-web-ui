import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit } from "@angular/core";
import { GlobalQuerySearchItem, SqlQueryResponseState } from "../global-query.model";
import { BaseComponent } from "src/app/common/base.component";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import {
    combineLatest,
    debounceTime,
    distinctUntilChanged,
    map,
    Observable,
    of,
    OperatorFunction,
    switchMap,
} from "rxjs";
import { DatasetBasicsFragment, GetDatasetSchemaQuery } from "src/app/api/kamu.graphql.interface";
import { parseCurrentSchema } from "src/app/common/app.helpers";
import { NgbTypeaheadSelectItemEvent } from "@ng-bootstrap/ng-bootstrap";
import { MaybeNull } from "src/app/common/app.types";
import { DatasetSchema } from "src/app/interface/dataset.interface";
import { DatasetAutocompleteItem, TypeNames } from "src/app/interface/search.interface";
import { SearchApi } from "src/app/api/search.api";
import { DatasetService } from "src/app/dataset-view/dataset.service";
import AppValues from "src/app/common/app.values";
import { SqlQueryService } from "src/app/services/sql-query.service";

@Component({
    selector: "app-search-and-schemas-section",
    templateUrl: "./search-and-schemas-section.component.html",
    styleUrls: ["./search-and-schemas-section.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchAndSchemasSectionComponent extends BaseComponent implements OnInit {
    public searchResult: GlobalQuerySearchItem[] = [];
    public inputDatasets = new Set<string>();
    public searchDataset = "";
    private readonly delayTime: number = AppValues.SHORT_DELAY_MS;

    private cdr = inject(ChangeDetectorRef);
    private datasetService = inject(DatasetService);
    private appSearchAPI = inject(SearchApi);
    private sqlQueryService = inject(SqlQueryService);

    public ngOnInit(): void {
        this.sqlQueryService.sqlQueryResponseChanges
            .pipe(
                switchMap((sqlQueryResponse: MaybeNull<SqlQueryResponseState>) => {
                    if (sqlQueryResponse) {
                        const schemaResponses = sqlQueryResponse.involvedDatasetsId.map((id: string) =>
                            this.datasetService.requestDatasetSchema(id),
                        );
                        return this.processSchemaResponses(schemaResponses);
                    }
                    return of(null);
                }),
                takeUntilDestroyed(this.destroyRef),
            )
            .subscribe((data: MaybeNull<GlobalQuerySearchItem[]>) => {
                if (data) {
                    this.searchResult = data;
                    this.cdr.detectChanges();
                }
            });
    }

    private processSchemaResponses(
        schemaResponses: Observable<GetDatasetSchemaQuery>[],
    ): Observable<GlobalQuerySearchItem[]> {
        return combineLatest(schemaResponses).pipe(
            map((datasets: GetDatasetSchemaQuery[]) => {
                const result = datasets.map((item: GetDatasetSchemaQuery) => {
                    const datasetAlias = item.datasets.byId?.alias;
                    const schema = parseCurrentSchema(item.datasets.byId?.metadata.currentSchema);
                    return { datasetAlias, schema } as GlobalQuerySearchItem;
                });
                return result;
            }),
        );
    }

    public removeDataset(datasetAlias: string): void {
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
            this.requestDatasetSchemaById(id);
        }
    }

    public get sortedSearchResult(): GlobalQuerySearchItem[] {
        return this.searchResult.sort((a: GlobalQuerySearchItem, b: GlobalQuerySearchItem) => {
            if (a.datasetAlias < b.datasetAlias) return -1;
            if (a.datasetAlias > b.datasetAlias) return 1;
            return 0;
        });
    }

    private requestDatasetSchemaById(id: string): void {
        this.datasetService
            .requestDatasetSchema(id)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((data: GetDatasetSchemaQuery) => {
                if (data.datasets.byId) {
                    const datasetAlias = (data.datasets.byId as DatasetBasicsFragment).alias;
                    const schema: MaybeNull<DatasetSchema> = parseCurrentSchema(
                        data.datasets.byId.metadata.currentSchema,
                    );

                    this.searchResult = [...this.searchResult, { datasetAlias, schema }];
                    this.cdr.detectChanges();
                }
            });
    }

    public clearSearch(): void {
        this.searchDataset = "";
    }
}