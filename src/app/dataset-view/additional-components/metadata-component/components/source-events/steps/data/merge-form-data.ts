/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { SourcesTooltipsTexts } from "@common/tooltips/sources.text";

import {
    ControlType,
    JsonFormData,
    MergeKind,
} from "src/app/dataset-view/additional-components/metadata-component/components/source-events/add-polling-source/add-polling-source-form.types";

export const MERGE_FORM_DATA: JsonFormData = {
    [MergeKind.APPEND]: {
        controls: [],
    },
    [MergeKind.LEDGER]: {
        controls: [
            {
                name: "primaryKey",
                label: "Primary keys",
                type: ControlType.ARRAY_KEY,
                placeholder: "Enter primary key...",
                tooltip: SourcesTooltipsTexts.PRIMARY_KEYS,
                options: {
                    buttonText: "+ Add primary key",
                },
                validators: {},
            },
        ],
    },
    [MergeKind.SNAPSHOT]: {
        controls: [
            {
                name: "primaryKey",
                label: "Primary keys",
                placeholder: "Enter primary key...",
                tooltip: SourcesTooltipsTexts.PRIMARY_KEYS,
                type: ControlType.ARRAY_KEY,
                options: {
                    buttonText: "+ Add primary key",
                },
                validators: {},
            },
            {
                name: "compareColumns",
                label: "Compare columns",
                placeholder: "Enter column name...",
                type: ControlType.ARRAY_KEY,
                tooltip: SourcesTooltipsTexts.COMPARE_COLUMNS,
                options: {
                    buttonText: "+ Add column name",
                },
                validators: {},
            },
        ],
    },

    [MergeKind.CHANGELOG_STREAM]: {
        controls: [
            {
                name: "primaryKey",
                label: "Primary keys",
                placeholder: "Enter primary key...",
                tooltip: SourcesTooltipsTexts.PRIMARY_KEYS,
                type: ControlType.ARRAY_KEY,
                options: {
                    buttonText: "+ Add primary key",
                },
                validators: {},
            },
        ],
    },
    [MergeKind.UPSERT_STREAM]: {
        controls: [
            {
                name: "primaryKey",
                label: "Primary keys",
                placeholder: "Enter primary key...",
                tooltip: SourcesTooltipsTexts.PRIMARY_KEYS,
                type: ControlType.ARRAY_KEY,
                options: {
                    buttonText: "+ Add primary key",
                },
                validators: {},
            },
        ],
    },
};
