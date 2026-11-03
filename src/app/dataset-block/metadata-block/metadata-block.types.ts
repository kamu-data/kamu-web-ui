/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { MetadataBlockFragment, MetadataBlocksFilter } from "@api/kamu.graphql.interface";

import { SupportedEvents } from "src/app/dataset-block/metadata-block/components/event-details/supported.events";

export interface MetadataBlockInfo {
    block: MetadataBlockFragment;
    blockAsYaml: string;
    downstreamsCount: number;
}

/** What the block list of the metadata block page is narrowed to, as its URL holds it. */
export interface BlockListFilter {
    eventTypes: SupportedEvents[];
    hashPrefix: string;
}

/** One page of the block list, as the API is asked for it. */
export interface BlockListRequest {
    page: number;
    filter: MetadataBlocksFilter;
}

export enum BlockView {
    YAML = "yaml",
    PROPERTIES = "properties",
}
