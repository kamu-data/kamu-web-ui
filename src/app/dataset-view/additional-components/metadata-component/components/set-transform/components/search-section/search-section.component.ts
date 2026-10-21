/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { CdkAccordionModule } from "@angular/cdk/accordion";
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
import { odfType2String, schemaAsDataRows } from "@common/helpers/data-schema.helpers";
import { DatasetLinkPipe } from "@common/pipes/dataset-link.pipe";
import AppValues from "@common/values/app.values";
import { DatasetBasicsFragment, GetDatasetSchemaQuery, TransformInput } from "@api/kamu.graphql.interface";
import { SearchApi } from "@api/search.api";
import { DataSchemaField, DataSchemaTypeField } from "@interface/dataset-schema.interface";
import { DatasetInfo } from "@interface/navigation.interface";
import { DatasetAutocompleteItem, TypeNames } from "@interface/search.interface";

import { datasetNodeFromSchemaQuery } from "src/app/dataset-view/additional-components/metadata-component/components/set-transform/set-transform.helpers";
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
        RouterLink,
        //-----//
        MatIconModule,
        MatButtonModule,
        NgbTypeahead,
        NgbHighlight,

        //-----//
        DynamicTableComponent,
        DatasetLinkPipe,
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
                                !this.isInvolvedDataset(autoCompleteItem.dataset),
                        );
                    }),
                );
            }),
        );
    };

    // Aliases have no account prefix in single-tenant mode, so the edited dataset is matched by owner and name
    private isInvolvedDataset(dataset: DatasetBasicsFragment): boolean {
        const isEditedDataset =
            dataset.owner.accountName === this.datasetInfo.accountName && dataset.name === this.datasetInfo.datasetName;
        return isEditedDataset || this.inputsViewModel.some((item: DatasetNode) => item.alias === dataset.alias);
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
                    this.inputsViewModel = [...this.inputsViewModel, datasetNodeFromSchemaQuery(alias, data)];
                    this.cdr.detectChanges();
                });
        }
    }

    public clearSearch(): void {
        this.searchDataset = "";
    }

    public deleteInputDataset(alias: string): void {
        this.inputsViewModel = this.inputsViewModel.filter((item: DatasetNode) => item.alias !== alias);

        this.inputDatasets.forEach((item) => {
            const input = JSON.parse(item) as TransformInput;
            if (input.alias === alias) {
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
