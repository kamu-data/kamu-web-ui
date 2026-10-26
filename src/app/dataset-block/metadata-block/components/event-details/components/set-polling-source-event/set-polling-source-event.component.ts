/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { NgComponentOutlet } from "@angular/common";
import { ChangeDetectionStrategy, Component } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";

import { BlockRowDataComponent } from "@common/components/block-row-data/block-row-data.component";
import { SetPollingSourceEventFragment } from "@api/kamu.graphql.interface";

import { BaseDynamicEventComponent } from "src/app/dataset-block/metadata-block/components/event-details/components/base-dynamic-event/base-dynamic-event.component";
import { SECTION_BUILDERS_BY_EVENT_TYPE } from "src/app/dataset-block/metadata-block/components/event-details/dynamic-events/builders/event-section.builders";

@Component({
    selector: "app-set-polling-source-event",
    templateUrl: "../base-dynamic-event/base-dynamic-event.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        //-----//
        NgComponentOutlet,
        //-----//
        MatIconModule,
        //-----//
        BlockRowDataComponent,
    ],
})
export class SetPollingSourceEventComponent extends BaseDynamicEventComponent<SetPollingSourceEventFragment> {
    protected readonly sectionBuilder = SECTION_BUILDERS_BY_EVENT_TYPE.SetPollingSource;
}
