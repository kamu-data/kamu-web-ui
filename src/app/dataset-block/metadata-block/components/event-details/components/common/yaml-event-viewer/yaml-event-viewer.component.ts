import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import {
    InputSlice,
    OffsetInterval,
    SqlQueryStep,
    TransformInput,
} from "src/app/api/kamu.graphql.interface";

@Component({
    selector: "app-yaml-event-viewer",
    templateUrl: "./yaml-event-viewer.component.html",
    styleUrls: ["./yaml-event-viewer.component.sass"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class YamlEventViewerComponent<TEvent extends object> {
    @Input() public event: TEvent;
    private firstLevelShift = "\u00A0\u00A0";
    private secondLevelShift = "\u00A0\u00A0\u00A0\u00A0";
    private thirdLevelShift = this.firstLevelShift + this.secondLevelShift;

    private kindMapper: Record<string, string> = {
        FetchStepUrl: "url",
        FetchStepContainer: "container",
        ReadStepCsv: "csv",
        MergeStrategyLedger: "ledger",
        TransformSql: "sql",
        ReadStepJsonLines: "jsonLines",
        Dataset: "dataset",
        DataSlice: "dataSlice",
        Checkpoint: "checkpoint",
        InputSlice: "inputSlice",
    };

    // Temporary solution, later data will come from server
    public get yamlEventText(): string {
        let result = "";
        let propertyName;
        Object.entries(this.event).forEach(([key, value]) => {
            if (value && key !== "__typename") {
                if (typeof value !== "object") {
                    result += `${key}: ${value as string}\n`;
                } else {
                    result += `${key}:\n`;
                }
                if (key === "inputs") {
                    (value as TransformInput[]).map((item: TransformInput) => {
                        result += `${this.firstLevelShift}- kind: ${
                            this.kindMapper[item.dataset.__typename as string]
                        }\n`;
                        result += `${this.secondLevelShift}id: ${
                            item.dataset.id as string
                        }\n`;
                        result += `${this.secondLevelShift}type: ${
                            item.dataset.kind as string
                        }\n`;
                        result += `${this.secondLevelShift}name: ${
                            item.dataset.name as string
                        }\n`;
                        result += `${this.secondLevelShift}owner: ${item.dataset.owner.name}\n`;
                    });
                } else if (key === "inputSlices") {
                    (value as InputSlice[]).map((item: InputSlice) => {
                        result += `${this.firstLevelShift}- kind: ${
                            this.kindMapper[item.__typename as string]
                        }\n`;
                        result += `${this.secondLevelShift}datasetId: ${
                            item.datasetId as string
                        }\n`;
                        result += `${this.secondLevelShift}blockInterval:\n${
                            this.thirdLevelShift
                        }start: ${item.blockInterval?.start as string}\n${
                            this.thirdLevelShift
                        }end: ${item.blockInterval?.end as string}\n`;
                        if (item.dataInterval)
                            result += `${this.secondLevelShift}dataInterval:\n${this.thirdLevelShift}start: ${item.dataInterval.start}\n${this.thirdLevelShift}end: ${item.dataInterval.end}\n`;
                    });
                } else if (typeof value !== "object") {
                    result += "";
                } else {
                    Object.entries(value as object).forEach(
                        ([property, data]) => {
                            if (data) {
                                property === "__typename"
                                    ? (propertyName = "kind")
                                    : (propertyName = property);
                                result += `${
                                    this.firstLevelShift
                                }${propertyName}: ${this.getPropertyValue(
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
        data: string | SqlQueryStep[] | OffsetInterval,
        property: string,
    ): string {
        if (property === "__typename") {
            return this.kindMapper[data as string];
        } else if (property === "queries") {
            return (data as SqlQueryStep[])
                .map((item: SqlQueryStep) => `>\n${item.query}`)
                .join();
        } else if (property === "interval") {
            return `\n${this.firstLevelShift}${this.firstLevelShift}start: ${
                (data as OffsetInterval).start
            }\n${this.firstLevelShift}${this.firstLevelShift}end: ${
                (data as OffsetInterval).end
            }`;
        } else {
            return data as string;
        }
    }
}
