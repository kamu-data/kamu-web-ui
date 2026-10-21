/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { inject, Pipe, PipeTransform } from "@angular/core";
import { UrlTree } from "@angular/router";

import { AccountSettingsTabs } from "src/app/account/settings/account-settings.constants";
import { NavigationService } from "src/app/services/navigation.service";

/** Link to a tab of the logged-in user's settings, built by `NavigationService.accountSettingsUrlTree`. */
@Pipe({
    name: "accountSettingsLink",
})
export class AccountSettingsLinkPipe implements PipeTransform {
    private navigationService = inject(NavigationService);

    public transform(tab: AccountSettingsTabs): UrlTree {
        return this.navigationService.accountSettingsUrlTree(tab);
    }
}
