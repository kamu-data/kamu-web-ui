/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { DataSchemaField } from "@interface/dataset-schema.interface";

import {
    MergeStepValue,
    PreprocessValue,
    ReadStepValue,
} from "src/app/dataset-view/additional-components/metadata-component/components/source-events/add-polling-source/add-polling-source-form.types";

export enum AddPushSourceSection {
    SOURCE_NAME = "sourceName",
    READ = "read",
    MERGE = "merge",
    PREPROCESS = "preprocess",
}

export interface EditAddPushSourceParseType {
    content: {
        event: Omit<AddPushSourceEditFormType, "read"> & {
            read: Omit<ReadStepValue, "schema"> & {
                schema?: {
                    fields: DataSchemaField[];
                };
            };
        };
    };
}

/** An `AddPushSource` event: what the editor reads from YAML and writes back. */
export interface AddPushSourceEditFormType {
    kind?: string;
    sourceName: string;
    read: ReadStepValue;
    preprocess?: PreprocessValue;
    merge: MergeStepValue;
}
