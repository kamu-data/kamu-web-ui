/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { FlowStatus } from "@api/kamu.graphql.interface";

import { flowStatusGroup } from "src/app/account/additional-components/account-flows-tab/account-flows-tab.helpers";

describe("flowStatusGroup", () => {
    [
        { status: FlowStatus.Finished, group: [FlowStatus.Finished] },
        { status: FlowStatus.Running, group: [FlowStatus.Running, FlowStatus.Retrying] },
        { status: FlowStatus.Retrying, group: [FlowStatus.Running, FlowStatus.Retrying] },
        { status: FlowStatus.Waiting, group: [FlowStatus.Waiting] },
    ].forEach(({ status, group }) => {
        it(`should put ${status} in the group of the tab that lists it`, () => {
            expect(flowStatusGroup(status)).toEqual(group);
        });
    });

    it("should give a new array on each call, since the activity tabs write to its first item", () => {
        const first = flowStatusGroup(FlowStatus.Running);
        first[0] = FlowStatus.Waiting;

        const second = flowStatusGroup(FlowStatus.Running);

        expect(second).toEqual([FlowStatus.Running, FlowStatus.Retrying]);
    });
});
