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
        switch (this.dataFormat) {
            case "JsonAoS": {
                return this.parseDataFromJsonAoSFormat(output.data, columnNames);
            }
            case "JsonAoA": {
                return this.parseDataFromJsonAoAFormat(output.data, columnNames);
            }
            case "JsonSoA": {
                return this.parseDataFromJsonSoAFormat(output.data, columnNames);
            }
            /* istanbul ignore next */
            default:
                throw new Error("Unable to parse date");
        }
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

    private parseDataFromJsonAoAFormat(data: object[], columnNames: string[]): DataRow[] {
        return data.map((dataItem) => {
            const arr = columnNames.map((value: string, index: number) => ({
                [value]: (dataItem as string[])[index as keyof typeof dataItem][index],
            }));
            return arr.reduce((resultObj, obj) => Object.assign(resultObj, obj), {});
        }) as DataRow[];
    }

    private parseDataFromJsonSoAFormat(data: object[], columnNames: string[]): DataRow[] {
        const values = Object.values(data) as [string[]];
        const result = values[0].map((_, index: number) => {
            const arr = columnNames.map((value: string) => {
                const findDataIndex = Object.keys(data).findIndex((x) => x === value);
                return {
                    [value]: values[findDataIndex][index],
                };
            });
            return arr.reduce((resultObj, obj) => Object.assign(resultObj, obj), {});
        }) as DataRow[];
        return result;
    }
}
