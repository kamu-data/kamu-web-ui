/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ChangeDetectionStrategy, Component, Input } from "@angular/core";

import { Highlight } from "ngx-highlightjs";

import { SqlQueryStepDataFragment } from "@api/kamu.graphql.interface";

import { BasePropertyComponent } from "src/app/dataset-block/metadata-block/components/event-details/components/common/base-property/base-property.component";
import { isListOfTypename } from "src/app/dataset-block/metadata-block/components/event-details/components/common/base-property/base-property.helpers";

@Component({
    selector: "app-sql-query-viewer",
    templateUrl: "./sql-query-viewer.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        //-----//
        Highlight,
    ],
})
export class SqlQueryViewerComponent extends BasePropertyComponent {
    @Input({ required: true }) public data: SqlQueryStepDataFragment[];

    public static acceptsData(data: unknown): data is SqlQueryViewerComponent["data"] {
        return isListOfTypename(data, "SqlQueryStep");
    }
}
