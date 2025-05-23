/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { BasePropertyComponent } from "src/app/dataset-block/metadata-block/components/event-details/components/common/base-property/base-property.component";
import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { TemporalTable } from "src/app/api/kamu.graphql.interface";

@Component({
    selector: "app-temporal-tables-property",
    templateUrl: "./temporal-tables-property.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TemporalTablesPropertyComponent extends BasePropertyComponent {
    @Input({ required: true }) public data: TemporalTable[];
}
