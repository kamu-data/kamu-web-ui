import { CollectionEntryDataFragment } from "@api/kamu.graphql.interface";

import { CollectionEntryViewType } from "./collection-view.model";

export function sortCollectionEntryData(nodes: CollectionEntryDataFragment[]): CollectionEntryViewType[] {
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

        if (segments.length > 1) {
            const currentFolder = segments[0];
            if (currentFolder !== lastFolder) {
                result.push({ ...node, isFolder: true, displayName: currentFolder });
                lastFolder = currentFolder;
            }
        } else {
            result.push({ ...node, isFolder: false, displayName: segments[0] });
        }
    });

    return result;
}
