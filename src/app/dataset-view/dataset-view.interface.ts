/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { OverviewUpdate } from "src/app/dataset-view/dataset.subscriptions.interface";

import { DatasetBasicsFragment, DatasetPermissionsFragment } from "@api/kamu.graphql.interface";

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
