/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ChangeDetectionStrategy, Component, inject, Input } from "@angular/core";
import { NgIf } from "@angular/common";
import RoutingResolvers from "src/app/common/resolvers/routing-resolvers";
import { MaybeNull } from "src/app/interface/app.types";
import { DatasetSchema } from "src/app/interface/dataset.interface";
import { BlockRowDataComponent } from "src/app/common/components/block-row-data/block-row-data.component";
import { DynamicTableComponent } from "src/app/common/components/dynamic-table/dynamic-table.component";
import { MatIconModule } from "@angular/material/icon";
import { DatasetOverviewTabData } from "src/app/dataset-view/dataset-view.interface";
import { isNil, promiseWithCatch } from "src/app/common/helpers/app.helpers";
import { ModalService } from "src/app/common/components/modal/modal.service";

@Component({
    selector: "app-metadata-schema-tab",
    standalone: true,
    imports: [
        //-----//
        NgIf,

        //-----//
        MatIconModule,

        //-----//
        BlockRowDataComponent,
        DynamicTableComponent,
    ],
    templateUrl: "./metadata-schema-tab.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
    styleUrls: ["./metadata-schema-tab.component.scss"],
})
export class MetadataSchemaTabComponent {
    @Input(RoutingResolvers.METADATA_SCHEMA_TAB_KEY) public datasetMetadataTabData: DatasetOverviewTabData;

    private modalService = inject(ModalService);

    public get schema(): MaybeNull<DatasetSchema> {
        return this.datasetMetadataTabData.overviewUpdate.schema;
    }

    public get canEditSchema(): boolean {
        return !isNil(this.schema) && this.datasetMetadataTabData.datasetPermissions.permissions.metadata.canCommit;
    }

    /* istanbul ignore next */
    public onEditSchema(): void {
        promiseWithCatch(
            this.modalService.warning({
                message: "Feature coming soon",
                yesButtonText: "Ok",
            }),
        );
    }
}
