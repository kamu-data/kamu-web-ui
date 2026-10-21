/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { GetDatasetFlowTriggerQuery } from "@api/kamu.graphql.interface";

/** A dataset flow trigger with exactly the fields `GetDatasetFlowTrigger` selects. */
export type DatasetFlowTriggerData = NonNullable<
    NonNullable<GetDatasetFlowTriggerQuery["datasets"]["byId"]>["flows"]["triggers"]["byType"]
>;

export type FlowTriggerScheduleData = NonNullable<DatasetFlowTriggerData["schedule"]>;
export type FlowTriggerReactiveData = NonNullable<DatasetFlowTriggerData["reactive"]>;
export type FlowTriggerStopPolicyData = NonNullable<DatasetFlowTriggerData["stopPolicy"]>;
