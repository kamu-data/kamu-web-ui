import { GraphQLError } from "graphql";
import { AccountFragment, AccountType, FetchAccountDetailsMutation, LoginMutation } from "../kamu.graphql.interface";
import { AppConfigLoginInstructions, LoginMethod } from "src/app/app-config.model";
import { PasswordLoginCredentials } from "../auth.api.model";

export const TEST_GITHUB_CODE = "12345";
export const TEST_ACCESS_TOKEN_GITHUB = "someTokenViaGithub";
export const TEST_ACCESS_TOKEN_PASSWORD = "someTokenViaPassword";
export const TEST_ACCOUNT_ID = "12345";
export const TEST_LOGIN = "foo";
export const TEST_PASSWORD = "bar";
export const TEST_USER_NAME = "Test User";

const mockPasswordLoginCredentials: PasswordLoginCredentials = {
    login: TEST_LOGIN,
    password: TEST_PASSWORD,
};

export const mockLoginInstructions: AppConfigLoginInstructions = {
    loginMethod: LoginMethod.PASSWORD,
    loginCredentialsJson: JSON.stringify(mockPasswordLoginCredentials),
};

export const TEST_AVATAR_URL = "http://example.com/image.jpg";

export const mockAccountDetails: AccountFragment = {
    id: TEST_ACCOUNT_ID,
    accountName: TEST_LOGIN,
    displayName: TEST_USER_NAME,
    accountType: AccountType.User,
    avatarUrl: TEST_AVATAR_URL,
    isAdmin: false,
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

export const mockLogin401Error: GraphQLError = new GraphQLError(
    "HTTP status client error (401 Unauthorized) for url (https://api.github.com/user)",
);
