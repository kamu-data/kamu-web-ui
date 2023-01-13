import { ChangeDetectionStrategy, Component } from "@angular/core";
import { extractSchemaFieldsFromData } from "src/app/common/table.helper";
import { DataRow, DataSchemaField } from "src/app/interface/dataset.interface";
import { BasePropertyComponent } from "../base-property/base-property.component";

@Component({
    selector: "app-schema-property",
    templateUrl: "./schema-property.component.html",
    styleUrls: ["./schema-property.component.sass"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SchemaPropertyComponent extends BasePropertyComponent {
    public get tableSource(): DataRow[] {
        return (this.data as string[]).map((item: string) => ({
            name: item.split(" ")[0],
            type: item.split(" ")[1],
        }));
    }

    public get schemaFields(): DataSchemaField[] {
        return extractSchemaFieldsFromData(this.tableSource[0]);
    }
}
