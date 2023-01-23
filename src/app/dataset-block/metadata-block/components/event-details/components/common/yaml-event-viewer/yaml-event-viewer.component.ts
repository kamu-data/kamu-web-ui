import { map } from "rxjs/operators";
/* eslint-disable @typescript-eslint/restrict-template-expressions */
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
        Object.entries(this.event).forEach(([key, value]) => {
            key !== "__typename" && value ? (result += `${key}:\n`) : "";
            if (value && key !== "__typename") {
                if (key === "inputs") {
                    (value as TransformInput[]).map((item: TransformInput) => {
                        result += `\u00A0\u00A0- kind: ${
                            this.kindMapper[item.dataset.__typename as string]
                        }\n`;
                        result += `\u00A0\u00A0\u00A0\u00A0id: ${item.dataset.id}\n`;
                        result += `\u00A0\u00A0\u00A0\u00A0type: ${item.dataset.kind}\n`;
                        result += `\u00A0\u00A0\u00A0\u00A0name: ${item.dataset.name}\n`;
                        result += `\u00A0\u00A0\u00A0\u00A0owner: ${item.dataset.owner.name}\n`;
                    });
                } else {
                    Object.entries(value as object).forEach(
                        ([property, data]) => {
                            if (data) {
                                result += `\u00A0\u00A0${
                                    property === "__typename"
                                        ? "kind"
                                        : property
                                }: ${
                                    property === "__typename"
                                        ? this.kindMapper[data as string]
                                        : property === "queries"
                                        ? (data as SqlQueryStep[]).map(
                                              (item) => `>\n${item.query}`,
                                          )
                                        : (data as string)
                                }\n`;
                            }
                        },
                    );
                }
            }
        });
        return result;
    }
}
