/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from "@angular/core";

/** Shown in place of a view when a well-formed URL parameter names something that does not exist */
@Component({
    selector: "app-value-not-found",
    templateUrl: "./value-not-found.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ValueNotFoundComponent {
    @Input({ required: true }) public message: string;
    /** The label of the action that leads to a value that exists, such as the latest version */
    @Input({ required: true }) public actionLabel: string;
    @Output() public actionEvent = new EventEmitter<void>();
}
