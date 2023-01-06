import { BasePropertyComponent } from "./components/common/base-property/base-property.component";
import { MetadataEvent } from "./../../../../api/kamu.graphql.interface";
import { SetPollingSource } from "src/app/api/kamu.graphql.interface";
import { Type } from "@angular/core";
import { SET_POLLING_SOURCE_DESCRIPTORS } from "./components/set-polling-source-event/set-polling-source-event.source";

export interface EventRow {
    label: string;
    tooltip: string;
    value?: unknown;
    presentationComponent: Type<BasePropertyComponent>;
}

enum EventTypes {
    SetPollingSource = "SetPollingSource",
}

abstract class EventRowFactory<TEvent> {
    public abstract buildEventRows(event: TEvent): EventRow[];
}

class SetPollingSourceEventRowFactory extends EventRowFactory<SetPollingSource> {
    public buildEventRows(event: SetPollingSource): EventRow[] {
        const result: EventRow[] = [];
        Object.entries(event.read).forEach(([key, value]) => {
            if (value && key !== "__typename") {
                result.push({
                    ...SET_POLLING_SOURCE_DESCRIPTORS[
                        `SetPollingSource.ReadStepCsv.${key}`
                    ],
                    value,
                });
            }
        });

        return result;
    }
}

export const FACTORIES_BY_EVENT_TYPE: Record<
    EventTypes,
    EventRowFactory<MetadataEvent>
> = {
    [EventTypes.SetPollingSource]: new SetPollingSourceEventRowFactory(),
};
