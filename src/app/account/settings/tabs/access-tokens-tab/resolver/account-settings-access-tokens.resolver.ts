/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, ResolveFn } from "@angular/router";

import { AccessTokenService } from "src/app/account/settings/tabs/access-tokens-tab/access-token.service";
import { AccessTokenConnection } from "src/app/api/kamu.graphql.interface";
import { LoggedUserService } from "src/app/auth/logged-user.service";
import ProjectLinks from "src/app/project-links";

export const accountSettingsAccessTokensResolverFn: ResolveFn<AccessTokenConnection> = (
    route: ActivatedRouteSnapshot,
) => {
    const accessTokenService = inject(AccessTokenService);
    const loggedUserService = inject(LoggedUserService);
    const PER_PAGE = 15;
    const page = Number(route.queryParamMap.get(ProjectLinks.URL_QUERY_PARAM_PAGE) ?? 1);
    return accessTokenService.listAccessTokens({
        accountId: loggedUserService.currentlyLoggedInUser.id,
        page: page - 1,
        perPage: PER_PAGE,
    });
};
