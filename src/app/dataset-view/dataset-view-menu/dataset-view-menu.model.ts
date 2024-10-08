import { DatasetPermissionsFragment } from "src/app/api/kamu.graphql.interface";
import { ElementVisibilityMode } from "./visibility-mode.service";

export interface DatasetMenuItemOptions {
    dataTestId: string;
    value: string;
    label: string;
    icon: string;
    disabled?: boolean;
    showAdminIcon?: boolean;
    shouldAllowTab: (viewMode: ElementVisibilityMode, permissions: DatasetPermissionsFragment | null) => boolean;
}

export const DatasetViewMenuItems: DatasetMenuItemOptions[] = [
    {
        dataTestId: "navigateToOverview",
        value: "overview",
        label: "Overview",
        icon: "visibility",
        shouldAllowTab: (viewMode: ElementVisibilityMode) => {
            return viewMode !== ElementVisibilityMode.UNAVAILABLE;
        },
    },
    {
        dataTestId: "navigateToData",
        value: "data",
        label: "Data",
        icon: "dataset",
        shouldAllowTab: (viewMode: ElementVisibilityMode) => {
            return viewMode !== ElementVisibilityMode.UNAVAILABLE;
        },
    },
    {
        dataTestId: "navigateToMetadata",
        value: "metadata",
        label: "Metadata",
        icon: "dataset_linked",
        shouldAllowTab: (viewMode: ElementVisibilityMode) => {
            return viewMode !== ElementVisibilityMode.UNAVAILABLE;
        },
    },
    {
        dataTestId: "navigateToHistory",
        value: "history",
        label: "History",
        icon: "manage_history",
        shouldAllowTab: (viewMode: ElementVisibilityMode) => {
            return viewMode !== ElementVisibilityMode.UNAVAILABLE;
        },
    },
    {
        dataTestId: "navigateToLineage",
        value: "lineage",
        label: "Lineage",
        icon: "account_tree",
        shouldAllowTab: (viewMode: ElementVisibilityMode) => {
            return viewMode !== ElementVisibilityMode.UNAVAILABLE;
        },
    },

    {
        dataTestId: "navigateToDiscussion",
        value: "discussions",
        label: "Discussions",
        icon: "message",
        disabled: true,
        shouldAllowTab: (viewMode: ElementVisibilityMode) => {
            return viewMode !== ElementVisibilityMode.UNAVAILABLE;
        },
    },
    {
        dataTestId: "navigateToFlows",
        value: "flows",
        label: "Flows",
        icon: "add_task",
        showAdminIcon: true,
        shouldAllowTab: (viewMode: ElementVisibilityMode, permissions: DatasetPermissionsFragment | null) => {
            return (
                viewMode === ElementVisibilityMode.AVAILABLE_VIA_ADMIN_PRIVILEGES ||
                Boolean(permissions?.permissions.canSchedule)
            );
        },
    },
    {
        dataTestId: "navigateToSettings",
        value: "settings",
        label: "Settings",
        icon: "settings",
        showAdminIcon: true,
        shouldAllowTab: (viewMode: ElementVisibilityMode, permissions: DatasetPermissionsFragment | null) => {
            return (
                viewMode === ElementVisibilityMode.AVAILABLE_VIA_ADMIN_PRIVILEGES ||
                Boolean(permissions?.permissions.canDelete) ||
                Boolean(permissions?.permissions.canRename)
            );
        },
    },
];
