/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { BasePropertyComponent } from "../base-property/base-property.component";

@Component({
    selector: "app-cards-property",
    templateUrl: "./cards-property.component.html",
    styleUrls: ["./cards-property.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardsPropertyComponent extends BasePropertyComponent {
    @Input({ required: true }) public data: string[];
}
