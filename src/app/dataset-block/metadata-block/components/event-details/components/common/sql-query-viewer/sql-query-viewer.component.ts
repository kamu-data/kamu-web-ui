/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { SqlQueryStep } from "../../../../../../../api/kamu.graphql.interface";
import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { BasePropertyComponent } from "../base-property/base-property.component";
import { HighlightModule } from "ngx-highlightjs";
import { NgFor, NgIf } from "@angular/common";

@Component({
    selector: "app-sql-query-viewer",
    templateUrl: "./sql-query-viewer.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        //-----//
        NgFor,
        NgIf,
        //-----//
        HighlightModule,
    ],
})
export class SqlQueryViewerComponent extends BasePropertyComponent {
    @Input({ required: true }) public data: SqlQueryStep[];
}
