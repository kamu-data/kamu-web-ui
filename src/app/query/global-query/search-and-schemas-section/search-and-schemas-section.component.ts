/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { CdkAccordionModule } from "@angular/cdk/accordion";
import { NgFor, NgIf } from "@angular/common";
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    inject,
    Input,
    OnInit,
    Output,
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { FormsModule } from "@angular/forms";
import { MatDividerModule } from "@angular/material/divider";
import { MatIconModule } from "@angular/material/icon";

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

import { BaseComponent } from "@common/components/base.component";
import { DynamicTableDataRow } from "@common/components/dynamic-table/dynamic-table.interface";
import { FeatureFlagDirective } from "@common/directives/feature-flag.directive";
import { parseCurrentSchema } from "@common/helpers/app.helpers";
import { schemaAsDataRows } from "@common/helpers/data-schema.helpers";
import AppValues from "@common/values/app.values";
import { NgbHighlight, NgbTypeahead, NgbTypeaheadSelectItemEvent } from "@ng-bootstrap/ng-bootstrap";
import { DatasetBasicsFragment, GetDatasetSchemaQuery } from "src/app/api/kamu.graphql.interface";
import { SearchApi } from "src/app/api/search.api";
import { DatasetService } from "src/app/dataset-view/dataset.service";
import { MaybeNull } from "src/app/interface/app.types";
import { DataSchemaField, DatasetSchema } from "src/app/interface/dataset-schema.interface";
import { DatasetAutocompleteItem, TypeNames } from "src/app/interface/search.interface";
import { SqlQueryService } from "src/app/services/sql-query.service";

import { DynamicTableComponent } from "../../../common/components/dynamic-table/dynamic-table.component";
import { SavedQueriesSectionComponent } from "../../shared/saved-queries-section/saved-queries-section.component";
import { GlobalQuerySearchItem, SqlQueryBasicResponse } from "../global-query.model";

@Component({
    selector: "app-search-and-schemas-section",
    templateUrl: "./search-and-schemas-section.component.html",
    styleUrls: ["./search-and-schemas-section.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        //-----//
        NgIf,
        NgFor,
        FormsModule,
        CdkAccordionModule,
        //-----//
        MatDividerModule,
        MatIconModule,
        NgbHighlight,
        NgbTypeahead,
        //-----//
        DynamicTableComponent,
        FeatureFlagDirective,
        SavedQueriesSectionComponent,
    ],
})
export class SearchAndSchemasSectionComponent extends BaseComponent implements OnInit {
    @Output() public sqlQueryEmit = new EventEmitter<string>();
    @Input() public disableSearch: boolean;
    public searchResult: GlobalQuerySearchItem[] = [];
    public inputDatasets = new Set<string>();
    public searchDataset = "";

    private readonly delayTime: number = AppValues.SHORT_DELAY_MS;
    private readonly SQL_DEFAULT_TEMPLATE = `select\n  *\nfrom`;

    private cdr = inject(ChangeDetectorRef);
    private datasetService = inject(DatasetService);
    private appSearchAPI = inject(SearchApi);
    private sqlQueryService = inject(SqlQueryService);

    public ngOnInit(): void {
        this.sqlQueryService.sqlQueryResponseChanges
            .pipe(
                switchMap((sqlQueryResponse: MaybeNull<SqlQueryBasicResponse>) => {
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

    public schemaData(schema: DataSchemaField[]): DynamicTableDataRow[] {
        return schemaAsDataRows(schema);
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
        if (!this.inputDatasets.size) {
            this.sqlQueryEmit.emit(`${this.SQL_DEFAULT_TEMPLATE} '${value.dataset.alias}'`);
        }
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
