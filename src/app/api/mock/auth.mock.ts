import { GraphQLError } from "graphql";
import { AccountDetailsFragment, FetchAccountInfoMutation, GithubLoginMutation } from "../kamu.graphql.interface";

export const TEST_GITHUB_CODE = "12345";
export const TEST_ACCESS_TOKEN = "someToken";

export const mockAccountDetails: AccountDetailsFragment = {
    login: "test-user",
    name: "Test User",
    email: "test@example.com",
    avatarUrl: null,
    gravatarId: null,
};

export const mockUserInfoFromAccessToken: FetchAccountInfoMutation = {
    auth: {
        __typename: "Auth",
        accountInfo: mockAccountDetails,
    }
};

export const mockGithubLoginResponse: GithubLoginMutation = {
    auth: {
        __typename: "Auth",
        githubLogin: {
            __typename: "LoginResponse",
            token: {
                __typename: "AccessToken",
                accessToken: TEST_ACCESS_TOKEN,
                scope: "someScope",
                tokenType: "someType"
            },
            accountInfo: mockAccountDetails,
        }
    }
};

export const mockLogin401Error: GraphQLError = new GraphQLError(
    "HTTP status client error (401 Unauthorized) for url (https://api.github.com/user)",
);

