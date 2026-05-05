/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { CollectionEntryDataFragment } from "@api/kamu.graphql.interface";

import { CollectionEntryViewType } from "./collection-view.model";

export function sortCollectionEntryData(
    nodes: CollectionEntryDataFragment[],
    maxDepth: number,
): CollectionEntryViewType[] {
    const result: CollectionEntryViewType[] = [];
    let lastFolder = "";

    // Grouping for displaying the folder header once
    nodes.forEach((node: CollectionEntryDataFragment) => {
        if (node.asDataset) {
            const segments = node.path.split("/").filter(Boolean);
            if (segments.length > maxDepth + 1) {
                const currentFolder = segments[maxDepth];
                if (currentFolder !== lastFolder) {
                    result.push({
                        ...node,
                        isFolder: true,
                        displayName: currentFolder,
                        systemTime: node.systemTime,
                    });
                    lastFolder = currentFolder;
                }
            } else {
                result.push({
                    ...node,
                    isFolder: false,
                    displayName: segments[maxDepth],
                    systemTime: node.systemTime,
                });
            }
        }
    });
    // Sort: folders first
    result.sort((a: CollectionEntryViewType, b: CollectionEntryViewType) => Number(b.isFolder) - Number(a.isFolder));

    return result;
}

export function getCollectionValueHelper(value: unknown): string {
    if (Array.isArray(value)) {
        return value.length > 0 ? value.join(", ") : "-";
    }

    if (value === null || value === undefined || value === "") {
        return "-";
    }
    return value as string;
}
