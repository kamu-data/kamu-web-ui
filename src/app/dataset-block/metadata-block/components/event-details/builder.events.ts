/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { BasePropertyComponent } from "./components/common/base-property/base-property.component";
import { MetadataEvent } from "../../../../api/kamu.graphql.interface";
import { SetPollingSource } from "src/app/api/kamu.graphql.interface";
import { Type } from "@angular/core";
import { SET_POLLING_SOURCE_DESCRIPTORS } from "./components/set-polling-source-event/set-polling-source-event.source";

export interface EventRow {
    label: string;
    tooltip: string;
    value?: unknown;
    separateRowForValue?: boolean;
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

const keysForSeparateRow: string[] = ["queries"];

abstract class EventSectionBuilder<TEvent> {
    public abstract buildEventRows(event: TEvent): EventSection[];
}

class SetPollingSourceSectionBuilder extends EventSectionBuilder<SetPollingSource> {
    public buildEventRows(event: SetPollingSource): EventSection[] {
        const result: EventSection[] = [];
        Object.entries(event).forEach(([property, data]) => {
            if (data && property !== "__typename") {
                switch (property) {
                    case SetPollingSourceProperty.READ:
                    case SetPollingSourceProperty.FETCH: {
                        const rows: EventRow[] = [];
                        Object.entries(event[property]).forEach(
                            ([key, value]) => {
                                if (value && key !== "__typename") {
                                    rows.push({
                                        ...SET_POLLING_SOURCE_DESCRIPTORS[
                                            `SetPollingSource.${event[property].__typename}.${key}`
                                        ],
                                        value: value,
                                    });
                                }
                            },
                        );
                        result.push({ title: property, rows });
                        break;
                    }
                    case SetPollingSourceProperty.MERGE: {
                        const rows: EventRow[] = [];
                        Object.entries(event[property]).forEach(
                            ([key, value]) => {
                                if (value && key !== "__typename") {
                                    rows.push({
                                        ...SET_POLLING_SOURCE_DESCRIPTORS[
                                            `SetPollingSource.${event[property].__typename}.${key}`
                                        ],
                                        value: value,
                                    });
                                }
                            },
                        );
                        result.push({ title: property, rows });
                        break;
                    }
                    case SetPollingSourceProperty.PREPROCESS: {
                        const rows: EventRow[] = [];
                        if (event.preprocess) {
                            Object.entries(event.preprocess).forEach(
                                ([key, value]) => {
                                    if (value && key !== "__typename") {
                                        rows.push({
                                            ...SET_POLLING_SOURCE_DESCRIPTORS[
                                                `SetPollingSource.${event.preprocess?.__typename}.${key}`
                                            ],
                                            value: value,
                                            separateRowForValue:
                                                keysForSeparateRow.includes(key)
                                                    ? true
                                                    : false,
                                        });
                                    }
                                },
                            );
                        }
                        result.push({ title: property, rows });
                        break;
                    }
                }
            }
        });
        return result;
    }
}

export const FACTORIES_BY_EVENT_TYPE: Record<
    EventTypes,
    EventSectionBuilder<MetadataEvent>
> = {
    [EventTypes.SetPollingSource]: new SetPollingSourceSectionBuilder(),
};
