/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { JsonPipe } from "@angular/common";
import { ChangeDetectionStrategy, Component, Input } from "@angular/core";

import { BasePropertyComponent } from "src/app/dataset-block/metadata-block/components/event-details/components/common/base-property/base-property.component";

@Component({
    selector: "app-unsupported-property",
    templateUrl: "./unsupported-property.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [JsonPipe],
})
export class UnsupportedPropertyComponent extends BasePropertyComponent {
    @Input({ required: true }) public data: unknown;
}
