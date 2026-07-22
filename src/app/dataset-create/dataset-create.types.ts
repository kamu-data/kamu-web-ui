/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { FormControl } from "@angular/forms";

import AppValues from "@common/values/app.values";
import { DatasetKind, DatasetVisibility } from "@api/kamu.graphql.interface";

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

export enum ArchetypeViewType {
    DATASET_WITH_DATA = "Dataset with data",
    COLLECTION = "Collection",
    VERSIONED_FILE = "Versioned file",
}

export interface SelectArchetypeType {
    id: number;
    value: ArchetypeViewType;
    label: string;
    image: string;
    iconClass: string;
    tooltip: string;
}

export const ARCHETYPE_LIST: SelectArchetypeType[] = [
    {
        id: 1,
        value: ArchetypeViewType.DATASET_WITH_DATA,
        label: "Structured Dataset",
        image: AppValues.DATASET_WITH_DATA_LOGO,
        iconClass: "kamu-icon",
        tooltip: "Store and process structured data. Supports ingestion, queries, and transformations.",
    },
    {
        id: 2,
        value: ArchetypeViewType.VERSIONED_FILE,
        label: "Versioned File",
        image: AppValues.DATASET_VERSIONED_FILE_LOGO,
        iconClass: "kamu-icon",
        tooltip: "Store a single file while preserving every uploaded version.",
    },
    {
        id: 3,
        value: ArchetypeViewType.COLLECTION,
        label: "Collection",
        image: AppValues.DATASET_COLLECTION_LOGO,
        iconClass: "kamu-icon",
        tooltip: "Organize links to datasets and versioned files in a folder-like hierarchy.",
    },
];
