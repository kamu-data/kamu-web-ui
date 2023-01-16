/* eslint-disable @typescript-eslint/no-non-null-assertion */
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
    dataTestId?: string;
    presentationComponent: Type<BasePropertyComponent>;
}

export interface EventSection {
    title: string;
    rows: EventRow[];
}

enum EventTypes {
    SetPollingSource = "SetPollingSource",
}

enum SetPollingSourceSection {
    READ = "read",
    FETCH = "fetch",
    MERGE = "merge",
    PREPROCESS = "preprocess",
    PREPARE = "prepare",
}

abstract class EventSectionBuilder<TEvent> {
    public abstract buildEventRows(event: TEvent): EventSection[];
}

class SetPollingSourceSectionBuilder extends EventSectionBuilder<SetPollingSource> {
    private unsupportedRow: EventRow = {
        ...SET_POLLING_SOURCE_DESCRIPTORS[`SetPollingSource.UnsupportedKey`],
    };

    public buildEventRows(event: SetPollingSource): EventSection[] {
        const result: EventSection[] = [];
        Object.entries(event).forEach(([section, data]) => {
            if (data && section !== "__typename") {
                switch (section) {
                    case SetPollingSourceSection.READ:
                    case SetPollingSourceSection.FETCH: {
                        const rows: EventRow[] = [];
                        Object.entries(event[section]).forEach(
                            ([key, value]) => {
                                if (value && key !== "__typename") {
                                    rows.push(
                                        this.isKeyExist(key, section, event)
                                            ? {
                                                  ...SET_POLLING_SOURCE_DESCRIPTORS[
                                                      `SetPollingSource.${event[section].__typename}.${key}`
                                                  ],
                                                  value: value,
                                              }
                                            : {
                                                  ...this.unsupportedRow,
                                                  label: `Unsupported(${key})`,
                                                  value: value,
                                              },
                                    );
                                }
                            },
                        );
                        result.push({ title: section, rows });
                        break;
                    }
                    case SetPollingSourceSection.MERGE: {
                        const rows: EventRow[] = [];
                        Object.entries(event[section]).forEach(
                            ([key, value]) => {
                                if (value) {
                                    rows.push(
                                        this.isKeyExist(key, section, event)
                                            ? {
                                                  ...SET_POLLING_SOURCE_DESCRIPTORS[
                                                      `SetPollingSource.${event[section].__typename}.${key}`
                                                  ],
                                                  value,
                                              }
                                            : {
                                                  ...this.unsupportedRow,
                                                  label: `Unsupported(${key})`,
                                                  value,
                                              },
                                    );
                                }
                            },
                        );
                        result.push({ title: section, rows });
                        break;
                    }
                    case SetPollingSourceSection.PREPROCESS: {
                        const rows: EventRow[] = [];
                        if (event.preprocess) {
                            Object.entries(event[section]!).forEach(
                                ([key, value]) => {
                                    if (value && key !== "__typename") {
                                        rows.push(
                                            this.isKeyExist(key, section, event)
                                                ? {
                                                      ...SET_POLLING_SOURCE_DESCRIPTORS[
                                                          `SetPollingSource.${event[section]?.__typename}.${key}`
                                                      ],
                                                      value,
                                                  }
                                                : {
                                                      ...this.unsupportedRow,
                                                      label: `Unsupported(${key})`,
                                                      value,
                                                  },
                                        );
                                    }
                                },
                            );
                        }
                        result.push({ title: section, rows });
                        break;
                    }

                    case SetPollingSourceSection.PREPARE: {
                        if (event.prepare) {
                            event.prepare.forEach((item, index) => {
                                const rows: EventRow[] = [];
                                Object.entries(item).forEach(([key, value]) => {
                                    if (key !== "__typename") {
                                        rows.push({
                                            ...SET_POLLING_SOURCE_DESCRIPTORS[
                                                `SetPollingSource.${item.__typename}.${key}`
                                            ],
                                            value: value,
                                        });
                                    }
                                });
                                result.push({
                                    title:
                                        section +
                                        (event.prepare!.length > 1
                                            ? `#${index + 1}`
                                            : ""),
                                    rows,
                                });
                            });
                        }
                        break;
                    }
                    default: {
                        result.push({ title: section, rows: [] });
                    }
                }
            }
        });
        return result;
    }

    private isKeyExist(
        key: string,
        section:
            | SetPollingSourceSection.FETCH
            | SetPollingSourceSection.READ
            | SetPollingSourceSection.MERGE
            | SetPollingSourceSection.PREPROCESS,
        event: SetPollingSource,
    ): boolean {
        return Object.keys(SET_POLLING_SOURCE_DESCRIPTORS).includes(
            `SetPollingSource.${event[section]?.__typename}.${key}`,
        );
    }
}

export const FACTORIES_BY_EVENT_TYPE: Record<
    EventTypes,
    EventSectionBuilder<MetadataEvent>
> = {
    [EventTypes.SetPollingSource]: new SetPollingSourceSectionBuilder(),
};
