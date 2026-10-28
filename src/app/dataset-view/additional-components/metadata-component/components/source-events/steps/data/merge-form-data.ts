/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { SourcesTooltipsTexts } from "@common/tooltips/sources.text";

import {
    ControlType,
    MergeKind,
} from "src/app/dataset-view/additional-components/metadata-component/components/source-events/add-polling-source/add-polling-source-form.types";
import {
    JsonFormData,
    MergeControls,
} from "src/app/dataset-view/additional-components/metadata-component/components/source-events/source-event-controls.types";
import { textListControl } from "src/app/dataset-view/additional-components/metadata-component/components/source-events/source-section";

export const MERGE_FORM_DATA: JsonFormData<MergeControls> = {
    [MergeKind.APPEND]: {
        controls: [],
    },
    [MergeKind.LEDGER]: {
        controls: [
            {
                name: "primaryKey",
                create: textListControl(),
                label: "Primary keys",
                type: ControlType.ARRAY_KEY,
                placeholder: "Enter primary key...",
                tooltip: SourcesTooltipsTexts.PRIMARY_KEYS,
                options: {
                    buttonText: "+ Add primary key",
                },
            },
        ],
    },
    [MergeKind.SNAPSHOT]: {
        controls: [
            {
                name: "primaryKey",
                create: textListControl(),
                label: "Primary keys",
                placeholder: "Enter primary key...",
                tooltip: SourcesTooltipsTexts.PRIMARY_KEYS,
                type: ControlType.ARRAY_KEY,
                options: {
                    buttonText: "+ Add primary key",
                },
            },
            {
                name: "compareColumns",
                create: textListControl(),
                label: "Compare columns",
                placeholder: "Enter column name...",
                type: ControlType.ARRAY_KEY,
                tooltip: SourcesTooltipsTexts.COMPARE_COLUMNS,
                options: {
                    buttonText: "+ Add column name",
                },
            },
        ],
    },

    [MergeKind.CHANGELOG_STREAM]: {
        controls: [
            {
                name: "primaryKey",
                create: textListControl(),
                label: "Primary keys",
                placeholder: "Enter primary key...",
                tooltip: SourcesTooltipsTexts.PRIMARY_KEYS,
                type: ControlType.ARRAY_KEY,
                options: {
                    buttonText: "+ Add primary key",
                },
            },
        ],
    },
    [MergeKind.UPSERT_STREAM]: {
        controls: [
            {
                name: "primaryKey",
                create: textListControl(),
                label: "Primary keys",
                placeholder: "Enter primary key...",
                tooltip: SourcesTooltipsTexts.PRIMARY_KEYS,
                type: ControlType.ARRAY_KEY,
                options: {
                    buttonText: "+ Add primary key",
                },
            },
        ],
    },
};
