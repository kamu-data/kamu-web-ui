import { DataHelpers } from "src/app/common/data.helpers";
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Input,
} from "@angular/core";
import {
    AttachmentEmbedded,
    AttachmentsEmbedded,
    SqlQueryStep,
    TemporalTable,
    TransformInput,
} from "src/app/api/kamu.graphql.interface";

@Component({
    selector: "app-yaml-event-viewer",
    templateUrl: "./yaml-event-viewer.component.html",
    styleUrls: ["./yaml-event-viewer.component.sass"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class YamlEventViewerComponent<TEvent extends object> {
    constructor(private cdr: ChangeDetectorRef) {}
    @Input() public event: TEvent;
    private readonly FIRST_LEVEL_SHIFT = "\u00A0\u00A0";
    private readonly SECOND_LEVEL_SHIFT = "\u00A0\u00A0\u00A0\u00A0";
    private kindMapper: Record<string, string> = {
        FetchStepUrl: "url",
        FetchStepContainer: "container",
        ReadStepCsv: "csv",
        MergeStrategyLedger: "ledger",
        TransformSql: "sql",
        ReadStepJsonLines: "jsonLines",
        Dataset: "dataset",
        AttachmentsEmbedded: "attachmentsEmbedded",
        AttachmentEmbedded: "embedded",
    };

    // Temporary solution, later data will come from server
    public get yamlEventText(): string {
        let result = "";
        let propertyName: string;
        Object.entries(this.event).forEach(([key, value]) => {
            if (value && key !== "__typename" && typeof value === "object") {
                result += `${key}:\n`;
                if (key === "inputs") {
                    (value as TransformInput[]).map((item: TransformInput) => {
                        result += `${this.FIRST_LEVEL_SHIFT}- kind: ${
                            this.kindMapper[item.dataset.__typename as string]
                        }\n`;
                        result += `${this.SECOND_LEVEL_SHIFT}id: ${
                            item.dataset.id as string
                        }\n`;
                        result += `${this.SECOND_LEVEL_SHIFT}type: ${
                            item.dataset.kind as string
                        }\n`;
                        result += `${this.SECOND_LEVEL_SHIFT}name: ${
                            item.dataset.name as string
                        }\n`;
                        result += `${this.SECOND_LEVEL_SHIFT}owner: ${item.dataset.owner.name}\n`;
                    });
                } else if (key === "attachments") {
                    (value as AttachmentsEmbedded).items.map(
                        (item: AttachmentEmbedded) => {
                            result += `${this.FIRST_LEVEL_SHIFT}kind: ${
                                this.kindMapper[item.__typename as string]
                            }\n`;
                            result += `${this.SECOND_LEVEL_SHIFT}- path: ${item.path}\n`;
                            result += `${
                                this.SECOND_LEVEL_SHIFT
                            }content: ${this.escapeText(item.content)}\n`;
                        },
                    );
                } else {
                    Object.entries(value as object).forEach(
                        ([property, data]) => {
                            if (property === "temporalTables" && data) {
                                result += `${this.FIRST_LEVEL_SHIFT}${property}:\n`;
                                (data as TemporalTable[]).map(
                                    (item: TemporalTable) => {
                                        result += `${this.FIRST_LEVEL_SHIFT}${this.SECOND_LEVEL_SHIFT}- name: ${item.name}\n`;
                                        result += `${this.FIRST_LEVEL_SHIFT}${this.SECOND_LEVEL_SHIFT}  primaryKey:\n`;
                                        item.primaryKey.map(
                                            (field: string) =>
                                                (result += `${this.SECOND_LEVEL_SHIFT}${this.SECOND_LEVEL_SHIFT}${this.SECOND_LEVEL_SHIFT}- ${field}\n`),
                                        );
                                    },
                                );
                            } else {
                                if (data && !Array.isArray(value)) {
                                    property === "__typename"
                                        ? (propertyName = "kind")
                                        : (propertyName = property);

                                    result += `${
                                        this.FIRST_LEVEL_SHIFT
                                    }${propertyName}: ${this.getPropertyValue(
                                        data as string,
                                        property,
                                    )}\n`;
                                } else if (data) {
                                    result += `${this.FIRST_LEVEL_SHIFT}- ${
                                        data as string
                                    }\n`;
                                }
                            }
                        },
                    );
                }
            } else {
                if (key !== "__typename" && value) {
                    result += `${key}: ${value as string}\n`;
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

    private escapeText(text: string): string {
        return DataHelpers.escapeText(text);
    }
}
