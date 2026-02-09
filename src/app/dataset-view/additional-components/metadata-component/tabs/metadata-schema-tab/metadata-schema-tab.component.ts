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
import { DataRow, DataSchemaField, DatasetSchema } from "src/app/interface/dataset.interface";
import { BlockRowDataComponent } from "src/app/common/components/block-row-data/block-row-data.component";
import { DynamicTableComponent } from "src/app/common/components/dynamic-table/dynamic-table.component";
import { MatIconModule } from "@angular/material/icon";
import { DatasetOverviewTabData } from "src/app/dataset-view/dataset-view.interface";
import { isNil, promiseWithCatch } from "src/app/common/helpers/app.helpers";
import { ModalService } from "src/app/common/components/modal/modal.service";
import { MarkdownModule } from "ngx-markdown";
import { MarkdownFormatPipe } from "src/app/common/pipes/markdown-format.pipe";
import * as YAML from "yaml";
import { SchemaViewMode } from "./metadata-schema-tab.component.types";
import { MatSlideToggleChange, MatSlideToggleModule } from "@angular/material/slide-toggle";
import { DynamicTableViewMode } from "src/app/common/components/dynamic-table/dynamic-table.interface";
import { prepareSchemaData } from "src/app/common/helpers/data.helpers";

@Component({
    selector: "app-metadata-schema-tab",
    standalone: true,
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
    public readonly DynamicTableViewMode: typeof DynamicTableViewMode = DynamicTableViewMode;

    public get schema(): MaybeNull<DatasetSchema> {
        return this.datasetMetadataTabData.overviewUpdate.schema;
    }

    public get canEditSchema(): boolean {
        return !isNil(this.schema) && this.datasetMetadataTabData.datasetPermissions.permissions.metadata.canCommit;
    }

    public inferTableSchema(schema: DataSchemaField[]): string[] {
        return schema.map((f: DataSchemaField) => f.name);
    }

    public schemaData(schema: DataSchemaField[]): DataRow[] {
        return prepareSchemaData(schema);
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
