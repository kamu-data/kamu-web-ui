/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ChangeDetectionStrategy, Component, Input } from "@angular/core";

import { BasePropertyComponent } from "src/app/dataset-block/metadata-block/components/event-details/components/common/base-property/base-property.component";

@Component({
    selector: "app-simple-property",
    templateUrl: "./simple-property.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
})
export class SimplePropertyComponent extends BasePropertyComponent {
    @Input({ required: true }) public data: string;
    @Input() public class?: string;
}
