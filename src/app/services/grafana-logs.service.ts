/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { Injectable } from "@angular/core";

import { addSeconds, subSeconds } from "date-fns";

import { FlowEventTaskChanged } from "@api/kamu.graphql.interface";

import { GrafanaFieldDescriptor } from "src/app/dataset-flow/dataset-flow-details/dataset-flow-details.types";

@Injectable({
    providedIn: "root",
})
export class GrafanaLogsService {
    private availableFields: GrafanaFieldDescriptor[] = [];

    public buildTaskUrl(initialUrl: string, eventTask: FlowEventTaskChanged): string {
        this.addTaskFields(eventTask);
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

    private addTaskFields(eventTask: FlowEventTaskChanged): void {
        this.availableFields = [];

        this.availableFields.push({ key: "taskId", value: eventTask.taskId });
        this.availableFields.push({
            key: "fromTime",
            value: subSeconds(eventTask.eventTime as string, 30)
                .valueOf()
                .toString(),
        });

        this.availableFields.push({
            key: "toTime",
            value: addSeconds(eventTask.eventTime, 30).valueOf().toString(),
        });
    }
}
