/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { Component, EventEmitter, Input, Output } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { MatIconModule } from "@angular/material/icon";

import AppValues from "@common/values/app.values";
import { MaybeNull } from "@interface/app.types";

@Component({
    selector: "app-load-more",
    templateUrl: "./load-more.component.html",
    styleUrls: ["./load-more.component.scss"],
    imports: [
        //-----//
        FormsModule,
        //-----//
        MatButtonModule,
        MatIconModule,
        MatButtonToggleModule,
    ],
})
export class LoadMoreComponent {
    /** `null` while the number input is empty. */
    public rowsNumber: MaybeNull<number> = AppValues.SQL_QUERY_LIMIT;
    public isHolderVisible = false;

    @Input({ required: true }) public isAllDataLoaded = false;

    @Output() public loadMoreEmit = new EventEmitter<number>();

    public readonly ROWS_OPTIONS: number[] = [
        AppValues.SQL_QUERY_LIMIT / 2,
        AppValues.SQL_QUERY_LIMIT,
        AppValues.SQL_QUERY_LIMIT * 2,
    ];

    public toggleOptions(): void {
        this.isHolderVisible = !this.isHolderVisible;
    }

    public get isRowsNumberValid(): boolean {
        return Number.isInteger(this.rowsNumber) && (this.rowsNumber ?? 0) >= 1;
    }

    public loadMore(): void {
        if (!this.isAllDataLoaded && this.isRowsNumberValid && this.rowsNumber !== null) {
            this.loadMoreEmit.emit(this.rowsNumber);
        }
    }
}
