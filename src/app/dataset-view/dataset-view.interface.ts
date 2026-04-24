/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import {
    DatasetArchetype,
    DatasetBasicsFragment,
    DatasetPermissionsFragment,
    VersionedFileEntryDataFragment,
} from "@api/kamu.graphql.interface";

import { OverviewUpdate } from "src/app/dataset-view/dataset.subscriptions.interface";

import { MaybeNull } from "./../interface/app.types";

export enum DatasetViewTypeEnum {
    Overview = "overview",
    Data = "data",
    Metadata = "metadata",
    Lineage = "lineage",
    Discussions = "discussions",
    History = "history",
    Settings = "settings",
    Flows = "flows",
}

export interface DatasetViewData {
    datasetBasics: DatasetBasicsFragment;
    datasetPermissions: DatasetPermissionsFragment;
}

export interface DatasetOverviewTabData extends DatasetViewData {
    overviewUpdate: OverviewUpdate;
}

export enum OverviewTabMode {
    Table = "table",
    VersionedFile = "versionedFile",
    Collection = "collection",
}

export interface VersionedFileView {
    name: string;
    fileInfo: MaybeNull<VersionedFileEntryDataFragment>;
    countVersions?: number;
}

export function selectOverviewTabMode(archetype: DatasetArchetype): OverviewTabMode {
    switch (archetype) {
        case DatasetArchetype.VersionedFile:
            return OverviewTabMode.VersionedFile;
        case DatasetArchetype.Collection:
            return OverviewTabMode.Collection;
        default: {
            return OverviewTabMode.Table;
        }
    }
}
