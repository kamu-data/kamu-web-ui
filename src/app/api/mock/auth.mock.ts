/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { GraphQLError } from "graphql";
import {
    AccountFragment,
    AccountProvider,
    AccountType,
    AccountWithEmailFragment,
    FetchAccountDetailsMutation,
    LoginMutation,
} from "../kamu.graphql.interface";
import { AppLoginInstructions } from "src/app/app-config.model";
import { PasswordLoginCredentials } from "../auth.api.model";

export const TEST_GITHUB_CODE = "12345";
export const TEST_ACCESS_TOKEN_GITHUB = "someTokenViaGithub";
export const TEST_ACCESS_TOKEN_PASSWORD = "someTokenViaPassword";
export const TEST_ACCOUNT_ID = "did:odf:fed016b61ed2ab1b63a006b61ed2ab1b63a00b016d65607000000e0821aafbf163e6f";
export const TEST_LOGIN = "foo";
export const TEST_PASSWORD = "bar";
export const TEST_USER_NAME = "Test User";
export const TEST_PAGE_NUMBER = 5;

const mockPasswordLoginCredentials: PasswordLoginCredentials = {
    login: TEST_LOGIN,
    password: TEST_PASSWORD,
};

export const mockLoginInstructions: AppLoginInstructions = {
    loginMethod: AccountProvider.Password,
    loginCredentialsJson: JSON.stringify(mockPasswordLoginCredentials),
};

export const TEST_AVATAR_URL = "http://example.com/image.jpg";
export const TEST_ACCOUNT_EMAIL = "http://kamu@example.com";

export const mockAccountDetails: AccountFragment = {
    id: TEST_ACCOUNT_ID,
    accountName: TEST_LOGIN,
    displayName: TEST_USER_NAME,
    accountType: AccountType.User,
    avatarUrl: TEST_AVATAR_URL,
    isAdmin: false,
    accountProvider: AccountProvider.Password,
};

export const mockAccountDetailsWithEmail: AccountWithEmailFragment = {
    id: TEST_ACCOUNT_ID,
    accountName: TEST_LOGIN,
    displayName: TEST_USER_NAME,
    avatarUrl: TEST_AVATAR_URL,
    email: TEST_ACCOUNT_EMAIL,
};

export const mockAccountFromAccessToken: FetchAccountDetailsMutation = {
    auth: {
        __typename: "AuthMut",
        accountDetails: mockAccountDetails,
    },
};

export const mockGithubLoginResponse: LoginMutation = {
    auth: {
        __typename: "AuthMut",
        login: {
            __typename: "LoginResponse",
            accessToken: TEST_ACCESS_TOKEN_GITHUB,
            account: mockAccountDetails,
        },
    },
};

export const mockPasswordLoginResponse: LoginMutation = {
    auth: {
        __typename: "AuthMut",
        login: {
            __typename: "LoginResponse",
            accessToken: TEST_ACCESS_TOKEN_PASSWORD,
            account: mockAccountDetails,
        },
    },
};

export const mockWeb3WalletLoginResponse: LoginMutation = mockPasswordLoginResponse;

export const mockLogin401Error: GraphQLError = new GraphQLError(
    "HTTP status client error (401 Unauthorized) for url (https://api.github.com/user)",
);
