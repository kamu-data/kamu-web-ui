import { Injectable } from "@angular/core";
import { DatasetFlowByIdResponse, GrafanaFieldDescriptor } from "./dataset-flow-details.types";
import moment from "moment";
import { FlowEventTaskChanged } from "src/app/api/kamu.graphql.interface";

@Injectable({
    providedIn: "root",
})
export class GrafanaLogsService {
    private availableFields: GrafanaFieldDescriptor[] = [];

    public buildTaskUrl(initialUrl: string, flowDetails: DatasetFlowByIdResponse): string {
        this.addTaskFields(flowDetails);
        return this.proccessUrl(initialUrl);
    }

    // TODO:
    // public buildFlowHistoryUrl(initialUrl: string, flowDetails: DatasetFlowByIdResponse): string {
    //     this.addFlowHistoryFields(flowDetails);
    //     return this.proccessUrl(initialUrl);
    // }

    private proccessUrl(url: string): string {
        return url
            .replace(
                /{{(\w+)}}/g, // this is the regex to replace {{variable}}
                (match, field) => {
                    const ex = this.availableFields.find((f: GrafanaFieldDescriptor) => f.key === field);
                    if (ex) {
                        return ex.value;
                    }
                    return match;
                },
            )
            .trim();
    }

    private addTaskFields(flowDetails: DatasetFlowByIdResponse): void {
        this.availableFields = [];
        const events = flowDetails.flowHistory.filter((item) => item.__typename === "FlowEventTaskChanged");
        if (events.length) {
            this.availableFields.push({ key: "taskId", value: (events[0] as FlowEventTaskChanged).taskId });
            this.availableFields.push({
                key: "fromTime",
                value: moment(flowDetails.flow.timing.runningSince).subtract(30, "seconds").valueOf().toString(),
            });
            this.availableFields.push({
                key: "toTime",
                value: moment(flowDetails.flow.timing.finishedAt).add(30, "seconds").valueOf().toString(),
            });
        }
    }

    // TODO Implemented fields for history
    private addFlowHistoryFields() {
        this.availableFields = [];
    }
}
