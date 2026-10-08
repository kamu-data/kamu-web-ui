/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { inject } from "@angular/core";
import { ResolveFn } from "@angular/router";

import { AccountStorageQuotaService } from "src/app/account/settings/tabs/storage-tab/account-storage-quota.service";
import { AccountStorageQuota } from "src/app/account/settings/tabs/storage-tab/storage-tab.model";
import { LoggedUserService } from "src/app/auth/logged-user.service";

export const accountSettingsStorageResolverFn: ResolveFn<AccountStorageQuota> = () => {
    const accountStorageQuotaService = inject(AccountStorageQuotaService);
    const loggedUserService = inject(LoggedUserService);
    return accountStorageQuotaService.fetchStorageQuota(loggedUserService.currentlyLoggedInUser.accountName);
};
