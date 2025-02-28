/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { EventSectionBuilder, GenericDynamicEventType } from "./event-section.builder";
import { SetPollingSourceSectionBuilder } from "./set-polling-source-section.builder";
import { SetTransformSectionBuilder } from "./set-transform-section.builder";
import { DynamicEventTypes } from "../dynamic-events.model";
import { ExecuteTransformSectionBuilder } from "./execute-transform.section.builder";
import { AddDataSectionBuilder } from "./add-data-section.builder";
import { AddPushSourceSectionBuilder } from "./add-push-source-section.builder";

export const SECTION_BUILDERS_BY_EVENT_TYPE: Record<DynamicEventTypes, EventSectionBuilder<GenericDynamicEventType>> = {
    [DynamicEventTypes.SetPollingSource]: new SetPollingSourceSectionBuilder(),
    [DynamicEventTypes.SetTransform]: new SetTransformSectionBuilder(),
    [DynamicEventTypes.ExecuteTransform]: new ExecuteTransformSectionBuilder(),
    [DynamicEventTypes.AddData]: new AddDataSectionBuilder(),
    [DynamicEventTypes.AddPushSource]: new AddPushSourceSectionBuilder(),
};
