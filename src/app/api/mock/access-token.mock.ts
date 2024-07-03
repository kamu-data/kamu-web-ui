import {
    AccountType,
    CreateAccessTokenMutation,
    ListAccessTokensQuery,
    RevokeAccessTokenMutation,
} from "../kamu.graphql.interface";

export const PAGE = 1;
export const PER_PAGE = 15;
export const TOKEN_NAME = "test-name";
export const TOKEN_ID = "df649c7c-a4cb-4a8c-b39a-e879f8e9b3b6";

export const mockCreateAccessTokenMutation: CreateAccessTokenMutation = {
    auth: {
        createAccessToken: {
            message: "Success",
            token: {
                id: "514bcfec-1c58-44ce-aee8-867477b100d2",
                name: "test-token",
                composed: "ka_A55WZV0WB12CXBQ8GST7FC80T95JKMSXHJ93Q08TJFRVE0N5Q2APVQVZM0",
                account: {
                    id: "did:odf:fed016b61ed2ab1b63a006b61ed2ab1b63a00b016d65607000000e0821aafbf163e6f",
                    accountName: "kamu",
                    displayName: "kamu",
                    accountType: AccountType.User,
                    avatarUrl: "https://avatars.githubusercontent.com/u/50896974?s=200&v=4",
                    isAdmin: true,
                    __typename: "Account",
                },
                __typename: "CreatedAccessToken",
            },
            __typename: "CreateAccessTokenResultSuccess",
        },
        __typename: "AuthMut",
    },
};

export const mockCreateAccessTokenMutationError: CreateAccessTokenMutation = {
    auth: {
        createAccessToken: {
            message: "Access token with q1 name already exists",
            tokenName: "q1",
            __typename: "CreateAccessTokenResultDuplicate",
        },
        __typename: "AuthMut",
    },
};

export const mockListAccessTokensQuery: ListAccessTokensQuery = {
    auth: {
        listAccessTokens: {
            nodes: [
                {
                    id: "df649c7c-a4cb-4a8c-b39a-e879f8e9b3b6",
                    name: "q1",
                    createdAt: "2024-07-02T14:07:01.342161525+00:00",
                    revokedAt: "2024-07-02T14:12:35.819821056+00:00",
                    account: {
                        id: "did:odf:fed016b61ed2ab1b63a006b61ed2ab1b63a00b016d65607000000e0821aafbf163e6f",
                        accountName: "kamu",
                        displayName: "kamu",
                        accountType: AccountType.User,
                        avatarUrl: "https://avatars.githubusercontent.com/u/50896974?s=200&v=4",
                        isAdmin: true,
                        __typename: "Account",
                    },
                    __typename: "ViewAccessToken",
                },
                {
                    id: "5d66ff36-0d34-45f9-a5ba-4c3fb54bbb70",
                    name: "q2",
                    createdAt: "2024-07-02T14:07:06.988846616+00:00",
                    revokedAt: null,
                    account: {
                        id: "did:odf:fed016b61ed2ab1b63a006b61ed2ab1b63a00b016d65607000000e0821aafbf163e6f",
                        accountName: "kamu",
                        displayName: "kamu",
                        accountType: AccountType.User,
                        avatarUrl: "https://avatars.githubusercontent.com/u/50896974?s=200&v=4",
                        isAdmin: true,
                        __typename: "Account",
                    },
                    __typename: "ViewAccessToken",
                },
            ],
            totalCount: 2,
            pageInfo: {
                hasNextPage: false,
                hasPreviousPage: false,
                currentPage: 0,
                totalPages: 1,
                __typename: "PageBasedInfo",
            },
            __typename: "AccessTokenConnection",
        },
        __typename: "Auth",
    },
};

export const mockRevokeAccessTokenMutation: RevokeAccessTokenMutation = {
    auth: {
        revokeAccessToken: {
            tokenId: "514bcfec-1c58-44ce-aee8-867477b100d2",
            message: "Access token revoked succesfully",
            __typename: "RevokeResultSuccess",
        },
        __typename: "AuthMut",
    },
};

export const mockRevokeAccessTokenMutationError: RevokeAccessTokenMutation = {
    auth: {
        revokeAccessToken: {
            tokenId: "514bcfec-1c58-44ce-aee8-867477b100d2",
            message: "Access token already revoked",
            __typename: "RevokeResultAlreadyRevoked",
        },
        __typename: "AuthMut",
    },
};
