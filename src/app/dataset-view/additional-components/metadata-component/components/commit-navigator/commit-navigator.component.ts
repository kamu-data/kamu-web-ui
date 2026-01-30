/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { Component, Input, Output, EventEmitter, OnChanges, ChangeDetectionStrategy } from "@angular/core";
import { SlicePipe } from "@angular/common";
import { MatIconModule } from "@angular/material/icon";

@Component({
    selector: "app-custom-pagination",
    templateUrl: "commit-navigator.component.html",
    styleUrls: ["commit-navigator.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        //-----//
        SlicePipe,
        //-----//
        MatIconModule,
    ],
})
export class CommitNavigatorComponent implements OnChanges {
    @Input({ required: true }) public date = "";
    @Input({ required: true }) public hash = "";
    @Input({ required: true }) public pageIndex: number; // current offset
    @Input({ required: true }) public limit: number; // record per page
    @Input({ required: true }) public total: number; // total records
    @Input() public range = 5;
    @Output() public pageChange: EventEmitter<number> = new EventEmitter<number>();
    public totalPageNo: number[] = [];
    public totalSizeOfPages: number = 0;

    public ngOnChanges() {
        this.totalSizeOfPages = this.total / this.limit;
        this.totalSizeOfPages = Math.ceil(this.totalSizeOfPages);

        this.totalPageNo = [];
        for (let i = 1; i <= this.totalSizeOfPages; i++) {
            this.totalPageNo.push(i);
        }
    }

    public pageChangeBackward() {
        if (this.pageIndex > 0) {
            this.pageIndex = this.pageIndex - 1;
        }
        this.pageChange.emit(this.pageIndex);
    }

    public pageChangeForward() {
        if (this.pageIndex < this.totalSizeOfPages) {
            this.pageIndex = this.pageIndex + 1;
        }
        this.pageChange.emit(this.pageIndex);
    }
}
