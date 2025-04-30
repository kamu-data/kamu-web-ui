/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from "@angular/core";
import { SearchAdditionalHeaderButtonOptions } from "../../common/components/search-additional-buttons/search-additional-buttons.interface";
import { DatasetInfo } from "src/app/interface/navigation.interface";
import { DatasetBasicsFragment, DatasetKind } from "src/app/api/kamu.graphql.interface";
import { searchAdditionalButtonsDescriptors } from "./dataset-view-header.model";

@Component({
    selector: "app-dataset-view-header",
    templateUrl: "./dataset-view-header.component.html",
    styleUrls: ["./dataset-view-header.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DatasetViewHeaderComponent {
    @Input({ required: true }) public datasetInfo: DatasetInfo;
    @Input({ required: true }) public datasetBasics: DatasetBasicsFragment;
    @Output() public onClickSearchAdditionalButtonEmit = new EventEmitter<string>();

    public searchAdditionalButtonsData: SearchAdditionalHeaderButtonOptions = searchAdditionalButtonsDescriptors;

    public get isDerivativeDataset(): boolean {
        return this.datasetBasics.kind === DatasetKind.Derivative;
    }

    public onClickSearchAdditionalButton(method: string): void {
        this.onClickSearchAdditionalButtonEmit.emit(method);
    }
}
