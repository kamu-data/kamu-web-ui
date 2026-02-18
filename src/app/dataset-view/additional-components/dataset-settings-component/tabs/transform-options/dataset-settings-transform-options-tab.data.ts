/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { FlowTriggerReactiveRule, FlowTriggerStopPolicy } from "@api/kamu.graphql.interface";
import { MaybeNull } from "@interface/app.types";

import { DatasetViewData } from "src/app/dataset-view/dataset-view.interface";

export interface DatasetSettingsTransformOptionsTabData extends DatasetViewData {
    reactive: MaybeNull<FlowTriggerReactiveRule>;
    stopPolicy: MaybeNull<FlowTriggerStopPolicy>;
    paused: boolean;
}
