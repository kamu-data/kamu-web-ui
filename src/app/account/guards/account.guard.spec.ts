/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestBed } from "@angular/core/testing";
import { ActivatedRouteSnapshot, CanActivateFn, convertToParamMap, RouterStateSnapshot } from "@angular/router";

import { TEST_ACCOUNT_NAME } from "@api/mock/dataset.mock";

import { AccountTabs } from "src/app/account/account.constants";
import { accountGuard } from "src/app/account/guards/account.guard";
import ProjectLinks from "src/app/project-links";
import { NavigationService } from "src/app/services/navigation.service";

describe("accountGuard", () => {
    let navigationService: NavigationService;
    const routeSnapshot = {
        paramMap: convertToParamMap({
            [ProjectLinks.URL_PARAM_ACCOUNT_NAME]: TEST_ACCOUNT_NAME,
            [ProjectLinks.URL_PARAM_DATASET_NAME]: "",
        }),
    } as ActivatedRouteSnapshot;

    const executeGuard: CanActivateFn = (...guardParameters) =>
        TestBed.runInInjectionContext(() => accountGuard(...guardParameters));

    beforeEach(() => {
        TestBed.configureTestingModule({});

        navigationService = TestBed.inject(NavigationService);
    });

    it("should be created", () => {
        expect(executeGuard).toBeTruthy();
    });

    it("should check account guard with true", async () => {
        const state = { url: `/kamu/${AccountTabs.FLOWS}` } as RouterStateSnapshot;
        const result = await executeGuard(routeSnapshot, state);
        expect(result).toEqual(true);
    });

    it("should check account guard with false", async () => {
        spyOn(navigationService, "navigateToOwnerView").and.returnValue();
        const state = { url: `/kamu` } as RouterStateSnapshot;
        const result = await executeGuard(routeSnapshot, state);
        expect(result).toEqual(false);
    });
});
