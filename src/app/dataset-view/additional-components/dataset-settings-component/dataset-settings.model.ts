/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

export enum SettingsTabsEnum {
    GENERAL = "general",
    SCHEDULING = "scheduling",
    VARIABLES_AND_SECRETS = "variables-and-secrets",
    COMPACTION = "compaction",
    TRANSFORM_SETTINGS = "transform",
    ACCESS = "access",
}

export enum PollingGroupEnum {
    TIME_DELTA = "TimeDelta",
    CRON_5_COMPONENT_EXPRESSION = "Cron5ComponentExpression",
}

export enum ThrottlingGroupEnum {
    AWAIT_FOR = "awaitFor",
    AWAIT_UNTIL = "awaitUntil",
}

export interface DatasetSettingsSidePanelItem {
    name: string;
    iconName: string;
    showDivider: boolean;
    activeTab: SettingsTabsEnum;
    id: string;
    visible?: boolean;
    iconClassName?: string;
}

export const datasetSettingsSidePanelData: DatasetSettingsSidePanelItem[] = [
    {
        name: "General",
        iconName: "account",
        showDivider: true,
        activeTab: SettingsTabsEnum.GENERAL,
        visible: true,
        iconClassName: "ms-1 me-2",
        id: "general",
    },
    {
        name: "Scheduled updates",
        iconName: "clock",
        showDivider: false,
        activeTab: SettingsTabsEnum.SCHEDULING,
        iconClassName: "ms-1 me-2 mb-1 scheduled-icon",
        id: "scheduling",
    },
    {
        name: "Transform settings",
        iconName: "tree-structure",
        showDivider: false,
        activeTab: SettingsTabsEnum.TRANSFORM_SETTINGS,
        iconClassName: "ms-1 me-2 mb-1 transform-icon",
        id: "transformOptions",
    },
    {
        name: "Compaction",
        iconName: "compact",
        showDivider: false,
        activeTab: SettingsTabsEnum.COMPACTION,
        iconClassName: "ms-1 me-2",
        id: "compaction",
    },
    {
        name: "Variables and secrets",
        iconName: "security",
        showDivider: false,
        activeTab: SettingsTabsEnum.VARIABLES_AND_SECRETS,
        iconClassName: "mr-2 ms-3px",
        id: "varsSecrets",
    },
    {
        name: "Access",
        iconName: "people",
        showDivider: false,
        visible: true,
        activeTab: SettingsTabsEnum.ACCESS,
        iconClassName: "ms-1 me-2 mb-1 access-icon",
        id: "access",
    },
];
