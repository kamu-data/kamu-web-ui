import { SET_TRANSFORM_SOURCE_DESCRIPTORS } from "./components/set-transform-event/set-transform-event.source";
import { BasePropertyComponent } from "./components/common/base-property/base-property.component";
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

export enum EventTypes {
    SetPollingSource = "SetPollingSource",
    SetTransform = "SetTransform",
}

type EventTypesScalar = `${EventTypes}`;

export enum SetPollingSourceSection {
    READ = "read",
    FETCH = "fetch",
    MERGE = "merge",
    PREPROCESS = "preprocess",
    PREPARE = "prepare",
}

export enum SetTransformSection {
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

export interface GenericDynamicEventType extends Record<string, unknown> {
    __typename?: EventTypesScalar;
}

type GenericEventSectionType = Record<string, unknown>;

export abstract class EventSectionBuilder<
    TEvent extends GenericDynamicEventType,
> {
    private readonly UNSUPPORTED_ROW_DESCRIPTOR: EventRowDescriptor = {
        label: "",
        tooltip: "Unsupported value",
        presentationComponent: UnsupportedPropertyComponent,
        separateRowForValue: false,
        dataTestId: "unsupportedKey",
    };

    public abstract buildEventSections(event: TEvent): EventSection[];

    public buildEventRows(
        event: TEvent,
        section: keyof TEvent,
        allowTypenameKey: boolean,
    ): EventRow[] {
        const rows: EventRow[] = [];
        const sectionObject: GenericEventSectionType = event[
            section
        ] as GenericEventSectionType;
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
