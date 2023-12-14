import { EventSectionBuilder, GenericDynamicEventType } from "./event-section.builder";
import { SetPollingSourceSectionBuilder } from "./set-polling-source-section.builder";
import { SetTransformSectionBuilder } from "./set-transform-section.builder";
import { DynamicEventTypes } from "../dynamic-events.model";
import { ExecuteQuerySectionBuilder } from "./execute-query.section.builder";
import { AddDataSectionBuilder } from "./add-data-section.builder";
import { AddPushSourceSectionBuilder } from "./add-push-source-section.builder";

export const SECTION_BUILDERS_BY_EVENT_TYPE: Record<DynamicEventTypes, EventSectionBuilder<GenericDynamicEventType>> = {
    [DynamicEventTypes.SetPollingSource]: new SetPollingSourceSectionBuilder(),
    [DynamicEventTypes.SetTransform]: new SetTransformSectionBuilder(),
    [DynamicEventTypes.ExecuteQuery]: new ExecuteQuerySectionBuilder(),
    [DynamicEventTypes.AddData]: new AddDataSectionBuilder(),
    [DynamicEventTypes.AddPushSource]: new AddPushSourceSectionBuilder(),
};
