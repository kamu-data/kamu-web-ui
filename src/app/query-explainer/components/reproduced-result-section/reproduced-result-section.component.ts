import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { QueryExplainerDataFormat, QueryExplainerOutputType } from "../../query-explainer.types";
import { extractSchemaFieldsFromData } from "src/app/common/table.helper";
import { DataRow, DataSchemaField } from "src/app/interface/dataset.interface";

@Component({
    selector: "app-reproduced-result-section",
    templateUrl: "./reproduced-result-section.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReproducedResultSectionComponent {
    @Input({ required: true }) public output: QueryExplainerOutputType;
    @Input({ required: true }) public dataFormat: keyof typeof QueryExplainerDataFormat;

    public tableSource(output: QueryExplainerOutputType): DataRow[] {
        const columnNames: string[] = output.schema.fields.map((item) => item.name);
        return this.parseDataFromJsonAoSFormat(output.data, columnNames);
    }

    public schemaFields(output: QueryExplainerOutputType): DataSchemaField[] {
        return extractSchemaFieldsFromData(this.tableSource(output)[0]);
    }

    private parseDataFromJsonAoSFormat(data: object[], columnNames: string[]): DataRow[] {
        return data.map((dataItem: object) => {
            const arr = columnNames.map((value: string) => ({
                [value]: dataItem[value as keyof typeof dataItem],
            }));
            return arr.reduce((resultObj, obj) => Object.assign(resultObj, obj), {});
        });
    }
}
