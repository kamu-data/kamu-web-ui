import { extractSchemaFieldsFromData } from "./../../../../../../../common/table.helper";
import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { EnvVar } from "src/app/api/kamu.graphql.interface";
import { DataRow, DataSchemaField } from "src/app/interface/dataset.interface";
import { BasePropertyComponent } from "../base-property/base-property.component";

@Component({
    selector: "app-env-variables-property",
    templateUrl: "./env-variables-property.component.html",
    styleUrls: ["./env-variables-property.component.sass"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnvVariablesPropertyComponent extends BasePropertyComponent {
    @Input() public data: EnvVar[];

    public get tableSource(): DataRow[] {
        const result: DataRow[] = [];
        this.data.forEach(({ name, value }: EnvVar) =>
            result.push({ name, value: value ? value : "null" }),
        );
        return result;
    }

    public get schemaFields(): DataSchemaField[] {
        return extractSchemaFieldsFromData(this.tableSource[0]);
    }
}
