/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { CdkAccordionModule } from "@angular/cdk/accordion";
import { NgFor, NgIf } from "@angular/common";
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, Input } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { RouterLink } from "@angular/router";

import { Observable, OperatorFunction } from "rxjs";
import { debounceTime, distinctUntilChanged, map, switchMap } from "rxjs/operators";

import { NgbHighlight, NgbTypeahead, NgbTypeaheadSelectItemEvent } from "@ng-bootstrap/ng-bootstrap";

import { BaseComponent } from "@common/components/base.component";
import { DynamicTableComponent } from "@common/components/dynamic-table/dynamic-table.component";
import { DynamicTableDataRow } from "@common/components/dynamic-table/dynamic-table.interface";
import { parseCurrentSchema } from "@common/helpers/app.helpers";
import { odfType2String, schemaAsDataRows } from "@common/helpers/data-schema.helpers";
import AppValues from "@common/values/app.values";
import { DatasetBasicsFragment, GetDatasetSchemaQuery } from "@api/kamu.graphql.interface";
import { SearchApi } from "@api/search.api";
import { MaybeNull } from "@interface/app.types";
import { DataSchemaField, DataSchemaTypeField, DatasetSchema, OdfTypes } from "@interface/dataset-schema.interface";
import { DatasetInfo } from "@interface/navigation.interface";
import { DatasetAutocompleteItem, TypeNames } from "@interface/search.interface";

import { DatasetNode } from "src/app/dataset-view/additional-components/metadata-component/components/set-transform/set-transform.types";
import { DatasetService } from "src/app/dataset-view/dataset.service";

@Component({
    selector: "app-search-section",
    templateUrl: "./search-section.component.html",
    styleUrls: ["./search-section.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        //-----//
        CdkAccordionModule,
        FormsModule,
        NgIf,
        NgFor,
        RouterLink,
        //-----//
        MatIconModule,
        MatButtonModule,
        NgbTypeahead,
        NgbHighlight,

        //-----//
        DynamicTableComponent,
    ],
})
export class SearchSectionComponent extends BaseComponent {
    public searchDataset = "";
    private readonly delayTime: number = AppValues.SHORT_DELAY_MS;
    @Input({ required: true }) public inputDatasets: Set<string>;
    @Input({ required: true }) public datasetInfo: DatasetInfo;
    @Input({ required: true }) public inputsViewModel: DatasetNode[];

    public readonly UNAVAILABLE_INPUT_LABEL: string = AppValues.SET_TRANSFORM_UNAVAILABLE_INPUT_LABEL;
    public readonly cdr = inject(ChangeDetectorRef);

    private appSearchAPI = inject(SearchApi);
    private datasetService = inject(DatasetService);

    public search: OperatorFunction<string, DatasetAutocompleteItem[]> = (text$: Observable<string>) => {
        return text$.pipe(
            debounceTime(this.delayTime),
            distinctUntilChanged(),
            switchMap((term: string) => {
                return this.appSearchAPI.autocompleteDatasetSearch(term).pipe(
                    map((autoCompleteItems: DatasetAutocompleteItem[]) => {
                        return autoCompleteItems.filter(
                            (autoCompleteItem: DatasetAutocompleteItem) =>
                                !this.involvedDatasets.some((item) => item === `${autoCompleteItem.dataset.alias}`),
                        );
                    }),
                );
            }),
        );
    };

    private get involvedDatasets(): string[] {
        return this.inputsViewModel
            .map((item: DatasetNode) => `${item.owner}/${item.name}`)
            .concat(`${this.datasetInfo.accountName}/${this.datasetInfo.datasetName}`);
    }

    public formatter(x: DatasetAutocompleteItem | string): string {
        return typeof x !== "string" ? x.dataset.name : x;
    }

    public onSelectItem(event: NgbTypeaheadSelectItemEvent): void {
        const value = event.item as DatasetAutocompleteItem;
        const id = value.dataset.id;
        const alias = value.dataset.alias;
        const inputDataset = JSON.stringify({
            datasetRef: id,
            alias,
        });
        if (value.__typename !== TypeNames.allDataType && !this.inputDatasets.has(inputDataset)) {
            this.inputDatasets.add(inputDataset);

            this.datasetService
                .requestDatasetSchema(id)
                .pipe(takeUntilDestroyed(this.destroyRef))
                .subscribe((data: GetDatasetSchemaQuery) => {
                    if (data.datasets.byId) {
                        const owner = (data.datasets.byId as DatasetBasicsFragment).owner.accountName;
                        const schema: MaybeNull<DatasetSchema> = parseCurrentSchema(
                            data.datasets.byId.metadata.currentSchema,
                        );

                        this.inputsViewModel = [
                            ...this.inputsViewModel,
                            {
                                name: value.dataset.name,
                                schema: schema?.fields.length
                                    ? schema.fields
                                    : [
                                          {
                                              name: "No schema",
                                              type: {
                                                  kind: OdfTypes.String,
                                              },
                                          },
                                      ],
                                owner,
                            },
                        ];
                        this.cdr.detectChanges();
                    }
                });
        }
    }

    public clearSearch(): void {
        this.searchDataset = "";
    }

    public deleteInputDataset(owner: string, name: string): void {
        const alias = `${owner}/${name}`;
        this.inputsViewModel = this.inputsViewModel.filter(
            (item: DatasetNode) => `${item.owner}/${item.name}` !== alias,
        );

        this.inputDatasets.forEach((item) => {
            if (item.includes(alias)) {
                this.inputDatasets.delete(item);
            }
        });
        this.cdr.detectChanges();
    }

    public OdfTypeMapper(type: DataSchemaTypeField): string {
        return odfType2String(type);
    }

    public schemaData(schema: DataSchemaField[]): DynamicTableDataRow[] {
        return schemaAsDataRows(schema);
    }
}
