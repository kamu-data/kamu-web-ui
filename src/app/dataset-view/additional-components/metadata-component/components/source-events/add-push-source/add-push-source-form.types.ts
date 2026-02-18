/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { Transform } from "stream";

import {
    MergeKind,
    PreprocessKind,
    ReadKind,
} from "src/app/dataset-view/additional-components/metadata-component/components/source-events/add-polling-source/add-polling-source-form.types";

export enum AddPushSourceSection {
    SOURCE_NAME = "sourceName",
    READ = "read",
    MERGE = "merge",
    PREPROCESS = "preprocess",
}

export interface EditAddPushSourceParseType {
    content: {
        event: AddPushSourceEditFormType;
    };
}

export interface AddPushSourceEditFormType {
    kind?: string;
    sourceName: string;
    read: {
        kind: ReadKind;
        jsonKind?: ReadKind;
        subPath?: string;
        schema?: string[];
        separator?: string;
        encoding?: string;
        quote?: string;
        escape?: string;
        dateFormat?: string;
        timestampFormat?: string;
    };
    merge: {
        kind: MergeKind;
        primaryKey?: string[];
        compareColumns?: string[];
    };
    preprocess?: Transform & {
        kind: PreprocessKind.SQL;
        query?: string;
    };
}
