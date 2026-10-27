/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { BasePropertyComponent } from "src/app/dataset-block/metadata-block/components/event-details/components/common/base-property/base-property.component";

export enum DynamicEventTypes {
    SetPollingSource = "SetPollingSource",
    SetTransform = "SetTransform",
    ExecuteTransform = "ExecuteTransform",
    AddData = "AddData",
    AddPushSource = "AddPushSource",
}

export type DynamicEventTypesScalar = `${DynamicEventTypes}`;

/**
 * A component that renders an event row's value through its `data` input. The row's value comes
 * from walking the event, so `acceptsData` checks it fits `data` before the component gets it.
 */
export interface PropertyComponentType {
    new (): BasePropertyComponent;
    acceptsData(data: unknown): boolean;
}

export interface EventRowDescriptor {
    label: string;
    tooltip: string;
    separateRowForValue?: boolean;
    dataTestId?: string;
    presentationComponent: PropertyComponentType;
}

export type EventRowDescriptorsByField = Record<string, EventRowDescriptor>;

export interface EventRow {
    descriptor: EventRowDescriptor;
    value: unknown;
}

export interface EventSection {
    title: string;
    rows: EventRow[];
}
