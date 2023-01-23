import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import {
    MetadataEvent,
    SqlQueryStep,
    TransformInput,
} from "src/app/api/kamu.graphql.interface";

@Component({
    selector: "app-yaml-event-viewer",
    templateUrl: "./yaml-event-viewer.component.html",
    styleUrls: ["./yaml-event-viewer.component.sass"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class YamlEventViewerComponent {
    @Input() public event: MetadataEvent;

    private kindMapper: Record<string, string> = {
        FetchStepUrl: "url",
        FetchStepContainer: "container",
        ReadStepCsv: "csv",
        MergeStrategyLedger: "ledger",
        TransformSql: "sql",
        ReadStepJsonLines: "jsonLines",
        Dataset: "dataset",
    };

    // Temporary solution, later data will come from server
    public get yamlEventText(): string {
        let result = "";
        let propertyName;
        const firstLevelShift = "\u00A0\u00A0";
        const secondLevelShift = "\u00A0\u00A0\u00A0\u00A0";
        Object.entries(this.event).forEach(([key, value]) => {
            key !== "__typename" && value ? (result += `${key}:\n`) : "";
            if (value && key !== "__typename") {
                if (key === "inputs") {
                    (value as TransformInput[]).map((item: TransformInput) => {
                        result += `${firstLevelShift}- kind: ${
                            this.kindMapper[item.dataset.__typename as string]
                        }\n`;
                        result += `${secondLevelShift}id: ${
                            item.dataset.id as string
                        }\n`;
                        result += `${secondLevelShift}type: ${
                            item.dataset.kind as string
                        }\n`;
                        result += `${secondLevelShift}name: ${
                            item.dataset.name as string
                        }\n`;
                        result += `${secondLevelShift}owner: ${item.dataset.owner.name}\n`;
                    });
                } else {
                    Object.entries(value as object).forEach(
                        ([property, data]) => {
                            if (data) {
                                property === "__typename"
                                    ? (propertyName = "kind")
                                    : (propertyName = property);

                                result += `${firstLevelShift}${propertyName}: ${this.getPropertyValue(
                                    data as string,
                                    property,
                                )}\n`;
                            }
                        },
                    );
                }
            }
        });
        return result;
    }

    private getPropertyValue(
        data: string | SqlQueryStep[],
        property: string,
    ): string {
        if (property === "__typename") {
            return this.kindMapper[data as string];
        } else if (property === "queries") {
            return (data as SqlQueryStep[])
                .map((item: SqlQueryStep) => `>\n${item.query}`)
                .join();
        } else {
            return data as string;
        }
    }
}
