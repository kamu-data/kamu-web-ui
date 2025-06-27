/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { fakeAsync, flush, TestBed, tick } from "@angular/core/testing";
import { Apollo } from "apollo-angular";
import { ApolloTestingModule, ApolloTestingController } from "apollo-angular/testing";
import { AccessTokenApi } from "./access-token.api";
import { AccountApi } from "./account.api";
import {
    CreateAccessTokenDocument,
    CreateAccessTokenMutation,
    ListAccessTokensDocument,
    ListAccessTokensQuery,
    RevokeAccessTokenDocument,
    RevokeAccessTokenMutation,
} from "./kamu.graphql.interface";
import { mockLogin401Error, TEST_ACCOUNT_ID } from "./mock/auth.mock";
import {
    PAGE,
    PER_PAGE,
    TOKEN_ID,
    TOKEN_NAME,
    mockCreateAccessTokenMutation,
    mockListAccessTokensQuery,
    mockRevokeAccessTokenMutation,
} from "./mock/access-token.mock";
import { first } from "rxjs";
import { ApolloError } from "@apollo/client";

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
                expect(list.auth.listAccessTokens.totalCount).toEqual(
                    mockListAccessTokensQuery.auth.listAccessTokens.totalCount,
                );
                expect(list.auth.listAccessTokens.nodes).toEqual(mockListAccessTokensQuery.auth.listAccessTokens.nodes);
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
            if (data.auth.createAccessToken.__typename === "CreateAccessTokenResultSuccess") {
                expect(data.auth.createAccessToken.message).toEqual(
                    mockCreateAccessTokenMutation.auth.createAccessToken.message,
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
                error: (e: ApolloError) => {
                    expect(e).toBeTruthy();
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
        service.revokeAccessToken(TOKEN_ID).subscribe((data: RevokeAccessTokenMutation) => {
            expect(data.auth.revokeAccessToken.message).toEqual(
                mockRevokeAccessTokenMutation.auth.revokeAccessToken.message,
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
            .revokeAccessToken(TOKEN_ID)
            .pipe(first())
            .subscribe({
                next: () => fail("Unexpected success"),
                error: (e: ApolloError) => {
                    expect(e).toBeTruthy();
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
