import { DatasetPermissionsFragment } from "src/app/api/kamu.graphql.interface";

export interface DatasetMenuItemOptions {
    dataTestId: string;
    value: string;
    label: string;
    icon: string;
    disabled?: boolean;
    showAdminIcon?: boolean;
    shouldAllowTab: (datasetPermissions: DatasetPermissionsFragment, adminPrivileges?: boolean) => boolean;
}

export const DatasetViewMenuItems: DatasetMenuItemOptions[] = [
    {
        dataTestId: "navigateToOverview",
        value: "overview",
        label: "Overview",
        icon: "visibility",
        shouldAllowTab: (datasetPermissions: DatasetPermissionsFragment) => {
            return datasetPermissions.permissions.canView;
        },
    },
    {
        dataTestId: "navigateToData",
        value: "data",
        label: "Data",
        icon: "dataset",
        shouldAllowTab: (datasetPermissions: DatasetPermissionsFragment) => {
            return datasetPermissions.permissions.canView;
        },
    },
    {
        dataTestId: "navigateToMetadata",
        value: "metadata",
        label: "Metadata",
        icon: "dataset_linked",
        shouldAllowTab: (datasetPermissions: DatasetPermissionsFragment) => {
            return datasetPermissions.permissions.canView;
        },
    },
    {
        dataTestId: "navigateToHistory",
        value: "history",
        label: "History",
        icon: "manage_history",
        shouldAllowTab: (datasetPermissions: DatasetPermissionsFragment) => {
            return datasetPermissions.permissions.canView;
        },
    },
    {
        dataTestId: "navigateToLineage",
        value: "lineage",
        label: "Lineage",
        icon: "account_tree",
        shouldAllowTab: (datasetPermissions: DatasetPermissionsFragment) => {
            return datasetPermissions.permissions.canView;
        },
    },

    {
        dataTestId: "navigateToDiscussion",
        value: "discussions",
        label: "Discussions",
        icon: "message",
        disabled: true,
        shouldAllowTab: (datasetPermissions: DatasetPermissionsFragment) => {
            return datasetPermissions.permissions.canView;
        },
    },
    {
        dataTestId: "navigateToFlows",
        value: "flows",
        label: "Flows",
        icon: "add_task",
        showAdminIcon: true,
        shouldAllowTab: (datasetPermissions: DatasetPermissionsFragment, adminPrivileges?: boolean) => {
            return Boolean(adminPrivileges) || datasetPermissions?.permissions.canSchedule;
        },
    },
    {
        dataTestId: "navigateToSettings",
        value: "settings",
        label: "Settings",
        icon: "settings",
        showAdminIcon: true,
        shouldAllowTab: (datasetPermissions: DatasetPermissionsFragment, adminPrivileges?: boolean) => {
            return (
                Boolean(adminPrivileges) ||
                datasetPermissions.permissions.canDelete ||
                datasetPermissions.permissions.canRename
            );
        },
    },
];
