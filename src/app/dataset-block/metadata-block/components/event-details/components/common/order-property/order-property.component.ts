/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { BasePropertyComponent } from "../base-property/base-property.component";
import { DataHelpers } from "src/app/common/helpers/data.helpers";
@Component({
    selector: "app-order-property",
    templateUrl: "./order-property.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderPropertyComponent extends BasePropertyComponent {
    @Input({ required: true }) public data: string;

    public get order(): string {
        return DataHelpers.descriptionOrder(this.data);
    }
}
