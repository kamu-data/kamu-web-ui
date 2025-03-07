/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { MetadataBlockFragment } from "src/app/api/kamu.graphql.interface";
import { SupportedEvents } from "../event-details/supported.events";
import { eventsWithYamlView } from "./yaml-view-section.types";

@Component({
    selector: "app-yaml-view-section",
    templateUrl: "./yaml-view-section.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class YamlViewSectionComponent {
    @Input({ required: true }) public blockAsYaml: string;
    @Input({ required: true }) public block: MetadataBlockFragment;

    public get isEventWithYamlView(): boolean {
        return eventsWithYamlView.includes(this.block.event.__typename as SupportedEvents);
    }
}
