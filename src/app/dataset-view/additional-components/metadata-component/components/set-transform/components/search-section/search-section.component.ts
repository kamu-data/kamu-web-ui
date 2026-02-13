/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, Input } from "@angular/core";
import { NgbTypeaheadSelectItemEvent, NgbTypeahead, NgbHighlight } from "@ng-bootstrap/ng-bootstrap";
import { OperatorFunction, Observable } from "rxjs";
import { debounceTime, distinctUntilChanged, map, switchMap } from "rxjs/operators";
import { DatasetBasicsFragment, GetDatasetSchemaQuery } from "src/app/api/kamu.graphql.interface";
import { SearchApi } from "src/app/api/search.api";
import { MaybeNull } from "src/app/interface/app.types";
import AppValues from "src/app/common/values/app.values";
import { DatasetService } from "src/app/dataset-view/dataset.service";
import { DatasetAutocompleteItem, TypeNames } from "src/app/interface/search.interface";
import { DatasetNode } from "../../set-transform.types";
import { BaseComponent } from "src/app/common/components/base.component";
import { parseCurrentSchema } from "src/app/common/helpers/app.helpers";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { DatasetInfo } from "src/app/interface/navigation.interface";
import { RouterLink } from "@angular/router";
import { MatButtonModule } from "@angular/material/button";
import { NgFor, NgIf } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { MatIconModule } from "@angular/material/icon";
import { CdkAccordionModule } from "@angular/cdk/accordion";
import { DynamicTableComponent } from "./../../../../../../../common/components/dynamic-table/dynamic-table.component";
import {
    DatasetSchema,
    OdfTypes,
    DataSchemaTypeField,
    DataSchemaField,
} from "src/app/interface/dataset-schema.interface";
import { odfType2String, schemaAsDataRows } from "src/app/common/helpers/data-schema.helpers";
import { DynamicTableDataRow } from "src/app/common/components/dynamic-table/dynamic-table.interface";

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
