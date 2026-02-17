/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { NgFor, NgIf } from "@angular/common";
import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { FormsModule } from "@angular/forms";

import { DatasetListItemComponent } from "@common/components/dataset-list-component/dataset-list-item/dataset-list-item.component";
import { FeatureFlagDirective } from "@common/directives/feature-flag.directive";
import { DatasetSearchOverviewFragment } from "@api/kamu.graphql.interface";
import { SearchMode } from "@interface/search.interface";

@Component({
    selector: "app-dataset-list",
    templateUrl: "./dataset-list.component.html",
    styleUrls: ["./dataset-list.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
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
