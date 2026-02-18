/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

/* istanbul ignore file */

import { Routes } from "@angular/router";

import { accountPasswordProviderGuard } from "@common/guards/account-password-provider.guard";
import RoutingResolvers from "@common/resolvers/routing-resolvers";

import { AccountSettingsComponent } from "src/app/account/settings/account-settings.component";
import { AccountSettingsTabs } from "src/app/account/settings/account-settings.constants";
import { accountSettingsActiveTabResolverFn } from "src/app/account/settings/resolver/account-settings-active-tab.resolver";
import { AccessTokensTabComponent } from "src/app/account/settings/tabs/access-tokens-tab/access-tokens-tab.component";
import { accountSettingsAccessTokensResolverFn } from "src/app/account/settings/tabs/access-tokens-tab/resolver/account-settings-access-tokens.resolver";
import { AccountTabComponent } from "src/app/account/settings/tabs/account-tab/account-tab.component";
import { accountSettingsAccountResolverFn } from "src/app/account/settings/tabs/account-tab/resolver/account-settings-account.resolver";
import { EmailsTabComponent } from "src/app/account/settings/tabs/emails-tab/emails-tab.component";
import { accountSettingsEmailResolverFn } from "src/app/account/settings/tabs/emails-tab/resolver/account-settings-email.resolver";
import { PasswordAndAuthenticationTabComponent } from "src/app/account/settings/tabs/password-and-authentication-tab/password-and-authentication-tab.component";
import { accountSettingsPasswordAndAuthenticationResolverFn } from "src/app/account/settings/tabs/password-and-authentication-tab/resolver/account-settings-password-and-authentication.resolver";
import ProjectLinks from "src/app/project-links";

export const ACCOUNT_SETTINGS_ROUTES: Routes = [
    {
        path: "",
        component: AccountSettingsComponent,
        resolve: { [RoutingResolvers.ACCOUNT_SETTINGS_ACTIVE_TAB_KEY]: accountSettingsActiveTabResolverFn },
        children: [
            {
                path: "",
                redirectTo: AccountSettingsTabs.ACCESS_TOKENS,
                pathMatch: "full",
            },
            {
                path: AccountSettingsTabs.ACCESS_TOKENS,
                component: AccessTokensTabComponent,
                data: {
                    [ProjectLinks.URL_PARAM_TAB]: AccountSettingsTabs.ACCESS_TOKENS,
                },
                runGuardsAndResolvers: "always",
                resolve: {
                    [RoutingResolvers.ACCOUNT_SETTINGS_ACCESS_TOKENS_KEY]: accountSettingsAccessTokensResolverFn,
                },
            },
            {
                path: AccountSettingsTabs.EMAILS,
                component: EmailsTabComponent,
                data: {
                    [ProjectLinks.URL_PARAM_TAB]: AccountSettingsTabs.EMAILS,
                },
                runGuardsAndResolvers: "always",
                resolve: { [RoutingResolvers.ACCOUNT_SETTINGS_EMAIL_KEY]: accountSettingsEmailResolverFn },
            },
            {
                path: AccountSettingsTabs.ACCOUNT,
                component: AccountTabComponent,
                data: {
                    [ProjectLinks.URL_PARAM_TAB]: AccountSettingsTabs.ACCOUNT,
                },
                runGuardsAndResolvers: "always",
                resolve: { [RoutingResolvers.ACCOUNT_SETTINGS_ACCOUNT_KEY]: accountSettingsAccountResolverFn },
            },
            {
                path: AccountSettingsTabs.SECURITY,
                component: PasswordAndAuthenticationTabComponent,
                data: {
                    [ProjectLinks.URL_PARAM_TAB]: AccountSettingsTabs.SECURITY,
                },
                runGuardsAndResolvers: "always",
                canActivate: [accountPasswordProviderGuard],
                resolve: {
                    [RoutingResolvers.ACCOUNT_SETTINGS_PASSWORD_AND_AUTHENTICATION_KEY]:
                        accountSettingsPasswordAndAuthenticationResolverFn,
                },
            },
        ],
    },
];
