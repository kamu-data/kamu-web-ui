import { DatasetPermissionsFragment } from "src/app/api/kamu.graphql.interface";
import { DatasetViewTypeEnum } from "../dataset-view.interface";

export interface DatasetMenuItemOptions {
    dataTestId: string;
    value: DatasetViewTypeEnum;
    label: string;
    icon: string;
    tab: DatasetViewTypeEnum | null;
    disabled?: boolean;
    showAdminIcon?: boolean;
    shouldAllowTab: (data: DatasetPermissionsFragment) => boolean;
}

export const DatasetViewMenuItems = [
    {
        dataTestId: "navigateToOverview",
        value: DatasetViewTypeEnum.Overview,
        label: "Overview",
        icon: "visibility",
        tab: null,
        shouldAllowTab: (data: DatasetPermissionsFragment) => {
            return data.permissions.canView;
        },
    },
    {
        dataTestId: "navigateToData",
        value: DatasetViewTypeEnum.Data,
        label: "Data",
        icon: "dataset",
        tab: DatasetViewTypeEnum.Data,
        shouldAllowTab: (data: DatasetPermissionsFragment) => {
            return data.permissions.canView;
        },
    },
    {
        dataTestId: "navigateToMetadata",
        value: DatasetViewTypeEnum.Metadata,
        label: "Metadata",
        icon: "dataset_linked",
        tab: DatasetViewTypeEnum.Metadata,
        shouldAllowTab: (data: DatasetPermissionsFragment) => {
            return data.permissions.canView;
        },
    },
    {
        dataTestId: "navigateToHistory",
        value: DatasetViewTypeEnum.History,
        label: "History",
        icon: "manage_history",
        tab: DatasetViewTypeEnum.History,
        shouldAllowTab: (data: DatasetPermissionsFragment) => {
            return data.permissions.canView;
        },
    },
    {
        dataTestId: "navigateToLineage",
        value: DatasetViewTypeEnum.Lineage,
        label: "Lineage",
        icon: "account_tree",
        tab: DatasetViewTypeEnum.Lineage,
        shouldAllowTab: (data: DatasetPermissionsFragment) => {
            return data.permissions.canView;
        },
    },
    {
        dataTestId: "navigateToDiscussion",
        value: DatasetViewTypeEnum.Discussions,
        label: "Discussions",
        icon: "message",
        tab: DatasetViewTypeEnum.Discussions,
        disabled: true,
        shouldAllowTab: (data: DatasetPermissionsFragment) => {
            return data.permissions.canView;
        },
    },
    {
        dataTestId: "navigateToFlows",
        value: DatasetViewTypeEnum.Flows,
        label: "Flows",
        icon: "add_task",
        tab: DatasetViewTypeEnum.Flows,
        showAdminIcon: true,
        shouldAllowTab: (data: DatasetPermissionsFragment) => {
            return data.permissions.canSchedule;
        },
    },
    {
        dataTestId: "navigateToSettings",
        value: DatasetViewTypeEnum.Settings,
        label: "Settings",
        icon: "settings",
        tab: DatasetViewTypeEnum.Settings,
        showAdminIcon: true,
        shouldAllowTab: (data: DatasetPermissionsFragment) => {
            return data.permissions.canDelete || data.permissions.canRename;
        },
    },
];
