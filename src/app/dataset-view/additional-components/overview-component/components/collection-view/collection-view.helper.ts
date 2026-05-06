/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { CollectionEntryDataFragment, DatasetArchetype } from "@api/kamu.graphql.interface";

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
            if (segments.length > maxDepth + 1 && node.asDataset.asVersionedFile) {
                const currentFolder = segments[maxDepth];
                if (currentFolder !== lastFolder) {
                    result.push({
                        ...node,
                        archetype: DatasetArchetype.Collection,
                        displayName: currentFolder,
                        systemTime: node.systemTime,

                        hash: node.asDataset.asVersionedFile.latest?.contentHash!,
                        size: 0,
                        contentType: null,
                    });
                    lastFolder = currentFolder;
                }
            } else {
                if (node.asDataset?.asVersionedFile?.latest) {
                    result.push({
                        ...node,
                        archetype: DatasetArchetype.VersionedFile,
                        displayName: segments[maxDepth],
                        systemTime: node.systemTime,

                        hash: node.asDataset.asVersionedFile.latest?.contentHash,
                        size: node.asDataset.asVersionedFile.latest?.contentLength,
                        contentType: node.asDataset.asVersionedFile.latest?.contentType,
                    });
                } else {
                    result.push({
                        ...node,
                        archetype: null,
                        displayName: segments[maxDepth],
                        systemTime: node.systemTime,
                        hash: node.asDataset.head,
                        size: node.asDataset.data.estimatedSizeBytes,
                        contentType: null,
                    });
                }
            }
        }
    });
    // Sort: folders first
    result.sort((a: CollectionEntryViewType, b: CollectionEntryViewType) => {
        if (a.archetype === b.archetype) return 0;
        if (a.archetype === DatasetArchetype.Collection) return -1;
        return 1;
    });

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
