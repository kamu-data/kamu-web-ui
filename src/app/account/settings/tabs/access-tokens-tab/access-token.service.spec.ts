/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestBed } from "@angular/core/testing";
import { AccessTokenService } from "./access-token.service";
import { Apollo } from "apollo-angular";
import { provideToastr, ToastrService } from "ngx-toastr";
import { AccessTokenApi } from "../../../../api/access-token.api";
import {
    PAGE,
    PER_PAGE,
    TOKEN_ID,
    TOKEN_NAME,
    mockCreateAccessTokenMutation,
    mockCreateAccessTokenMutationError,
    mockListAccessTokensQuery,
    mockRevokeAccessTokenMutation,
    mockRevokeAccessTokenMutationError,
} from "../../../../api/mock/access-token.mock";
import { of } from "rxjs";
import { AccessTokenConnection, CreatedAccessToken } from "../../../../api/kamu.graphql.interface";
import { TEST_ACCOUNT_ID } from "../../../../search/mock.data";
import { MaybeNull } from "../../../../interface/app.types";
import { provideAnimations } from "@angular/platform-browser/animations";

describe("AccessTokenService", () => {
    let service: AccessTokenService;
    let accessTokenApi: AccessTokenApi;
    let toastrService: ToastrService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [Apollo, provideAnimations(), provideToastr()],
        });
        service = TestBed.inject(AccessTokenService);
        accessTokenApi = TestBed.inject(AccessTokenApi);
        toastrService = TestBed.inject(ToastrService);
    });

    it("should be created", () => {
        expect(service).toBeTruthy();
    });

    it("check list access tokens", () => {
        const listAccessTokensSpy = spyOn(accessTokenApi, "listAccessTokens").and.returnValue(
            of(mockListAccessTokensQuery),
        );
        const subscription$ = service
            .listAccessTokens({ accountId: TEST_ACCOUNT_ID, page: PAGE, perPage: PER_PAGE })
            .subscribe((data: AccessTokenConnection) => {
                expect(data.totalCount).toEqual(
                    mockListAccessTokensQuery.accounts.byId?.accessTokens.listAccessTokens.totalCount as number,
                );
            });

        expect(listAccessTokensSpy).toHaveBeenCalledTimes(1);
        expect(subscription$.closed).toBeTrue();
    });

    it("check create access token with success", () => {
        const result = "ka_A55WZV0WB12CXBQ8GST7FC80T95JKMSXHJ93Q08TJFRVE0N5Q2APVQVZM0";
        const toastrServiceSuccessSpy = spyOn(toastrService, "success");
        const createAccessTokensSpy = spyOn(accessTokenApi, "createAccessToken").and.returnValue(
            of(mockCreateAccessTokenMutation),
        );
        const subscription$ = service
            .createAccessTokens(TEST_ACCOUNT_ID, TOKEN_NAME)
            .subscribe((data: MaybeNull<CreatedAccessToken>) => {
                if (data) {
                    expect(data.composed).toEqual(result);
                }
            });

        expect(toastrServiceSuccessSpy).toHaveBeenCalledTimes(1);
        expect(createAccessTokensSpy).toHaveBeenCalledTimes(1);
        expect(subscription$.closed).toBeTrue();
    });

    it("check create access token with error", () => {
        const toastrServiceErrorSpy = spyOn(toastrService, "error");
        const createAccessTokensSpy = spyOn(accessTokenApi, "createAccessToken").and.returnValue(
            of(mockCreateAccessTokenMutationError),
        );
        const subscription$ = service
            .createAccessTokens(TEST_ACCOUNT_ID, TOKEN_NAME)
            .subscribe((data: MaybeNull<CreatedAccessToken>) => {
                expect(data).toEqual(null);
            });

        expect(toastrServiceErrorSpy).toHaveBeenCalledTimes(1);
        expect(createAccessTokensSpy).toHaveBeenCalledTimes(1);
        expect(subscription$.closed).toBeTrue();
    });

    it("check revoke access token with succes", () => {
        const toastrServiceSuccessSpy = spyOn(toastrService, "success");
        const revokeAccessTokenSpy = spyOn(accessTokenApi, "revokeAccessToken").and.returnValue(
            of(mockRevokeAccessTokenMutation),
        );
        const subscription$ = service.revokeAccessTokens(TEST_ACCOUNT_ID, TOKEN_ID).subscribe();

        expect(toastrServiceSuccessSpy).toHaveBeenCalledTimes(1);
        expect(revokeAccessTokenSpy).toHaveBeenCalledTimes(1);
        expect(subscription$.closed).toBeTrue();
    });

    it("check revoke access token with error", () => {
        const toastrServiceErrorSpy = spyOn(toastrService, "error");
        const revokeAccessTokenSpy = spyOn(accessTokenApi, "revokeAccessToken").and.returnValue(
            of(mockRevokeAccessTokenMutationError),
        );
        const subscription$ = service.revokeAccessTokens(TEST_ACCOUNT_ID, TOKEN_ID).subscribe();

        expect(toastrServiceErrorSpy).toHaveBeenCalledTimes(1);
        expect(revokeAccessTokenSpy).toHaveBeenCalledTimes(1);
        expect(subscription$.closed).toBeTrue();
    });
});
