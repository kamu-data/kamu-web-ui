/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { FlowProcessEffectiveState, WebhookFlowSubProcess } from "@api/kamu.graphql.interface";
import { mockDatasetFlowsProcessesQuery } from "@api/mock/dataset-flow.mock";

import { SubprocessStatusFilterPipe } from "./subprocess-status-filter.pipe";

describe("SubprocessStatusFilterPipe", () => {
    const subprocesses = mockDatasetFlowsProcessesQuery.datasets.byId?.flows.processes.webhooks
        .subprocesses as WebhookFlowSubProcess[];

    it("create an instance", () => {
        const pipe = new SubprocessStatusFilterPipe();
        expect(pipe).toBeTruthy();
    });

    it("the pipe should be checked when the pipe returns initial data", () => {
        const pipe = new SubprocessStatusFilterPipe();
        expect(pipe.transform(subprocesses, [])).toEqual(subprocesses);
    });

    it("the pipe should be checked when the pipe returns modified data", () => {
        const pipe = new SubprocessStatusFilterPipe();
        expect(subprocesses.length).toEqual(2);
        const modifiedProcesses = pipe.transform(subprocesses, [FlowProcessEffectiveState.Active]);
        expect(modifiedProcesses.length).toEqual(1);
    });
});
