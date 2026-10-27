/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ChangeDetectionStrategy, Component, Input } from "@angular/core";

import { SourceCaching } from "@api/kamu.graphql.interface";

import { BasePropertyComponent } from "src/app/dataset-block/metadata-block/components/event-details/components/common/base-property/base-property.component";
import { hasTypename } from "src/app/dataset-block/metadata-block/components/event-details/components/common/base-property/base-property.helpers";

@Component({
    selector: "app-cache-property",
    templateUrl: "./cache-property.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CachePropertyComponent extends BasePropertyComponent {
    @Input({ required: true }) public data: SourceCaching;

    public static acceptsData(data: unknown): data is CachePropertyComponent["data"] {
        return hasTypename(data, "SourceCachingForever");
    }
}
