/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { MetadataEventType } from "@api/kamu.graphql.interface";

export enum SupportedEvents {
    AddData = "AddData",
    ExecuteTransform = "ExecuteTransform",
    Seed = "Seed",
    SetAttachments = "SetAttachments",
    SetInfo = "SetInfo",
    SetLicense = "SetLicense",
    SetPollingSource = "SetPollingSource",
    SetTransform = "SetTransform",
    SetVocab = "SetVocab",
    AddPushSource = "AddPushSource",
    SetDataSchema = "SetDataSchema",
}

/** The API's name of each event type, for filtering blocks by it. */
export const SUPPORTED_EVENT_API_TYPES: Record<SupportedEvents, MetadataEventType> = {
    [SupportedEvents.AddData]: MetadataEventType.AddData,
    [SupportedEvents.ExecuteTransform]: MetadataEventType.ExecuteTransform,
    [SupportedEvents.Seed]: MetadataEventType.Seed,
    [SupportedEvents.SetAttachments]: MetadataEventType.SetAttachments,
    [SupportedEvents.SetInfo]: MetadataEventType.SetInfo,
    [SupportedEvents.SetLicense]: MetadataEventType.SetLicense,
    [SupportedEvents.SetPollingSource]: MetadataEventType.SetPollingSource,
    [SupportedEvents.SetTransform]: MetadataEventType.SetTransform,
    [SupportedEvents.SetVocab]: MetadataEventType.SetVocab,
    [SupportedEvents.AddPushSource]: MetadataEventType.AddPushSource,
    [SupportedEvents.SetDataSchema]: MetadataEventType.SetDataSchema,
};

export interface EventPropertyLogo {
    name: string;
    label?: string;
    url_logo?: string;
}

export type SourcesEvents = SupportedEvents.AddPushSource | SupportedEvents.SetPollingSource;
