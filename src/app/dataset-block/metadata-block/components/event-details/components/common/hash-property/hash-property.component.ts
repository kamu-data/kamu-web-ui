/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { BasePropertyComponent } from "src/app/dataset-block/metadata-block/components/event-details/components/common/base-property/base-property.component";
import { ChangeDetectionStrategy, Component, Input } from "@angular/core";

@Component({
    selector: "app-hash-property",
    templateUrl: "./hash-property.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HashPropertyComponent extends BasePropertyComponent {
    @Input({ required: true }) public data: string;
}
