/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ChangeDetectionStrategy, Component, Input } from "@angular/core";

import { DataHelpers } from "@common/helpers/data.helpers";

import { BasePropertyComponent } from "src/app/dataset-block/metadata-block/components/event-details/components/common/base-property/base-property.component";

@Component({
    selector: "app-order-property",
    templateUrl: "./order-property.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
})
export class OrderPropertyComponent extends BasePropertyComponent {
    @Input({ required: true }) public data: string;

    public get order(): string {
        return DataHelpers.descriptionOrder(this.data);
    }
}
