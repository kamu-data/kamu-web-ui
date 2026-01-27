/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { Component, EventEmitter, Input, Output } from "@angular/core";
import AppValues from "../../../common/values/app.values";
import { FormsModule } from "@angular/forms";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { MatIconModule } from "@angular/material/icon";
import { NgIf, NgFor } from "@angular/common";
import { MatButtonModule } from "@angular/material/button";

@Component({
    selector: "app-load-more",
    templateUrl: "./load-more.component.html",
    styleUrls: ["./load-more.component.scss"],
    imports: [
        //-----//
        FormsModule,
        NgIf,
        NgFor,
        //-----//
        MatButtonModule,
        MatIconModule,
        MatButtonToggleModule,
    ]
})
export class LoadMoreComponent {
    public rowsNumber: number = AppValues.SQL_QUERY_LIMIT;
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

    public loadMore(): void {
        if (!this.isAllDataLoaded) {
            this.loadMoreEmit.emit(this.rowsNumber);
        }
    }
}
