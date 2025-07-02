/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { BaseComponent } from "src/app/common/components/base.component";
import { SetLicense } from "../../../../../../api/kamu.graphql.interface";
import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { LinkPropertyComponent } from "../common/link-property/link-property.component";
import { BlockRowDataComponent } from "../../../../../../common/components/block-row-data/block-row-data.component";
import { NgIf } from "@angular/common";

@Component({
    selector: "app-set-license-event",
    templateUrl: "./set-license-event.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        //-----//
        NgIf,

        //-----//
        BlockRowDataComponent,
        LinkPropertyComponent,
    ],
})
export class SetLicenseEventComponent extends BaseComponent {
    @Input({ required: true }) public event: SetLicense;
}
