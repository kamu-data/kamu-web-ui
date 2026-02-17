/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { NgFor, NgIf } from "@angular/common";
import { ChangeDetectionStrategy, Component, Input } from "@angular/core";

import { Highlight } from "ngx-highlightjs";
import { BasePropertyComponent } from "src/app/dataset-block/metadata-block/components/event-details/components/common/base-property/base-property.component";

import { SqlQueryStep } from "@api/kamu.graphql.interface";

@Component({
    selector: "app-sql-query-viewer",
    templateUrl: "./sql-query-viewer.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        //-----//
        NgFor,
        NgIf,
        //-----//
        Highlight,
    ],
})
export class SqlQueryViewerComponent extends BasePropertyComponent {
    @Input({ required: true }) public data: SqlQueryStep[];
}
