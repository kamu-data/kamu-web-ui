/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { FlowStatus } from "@api/kamu.graphql.interface";

/** The statuses each tab of the activity view lists; a retrying flow is listed with the running ones */
const FLOW_STATUS_GROUPS: readonly (readonly FlowStatus[])[] = [
    [FlowStatus.Finished],
    [FlowStatus.Running, FlowStatus.Retrying],
    [FlowStatus.Waiting],
];

/** The tab group a status belongs to, as a new array: the activity tabs bind to its first item two-way */
export function flowStatusGroup(status: FlowStatus): FlowStatus[] {
    const group = FLOW_STATUS_GROUPS.find((statuses) => statuses.includes(status));
    return group ? [...group] : [status];
}
