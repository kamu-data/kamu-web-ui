/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from "@angular/core";

import { NgbPagination, NgbPaginationNext, NgbPaginationPrevious } from "@ng-bootstrap/ng-bootstrap";

import { PageBasedInfo } from "@api/kamu.graphql.interface";

@Component({
    selector: "app-pagination",
    templateUrl: "./pagination.component.html",
    styleUrls: ["./pagination.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [NgbPagination, NgbPaginationPrevious, NgbPaginationNext],
})
export class PaginationComponent {
    @Input({ required: true }) public currentPage: number;
    @Input({ required: true }) public pageInfo: PageBasedInfo;
    @Output() public pageChangeEvent = new EventEmitter<number>();

    private previousPage: number;

    public onPageChange(currentPage: number) {
        if (currentPage !== this.previousPage) {
            this.previousPage = currentPage;
            this.pageChangeEvent.emit(currentPage);
        }
    }
}
