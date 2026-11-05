/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, ResolveFn } from "@angular/router";

import { map } from "rxjs";

import { requireValue } from "@common/helpers/app.helpers";
import { AccountFragment } from "@api/kamu.graphql.interface";

import { AccountService } from "src/app/account/account.service";
import ProjectLinks from "src/app/project-links";
import { NavigationService } from "src/app/services/navigation.service";

export const accountResolverFn: ResolveFn<AccountFragment> = (route: ActivatedRouteSnapshot) => {
    const accountService = inject(AccountService);
    const navigationService = inject(NavigationService);

    const accountName = requireValue(
        route.paramMap.get(ProjectLinks.URL_PARAM_ACCOUNT_NAME),
        "Route has no account name",
    );
    return accountService
        .fetchAccountByName(accountName)
        .pipe(map((account) => account ?? navigationService.pageNotFoundRedirect()));
};
