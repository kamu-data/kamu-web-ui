/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import ProjectLinks from "src/app/project-links";
import { AccountProvider, AccountWithEmailFragment } from "src/app/api/kamu.graphql.interface";
import {
    AccountSettingsMenuItem,
    ACCOUNT_SETTINGS_MENU_ITEMS,
    AccountSettingsTabs,
} from "./account-settings.constants";
import { ChangeDetectionStrategy, Component, inject, Input, OnInit } from "@angular/core";
import { switchMap } from "rxjs/operators";
import { BaseComponent } from "src/app/common/components/base.component";
import AppValues from "src/app/common/values/app.values";
import { MaybeNull } from "src/app/interface/app.types";
import { EMPTY, Observable } from "rxjs";
import { AccountEmailService } from "src/app/account/settings/tabs/emails-tab/account-email.service";
import { LoggedUserService } from "../../auth/logged-user.service";
import RoutingResolvers from "src/app/common/resolvers/routing-resolvers";

@Component({
    selector: "app-settings",
    templateUrl: "./account-settings.component.html",
    styleUrls: ["./account-settings.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountSettingsComponent extends BaseComponent implements OnInit {
    @Input(RoutingResolvers.ACCOUNT_SETTINGS_ACTIVE_TAB_KEY) public activeTab: AccountSettingsTabs;

    public readonly DEFAULT_AVATAR_URL = AppValues.DEFAULT_AVATAR_URL;
    public readonly AccountSettingsTabs: typeof AccountSettingsTabs = AccountSettingsTabs;
    public readonly ACCOUNT_SETTINGS_MENU_DESCRIPTORS: AccountSettingsMenuItem[] = ACCOUNT_SETTINGS_MENU_ITEMS;
    public user$: Observable<MaybeNull<AccountWithEmailFragment>>;

    private accountEmailService = inject(AccountEmailService);
    private loggedUserService = inject(LoggedUserService);

    public ngOnInit(): void {
        this.fetchAccountInfo();
    }

    public getRouteLink(tab: AccountSettingsTabs): string {
        return `/${ProjectLinks.URL_SETTINGS}/${tab}`;
    }

    public showItem(activeTab: AccountSettingsTabs): boolean {
        switch (activeTab) {
            case AccountSettingsTabs.SECURITY:
                return this.loggedUserService.currentlyLoggedInUser.accountProvider === AccountProvider.Password;
            default:
                return true;
        }
    }

    private fetchAccountInfo(): void {
        this.user$ = this.loggedUserService.loggedInUserChanges.pipe(
            switchMap((loggedUser) => {
                if (loggedUser) {
                    return this.accountEmailService.fetchAccountWithEmail(loggedUser.accountName);
                } else {
                    return EMPTY;
                }
            }),
        );
    }
}
