export enum SettingsTabsEnum {
    GENERAL = "general",
    SCHEDULING = "scheduling",
    COMPACTING = "compacting",
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
        name: "Compacting",
        iconName: "compress",
        showDivider: false,
        activeTab: SettingsTabsEnum.COMPACTING,
        iconClassName: "mr-2",
    },
];
