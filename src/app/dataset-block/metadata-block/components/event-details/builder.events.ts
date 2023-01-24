import { SET_TRANSFORM_SOURCE_DESCRIPTORS } from "./components/set-transform-event/set-transform-event.source";
import {
    SetTransform,
    TransformInput,
} from "./../../../../api/kamu.graphql.interface";
import { BasePropertyComponent } from "./components/common/base-property/base-property.component";
import { SetPollingSource } from "src/app/api/kamu.graphql.interface";
import { Type } from "@angular/core";
import { SET_POLLING_SOURCE_DESCRIPTORS } from "./components/set-polling-source-event/set-polling-source-event.source";
import { UnsupportedPropertyComponent } from "./components/common/unsupported-property/unsupported-property.component";

export interface EventRowDescriptor {
    label: string;
    tooltip: string;
    separateRowForValue?: boolean;
    dataTestId?: string;
    presentationComponent: Type<BasePropertyComponent>;
}

export interface EventRow {
    descriptor: EventRowDescriptor;
    value: unknown;
}

export interface EventSection {
    title: string;
    rows: EventRow[];
}

enum EventTypes {
    SetPollingSource = "SetPollingSource",
    SetTransform = "SetTransform",
}

type EventTypesScalar = `${EventTypes}`;

enum SetPollingSourceSection {
    READ = "read",
    FETCH = "fetch",
    MERGE = "merge",
    PREPROCESS = "preprocess",
    PREPARE = "prepare",
}

enum SetTransformSection {
    INPUTS = "inputs",
    TRANSFORM = "transform",
}

export const descriptorMapper: Record<
    EventTypesScalar,
    Record<string, EventRowDescriptor>
> = {
    [EventTypes.SetPollingSource]: SET_POLLING_SOURCE_DESCRIPTORS,
    [EventTypes.SetTransform]: SET_TRANSFORM_SOURCE_DESCRIPTORS,
};

interface GenericDynamicEventType extends Record<string, unknown> {
    __typename?: EventTypesScalar;
}

type GenericEventSectionType = Record<string, unknown>;

abstract class EventSectionBuilder<TEvent extends GenericDynamicEventType> {
    private readonly UNSUPPORTED_ROW_DESCRIPTOR: EventRowDescriptor = {
        label: "",
        tooltip: "Unsupported value",
        presentationComponent: UnsupportedPropertyComponent,
        separateRowForValue: false,
        dataTestId: "unsupportedKey",
    };
    public abstract buildEventSections(event: TEvent): EventSection[];
    public buildEventRows(event: TEvent, section: keyof TEvent): EventRow[] {
        const rows: EventRow[] = [];
        const sectionObject: GenericEventSectionType = event[
            section
        ] as GenericEventSectionType;
        const allowTypenameKey = section === SetPollingSourceSection.MERGE;
        Object.entries(sectionObject).forEach(([key, value]) => {
            if (value && (key !== "__typename" || allowTypenameKey)) {
                rows.push(this.buildEventRow(event, sectionObject, key, value));
            }
        });

        return rows;
    }
    public buildEventRow(
        event: TEvent,
        sectionObject: GenericEventSectionType,
        key: string,
        value: unknown,
    ): EventRow {
        const eventType = event.__typename;
        if (event.__typename && eventType && "__typename" in sectionObject) {
            const sectionType = sectionObject.__typename as string;
            const keyExists = Object.keys(
                descriptorMapper[event.__typename],
            ).includes(`${eventType}.${sectionType}.${key}`);
            if (keyExists) {
                return this.buildSupportedRow(
                    event.__typename,
                    sectionType,
                    key,
                    value,
                );
            } else {
                return this.buildUnsupportedRow(key, value);
            }
        } else {
            throw new Error("Expecting typename in section object");
        }
    }

    private buildUnsupportedRow(key: string, value: unknown): EventRow {
        return {
            descriptor: {
                ...this.UNSUPPORTED_ROW_DESCRIPTOR,
                label: `Unsupported(${key})`,
            } as EventRowDescriptor,
            value,
        } as EventRow;
    }

    public buildSupportedRow(
        eventType: EventTypesScalar,
        sectionType: string,
        key: string,
        value: unknown,
    ): EventRow {
        return {
            descriptor:
                descriptorMapper[eventType][
                    `${eventType}.${sectionType}.${key}`
                ],

            value,
        } as EventRow;
    }
}

class SetPollingSourceSectionBuilder extends EventSectionBuilder<SetPollingSource> {
    public buildEventSections(event: SetPollingSource): EventSection[] {
        const result: EventSection[] = [];
        Object.entries(event).forEach(([section, data]) => {
            if (data && section !== "__typename") {
                switch (section) {
                    case SetPollingSourceSection.READ:
                    case SetPollingSourceSection.FETCH:
                    case SetPollingSourceSection.MERGE:
                    case SetPollingSourceSection.PREPROCESS:
                        result.push({
                            title: section,
                            rows: this.buildEventRows(event, section),
                        });
                        break;

                    case SetPollingSourceSection.PREPARE: {
                        if (event.prepare) {
                            const numPrepareParts = event.prepare.length;
                            event.prepare.forEach((item, index) => {
                                const rows: EventRow[] = [];
                                Object.entries(item).forEach(([key, value]) => {
                                    if (
                                        key !== "__typename" &&
                                        item.__typename &&
                                        event.__typename
                                    ) {
                                        rows.push(
                                            this.buildSupportedRow(
                                                event.__typename,
                                                `${item.__typename}`,
                                                key,
                                                value,
                                            ),
                                        );
                                    }
                                });
                                result.push({
                                    title:
                                        section +
                                        (numPrepareParts > 1
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
}

class SetTransformSectionBuilder extends EventSectionBuilder<SetTransform> {
    public buildEventSections(event: SetTransform): EventSection[] {
        const result: EventSection[] = [];
        Object.entries(event).forEach(([section, data]) => {
            if (section !== "__typename") {
                switch (section) {
                    case SetTransformSection.TRANSFORM: {
                        result.push({
                            title: section,
                            rows: this.buildEventRows(event, section),
                        });

                        break;
                    }
                    case SetTransformSection.INPUTS: {
                        const numInputsParts = event.inputs.length;
                        const rows: EventRow[] = [];
                        (data as TransformInput[]).forEach((item, index) => {
                            Object.entries(item.dataset).forEach(
                                ([key, value]) => {
                                    if (
                                        event.__typename &&
                                        item.dataset.__typename &&
                                        key !== "__typename"
                                    ) {
                                        rows.push(
                                            this.buildSupportedRow(
                                                event.__typename,
                                                item.dataset.__typename,
                                                key,
                                                key === "kind"
                                                    ? this.kindDatasetCapitalize(
                                                          value as string,
                                                      )
                                                    : value,
                                            ),
                                        );
                                    }
                                },
                            );
                            result.push({
                                title:
                                    section +
                                    (numInputsParts > 1 ? `#${index + 1}` : ""),
                                rows,
                            });
                        });
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

    private kindDatasetCapitalize(kind: string): string {
        return kind.slice(0, 1) + kind.slice(1).toLowerCase();
    }
}

export const FACTORIES_BY_EVENT_TYPE: Record<
    EventTypes,
    EventSectionBuilder<GenericDynamicEventType>
> = {
    [EventTypes.SetPollingSource]: new SetPollingSourceSectionBuilder(),
    [EventTypes.SetTransform]: new SetTransformSectionBuilder(),
};
