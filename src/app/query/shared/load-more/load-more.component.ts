/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from "@angular/core";
import { FormControl, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { MatIconModule } from "@angular/material/icon";

import { FormValidationErrorsDirective } from "@common/validation/form-validation-errors.directive";
import { integerInRangeValidators } from "@common/validation/number.validators";
import AppValues from "@common/values/app.values";
import { MaybeNull } from "@interface/app.types";

@Component({
    selector: "app-load-more",
    templateUrl: "./load-more.component.html",
    styleUrls: ["./load-more.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        //-----//
        ReactiveFormsModule,
        //-----//
        MatButtonModule,
        MatIconModule,
        MatButtonToggleModule,
        //-----//
        FormValidationErrorsDirective,
    ],
})
export class LoadMoreComponent {
    /** `null` while the number input is empty. */
    public readonly rowsControl = new FormControl<MaybeNull<number>>(AppValues.SQL_QUERY_LIMIT, [
        Validators.required,
        ...integerInRangeValidators(1),
    ]);
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
        const rows = this.rowsControl.value;
        if (!this.isAllDataLoaded && this.rowsControl.valid && rows !== null) {
            this.loadMoreEmit.emit(rows);
        }
    }
}
