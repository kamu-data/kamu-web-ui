/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { NgIf } from "@angular/common";
import { ChangeDetectionStrategy, Component, Input } from "@angular/core";

import { BasePropertyComponent } from "src/app/dataset-block/metadata-block/components/event-details/components/common/base-property/base-property.component";

import { EventTimeSource } from "@api/kamu.graphql.interface";

@Component({
    selector: "app-event-time-property",
    templateUrl: "./event-time-property.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [NgIf],
})
export class EventTimePropertyComponent extends BasePropertyComponent {
    @Input({ required: true }) public data: EventTimeSource;

    public get isFromMetadata(): boolean {
        return this.data.__typename === "EventTimeSourceFromMetadata";
    }

    public get isFromPath(): boolean {
        return this.data.__typename === "EventTimeSourceFromPath";
    }

    public get isFromSystemTime(): boolean {
        return this.data.__typename === "EventTimeSourceFromSystemTime";
    }
}
