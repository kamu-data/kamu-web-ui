/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { MaybeNull } from "@interface/app.types";

import {
    FlowTriggerScheduleData,
    FlowTriggerStopPolicyData,
} from "src/app/dataset-view/additional-components/dataset-settings-component/tabs/shared/flow-trigger.types";
import { DatasetViewData } from "src/app/dataset-view/dataset-view.interface";

export interface DatasetSettingsSchedulingTabData extends DatasetViewData {
    schedule: MaybeNull<FlowTriggerScheduleData>;
    stopPolicy: MaybeNull<FlowTriggerStopPolicyData>;
    paused: boolean;
}
