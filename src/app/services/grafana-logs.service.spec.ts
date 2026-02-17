/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestBed } from "@angular/core/testing";

import { mockDatasetFlowByIdResponse } from "@api/mock/dataset-flow.mock";

import { GrafanaLogsService } from "./grafana-logs.service";

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
        const result = service.buildTaskUrl(mockUrl, mockDatasetFlowByIdResponse);
        expect(result).toEqual("http://test.com?taskId=0&fromTime=1707762057477&toTime=1707762119554");
    });
});
