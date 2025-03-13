/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { DatasetAccessRole } from "src/app/api/kamu.graphql.interface";

export interface SelectRoleType {
    label: string;
    value: DatasetAccessRole;
    hint: string;
}

export const ROLE_OPTIONS: SelectRoleType[] = [
    {
        label: "Reader",
        value: DatasetAccessRole.Reader,
        hint: "Can view data and metadata and execute queries",
    },
    {
        label: "Editor",
        value: DatasetAccessRole.Editor,
        hint: "Can add new data and edit metadata",
    },
    {
        label: "Maintainer",
        value: DatasetAccessRole.Maintainer,
        hint: "Can manage the dataset without access to sensitive or destructive actions",
    },
];
