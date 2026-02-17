/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ChangeDetectionStrategy, Component, Input } from "@angular/core";

import { MqttTopicSubscription } from "@api/kamu.graphql.interface";
import { DynamicTableComponent } from "@common/components/dynamic-table/dynamic-table.component";
import {
    DynamicTableColumnClassEnum,
    DynamicTableColumnDescriptor,
    DynamicTableDataRow,
} from "@common/components/dynamic-table/dynamic-table.interface";
import { extractSchemaFieldsFromData } from "@common/helpers/data-schema.helpers";
import { BasePropertyComponent } from "src/app/dataset-block/metadata-block/components/event-details/components/common/base-property/base-property.component";
import { DataSchemaField } from "src/app/interface/dataset-schema.interface";

@Component({
    selector: "app-topics-property",
    templateUrl: "./topics-property.component.html",
    styleUrls: ["./topics-property.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [DynamicTableComponent],
})
export class TopicsPropertyComponent extends BasePropertyComponent {
    @Input({ required: true }) public data: MqttTopicSubscription[];

    public get tableSource(): DynamicTableDataRow[] {
        const result: DynamicTableDataRow[] = [];
        this.data.forEach(({ path, qos }: MqttTopicSubscription) =>
            result.push({
                path: {
                    value: path,
                    cssClass: DynamicTableColumnClassEnum.PRIMARY_COLOR,
                },
                qos: {
                    value: (qos as string) ?? "",
                    cssClass: DynamicTableColumnClassEnum.PRIMARY_COLOR,
                },
            }),
        );
        return result;
    }

    public get schemaFields(): DataSchemaField[] {
        return extractSchemaFieldsFromData(this.tableSource[0]);
    }

    public inferTableSchema(schema: DataSchemaField[]): DynamicTableColumnDescriptor[] {
        return schema.map((f: DataSchemaField) => ({ columnName: f.name }));
    }
}
