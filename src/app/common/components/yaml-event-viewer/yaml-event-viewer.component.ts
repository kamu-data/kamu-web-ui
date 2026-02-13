/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { BasePropertyComponent } from "../../../dataset-block/metadata-block/components/event-details/components/common/base-property/base-property.component";
import { Highlight } from "ngx-highlightjs";

@Component({
    selector: "app-yaml-event-viewer",
    templateUrl: "./yaml-event-viewer.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [Highlight],
})
export class YamlEventViewerComponent extends BasePropertyComponent {
    @Input({ required: true }) public data: string;
}
