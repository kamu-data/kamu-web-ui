/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

export enum AccountSettingsTabs {
    PROFILE = "profile",
    ACCOUNT = "account",
    APPEARANCE = "appearance",
    ACCESSIBILITY = "accessibility",
    NOTIFICATIONS = "notifications",
    BILLING = "billing",
    EMAILS = "emails",
    SECURITY = "security",
    ORGANIZATIONS = "organizations",
    ACCESS_TOKENS = "access-tokens",
}

export enum TokenCreateStep {
    INITIAL = "initial",
    GENERATE = "generate",
    FINISH = "finish",
}

export interface AccountSettingsMenuItem {
    iconName: string;
    activeTab: AccountSettingsTabs;
    label: string;
    featureFlag: string;
    class: string;
    groupDivider?: {
        groupName: string;
    };
}

export const ACCOUNT_SETTINGS_MENU_ITEMS: AccountSettingsMenuItem[] = [
    {
        activeTab: AccountSettingsTabs.PROFILE,
        class: "disabled",
        iconName: "public-profile",
        label: "Public profile",
        featureFlag: "settings.profile",
    },
    {
        activeTab: AccountSettingsTabs.ACCOUNT,
        class: "",
        iconName: "account",
        label: "Account",
        featureFlag: "settings.account",
    },
    {
        activeTab: AccountSettingsTabs.APPEARANCE,
        class: "disabled",
        iconName: "appearance",
        label: "Appearance",
        featureFlag: "settings.appearance",
    },
    {
        activeTab: AccountSettingsTabs.ACCESSIBILITY,
        class: "disabled",
        iconName: "accessibility",
        label: "Accessibility",
        featureFlag: "settings.accessibility",
    },
    {
        activeTab: AccountSettingsTabs.NOTIFICATIONS,
        class: "disabled",
        iconName: "notifications",
        label: "Notifications",
        featureFlag: "settings.notifications",
        groupDivider: {
            groupName: "Access",
        },
    },
    {
        activeTab: AccountSettingsTabs.BILLING,
        class: "disabled",
        iconName: "billing",
        label: "Billing and plans",
        featureFlag: "settings.billing",
    },
    {
        activeTab: AccountSettingsTabs.EMAILS,
        class: "",
        iconName: "emails",
        label: "Emails",
        featureFlag: "settings.emails",
    },
    {
        activeTab: AccountSettingsTabs.SECURITY,
        class: "disabled",
        iconName: "security",
        label: "Password and authentication",
        featureFlag: "settings.password",
    },
    {
        activeTab: AccountSettingsTabs.ORGANIZATIONS,
        class: "disabled",
        iconName: "organizations",
        label: "Organizations",
        featureFlag: "settings.organizations",
    },
    {
        activeTab: AccountSettingsTabs.ACCESS_TOKENS,
        class: "",
        iconName: "access-token",
        label: "Access tokens",
        featureFlag: "settings.tokens",
    },
];

export interface ChangeAccountUsernameResult {
    changed: boolean;
    name: string;
}
