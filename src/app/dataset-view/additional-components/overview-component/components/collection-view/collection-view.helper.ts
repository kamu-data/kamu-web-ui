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

    // Sort: folders first, then files + alphabetical
    const sorted = [...nodes].sort((a, b) => {
        const segmentsA = a.path.split("/").filter(Boolean);
        const segmentsB = b.path.split("/").filter(Boolean);

        const isFolderA = segmentsA.length > 1;
        const isFolderB = segmentsB.length > 1;

        // 1. Prioritize folders
        if (isFolderA && !isFolderB) return -1;
        if (!isFolderA && isFolderB) return 1;

        // 2. If both are folders or both are files, sort alphabetically.
        return a.path.localeCompare(b.path);
    });

    // Grouping for displaying the folder header once
    sorted.forEach((node) => {
        const segments = node.path.split("/").filter(Boolean);
        if (segments.length > maxDepth + 1) {
            const currentFolder = segments[maxDepth];
            if (currentFolder !== lastFolder) {
                result.push({ ...node, isFolder: true, displayName: currentFolder });
                lastFolder = currentFolder;
            }
        } else {
            result.push({ ...node, isFolder: false, displayName: segments[maxDepth] });
        }
    });

    return result;
}

export function getFileIconHelper(contentType: string): string {
    if (!contentType) return "default-file";

    if (contentType.startsWith("image/")) return "image-file";
    if (contentType.startsWith("video/")) return "video-file";
    if (contentType.startsWith("audio/")) return "mp3-file";

    switch (contentType) {
        case "application/pdf":
            return "pdf-file";
        case "text/plain":
            return "txt-file";

        default:
            return "default-file";
    }
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
