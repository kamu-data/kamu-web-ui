/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

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

export interface EventPropertyLogo {
    name: string;
    label?: string;
    url_logo?: string;
}

export type SourcesEvents = SupportedEvents.AddPushSource | SupportedEvents.SetPollingSource;
