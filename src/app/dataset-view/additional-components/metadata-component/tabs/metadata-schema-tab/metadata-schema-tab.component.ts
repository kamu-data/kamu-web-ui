/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { NgIf } from "@angular/common";
import { ChangeDetectionStrategy, Component, inject, Input } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { MatSlideToggleChange, MatSlideToggleModule } from "@angular/material/slide-toggle";

import { MarkdownModule } from "ngx-markdown";
import * as YAML from "yaml";

import { BlockRowDataComponent } from "@common/components/block-row-data/block-row-data.component";
import { DynamicTableComponent } from "@common/components/dynamic-table/dynamic-table.component";
import { DynamicTableDataRow } from "@common/components/dynamic-table/dynamic-table.interface";
import { ModalService } from "@common/components/modal/modal.service";
import { isNil, promiseWithCatch } from "@common/helpers/app.helpers";
import { schemaAsDataRows } from "@common/helpers/data-schema.helpers";
import { MarkdownFormatPipe } from "@common/pipes/markdown-format.pipe";
import RoutingResolvers from "@common/resolvers/routing-resolvers";
import { MaybeNull } from "@interface/app.types";
import { DataSchemaField, DatasetSchema } from "@interface/dataset-schema.interface";

import { SchemaViewMode } from "src/app/dataset-view/additional-components/metadata-component/tabs/metadata-schema-tab/metadata-schema-tab.component.types";
import { DatasetOverviewTabData } from "src/app/dataset-view/dataset-view.interface";

@Component({
    selector: "app-metadata-schema-tab",
    imports: [
        //-----//
        NgIf,
        //-----//
        MatIconModule,
        MatSlideToggleModule,
        MarkdownModule,

        //-----//
        BlockRowDataComponent,
        DynamicTableComponent,
        MarkdownFormatPipe,
    ],
    templateUrl: "./metadata-schema-tab.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
    styleUrls: ["./metadata-schema-tab.component.scss"],
})
export class MetadataSchemaTabComponent {
    @Input(RoutingResolvers.METADATA_SCHEMA_TAB_KEY) public datasetMetadataTabData: DatasetOverviewTabData;

    private modalService = inject(ModalService);

    public viewMode: SchemaViewMode = SchemaViewMode.TABLE;
    public readonly SchemaViewMode: typeof SchemaViewMode = SchemaViewMode;

    public get schema(): MaybeNull<DatasetSchema> {
        return this.datasetMetadataTabData.overviewUpdate.schema;
    }

    public get canEditSchema(): boolean {
        return !isNil(this.schema) && this.datasetMetadataTabData.datasetPermissions.permissions.metadata.canCommit;
    }

    public inferTableSchema(schema: DataSchemaField[]): string[] {
        return schema.map((f: DataSchemaField) => f.name);
    }

    public schemaData(schema: DataSchemaField[]): DynamicTableDataRow[] {
        return schemaAsDataRows(schema);
    }

    public convertToYaml(fields: DataSchemaField[]): string {
        return YAML.stringify(fields);
    }

    public toggleYamlView(event: MatSlideToggleChange): void {
        this.viewMode = event.checked ? SchemaViewMode.YAML : SchemaViewMode.TABLE;
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
