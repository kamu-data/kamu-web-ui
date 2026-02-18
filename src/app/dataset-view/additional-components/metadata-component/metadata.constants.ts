/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import {
    DatasetBasicsFragment,
    DatasetMetadataSummaryFragment,
    DatasetPermissionsFragment,
} from "@api/kamu.graphql.interface";

export enum MetadataTabs {
    Schema = "schema",
    PollingSource = "polling-source",
    PushSources = "push-sources",
    Transformation = "transformation",
    Watermark = "watermark",
    License = "license",
}

export interface MetadataTabData {
    datasetBasics: DatasetBasicsFragment;
    datasetPermissions: DatasetPermissionsFragment;
    metadataSummary: DatasetMetadataSummaryFragment;
}

export interface MetadataMenuItem {
    iconName: string;
    activeTab: MetadataTabs;
    label: string;
    class?: string;
}

export const METADATA_TAB_MENU_ITEMS: MetadataMenuItem[] = [
    {
        iconName: "table-chart-outline",
        activeTab: MetadataTabs.Schema,
        label: "Schema",
    },
    {
        iconName: "source_notes",
        activeTab: MetadataTabs.PollingSource,
        label: "Polling source",
    },
    {
        iconName: "enable",
        activeTab: MetadataTabs.PushSources,
        label: "Push sources",
    },
    {
        iconName: "tree-structure",
        activeTab: MetadataTabs.Transformation,
        label: "Transformation",
    },
    {
        iconName: "receipt_long",
        activeTab: MetadataTabs.License,
        label: "License",
    },
    {
        iconName: "timeline",
        activeTab: MetadataTabs.Watermark,
        label: "Watermark",
    },
];
