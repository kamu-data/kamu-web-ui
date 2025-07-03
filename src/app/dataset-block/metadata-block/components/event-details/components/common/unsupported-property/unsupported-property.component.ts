/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { BasePropertyComponent } from "../base-property/base-property.component";
import { JsonPipe } from "@angular/common";

@Component({
    selector: "app-unsupported-property",
    templateUrl: "./unsupported-property.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [JsonPipe],
})
export class UnsupportedPropertyComponent extends BasePropertyComponent {
    @Input({ required: true }) public data: unknown;
}
