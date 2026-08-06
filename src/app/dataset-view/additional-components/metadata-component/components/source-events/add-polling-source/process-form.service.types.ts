/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import {
    EventTimeSourceKind,
    FetchKind,
    SetPollingSourceSection,
} from "src/app/dataset-view/additional-components/metadata-component/components/source-events/add-polling-source/add-polling-source-form.types";
import { AddPushSourceSection } from "src/app/dataset-view/additional-components/metadata-component/components/source-events/add-push-source/add-push-source-form.types";

export enum SourceOrder {
    NONE = "NONE",
    BY_NAME = "ByName",
    BY_EVENT_TIME = "ByEventTime",
}

export interface OrderControlType {
    fetch: {
        kind: FetchKind;
        order?: SourceOrder;
        cache?: { kind: string };
        eventTime?: { kind: EventTimeSourceKind; pattern?: string; timestampFormat?: string };
    };
}
export type SourcesSection = SetPollingSourceSection | AddPushSourceSection;
