/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { NgIf } from "@angular/common";
import { ChangeDetectionStrategy, Component, Input } from "@angular/core";

import { DynamicTableComponent } from "@common/components/dynamic-table/dynamic-table.component";
import {
    DynamicTableColumnDescriptor,
    DynamicTableDataRow,
} from "@common/components/dynamic-table/dynamic-table.interface";
import { extractSchemaFieldsFromData } from "@common/helpers/data-schema.helpers";
import { parseDataFromJsonAoSFormat } from "@common/helpers/data.helpers";
import { DataSchemaField } from "@interface/dataset-schema.interface";

import { QueryExplainerOutputType } from "src/app/query-explainer/query-explainer.types";

@Component({
    selector: "app-reproduced-result-section",
    templateUrl: "./reproduced-result-section.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        //-----//
        NgIf,
        //-----//
        DynamicTableComponent,
    ],
})
export class ReproducedResultSectionComponent {
    @Input({ required: true }) public dataJsonAoS: QueryExplainerOutputType;

    public tableSource(output: QueryExplainerOutputType): DynamicTableDataRow[] {
        const columnNames: string[] = output.schema.fields.map((item) => item.name);
        return parseDataFromJsonAoSFormat(output.data, columnNames);
    }

    public schemaFields(output: QueryExplainerOutputType): DataSchemaField[] {
        return extractSchemaFieldsFromData(this.tableSource(output)[0] ?? []);
    }

    public inferTableSchema(schema: DataSchemaField[]): DynamicTableColumnDescriptor[] {
        return schema.map((f: DataSchemaField) => ({ columnName: f.name }));
    }
}
