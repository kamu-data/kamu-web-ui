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
