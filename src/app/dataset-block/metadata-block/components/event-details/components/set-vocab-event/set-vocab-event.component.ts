/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { SetVocab } from "src/app/api/kamu.graphql.interface";
import { BaseComponent } from "src/app/common/components/base.component";
import { CardsPropertyComponent } from "../common/cards-property/cards-property.component";
import { BlockRowDataComponent } from "../../../../../../common/components/block-row-data/block-row-data.component";
import { NgIf, NgFor, KeyValuePipe } from "@angular/common";

@Component({
    selector: "app-set-vocab-event",
    templateUrl: "./set-vocab-event.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        //-----//
        NgIf,
        NgFor,
        KeyValuePipe,
        //-----//
        BlockRowDataComponent,
        CardsPropertyComponent,
    ],
})
export class SetVocabEventComponent extends BaseComponent {
    @Input({ required: true }) public event: SetVocab;
    public viewDataMapper: Record<string, { label: string; tooltip: string }> = {
        offsetColumn: { label: "Offset column:", tooltip: "Name of the offset column." },
        operationTypeColumn: { label: "Operation type column:", tooltip: "Name of the operation type column." },
        systemTimeColumn: { label: "System time column:", tooltip: "Name of the system time column." },
        eventTimeColumn: { label: "Event time column:", tooltip: "Name of the event time column." },
    };
}
