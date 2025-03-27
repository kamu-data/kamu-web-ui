/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ControlType, JsonFormData, MergeKind } from "../../add-polling-source/add-polling-source-form.types";
import { SourcesTooltipsTexts } from "src/app/common/tooltips/sources.text";

export const MERGE_FORM_DATA: JsonFormData = {
    [MergeKind.APPEND]: {
        controls: [],
    },
    [MergeKind.LEDGER]: {
        controls: [
            {
                name: "primaryKey",
                label: "Primary keys",
                value: "",
                type: ControlType.ARRAY_KEY,
                placeholder: "Enter primary key...",
                tooltip: SourcesTooltipsTexts.PRIMARY_KEYS,
                options: {
                    formArrayName: "primaryKey",
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
                value: "",
                tooltip: SourcesTooltipsTexts.PRIMARY_KEYS,
                type: ControlType.ARRAY_KEY,
                options: {
                    formArrayName: "primaryKey",
                    buttonText: "+ Add primary key",
                },
                validators: {},
            },
            {
                name: "compareColumns",
                label: "Compare columns",
                placeholder: "Enter column name...",
                value: "",
                type: ControlType.ARRAY_KEY,
                tooltip: SourcesTooltipsTexts.COMPARE_COLUMNS,
                options: {
                    formArrayName: "compareColumns",
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
                value: "",
                tooltip: SourcesTooltipsTexts.PRIMARY_KEYS,
                type: ControlType.ARRAY_KEY,
                options: {
                    formArrayName: "primaryKey",
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
                value: "",
                tooltip: SourcesTooltipsTexts.PRIMARY_KEYS,
                type: ControlType.ARRAY_KEY,
                options: {
                    formArrayName: "primaryKey",
                    buttonText: "+ Add primary key",
                },
                validators: {},
            },
        ],
    },
};
