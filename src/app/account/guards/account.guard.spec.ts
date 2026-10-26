/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestBed } from "@angular/core/testing";

import { expectRedirectTo, routeSnapshot, runCanActivate } from "@common/helpers/base-test.helpers.spec";
import { TEST_ACCOUNT_NAME } from "@api/mock/dataset.mock";

import { AccountTabs } from "src/app/account/account.constants";
import { accountGuard } from "src/app/account/guards/account.guard";
import ProjectLinks from "src/app/project-links";

describe("accountGuard", () => {
    const route = routeSnapshot({ params: { [ProjectLinks.URL_PARAM_ACCOUNT_NAME]: TEST_ACCOUNT_NAME } });
    const datasetsTabUrl = `/${TEST_ACCOUNT_NAME}/${ProjectLinks.URL_ACCOUNT_SELECT}/${AccountTabs.DATASETS}`;

    beforeEach(() => {
        TestBed.configureTestingModule({});
    });

    [
        `/${TEST_ACCOUNT_NAME}/${ProjectLinks.URL_ACCOUNT_SELECT}/${AccountTabs.FLOWS}`,
        `/${TEST_ACCOUNT_NAME}/${ProjectLinks.URL_ACCOUNT_SELECT}/${AccountTabs.DATASETS}?page=2`,
        `/${TEST_ACCOUNT_NAME}/${ProjectLinks.URL_ACCOUNT_SELECT}/${AccountTabs.FLOWS}#top`,
    ].forEach((url) => {
        it(`should allow the tab URL ${url}`, async () => {
            expect(await runCanActivate(accountGuard, route, url)).toBeTrue();
        });
    });

    [
        `/${TEST_ACCOUNT_NAME}`,
        `/${TEST_ACCOUNT_NAME}?page=2`,
        `/${TEST_ACCOUNT_NAME}/`,
        `/${TEST_ACCOUNT_NAME}#/${AccountTabs.FLOWS}`,
    ].forEach((url) => {
        it(`should redirect ${url} to the datasets tab`, async () => {
            expectRedirectTo(await runCanActivate(accountGuard, route, url), datasetsTabUrl);
        });
    });
});
