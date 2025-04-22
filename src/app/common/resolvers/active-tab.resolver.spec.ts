/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestBed } from "@angular/core/testing";
import { ActivatedRouteSnapshot, convertToParamMap, ResolveFn, RouterStateSnapshot } from "@angular/router";
import { activeTabResolver } from "./active-tab.resolver";
import { AccountSettingsTabs } from "src/app/account/settings/account-settings.constants";
import ProjectLinks from "src/app/project-links";
import { TEST_ACCOUNT_NAME, TEST_DATASET_NAME } from "src/app/api/mock/dataset.mock";

describe("activeTabResolver", () => {
    const mockRoute = {
        paramMap: convertToParamMap({
            [ProjectLinks.URL_PARAM_ACCOUNT_NAME]: TEST_ACCOUNT_NAME,
            [ProjectLinks.URL_PARAM_DATASET_NAME]: TEST_DATASET_NAME,
        }),
    } as ActivatedRouteSnapshot;

    const executeResolver: ResolveFn<string> = (...resolverParameters) =>
        TestBed.runInInjectionContext(() => activeTabResolver(...resolverParameters));

    beforeEach(() => {
        TestBed.configureTestingModule({});
    });

    it("should be created", () => {
        expect(executeResolver).toBeTruthy();
    });

    it("should check activeTabResolver", async () => {
        const mockState = {
            url: `/kamu/datasetName/${ProjectLinks.URL_SETTINGS}/${AccountSettingsTabs.ACCESS_TOKENS}`,
        } as RouterStateSnapshot;
        const result = await activeTabResolver(mockRoute, mockState);

        expect(result).toEqual(AccountSettingsTabs.ACCESS_TOKENS);
    });

    it("should check activeTabResolver with query params", async () => {
        const mockState = {
            url: `/kamu/datasetName/${ProjectLinks.URL_SETTINGS}/${AccountSettingsTabs.ACCESS_TOKENS}?page=2`,
        } as RouterStateSnapshot;
        const result = await activeTabResolver(mockRoute, mockState);

        expect(result).toEqual(AccountSettingsTabs.ACCESS_TOKENS);
    });
});
