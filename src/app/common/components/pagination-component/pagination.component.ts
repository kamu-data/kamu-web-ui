/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    Input,
    OnChanges,
    Output,
    SimpleChanges,
} from "@angular/core";

import { NgbPagination, NgbPaginationNext, NgbPaginationPrevious } from "@ng-bootstrap/ng-bootstrap";

import { DatasetPageInfoFragment } from "@api/kamu.graphql.interface";

@Component({
    selector: "app-pagination",
    templateUrl: "./pagination.component.html",
    styleUrls: ["./pagination.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        //-----//
        NgbPagination,
        NgbPaginationPrevious,
        NgbPaginationNext,
    ],
})
export class PaginationComponent implements OnChanges {
    @Input({ required: true }) public currentPage: number;
    @Input({ required: true }) public pageInfo: DatasetPageInfoFragment;
    @Output() public pageChangeEvent = new EventEmitter<number>();

    private previousPage: number;

    public ngOnChanges(changes: SimpleChanges): void {
        // A page the parent moved to, such as page 1 after a new filter, is the one a click must differ from
        if (changes.currentPage) {
            this.previousPage = this.currentPage;
        }
    }

    public onPageChange(currentPage: number) {
        if (currentPage !== this.previousPage) {
            this.previousPage = currentPage;
            this.pageChangeEvent.emit(currentPage);
        }
    }
}
