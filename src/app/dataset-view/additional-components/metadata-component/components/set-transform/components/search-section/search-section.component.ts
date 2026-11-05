/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { CdkAccordionModule } from "@angular/cdk/accordion";
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, Input, OnInit } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatIconModule } from "@angular/material/icon";
import { RouterLink } from "@angular/router";

import { Observable, of, OperatorFunction } from "rxjs";
import { catchError, debounceTime, distinctUntilChanged, map, switchMap } from "rxjs/operators";

import { NgbHighlight, NgbTypeahead, NgbTypeaheadSelectItemEvent } from "@ng-bootstrap/ng-bootstrap";
import { NgxTrimDirectiveModule } from "ngx-trim-directive";

import { BaseComponent } from "@common/components/base.component";
import { DynamicTableComponent } from "@common/components/dynamic-table/dynamic-table.component";
import { DynamicTableDataRow } from "@common/components/dynamic-table/dynamic-table.interface";
import { odfType2String, schemaAsDataRows } from "@common/helpers/data-schema.helpers";
import { DatasetLinkPipe } from "@common/pipes/dataset-link.pipe";
import { SetTransformTooltipsTexts } from "@common/tooltips/set-transform.text";
import { FormValidationErrorsDirective } from "@common/validation/form-validation-errors.directive";
import AppValues from "@common/values/app.values";
import { DatasetBasicsFragment, GetDatasetSchemaQuery } from "@api/kamu.graphql.interface";
import { SearchApi } from "@api/search.api";
import { DataSchemaField, DataSchemaTypeField } from "@interface/dataset-schema.interface";
import { DatasetInfo } from "@interface/navigation.interface";
import { DatasetAutocompleteItem, TypeNames } from "@interface/search.interface";

import {
    datasetInfoFromSchemaQuery,
    transformInputForm,
    unavailableDatasetInfo,
} from "src/app/dataset-view/additional-components/metadata-component/components/set-transform/set-transform.helpers";
import {
    TransformInputDatasetInfo,
    TransformInputsFormArray,
} from "src/app/dataset-view/additional-components/metadata-component/components/set-transform/set-transform.types";
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
        ReactiveFormsModule,
        RouterLink,
        //-----//
        MatIconModule,
        NgbTypeahead,
        NgbHighlight,
        NgxTrimDirectiveModule,
        //-----//
        DynamicTableComponent,
        FormValidationErrorsDirective,
        DatasetLinkPipe,
    ],
})
export class SearchSectionComponent extends BaseComponent implements OnInit {
    public searchDataset = "";
    private readonly delayTime: number = AppValues.SHORT_DELAY_MS;
    @Input({ required: true }) public inputsForm: TransformInputsFormArray;
    @Input({ required: true }) public datasetInfo: DatasetInfo;

    public readonly aliasHint = SetTransformTooltipsTexts.INPUT_QUERY_ALIAS;

    // Keyed by dataset reference; an input missing here is still loading
    public datasetsByRef: ReadonlyMap<string, TransformInputDatasetInfo> = new Map();

    public readonly cdr = inject(ChangeDetectorRef);

    private appSearchAPI = inject(SearchApi);
    private datasetService = inject(DatasetService);

    public ngOnInit(): void {
        this.inputsForm.controls.forEach((inputForm) => this.loadDatasetInfo(inputForm.controls.datasetRef.value));
    }

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
                    // A failed search offers no suggestions; the next term searches again
                    catchError(() => of([])),
                );
            }),
        );
    };

    // Inputs are matched by dataset id, since their query aliases are the user's own names
    private isInvolvedDataset(dataset: DatasetBasicsFragment): boolean {
        const isEditedDataset =
            dataset.owner.accountName === this.datasetInfo.accountName && dataset.name === this.datasetInfo.datasetName;
        return isEditedDataset || this.isInput(dataset.id);
    }

    private isInput(datasetRef: string): boolean {
        return this.inputsForm.controls.some((inputForm) => inputForm.controls.datasetRef.value === datasetRef);
    }

    public formatter(x: DatasetAutocompleteItem | string): string {
        return typeof x !== "string" ? x.dataset.name : x;
    }

    public onSelectItem(event: NgbTypeaheadSelectItemEvent<DatasetAutocompleteItem>): void {
        const value = event.item;
        const datasetRef = value.dataset.id;
        if (value.__typename !== TypeNames.allDataType && !this.isInput(datasetRef)) {
            this.inputsForm.push(transformInputForm({ datasetRef, alias: value.dataset.alias }));
            // The default alias may repeat one the user typed; a pristine list would hide that error
            this.inputsForm.markAsDirty();
            this.loadDatasetInfo(datasetRef);
        }
    }

    public clearSearch(): void {
        this.searchDataset = "";
    }

    public deleteInput(index: number): void {
        this.inputsForm.removeAt(index);
        this.inputsForm.markAsDirty();
    }

    private loadDatasetInfo(datasetRef: string): void {
        this.datasetService
            .requestDatasetSchema(datasetRef)
            .pipe(
                map((data: GetDatasetSchemaQuery) => datasetInfoFromSchemaQuery(data)),
                // The global Apollo error link has already reported the failure
                catchError(() => of(unavailableDatasetInfo())),
                takeUntilDestroyed(this.destroyRef),
            )
            .subscribe((info: TransformInputDatasetInfo) => {
                this.datasetsByRef = new Map(this.datasetsByRef).set(datasetRef, info);
                this.cdr.markForCheck();
            });
    }

    public OdfTypeMapper(type: DataSchemaTypeField): string {
        return odfType2String(type);
    }

    public schemaData(schema: DataSchemaField[]): DynamicTableDataRow[] {
        return schemaAsDataRows(schema);
    }
}
