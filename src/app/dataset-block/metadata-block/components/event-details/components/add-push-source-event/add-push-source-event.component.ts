/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { NgFor, NgIf } from "@angular/common";
import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";

import { BaseDynamicEventComponent } from "src/app/dataset-block/metadata-block/components/event-details/components/base-dynamic-event/base-dynamic-event.component";
import { SECTION_BUILDERS_BY_EVENT_TYPE } from "src/app/dataset-block/metadata-block/components/event-details/dynamic-events/builders/event-section.builders";

import { BlockRowDataComponent } from "@common/components/block-row-data/block-row-data.component";
import { AddPushSource } from "@api/kamu.graphql.interface";

@Component({
    selector: "app-add-push-source-event",
    templateUrl: "../base-dynamic-event/base-dynamic-event.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
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
export class AddPushSourceEventComponent extends BaseDynamicEventComponent<AddPushSource> implements OnInit {
    public ngOnInit(): void {
        this.eventSections = SECTION_BUILDERS_BY_EVENT_TYPE.AddPushSource.buildEventSections(this.event);
    }
}
