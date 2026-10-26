/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestBed } from "@angular/core/testing";

import { of } from "rxjs";

import { Apollo } from "apollo-angular";
import { provideToastr, ToastrService } from "ngx-toastr";

import { stubMethod } from "@common/helpers/base-test.helpers.spec";
import { AccessTokenApi } from "@api/access-token.api";
import { AccessTokenConnectionDataFragment, CreatedAccessTokenDataFragment } from "@api/kamu.graphql.interface";
import {
    mockAccessTokenConnectionData,
    mockCreateAccessTokenMutation,
    mockCreateAccessTokenMutationError,
    mockListAccessTokensQuery,
    mockRevokeAccessTokenMutation,
    mockRevokeAccessTokenMutationError,
    PAGE,
    PER_PAGE,
    TOKEN_ID,
    TOKEN_NAME,
} from "@api/mock/access-token.mock";
import { TEST_ACCOUNT_ID } from "@api/mock/auth.mock";
import { MaybeNull } from "@interface/app.types";

import { AccessTokenService } from "src/app/account/settings/tabs/access-tokens-tab/access-token.service";

describe("AccessTokenService", () => {
    let service: AccessTokenService;
    let accessTokenApi: AccessTokenApi;
    let toastrService: ToastrService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [Apollo, provideToastr()],
        });
        service = TestBed.inject(AccessTokenService);
        accessTokenApi = TestBed.inject(AccessTokenApi);
        toastrService = TestBed.inject(ToastrService);
    });

    it("should be created", () => {
        expect(service).toBeTruthy();
    });

    it("check list access tokens", () => {
        const listAccessTokensSpy = vi
            .spyOn(accessTokenApi, "listAccessTokens")
            .mockReturnValue(of(mockListAccessTokensQuery));
        const subscription$ = service
            .listAccessTokens({ accountId: TEST_ACCOUNT_ID, page: PAGE, perPage: PER_PAGE })
            .subscribe((data: AccessTokenConnectionDataFragment) => {
                expect(data.totalCount).toEqual(mockAccessTokenConnectionData.totalCount);
            });

        expect(listAccessTokensSpy).toHaveBeenCalledTimes(1);
        expect(subscription$.closed).toBe(true);
    });

    it("check create access token with success", () => {
        const result = "ka_A55WZV0WB12CXBQ8GST7FC80T95JKMSXHJ93Q08TJFRVE0N5Q2APVQVZM0";
        const toastrServiceSuccessSpy = stubMethod(toastrService, "success");
        const createAccessTokensSpy = vi
            .spyOn(accessTokenApi, "createAccessToken")
            .mockReturnValue(of(mockCreateAccessTokenMutation));
        const subscription$ = service
            .createAccessTokens(TEST_ACCOUNT_ID, TOKEN_NAME)
            .subscribe((data: MaybeNull<CreatedAccessTokenDataFragment>) => {
                expect(data?.composed).toEqual(result);
            });

        expect(toastrServiceSuccessSpy).toHaveBeenCalledTimes(1);
        expect(createAccessTokensSpy).toHaveBeenCalledTimes(1);
        expect(subscription$.closed).toBe(true);
    });

    it("check create access token with error", () => {
        const toastrServiceErrorSpy = stubMethod(toastrService, "error");
        const createAccessTokensSpy = vi
            .spyOn(accessTokenApi, "createAccessToken")
            .mockReturnValue(of(mockCreateAccessTokenMutationError));
        const subscription$ = service
            .createAccessTokens(TEST_ACCOUNT_ID, TOKEN_NAME)
            .subscribe((data: MaybeNull<CreatedAccessTokenDataFragment>) => {
                expect(data).toEqual(null);
            });

        expect(toastrServiceErrorSpy).toHaveBeenCalledTimes(1);
        expect(createAccessTokensSpy).toHaveBeenCalledTimes(1);
        expect(subscription$.closed).toBe(true);
    });

    it("check revoke access token with succes", () => {
        const toastrServiceSuccessSpy = stubMethod(toastrService, "success");
        const revokeAccessTokenSpy = vi
            .spyOn(accessTokenApi, "revokeAccessToken")
            .mockReturnValue(of(mockRevokeAccessTokenMutation));
        const subscription$ = service.revokeAccessTokens(TEST_ACCOUNT_ID, TOKEN_ID).subscribe();

        expect(toastrServiceSuccessSpy).toHaveBeenCalledTimes(1);
        expect(revokeAccessTokenSpy).toHaveBeenCalledTimes(1);
        expect(subscription$.closed).toBe(true);
    });

    it("check revoke access token with error", () => {
        const toastrServiceErrorSpy = stubMethod(toastrService, "error");
        const revokeAccessTokenSpy = vi
            .spyOn(accessTokenApi, "revokeAccessToken")
            .mockReturnValue(of(mockRevokeAccessTokenMutationError));
        const subscription$ = service.revokeAccessTokens(TEST_ACCOUNT_ID, TOKEN_ID).subscribe();

        expect(toastrServiceErrorSpy).toHaveBeenCalledTimes(1);
        expect(revokeAccessTokenSpy).toHaveBeenCalledTimes(1);
        expect(subscription$.closed).toBe(true);
    });
});
