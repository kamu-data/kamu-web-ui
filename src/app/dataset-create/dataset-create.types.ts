/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { FormControl } from "@angular/forms";

import { DatasetKind, DatasetVisibility } from "../api/kamu.graphql.interface";
import AppValues from "../common/values/app.values";

export interface CreateDatasetFormType {
    owner: FormControl<string>;
    datasetName: FormControl<string>;
    kind: FormControl<DatasetKind>;
    visibility: FormControl<DatasetVisibility>;
}
export interface SelectStorageItemType {
    id: number;
    storageName: string;
    image: string;
    iconClass: string;
    disabled: boolean;
}

export const STORAGE_LIST: SelectStorageItemType[] = [
    {
        id: 1,
        storageName: "Kamu managed (US West)",
        image: AppValues.APP_LOGO,
        iconClass: "kamu-icon",
        disabled: false,
    },
    { id: 2, storageName: "Kamu managed (EU)", image: AppValues.APP_LOGO, iconClass: "kamu-icon", disabled: true },
    {
        id: 3,
        storageName: "Bring your own S3 Event (BYO)",
        image: AppValues.AMAZON_S3_BYO_LOGO,
        iconClass: "byo-icon",
        disabled: true,
    },
    {
        id: 4,
        storageName: "InterPlanetary File Sysytem (IPFS)",
        image: AppValues.IPFS_LOGO,
        iconClass: "ipfs-icon",
        disabled: true,
    },
];
