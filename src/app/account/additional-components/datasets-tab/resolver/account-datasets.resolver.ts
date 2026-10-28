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
import { positiveIntegerFromParam } from "@common/helpers/url-params.helpers";
import { DatasetsAccountResolverResponse, DatasetsAccountResponse } from "@interface/dataset.interface";

import { AccountService } from "src/app/account/account.service";
import ProjectLinks from "src/app/project-links";

export const accountDatasetsResolverFn: ResolveFn<DatasetsAccountResolverResponse> = (
    route: ActivatedRouteSnapshot,
) => {
    const accountService = inject(AccountService);

    const accountName = requireValue(
        route.parent?.parent?.paramMap.get(ProjectLinks.URL_PARAM_ACCOUNT_NAME),
        "Route has no account name",
    );
    const page = positiveIntegerFromParam(route.queryParamMap.get(ProjectLinks.URL_QUERY_PARAM_PAGE)) ?? 1;
    return accountService.getDatasetsByAccountName(accountName, page - 1).pipe(
        map((data: DatasetsAccountResponse) => {
            return {
                datasetsResponse: data,
                accountName,
            };
        }),
    );
};
