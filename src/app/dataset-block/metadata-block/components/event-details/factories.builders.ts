import {
    EventSectionBuilder,
    EventTypes,
    GenericDynamicEventType,
} from "./builder.events";
import { SetPollingSourceSectionBuilder } from "./event-details-builders/set-polling-source-section.builder";
import { SetTransformSectionBuilder } from "./event-details-builders/set-transform-section.builder";

export const FACTORIES_BY_EVENT_TYPE: Record<
    EventTypes,
    EventSectionBuilder<GenericDynamicEventType>
> = {
    [EventTypes.SetPollingSource]: new SetPollingSourceSectionBuilder(),
    [EventTypes.SetTransform]: new SetTransformSectionBuilder(),
};
