/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { isRecord } from "@common/helpers/app.helpers";
import { MaybeUndefined } from "@interface/app.types";

import { UnsupportedPropertyComponent } from "src/app/dataset-block/metadata-block/components/event-details/components/common/unsupported-property/unsupported-property.component";
import {
    DynamicEventTypesScalar,
    EventRow,
    EventRowDescriptor,
    EventRowDescriptorsByField,
    EventSection,
} from "src/app/dataset-block/metadata-block/components/event-details/dynamic-events/dynamic-events.model";

export interface GenericDynamicEventType extends Record<string, unknown> {
    __typename?: DynamicEventTypesScalar;
}

type GenericEventSectionType = Record<string, unknown>;

export abstract class EventSectionBuilder<TEvent extends GenericDynamicEventType> {
    private readonly UNSUPPORTED_ROW_DESCRIPTOR: EventRowDescriptor = {
        label: "",
        tooltip: "Unsupported value",
        presentationComponent: UnsupportedPropertyComponent,
        separateRowForValue: false,
        dataTestId: "unsupportedKey",
    };

    public abstract buildEventSections(event: TEvent): EventSection[];

    protected buildEventRows(
        event: TEvent,
        rowDescriptors: EventRowDescriptorsByField,
        section: string,
        allowTypenameKey: boolean,
    ): EventRow[] {
        const rows: EventRow[] = [];
        const sectionObject = event[section];
        if (!isRecord(sectionObject)) {
            throw new Error(`Expecting an object in event section "${section}"`);
        }
        Object.entries(sectionObject).forEach(([key, value]) => {
            if (value && (key !== "__typename" || allowTypenameKey)) {
                rows.push(this.buildEventRow(event, rowDescriptors, sectionObject, key, value));
            }
        });

        return rows;
    }

    protected buildEventRow(
        event: TEvent,
        rowDescriptors: EventRowDescriptorsByField,
        sectionObject: GenericEventSectionType,
        key: string,
        value: unknown,
    ): EventRow {
        const eventType = event.__typename;
        const sectionType = sectionObject.__typename;
        if (eventType && typeof sectionType === "string") {
            const keyExists = Object.keys(rowDescriptors).includes(`${eventType}.${sectionType}.${key}`);
            if (keyExists) {
                return this.buildSupportedRow(eventType, rowDescriptors, sectionType, key, value);
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
            },
            value,
        };
    }

    public buildSupportedRow(
        eventType: DynamicEventTypesScalar,
        rowDescriptors: EventRowDescriptorsByField,
        sectionType: string,
        key: string,
        value: unknown,
    ): EventRow {
        const descriptor: MaybeUndefined<EventRowDescriptor> = rowDescriptors[`${eventType}.${sectionType}.${key}`];
        if (!descriptor?.presentationComponent.acceptsData(value)) {
            return this.buildUnsupportedRow(key, value);
        }
        return { descriptor, value };
    }
}
