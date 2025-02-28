/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { SetPollingSource } from "src/app/api/kamu.graphql.interface";
import { BaseDynamicEventComponent } from "../base-dynamic-event/base-dynamic-event.component";
import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { SECTION_BUILDERS_BY_EVENT_TYPE } from "../../dynamic-events/builders/event-section.builders";

@Component({
    selector: "app-set-polling-source-event",
    templateUrl: "../base-dynamic-event/base-dynamic-event.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SetPollingSourceEventComponent extends BaseDynamicEventComponent<SetPollingSource> implements OnInit {
    public ngOnInit(): void {
        this.eventSections = SECTION_BUILDERS_BY_EVENT_TYPE.SetPollingSource.buildEventSections(this.event);
    }
}
