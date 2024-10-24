import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { QueryExplainerOutputType, QueryExplainerSchemaType } from "../../query-explainer.types";
import { extractSchemaFieldsFromData } from "src/app/common/table.helper";
import { DataRow, DataSchemaField } from "src/app/interface/dataset.interface";

@Component({
    selector: "app-reproduced-result-section",
    templateUrl: "./reproduced-result-section.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReproducedResultSectionComponent {
    @Input({ required: true }) public output: QueryExplainerOutputType;

    public tableSource(output: QueryExplainerOutputType): DataRow[] {
        const result = output.data.map((dataItem) => {
            const arr = dataItem.map((value, index) => ({ [this.columnNames(output.schema)[index]]: value }));
            return arr.reduce((resultObj, obj) => Object.assign(resultObj, obj), {});
        }) as DataRow[];
        return result;
    }

    private columnNames(schema: QueryExplainerSchemaType): string[] {
        return schema.fields.map((item) => item.name);
    }

    public schemaFields(output: QueryExplainerOutputType): DataSchemaField[] {
        return extractSchemaFieldsFromData(this.tableSource(output)[0]);
    }
}
