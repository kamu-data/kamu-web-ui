/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { AccountBasicsFragment } from "../../../../../../../api/kamu.graphql.interface";
import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { BasePropertyComponent } from "../base-property/base-property.component";
import { RouterLink } from "@angular/router";

@Component({
    selector: "app-owner-property",
    templateUrl: "./owner-property.component.html",
    styleUrls: ["./owner-property.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [RouterLink],
})
export class OwnerPropertyComponent extends BasePropertyComponent {
    @Input({ required: true }) public data: AccountBasicsFragment;
}
