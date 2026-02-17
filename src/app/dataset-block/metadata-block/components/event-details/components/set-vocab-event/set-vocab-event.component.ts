/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { KeyValuePipe, NgFor, NgIf } from "@angular/common";
import { ChangeDetectionStrategy, Component, Input } from "@angular/core";

import { SetVocab } from "@api/kamu.graphql.interface";
import { BaseComponent } from "@common/components/base.component";
import { BlockRowDataComponent } from "@common/components/block-row-data/block-row-data.component";
import { CardsPropertyComponent } from "src/app/dataset-block/metadata-block/components/event-details/components/common/cards-property/cards-property.component";

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
