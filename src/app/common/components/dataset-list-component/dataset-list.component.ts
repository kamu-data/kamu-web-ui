/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { DatasetSearchOverviewFragment } from "src/app/api/kamu.graphql.interface";
import { SearchMode } from "src/app/interface/search.interface";
import { DatasetListItemComponent } from "./dataset-list-item/dataset-list-item.component";
import { FormsModule } from "@angular/forms";
import { FeatureFlagDirective } from "../../directives/feature-flag.directive";
import { NgIf, NgFor } from "@angular/common";

@Component({
    selector: "app-dataset-list",
    templateUrl: "./dataset-list.component.html",
    styleUrls: ["./dataset-list.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        //-----//
        FormsModule,
        NgFor,
        NgIf,

        //-----//
        FeatureFlagDirective,
        DatasetListItemComponent,
    ],
})
export class DatasetListComponent {
    @Input({ required: true }) public dataSource: DatasetSearchOverviewFragment[];
    @Input({ required: true }) public totalCount: number;
    @Input({ required: true }) public resultUnitText: string;
    @Input({ required: true }) public isClickableRow: boolean;
    @Input({ required: true }) public searchMode: SearchMode;
    @Input({ required: true }) public sortOptions: {
        value: string;
        label: string;
        active: boolean;
    }[];
    @Input() public hasResultQuantity?: boolean = false;

    public get isSemanticSearch(): boolean {
        return this.searchMode === SearchMode.SEMANTIC_SEARCH;
    }
}
