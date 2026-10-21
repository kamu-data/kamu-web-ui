/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestBed } from "@angular/core/testing";
import {
    ActivatedRouteSnapshot,
    CanActivateFn,
    convertToParamMap,
    Router,
    RouterStateSnapshot,
    UrlTree,
} from "@angular/router";

import { TEST_ACCOUNT_NAME } from "@api/mock/dataset.mock";

import { AccountTabs } from "src/app/account/account.constants";
import { accountGuard } from "src/app/account/guards/account.guard";
import ProjectLinks from "src/app/project-links";

describe("accountGuard", () => {
    let router: Router;
    const routeSnapshot = {
        paramMap: convertToParamMap({
            [ProjectLinks.URL_PARAM_ACCOUNT_NAME]: TEST_ACCOUNT_NAME,
        }),
    } as ActivatedRouteSnapshot;
    const datasetsTabUrl = `/${TEST_ACCOUNT_NAME}/${ProjectLinks.URL_ACCOUNT_SELECT}/${AccountTabs.DATASETS}`;

    const executeGuard: CanActivateFn = (...guardParameters) =>
        TestBed.runInInjectionContext(() => accountGuard(...guardParameters));

    beforeEach(() => {
        TestBed.configureTestingModule({});
        router = TestBed.inject(Router);
    });

    [
        `/${TEST_ACCOUNT_NAME}/${ProjectLinks.URL_ACCOUNT_SELECT}/${AccountTabs.FLOWS}`,
        `/${TEST_ACCOUNT_NAME}/${ProjectLinks.URL_ACCOUNT_SELECT}/${AccountTabs.DATASETS}?page=2`,
        `/${TEST_ACCOUNT_NAME}/${ProjectLinks.URL_ACCOUNT_SELECT}/${AccountTabs.FLOWS}#top`,
    ].forEach((url) => {
        it(`should allow the tab URL ${url}`, () => {
            const result = executeGuard(routeSnapshot, { url } as RouterStateSnapshot);
            expect(result).toBeTrue();
        });
    });

    [
        `/${TEST_ACCOUNT_NAME}`,
        `/${TEST_ACCOUNT_NAME}?page=2`,
        `/${TEST_ACCOUNT_NAME}/`,
        `/${TEST_ACCOUNT_NAME}#/${AccountTabs.FLOWS}`,
    ].forEach((url) => {
        it(`should redirect ${url} to the datasets tab`, () => {
            const result = executeGuard(routeSnapshot, { url } as RouterStateSnapshot);
            expect(router.serializeUrl(result as UrlTree)).toEqual(datasetsTabUrl);
        });
    });
});
