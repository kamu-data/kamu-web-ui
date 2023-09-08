import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { extractSchemaFieldsFromData } from "src/app/common/table.helper";
import { DataRow, DataSchemaField } from "src/app/interface/dataset.interface";
import { BasePropertyComponent } from "../base-property/base-property.component";

@Component({
    selector: "app-schema-property",
    templateUrl: "./schema-property.component.html",
    styleUrls: ["./schema-property.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SchemaPropertyComponent extends BasePropertyComponent {
    @Input() public data: string[];

    public get tableSource(): DataRow[] {
        return this.data.map((item: string) => ({
            name: item.split(" ")[0],
            type: item.split(" ")[1],
        }));
    }

    public get schemaFields(): DataSchemaField[] {
        return extractSchemaFieldsFromData(this.tableSource[0]);
    }
}
