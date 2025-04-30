/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ChangeDetectionStrategy, Component, EventEmitter, inject, Input, OnInit, Output } from "@angular/core";
import {
    SearchAdditionalHeaderButtonInterface,
    SearchAdditionalHeaderButtonOptions,
    SearchAdditionalHeaderDatasetInputs,
} from "./search-additional-buttons.interface";
import { DatasetBasicsFragment, DatasetKind } from "src/app/api/kamu.graphql.interface";
import { searchAdditionalButtonsEnum } from "src/app/search/search.interface";
import { DatasetSubscriptionsService } from "src/app/dataset-view/dataset.subscriptions.service";
import { Observable, tap } from "rxjs";

@Component({
    selector: "app-search-additional-buttons-nav",
    templateUrl: "./search-additional-buttons-nav.component.html",
    styleUrls: ["./search-additional-buttons.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchAdditionalButtonsNavComponent implements OnInit {
    @Input({ required: true }) public datasetBasics: DatasetBasicsFragment;
    @Input({ required: true })
    public searchAdditionalButtonsData: SearchAdditionalHeaderButtonOptions;
    @Output() public searchAdditionalButtonsMethod = new EventEmitter<string>();

    private datasetSubsService = inject(DatasetSubscriptionsService);
    public currentTransformInputs$: Observable<SearchAdditionalHeaderDatasetInputs>;

    public ngOnInit(): void {
        this.currentTransformInputs$ = this.datasetSubsService.currentTransformInputsCountChanges.pipe(
            tap((data: SearchAdditionalHeaderDatasetInputs) => {
                this.searchAdditionalButtonsData[searchAdditionalButtonsEnum.DeriveFrom].counter = data.count;
            }),
        );
    }

    public onClickButton(method: string): void {
        this.searchAdditionalButtonsMethod.emit(method);
    }

    public get getButtonArray(): { key: searchAdditionalButtonsEnum; data: SearchAdditionalHeaderButtonInterface }[] {
        return Object.entries(this.searchAdditionalButtonsData).map(([key, data]) => ({
            key: key as searchAdditionalButtonsEnum,
            data,
        }));
    }

    public setVisibilityButtonHelper(key: searchAdditionalButtonsEnum, datasetBasics: DatasetBasicsFragment): boolean {
        switch (key) {
            case searchAdditionalButtonsEnum.DeriveFrom: {
                return datasetBasics.kind === DatasetKind.Derivative;
            }
            default:
                return true;
        }
    }
}
