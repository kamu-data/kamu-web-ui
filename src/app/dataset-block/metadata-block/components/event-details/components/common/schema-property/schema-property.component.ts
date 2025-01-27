import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { extractSchemaFieldsFromData } from "src/app/common/helpers/table.helper";
import { DataRow, DataSchemaField, OperationColumnClassEnum } from "src/app/interface/dataset.interface";
import { BasePropertyComponent } from "../base-property/base-property.component";

@Component({
    selector: "app-schema-property",
    templateUrl: "./schema-property.component.html",
    styleUrls: ["./schema-property.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SchemaPropertyComponent extends BasePropertyComponent {
    @Input({ required: true }) public data: string[];

    public get tableSource(): DataRow[] {
        return this.data.map((item: string) => ({
            name: {
                value: item.split(" ")[0],
                cssClass: OperationColumnClassEnum.PRIMARY_COLOR,
            },
            type: {
                value: item.split(" ")[1],
                cssClass: OperationColumnClassEnum.PRIMARY_COLOR,
            },
        }));
    }

    public get schemaFields(): DataSchemaField[] {
        return extractSchemaFieldsFromData(this.tableSource[0]);
    }
}
