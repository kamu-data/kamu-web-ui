/* eslint-disable @typescript-eslint/restrict-template-expressions */
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

export interface EventSection {
    title: string;
    rows: EventRow[];
}

enum EventTypes {
    SetPollingSource = "SetPollingSource",
}

enum SetPollingSourceProperty {
    READ = "read",
    FETCH = "fetch",
    MERGE = "merge",
    PREPROCESS = "preprocess",
    PREPARE = "prepare",
}

abstract class EventRowFactory<TEvent> {
    public abstract buildEventRows(event: TEvent): EventSection[];
}

class SetPollingSourceEventRowFactory extends EventRowFactory<SetPollingSource> {
    public buildEventRows(event: SetPollingSource): EventSection[] {
        const result: EventSection[] = [];
        let rows: EventRow[] = [];
        Object.entries(event).forEach(([property, data]) => {
            if (data && property !== "__typename") {
                if (property === SetPollingSourceProperty.READ) {
                    Object.entries(event[property]).forEach(([key, value]) => {
                        if (value && key !== "__typename") {
                            rows.push({
                                ...SET_POLLING_SOURCE_DESCRIPTORS[
                                    `SetPollingSource.${event[property].__typename}.${key}`
                                ],
                                value: value,
                            });
                        }
                    });
                }
                if (property === SetPollingSourceProperty.FETCH) {
                    Object.entries(event[property]).forEach(([key, value]) => {
                        if (value && key !== "__typename") {
                            rows.push({
                                ...SET_POLLING_SOURCE_DESCRIPTORS[
                                    `SetPollingSource.${event[property].__typename}.${key}`
                                ],
                                value: value,
                            });
                        }
                    });
                }

                if (property === SetPollingSourceProperty.MERGE) {
                    Object.entries(event[property]).forEach(([key, value]) => {
                        if (value) {
                            rows.push({
                                ...SET_POLLING_SOURCE_DESCRIPTORS[
                                    `SetPollingSource.${event[property].__typename}.${key}`
                                ],
                                value: value,
                            });
                        }
                    });
                }

                if (
                    event.preprocess &&
                    property === SetPollingSourceProperty.PREPROCESS
                ) {
                    Object.entries(event.preprocess).forEach(([key, value]) => {
                        if (value && key !== "__typename") {
                            rows.push({
                                ...SET_POLLING_SOURCE_DESCRIPTORS[
                                    `SetPollingSource.${event.preprocess?.__typename}.${key}`
                                ],
                                value: value,
                            });
                        }
                    });
                }
                result.push({ title: property, rows });
                rows = [];
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
