/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { NgIf } from "@angular/common";
import RoutingResolvers from "src/app/common/resolvers/routing-resolvers";
import { MaybeNull } from "src/app/interface/app.types";
import { DatasetSchema } from "src/app/interface/dataset.interface";
import { BlockRowDataComponent } from "src/app/common/components/block-row-data/block-row-data.component";
import { DynamicTableComponent } from "src/app/common/components/dynamic-table/dynamic-table.component";

@Component({
    selector: "app-metadata-schema-tab",
    standalone: true,
    imports: [
        //-----//
        NgIf,

        //-----//
        BlockRowDataComponent,
        DynamicTableComponent,
    ],
    templateUrl: "./metadata-schema-tab.component.html",
    styleUrls: ["./metadata-schema-tab.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MetadataSchemaTabComponent {
    @Input(RoutingResolvers.METADATA_SCHEMA_TAB_KEY) public schema: MaybeNull<DatasetSchema>;
}
