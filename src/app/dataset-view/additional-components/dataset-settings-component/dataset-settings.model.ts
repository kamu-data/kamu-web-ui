export enum SettingsTabsEnum {
    GENERAL = "general",
    SCHEDULING = "scheduling",
    VARIABLES_AND_SECRETS = "variablesAndSecrets",
    COMPACTION = "compaction",
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
        iconClassName: "mr-1",
    },
    {
        name: "Scheduling",
        iconName: "clock",
        showDivider: false,
        activeTab: SettingsTabsEnum.SCHEDULING,
        iconClassName: "mr-1",
    },
    {
        name: "Compaction",
        iconName: "compact",
        showDivider: false,
        activeTab: SettingsTabsEnum.COMPACTION,
        iconClassName: "mr-2",
    },
    {
        name: "Variables and secrets",
        iconName: "security",
        showDivider: false,
        activeTab: SettingsTabsEnum.VARIABLES_AND_SECRETS,
        iconClassName: "mr-2 ms-3px",
        visible: true,
    },
];
