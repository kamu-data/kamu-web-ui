/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { CollectionEntryDataFragment, DatasetArchetype } from "@api/kamu.graphql.interface";

import { PreviewFileTypePipe } from "../versioned-file-view/pipes/preview-file-type.pipe";
import { CollectionEntryViewType, CollectionViewNode } from "./collection-view.model";

export function sortCollectionEntryData(
    nodes: CollectionEntryDataFragment[],
    maxDepth: number,
): CollectionEntryViewType[] {
    const grouped = new Map<string, CollectionEntryViewType>();

    nodes.forEach((node: CollectionEntryDataFragment) => {
        const segments = node.path.split("/").filter(Boolean);
        const displayName = segments[maxDepth] || node.ref;
        const isFolder = segments.length > maxDepth + 1;

        // Grouping key: if it's path is nested, group by name; if it's a file, group by unique ref
        const groupKey = isFolder ? `dir:${displayName}` : `file:${node.ref}`;
        if (grouped.has(groupKey)) return;

        if (node.asDataset) {
            const latest = node.asDataset.asVersionedFile?.latest;

            if (isFolder && node.asDataset.asVersionedFile) {
                grouped.set(groupKey, {
                    ...node,
                    nodeType: CollectionViewNode.Folder,
                    displayName,
                    systemTime: node.systemTime,
                    hash: latest?.contentHash || null,
                    size: 0,
                    contentType: null,
                });
            } else {
                grouped.set(groupKey, {
                    ...node,
                    nodeType: latest ? CollectionViewNode.File : CollectionViewNode.Dataset,
                    displayName,
                    systemTime: node.systemTime,
                    hash: latest?.contentHash ?? node.asDataset.head,
                    size: latest?.contentLength ?? node.asDataset.data.estimatedSizeBytes,
                    contentType: latest?.contentType ?? null,
                });
            }
        } else {
            // Case without asDataset
            grouped.set(groupKey, {
                ...node,
                nodeType: CollectionViewNode.Broken,
                displayName: node.ref,
                systemTime: node.systemTime,
                hash: null,
                size: null,
                contentType: null,
            });
        }
    });
    return Array.from(grouped.values()).sort((a, b) => {
        // 1. Folders (Collection) always take priority
        const isFolderA = a.nodeType === CollectionViewNode.Folder;
        const isFolderB = b.nodeType === CollectionViewNode.Folder;
        if (isFolderA !== isFolderB) {
            return isFolderA ? -1 : 1;
        }
        // 2. Sort by name (alphabetical) within groups
        return a.displayName.localeCompare(b.displayName);
    });
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

export function resolveEntryIconHelper(element: CollectionEntryViewType): string {
    const previewFileTypePipe = new PreviewFileTypePipe();
    if (element.nodeType === CollectionViewNode.Folder) {
        return "collection-folder";
    }
    if (element.nodeType === CollectionViewNode.Dataset) {
        return "database";
    }

    if (element.nodeType === CollectionViewNode.Broken) {
        return "question";
    }
    return previewFileTypePipe.transform(element.contentType as string);
}
