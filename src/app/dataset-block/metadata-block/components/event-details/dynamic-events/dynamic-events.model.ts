/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { Type } from "@angular/core";

import { BasePropertyComponent } from "../components/common/base-property/base-property.component";

export enum DynamicEventTypes {
    SetPollingSource = "SetPollingSource",
    SetTransform = "SetTransform",
    ExecuteTransform = "ExecuteTransform",
    AddData = "AddData",
    AddPushSource = "AddPushSource",
}

export type DynamicEventTypesScalar = `${DynamicEventTypes}`;

export interface EventRowDescriptor {
    label: string;
    tooltip: string;
    separateRowForValue?: boolean;
    dataTestId?: string;
    presentationComponent: Type<BasePropertyComponent>;
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
