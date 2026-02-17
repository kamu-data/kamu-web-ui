/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ChangeDetectionStrategy, Component, Input } from "@angular/core";

import { BasePropertyComponent } from "src/app/dataset-block/metadata-block/components/event-details/components/common/base-property/base-property.component";

import { DisplaySizePipe } from "@common/pipes/display-size.pipe";

@Component({
    selector: "app-size-property",
    templateUrl: "./size-property.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [DisplaySizePipe],
})
export class SizePropertyComponent extends BasePropertyComponent {
    @Input({ required: true }) public data: number;
}
