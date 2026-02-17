/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { SupportedEvents } from "src/app/dataset-block/metadata-block/components/event-details/supported.events";

export const eventsWithYamlView: SupportedEvents[] = [
    SupportedEvents.SetPollingSource,
    SupportedEvents.SetTransform,
    SupportedEvents.SetAttachments,
    SupportedEvents.SetLicense,
    SupportedEvents.SetInfo,
    SupportedEvents.SetVocab,
    SupportedEvents.Seed,
    SupportedEvents.AddPushSource,
];
