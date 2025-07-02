/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { AddData } from "../../../../../../api/kamu.graphql.interface";
import { ChangeDetectionStrategy, Component, OnChanges, OnInit, SimpleChanges } from "@angular/core";
import { BaseDynamicEventComponent } from "../base-dynamic-event/base-dynamic-event.component";
import { SECTION_BUILDERS_BY_EVENT_TYPE } from "../../dynamic-events/builders/event-section.builders";
import { MatIconModule } from "@angular/material/icon";
import { BlockRowDataComponent } from "../../../../../../common/components/block-row-data/block-row-data.component";
import { NgFor, NgIf } from "@angular/common";

@Component({
    selector: "app-add-data-event",
    templateUrl: "../base-dynamic-event/base-dynamic-event.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        //-----//
        NgFor,
        NgIf,

        //-----//
        MatIconModule,

        //-----//
        BlockRowDataComponent,
    ],
})
export class AddDataEventComponent extends BaseDynamicEventComponent<AddData> implements OnChanges, OnInit {
    public ngOnChanges(changes: SimpleChanges): void {
        if (!changes.event.firstChange) {
            this.buildSections();
        }
    }

    public ngOnInit(): void {
        this.buildSections();
    }

    private buildSections(): void {
        this.eventSections = SECTION_BUILDERS_BY_EVENT_TYPE.AddData.buildEventSections(this.event);
    }
}
