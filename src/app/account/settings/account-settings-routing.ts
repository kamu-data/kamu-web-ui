/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

/* istanbul ignore file */

import { Routes } from "@angular/router";
import { AccountSettingsTabs } from "./account-settings.constants";
import { AccessTokensTabComponent } from "./tabs/access-tokens-tab/access-tokens-tab.component";
import { accountSettingsAccessTokensResolverFn } from "./tabs/access-tokens-tab/resolver/account-settings-access-tokens.resolver";
import { AccountTabComponent } from "./tabs/account-tab/account-tab.component";
import { accountSettingsAccountResolverFn } from "./tabs/account-tab/resolver/account-settings-account.resolver";
import { EmailsTabComponent } from "./tabs/emails-tab/emails-tab.component";
import { accountSettingsEmailResolverFn } from "./tabs/emails-tab/resolver/account-settings-email.resolver";
import { PasswordAndAuthenticationTabComponent } from "./tabs/password-and-authentication-tab/password-and-authentication-tab.component";
import { accountSettingsPasswordAndAuthenticationResolverFn } from "./tabs/password-and-authentication-tab/resolver/account-settings-password-and-authentication.resolver";
import { accountPasswordProviderGuard } from "../../common/guards/account-password-provider.guard";
import RoutingResolvers from "../../common/resolvers/routing-resolvers";
import ProjectLinks from "../../project-links";
import { AccountSettingsComponent } from "./account-settings.component";
import { accountSettingsActiveTabResolverFn } from "./resolver/account-settings-active-tab.resolver";

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
