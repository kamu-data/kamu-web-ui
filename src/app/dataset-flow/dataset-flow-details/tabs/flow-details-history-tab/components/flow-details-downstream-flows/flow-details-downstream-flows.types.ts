/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

export interface DownstreamFlowItem {
    flowId: string;
    icon: { icon: string; class: string };
    // Set only when the downstream flow is visible to the user
    flowLink: string[] | null;
    flowStatusDescription: string | null;
    // Set only when the downstream dataset is readable by the user
    datasetLink: string[] | null;
    datasetAlias: string | null;
    // Set when the downstream dataset was deleted or is not readable by the user
    unavailableDatasetId: string | null;
}
