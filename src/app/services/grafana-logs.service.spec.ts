/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestBed } from "@angular/core/testing";

import { TaskStatus } from "@api/kamu.graphql.interface";

import { GrafanaLogsService } from "src/app/services/grafana-logs.service";

describe("GrafanaLogsService", () => {
    let service: GrafanaLogsService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(GrafanaLogsService);
    });

    it("should be created", () => {
        expect(service).toBeTruthy();
    });

    it("should check build url for task", () => {
        const mockUrl = "http://test.com?taskId={{taskId}}&fromTime={{fromTime}}&toTime={{toTime}}";
        const result = service.buildTaskUrl(mockUrl, [
            {
                __typename: "FlowEventTaskChanged",
                eventId: "3",
                eventTime: "2024-03-13T13:54:32.269040795+00:00",
                taskId: "0",
                taskStatus: TaskStatus.Queued,
                task: {
                    taskId: "0",
                    cancellationRequested: false,
                    status: TaskStatus.Queued,
                    createdAt: "2024-03-13T13:54:32.269040795+00:00",
                },
                nextAttemptAt: null,
            },

            {
                __typename: "FlowEventTaskChanged",
                eventId: "4",
                eventTime: "2024-03-13T13:54:32.269040795+00:00",
                taskId: "0",
                taskStatus: TaskStatus.Finished,
                task: {
                    taskId: "0",
                    cancellationRequested: false,
                    status: TaskStatus.Finished,
                    createdAt: "2024-03-13T13:58:32.269040795+00:00",
                },
                nextAttemptAt: null,
            },
        ]);
        expect(result).toEqual("http://test.com?taskId=0&fromTime=1710338042269&toTime=1710338102269");
    });
});
