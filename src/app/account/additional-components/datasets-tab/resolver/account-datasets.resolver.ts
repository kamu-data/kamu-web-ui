/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, ResolveFn } from "@angular/router";

import { map } from "rxjs";

import { AccountService } from "src/app/account/account.service";
import { DatasetsAccountResolverResponse, DatasetsAccountResponse } from "src/app/interface/dataset.interface";
import ProjectLinks from "src/app/project-links";

export const accountDatasetsResolverFn: ResolveFn<DatasetsAccountResolverResponse> = (
    route: ActivatedRouteSnapshot,
) => {
    const accountService = inject(AccountService);
    const accountName = route.parent?.parent?.paramMap.get(ProjectLinks.URL_PARAM_ACCOUNT_NAME) as string;
    const page = route.queryParamMap.get(ProjectLinks.URL_QUERY_PARAM_PAGE) ?? 1;
    return accountService.getDatasetsByAccountName(accountName, Number(page) - 1).pipe(
        map((data: DatasetsAccountResponse) => {
            return {
                datasetsResponse: data,
                accountName,
            };
        }),
    );
};
