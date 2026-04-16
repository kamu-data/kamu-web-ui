/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { DatasetArchetype } from "@api/kamu.graphql.interface";

import { OverviewTabMode } from "src/app/dataset-view/dataset-view.interface";

export interface ViewModeButtonsOptions {
    value: OverviewTabMode;
    icon: string;
    tooltip: string;
    archetype: DatasetArchetype | null;
}

export const VIEW_MODE_BUTTONS_OPTIONS: ViewModeButtonsOptions[] = [
    {
        value: OverviewTabMode.VersionedFile,
        icon: "clarify",
        tooltip: "File view",
        archetype: DatasetArchetype.VersionedFile,
    },
    {
        value: OverviewTabMode.Collection,
        icon: "folder",
        tooltip: "Collection view",
        archetype: DatasetArchetype.Collection,
    },
    {
        value: OverviewTabMode.Table,
        icon: "table-chart-outline",
        tooltip: "Table view",
        archetype: null,
    },
];

export function extractAndAddExtension(filename: string): string {
    const KNOWN_EXTENSIONS = [
        "jpg",
        "jpeg",
        "png",
        "gif",
        "webp",
        "svg", // Images
        "pdf",
        "doc",
        "docx",
        "xls",
        "xlsx",
        "ppt",
        "pptx", // Documents
        "mp3",
        "mp4",
        "avi",
        "mov",
        "wav", // Media
        "zip",
        "rar",
        "7z",
        "tar",
        "gz", // Archive
        "txt",
        "md",
        "json",
        "xml",
        "html",
        "css",
        "js",
        "ts", // Text
    ];

    for (const ext of KNOWN_EXTENSIONS) {
        const pattern = new RegExp(`-${ext}$`, "i");
        if (pattern.test(filename)) {
            return filename.replace(pattern, `.${ext}`);
        }
    }

    return filename;
}
