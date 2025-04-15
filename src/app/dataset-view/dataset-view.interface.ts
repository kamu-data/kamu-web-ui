/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { DatasetBasicsFragment, DatasetPermissionsFragment } from "../api/kamu.graphql.interface";
import { OverviewUpdate } from "./dataset.subscriptions.interface";

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

export interface DatasetOverviewTabData {
    datasetBasics: DatasetBasicsFragment;
    datasetPermissions: DatasetPermissionsFragment;
    overviewUpdate: OverviewUpdate;
}

export interface DatasetViewData {
    datasetBasics: DatasetBasicsFragment;
    datasetPermissions: DatasetPermissionsFragment;
}
