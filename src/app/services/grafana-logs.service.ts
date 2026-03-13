/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { Injectable } from "@angular/core";

import { addSeconds, subSeconds } from "date-fns";

import { FlowEventTaskChanged, TaskStatus } from "@api/kamu.graphql.interface";

import { GrafanaFieldDescriptor } from "src/app/dataset-flow/dataset-flow-details/dataset-flow-details.types";

@Injectable({
    providedIn: "root",
})
export class GrafanaLogsService {
    private availableFields: GrafanaFieldDescriptor[] = [];

    public buildTaskUrl(initialUrl: string, eventTasks: FlowEventTaskChanged[]): string {
        this.addTaskFields(eventTasks);
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

    private addTaskFields(eventTask: FlowEventTaskChanged[]): void {
        this.availableFields = [];
        const fromTime = eventTask.filter((item) => item.taskStatus === TaskStatus.Queued);
        const toTime = eventTask.filter((item) => item.taskStatus === TaskStatus.Finished);

        this.availableFields.push({ key: "taskId", value: fromTime[0].taskId });
        this.availableFields.push({
            key: "fromTime",
            value: subSeconds(fromTime[0].eventTime, 30).valueOf().toString(),
        });

        this.availableFields.push({
            key: "toTime",
            value:
                toTime.length && toTime[0].eventTime
                    ? addSeconds(toTime[0].eventTime, 30).valueOf().toString()
                    : Date.now().valueOf().toString(),
        });
    }
}
