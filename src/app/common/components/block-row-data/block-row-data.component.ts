/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ChangeDetectionStrategy, Component, Input } from "@angular/core";

@Component({
    selector: "app-block-row-data",
    templateUrl: "./block-row-data.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlockRowDataComponent {
    @Input({ required: true }) public label: string;
    @Input({ required: true }) public tooltip: string;
}
