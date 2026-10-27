/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from "@angular/core";

import { MaybeNullOrUndefined } from "@interface/app.types";

/** Shown in place of an empty list when the URL asks for a page past the last one */
@Component({
    selector: "app-page-past-end",
    templateUrl: "./page-past-end.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PagePastEndComponent {
    /** What the list holds, in the plural: "datasets", "flow runs" */
    @Input({ required: true }) public itemsName: string;
    @Input({ required: true }) public totalPages: MaybeNullOrUndefined<number>;
    @Output() public pageChangeEvent = new EventEmitter<number>();

    public get lastPage(): number {
        return Math.max(this.totalPages ?? 1, 1);
    }
}
