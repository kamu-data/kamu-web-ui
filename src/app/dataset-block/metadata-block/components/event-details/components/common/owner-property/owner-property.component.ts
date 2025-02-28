/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { AccountBasicsFragment } from "../../../../../../../api/kamu.graphql.interface";
import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { BasePropertyComponent } from "../base-property/base-property.component";

@Component({
    selector: "app-owner-property",
    templateUrl: "./owner-property.component.html",
    styleUrls: ["./owner-property.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OwnerPropertyComponent extends BasePropertyComponent {
    @Input({ required: true }) public data: AccountBasicsFragment;
}
