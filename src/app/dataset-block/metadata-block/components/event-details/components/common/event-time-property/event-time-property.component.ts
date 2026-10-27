/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ChangeDetectionStrategy, Component, Input } from "@angular/core";

import { EventTimeSourceDataFragment } from "@api/kamu.graphql.interface";

import { BasePropertyComponent } from "src/app/dataset-block/metadata-block/components/event-details/components/common/base-property/base-property.component";
import { hasTypename } from "src/app/dataset-block/metadata-block/components/event-details/components/common/base-property/base-property.helpers";

@Component({
    selector: "app-event-time-property",
    templateUrl: "./event-time-property.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventTimePropertyComponent extends BasePropertyComponent {
    @Input({ required: true }) public data: EventTimeSourceDataFragment;

    public static acceptsData(data: unknown): data is EventTimePropertyComponent["data"] {
        return hasTypename(
            data,
            "EventTimeSourceFromMetadata",
            "EventTimeSourceFromPath",
            "EventTimeSourceFromSystemTime",
        );
    }

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
