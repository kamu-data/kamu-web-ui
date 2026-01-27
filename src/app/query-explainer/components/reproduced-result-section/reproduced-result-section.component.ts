/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { QueryExplainerOutputType } from "../../query-explainer.types";
import { extractSchemaFieldsFromData } from "src/app/common/helpers/table.helper";
import { DataRow, DataSchemaField } from "src/app/interface/dataset.interface";
import { parseDataFromJsonAoSFormat } from "src/app/common/helpers/data.helpers";
import { DynamicTableComponent } from "../../../common/components/dynamic-table/dynamic-table.component";
import { NgIf } from "@angular/common";

@Component({
    selector: "app-reproduced-result-section",
    templateUrl: "./reproduced-result-section.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        //-----//
        NgIf,
        //-----//
        DynamicTableComponent,
    ]
})
export class ReproducedResultSectionComponent {
    @Input({ required: true }) public dataJsonAoS: QueryExplainerOutputType;

    public tableSource(output: QueryExplainerOutputType): DataRow[] {
        const columnNames: string[] = output.schema.fields.map((item) => item.name);
        return parseDataFromJsonAoSFormat(output.data, columnNames);
    }

    public schemaFields(output: QueryExplainerOutputType): DataSchemaField[] {
        return extractSchemaFieldsFromData(this.tableSource(output)[0] ?? []);
    }
}
