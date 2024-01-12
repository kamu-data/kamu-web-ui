export enum SettingsTabsEnum {
    GENERAL = "general",
    SCHEDULING = "scheduling",
}

export enum PollingGroupEnum {
    TIME_DELTA = "TimeDelta",
    CRON_EXPRESSION = "CronExpression",
}

export enum ThrottlingGroupEnum {
    AWAIT_FOR = "awaitFor",
    AWAIT_UNTIL = "awaitUntil",
}

export interface SchedulingSettings {
    updatesState: boolean;
    pollingGroup: {
        pollingSource: PollingGroupEnum;
        timeDelta?: number;
        timeSegment?: string;
        cronExpression?: string;
    };
    throttlingGroup: {
        throttlingParameters: ThrottlingGroupEnum;
        awaitFor?: number;
        awaitUntil?: number;
    };
}
