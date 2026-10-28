/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { SourcesTooltipsTexts } from "@common/tooltips/sources.text";
import { uniqueItemsValidator } from "@common/validation/collection.validators";

import {
    ControlType,
    MergeKind,
} from "src/app/dataset-view/additional-components/metadata-component/components/source-events/add-polling-source/add-polling-source-form.types";
import {
    JsonFormControl,
    JsonFormData,
    MergeControls,
} from "src/app/dataset-view/additional-components/metadata-component/components/source-events/source-event-controls.types";
import { textListControl } from "src/app/dataset-view/additional-components/metadata-component/components/source-events/source-section";

/** The primary key field, the same for every merge strategy that needs one. */
const PRIMARY_KEY: JsonFormControl<MergeControls> = {
    name: "primaryKey",
    create: textListControl(),
    required: true,
    validators: [uniqueItemsValidator((key) => key.value)],
    label: "Primary keys",
    type: ControlType.ARRAY_KEY,
    placeholder: "Enter primary key...",
    tooltip: SourcesTooltipsTexts.PRIMARY_KEYS,
    options: {
        buttonText: "+ Add primary key",
    },
};

export const MERGE_FORM_DATA: JsonFormData<MergeControls> = {
    [MergeKind.APPEND]: {
        controls: [],
    },
    [MergeKind.LEDGER]: {
        controls: [PRIMARY_KEY],
    },
    [MergeKind.SNAPSHOT]: {
        controls: [
            PRIMARY_KEY,
            {
                name: "compareColumns",
                create: textListControl(),
                validators: [uniqueItemsValidator((column) => column.value)],
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
        controls: [PRIMARY_KEY],
    },
    [MergeKind.UPSERT_STREAM]: {
        controls: [PRIMARY_KEY],
    },
};
