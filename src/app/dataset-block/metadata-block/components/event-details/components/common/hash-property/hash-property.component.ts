/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { BasePropertyComponent } from "src/app/dataset-block/metadata-block/components/event-details/components/common/base-property/base-property.component";
import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { DisplayHashComponent } from "../../../../../../../common/components/display-hash/display-hash.component";
import { NgIf } from "@angular/common";

@Component({
    selector: "app-hash-property",
    templateUrl: "./hash-property.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        //-----//
        NgIf,

        //-----//
        DisplayHashComponent,
    ],
})
export class HashPropertyComponent extends BasePropertyComponent {
    @Input({ required: true }) public data: string;
}
