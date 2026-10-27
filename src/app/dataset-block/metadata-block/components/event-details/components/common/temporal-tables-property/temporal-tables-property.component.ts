/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ChangeDetectionStrategy, Component, Input } from "@angular/core";

import { TemporalTableDataFragment } from "@api/kamu.graphql.interface";

import { BasePropertyComponent } from "src/app/dataset-block/metadata-block/components/event-details/components/common/base-property/base-property.component";
import { isListOfTypename } from "src/app/dataset-block/metadata-block/components/event-details/components/common/base-property/base-property.helpers";
import { CardsPropertyComponent } from "src/app/dataset-block/metadata-block/components/event-details/components/common/cards-property/cards-property.component";

@Component({
    selector: "app-temporal-tables-property",
    templateUrl: "./temporal-tables-property.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        //-----//
        CardsPropertyComponent,
    ],
})
export class TemporalTablesPropertyComponent extends BasePropertyComponent {
    @Input({ required: true }) public data: TemporalTableDataFragment[];

    public static acceptsData(data: unknown): data is TemporalTablesPropertyComponent["data"] {
        return isListOfTypename(data, "TemporalTable");
    }
}
