/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { extractSchemaFieldsFromData } from "../../../../../../../common/helpers/table.helper";
import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { EnvVar } from "src/app/api/kamu.graphql.interface";
import { DataRow, DataSchemaField, OperationColumnClassEnum } from "src/app/interface/dataset.interface";
import { BasePropertyComponent } from "../base-property/base-property.component";

@Component({
    selector: "app-env-variables-property",
    templateUrl: "./env-variables-property.component.html",
    styleUrls: ["./env-variables-property.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnvVariablesPropertyComponent extends BasePropertyComponent {
    @Input({ required: true }) public data: EnvVar[];

    public get tableSource(): DataRow[] {
        const result: DataRow[] = [];
        this.data.forEach(({ name, value }: EnvVar) =>
            result.push({
                name: {
                    value: name,
                    cssClass: OperationColumnClassEnum.PRIMARY_COLOR,
                },
                value: {
                    value: value ? value : "null",
                    cssClass: OperationColumnClassEnum.PRIMARY_COLOR,
                },
            }),
        );
        return result;
    }

    public get schemaFields(): DataSchemaField[] {
        return extractSchemaFieldsFromData(this.tableSource[0]);
    }
}
