/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

export enum MetadataTabs {
    SCHEMA = "schema",
    POLLING_SOURCE = "pollingSource",
    PUSH_SOURCES = "pushSources",
    TRANSFORM = "transform",
    WATERMARK = "watermark",
    LICENSE = "license",
}

export interface MetadataMenuItem {
    iconName: string;
    activeTab: MetadataTabs;
    label: string;
    class?: string;
}
