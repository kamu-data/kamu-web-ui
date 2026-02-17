/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { fakeAsync, flush, TestBed, tick } from "@angular/core/testing";

import { first } from "rxjs";

import { CombinedGraphQLErrors } from "@apollo/client/errors";
import { Apollo } from "apollo-angular";
import { ApolloTestingController, ApolloTestingModule } from "apollo-angular/testing";

import { AccessTokenApi } from "@api/access-token.api";
import { AccountApi } from "@api/account.api";
import {
    CreateAccessTokenDocument,
    CreateAccessTokenMutation,
    ListAccessTokensDocument,
    ListAccessTokensQuery,
    RevokeAccessTokenDocument,
    RevokeAccessTokenMutation,
} from "@api/kamu.graphql.interface";
import {
    mockCreateAccessTokenMutation,
    mockListAccessTokensQuery,
    mockRevokeAccessTokenMutation,
    PAGE,
    PER_PAGE,
    TOKEN_ID,
    TOKEN_NAME,
} from "@api/mock/access-token.mock";
import { mockLogin401Error, TEST_ACCOUNT_ID } from "@api/mock/auth.mock";

describe("AccessTokenApi", () => {
    let service: AccessTokenApi;
    let controller: ApolloTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [AccountApi, Apollo],
            imports: [ApolloTestingModule],
        });
        service = TestBed.inject(AccessTokenApi);
        controller = TestBed.inject(ApolloTestingController);
    });

    afterEach(() => {
        controller.verify();
    });

    it("should be created", () => {
        expect(service).toBeTruthy();
    });

    it("should check fetch list access tokens", () => {
        service
            .listAccessTokens({ accountId: TEST_ACCOUNT_ID, page: PAGE, perPage: PER_PAGE })
            .subscribe((list: ListAccessTokensQuery) => {
                expect(list.accounts.byId?.accessTokens.listAccessTokens.totalCount).toEqual(
                    mockListAccessTokensQuery.accounts.byId?.accessTokens.listAccessTokens.totalCount,
                );
                expect(list.accounts.byId?.accessTokens.listAccessTokens.nodes).toEqual(
                    mockListAccessTokensQuery.accounts.byId?.accessTokens.listAccessTokens.nodes,
                );
            });
        const op = controller.expectOne(ListAccessTokensDocument);
        expect(op.operation.variables.accountId).toEqual(TEST_ACCOUNT_ID);
        expect(op.operation.variables.page).toEqual(PAGE);
        expect(op.operation.variables.perPage).toEqual(PER_PAGE);

        op.flush({
            data: mockListAccessTokensQuery,
        });
    });

    it("should check create access token", () => {
        service.createAccessToken(TEST_ACCOUNT_ID, TOKEN_NAME).subscribe((data: CreateAccessTokenMutation) => {
            if (data.accounts.byId?.accessTokens.createAccessToken.__typename === "CreateAccessTokenResultSuccess") {
                expect(data.accounts.byId?.accessTokens.createAccessToken.message).toEqual(
                    mockCreateAccessTokenMutation.accounts.byId?.accessTokens.createAccessToken.message as string,
                );
            }
        });

        const op = controller.expectOne(CreateAccessTokenDocument);
        expect(op.operation.variables.accountId).toEqual(TEST_ACCOUNT_ID);
        expect(op.operation.variables.tokenName).toEqual(TOKEN_NAME);

        op.flush({
            data: mockCreateAccessTokenMutation,
        });
    });

    it("should check create access token with error", fakeAsync(() => {
        const subscription$ = service
            .createAccessToken(TEST_ACCOUNT_ID, TOKEN_NAME)
            .pipe(first())
            .subscribe({
                next: () => fail("Unexpected success"),
                error: (e: Error) => {
                    expect(CombinedGraphQLErrors.is(e)).toBe(true);
                },
            });

        const op = controller.expectOne(CreateAccessTokenDocument);
        expect(op.operation.variables.accountId).toEqual(TEST_ACCOUNT_ID);
        expect(op.operation.variables.tokenName).toEqual(TOKEN_NAME);
        op.graphqlErrors([mockLogin401Error]);
        tick();

        expect(subscription$.closed).toBeTrue();
        flush();
    }));

    it("should check revoke access token", () => {
        service.revokeAccessToken(TEST_ACCOUNT_ID, TOKEN_ID).subscribe((data: RevokeAccessTokenMutation) => {
            expect(data.accounts.byId?.accessTokens.revokeAccessToken.message).toEqual(
                mockRevokeAccessTokenMutation.accounts.byId?.accessTokens.revokeAccessToken.message,
            );
        });

        const op = controller.expectOne(RevokeAccessTokenDocument);
        expect(op.operation.variables.tokenId).toEqual(TOKEN_ID);

        op.flush({
            data: mockRevokeAccessTokenMutation,
        });
    });

    it("should check revoke access token with error", fakeAsync(() => {
        const subscription$ = service
            .revokeAccessToken(TEST_ACCOUNT_ID, TOKEN_ID)
            .pipe(first())
            .subscribe({
                next: () => fail("Unexpected success"),
                error: (e: Error) => {
                    expect(CombinedGraphQLErrors.is(e)).toBe(true);
                },
            });
        const op = controller.expectOne(RevokeAccessTokenDocument);
        expect(op.operation.variables.tokenId).toEqual(TOKEN_ID);
        op.graphqlErrors([mockLogin401Error]);
        tick();

        expect(subscription$.closed).toBeTrue();
        flush();
    }));
});
