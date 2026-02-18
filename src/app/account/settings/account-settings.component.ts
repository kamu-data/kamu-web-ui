/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { AsyncPipe, NgClass, NgFor, NgIf } from "@angular/common";
import { ChangeDetectionStrategy, Component, inject, Input, OnInit } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { RouterLink, RouterLinkActive, RouterOutlet } from "@angular/router";

import { EMPTY, Observable } from "rxjs";
import { switchMap } from "rxjs/operators";

import { BaseComponent } from "@common/components/base.component";
import { FeatureFlagDirective } from "@common/directives/feature-flag.directive";
import RoutingResolvers from "@common/resolvers/routing-resolvers";
import AppValues from "@common/values/app.values";
import { AccountProvider, AccountWithEmailFragment } from "@api/kamu.graphql.interface";
import { MaybeNull } from "@interface/app.types";

import {
    ACCOUNT_SETTINGS_MENU_ITEMS,
    AccountSettingsMenuItem,
    AccountSettingsTabs,
} from "src/app/account/settings/account-settings.constants";
import { AccountEmailService } from "src/app/account/settings/tabs/emails-tab/account-email.service";
import { LoggedUserService } from "src/app/auth/logged-user.service";
import ProjectLinks from "src/app/project-links";

@Component({
    selector: "app-settings",
    templateUrl: "./account-settings.component.html",
    styleUrls: ["./account-settings.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        //-----//
        AsyncPipe,
        NgClass,
        NgIf,
        NgFor,
        RouterLink,
        RouterLinkActive,
        RouterOutlet,
        //-----//
        MatIconModule,
        //-----//
        FeatureFlagDirective,
    ],
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
