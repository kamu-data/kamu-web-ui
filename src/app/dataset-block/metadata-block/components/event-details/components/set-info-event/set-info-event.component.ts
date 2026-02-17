/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { NgIf } from "@angular/common";
import { ChangeDetectionStrategy, Component, Input } from "@angular/core";

import { SetInfo } from "src/app/api/kamu.graphql.interface";
import { BaseComponent } from "src/app/common/components/base.component";

import { BlockRowDataComponent } from "../../../../../../common/components/block-row-data/block-row-data.component";
import { CardsPropertyComponent } from "../common/cards-property/cards-property.component";

@Component({
    selector: "app-set-info-event",
    templateUrl: "./set-info-event.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        //-----//
        NgIf,
        //-----//
        BlockRowDataComponent,
        CardsPropertyComponent,
    ],
})
export class SetInfoEventComponent extends BaseComponent {
    @Input({ required: true }) public event: SetInfo;
}
