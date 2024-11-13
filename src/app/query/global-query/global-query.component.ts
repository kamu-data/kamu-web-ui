import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { debounceTime, distinctUntilChanged, finalize, Observable, OperatorFunction, switchMap } from "rxjs";
import { BaseComponent } from "src/app/common/base.component";
import { DatasetService } from "src/app/dataset-view/dataset.service";
import { DatasetRequestBySql, DatasetSchema } from "src/app/interface/dataset.interface";

import AppValues from "src/app/common/app.values";
import { MaybeNull } from "src/app/common/app.types";
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
    public sqlRequestCode = "";
    public sqlLoading = false;
    public searchResult: GlobalQuerySearchItem[] = [];

    //Search
    public inputDatasets = new Set<string>();
    public searchDataset = "";
    private readonly delayTime: number = AppValues.SHORT_DELAY_MS;

    private datasetService = inject(DatasetService);
    private cdr = inject(ChangeDetectorRef);
    private appSearchAPI = inject(SearchApi);

    ngOnInit(): void {}

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

                        this.searchResult = [...this.searchResult, { datasetAlias, schema }];
                        this.cdr.detectChanges();
                    }
                });
        }
    }

    public clearSearch(): void {
        this.searchDataset = "";
    }

    public runSQLRequest(params: DatasetRequestBySql): void {
        this.sqlLoading = true;
        this.datasetService
            // TODO: Propagate limit from UI and display when it was reached
            .requestDatasetDataSqlRun(params)
            .pipe(
                finalize(() => {
                    this.sqlLoading = false;
                }),
                takeUntilDestroyed(this.destroyRef),
            )
            .subscribe();
        this.cdr.detectChanges();
    }
}
