/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { AddPushSource } from "src/app/api/kamu.graphql.interface";
import { BaseDynamicEventComponent } from "../base-dynamic-event/base-dynamic-event.component";
import { SECTION_BUILDERS_BY_EVENT_TYPE } from "../../dynamic-events/builders/event-section.builders";
import { MatIconModule } from "@angular/material/icon";
import { BlockRowDataComponent } from "../../../../../../common/components/block-row-data/block-row-data.component";
import { NgFor, NgIf } from "@angular/common";

@Component({
    selector: "app-add-push-source-event",
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
export class AddPushSourceEventComponent extends BaseDynamicEventComponent<AddPushSource> implements OnInit {
    public ngOnInit(): void {
        this.eventSections = SECTION_BUILDERS_BY_EVENT_TYPE.AddPushSource.buildEventSections(this.event);
    }
}
