/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { AddDataSectionBuilder } from "src/app/dataset-block/metadata-block/components/event-details/dynamic-events/builders/add-data-section.builder";
import { AddPushSourceSectionBuilder } from "src/app/dataset-block/metadata-block/components/event-details/dynamic-events/builders/add-push-source-section.builder";
import {
    EventSectionBuilder,
    GenericDynamicEventType,
} from "src/app/dataset-block/metadata-block/components/event-details/dynamic-events/builders/event-section.builder";
import { ExecuteTransformSectionBuilder } from "src/app/dataset-block/metadata-block/components/event-details/dynamic-events/builders/execute-transform.section.builder";
import { SetPollingSourceSectionBuilder } from "src/app/dataset-block/metadata-block/components/event-details/dynamic-events/builders/set-polling-source-section.builder";
import { SetTransformSectionBuilder } from "src/app/dataset-block/metadata-block/components/event-details/dynamic-events/builders/set-transform-section.builder";
import { DynamicEventTypes } from "src/app/dataset-block/metadata-block/components/event-details/dynamic-events/dynamic-events.model";

export const SECTION_BUILDERS_BY_EVENT_TYPE: Record<DynamicEventTypes, EventSectionBuilder<GenericDynamicEventType>> = {
    [DynamicEventTypes.SetPollingSource]: new SetPollingSourceSectionBuilder(),
    [DynamicEventTypes.SetTransform]: new SetTransformSectionBuilder(),
    [DynamicEventTypes.ExecuteTransform]: new ExecuteTransformSectionBuilder(),
    [DynamicEventTypes.AddData]: new AddDataSectionBuilder(),
    [DynamicEventTypes.AddPushSource]: new AddPushSourceSectionBuilder(),
};
