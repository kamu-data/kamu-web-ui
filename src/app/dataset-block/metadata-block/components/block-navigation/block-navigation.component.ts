/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { NgFor, NgIf } from "@angular/common";
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatIconModule } from "@angular/material/icon";
import { RouterLink } from "@angular/router";

import { NgSelectModule } from "@ng-select/ng-select";
import { BlockHashFilterPipe } from "src/app/dataset-block/metadata-block/components/block-navigation/pipes/block-hash-filter.pipe";
import { EventTypeFilterPipe } from "src/app/dataset-block/metadata-block/components/block-navigation/pipes/event-type-filter.pipe";
import { SupportedEvents } from "src/app/dataset-block/metadata-block/components/event-details/supported.events";
import { DatasetHistoryUpdate } from "src/app/dataset-view/dataset.subscriptions.interface";
import ProjectLinks from "src/app/project-links";

import { PaginationComponent } from "@common/components/pagination-component/pagination.component";
import { MaybeNull } from "@interface/app.types";
import { DatasetInfo } from "@interface/navigation.interface";

@Component({
    selector: "app-block-navigation",
    templateUrl: "./block-navigation.component.html",
    styleUrls: ["./block-navigation.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        //-----//
        FormsModule,
        NgIf,
        NgFor,
        RouterLink,
        //-----//
        MatIconModule,
        NgSelectModule,
        //-----//
        BlockHashFilterPipe,
        EventTypeFilterPipe,
        PaginationComponent,
    ],
})
export class BlockNavigationComponent {
    @Input({ required: true }) public datasetHistory: MaybeNull<DatasetHistoryUpdate>;
    @Input({ required: true }) public currentBlockHash: string;
    @Input({ required: true }) public datasetInfo: DatasetInfo;
    @Output() public onPageChangeEmit = new EventEmitter<number>();
    public searchHash = "";
    public currentPage = 1;
    public readonly URL_BLOCK = ProjectLinks.URL_BLOCK;

    public dropdownList = Object.entries(SupportedEvents).map(([key]) => {
        return { id: key, value: key };
    });
    public eventTypeFiltersSelected: string[] = [];

    public highlightHash(hash: string, searchHash: string): string {
        return hash.replace(searchHash, `<span class="bg-warning fs-10">${searchHash}</span>`);
    }

    public onPageChange(currentPage: number): void {
        this.onPageChangeEmit.emit(currentPage);
    }

    public refreshSearch(): void {
        this.searchHash = "";
    }
}
