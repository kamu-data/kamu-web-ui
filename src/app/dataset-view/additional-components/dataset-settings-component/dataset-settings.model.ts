/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

export enum SettingsTabsEnum {
    GENERAL = "general",
    SCHEDULING = "scheduling",
    INGEST_CONFIGURATION = "ingest-configuration",
    VARIABLES_AND_SECRETS = "variables-and-secrets",
    COMPACTION = "compaction",
    TRANSFORM_SETTINGS = "transform",
    ACCESS = "access",
    WEBHOOKS = "webhooks",
}

export enum ScheduleType {
    TIME_DELTA = "TimeDelta",
    CRON_5_COMPONENT_EXPRESSION = "Cron5ComponentExpression",
}

export enum BatchingRuleType {
    IMMEDIATE = "Immediate",
    BUFFERING = "Buffering",
}

export enum FlowTriggerStopPolicyType {
    NEVER = "Never",
    AFTER_CONSECUTIVE_FAILURES = "AfterConsecutiveFailures",
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

export const DATASET_SETTINGS_SIDE_PANEL_DATA: DatasetSettingsSidePanelItem[] = [
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
        name: "Ingest configuration",
        iconName: "configuration",
        showDivider: false,
        activeTab: SettingsTabsEnum.INGEST_CONFIGURATION,
        iconClassName: "ms-1 me-2 mb-1 scheduled-icon",
        id: "ingestConfiguration",
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
    {
        name: "Webhooks",
        iconName: "webhook",
        showDivider: false,
        visible: true,
        activeTab: SettingsTabsEnum.WEBHOOKS,
        iconClassName: "ms-1 me-2 mb-1 access-icon",
        id: "webhooks",
    },
];
