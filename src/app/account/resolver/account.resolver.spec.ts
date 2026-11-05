/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestBed } from "@angular/core/testing";

import { of, throwError } from "rxjs";

import { Apollo } from "apollo-angular";
import { provideToastr } from "ngx-toastr";

import { expectPageNotFoundRedirect, routeSnapshot, runResolver } from "@common/helpers/base-test.helpers.spec";
import { mockAccountDetails, TEST_LOGIN } from "@api/mock/auth.mock";

import { AccountService } from "src/app/account/account.service";
import { accountResolverFn } from "src/app/account/resolver/account.resolver";
import ProjectLinks from "src/app/project-links";

describe("accountResolverFn", () => {
    let accountService: AccountService;

    const route = routeSnapshot({
        params: { [ProjectLinks.URL_PARAM_ACCOUNT_NAME]: TEST_LOGIN },
    });

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [Apollo, provideToastr()],
        });
        accountService = TestBed.inject(AccountService);
    });

    it("should request the account named in the route and resolve it", async () => {
        const fetchAccountByNameSpy = vi
            .spyOn(accountService, "fetchAccountByName")
            .mockReturnValue(of(mockAccountDetails));

        const data = await runResolver(accountResolverFn, route);

        expect(fetchAccountByNameSpy).toHaveBeenCalledTimes(1);
        expect(fetchAccountByNameSpy).toHaveBeenCalledWith(TEST_LOGIN);
        expect(data).toEqual(mockAccountDetails);
    });

    it("should redirect to page not found when the account does not exist", async () => {
        vi.spyOn(accountService, "fetchAccountByName").mockReturnValue(of(null));

        expectPageNotFoundRedirect(await runResolver(accountResolverFn, route));
    });

    it("should propagate any other failure to load the account", async () => {
        vi.spyOn(accountService, "fetchAccountByName").mockReturnValue(
            throwError(() => new Error("Server unreachable")),
        );

        await expect(runResolver(accountResolverFn, route)).rejects.toThrow("Server unreachable");
    });
});
