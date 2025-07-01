/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { Injectable } from "@angular/core";
import {
    DatasetFlowByIdResponse,
    GrafanaFieldDescriptor,
} from "../dataset-flow/dataset-flow-details/dataset-flow-details.types";
import { FlowEventTaskChanged } from "src/app/api/kamu.graphql.interface";
import { addSeconds, subSeconds } from "date-fns";

@Injectable({
    providedIn: "root",
})
export class GrafanaLogsService {
    private availableFields: GrafanaFieldDescriptor[] = [];

    public buildTaskUrl(initialUrl: string, flowDetails: DatasetFlowByIdResponse): string {
        this.addTaskFields(flowDetails);
        return this.proccessUrl(initialUrl);
    }

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
                value: subSeconds(flowDetails.flow.timing.runningSince as string, 30)
                    .valueOf()
                    .toString(),
            });

            // TODO: this logic looks wrong, we should take data from a task, not from a flow
            const finishedTime = flowDetails.flow.timing.lastAttemptFinishedAt;
            this.availableFields.push({
                key: "toTime",
                value: finishedTime
                    ? addSeconds(finishedTime, 30).valueOf().toString()
                    : Date.now().valueOf().toString(),
            });
        }
    }
}
