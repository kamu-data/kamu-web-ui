/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import {
    AccountType,
    AccountWithRole,
    DatasetAccessRole,
    DatasetKind,
    DatasetListCollaboratorsQuery,
    DatasetSearchCollaboratorQuery,
    SetRoleCollaboratorMutation,
    UnsetRoleCollaboratorMutation,
} from "../kamu.graphql.interface";

export const MOCK_ACCOUNT_WITH_ROLE: AccountWithRole = {
    account: {
        id: "did:odf:fed016b61ed2ab1b63a006b61ed2ab1b63a00b016d65607000000e0821aafbf163e6f",
        accountName: "kamu",
        displayName: "kamu",
        accountType: AccountType.User,
        email: "test@gamil.com",
        avatarUrl: "https://avatars.githubusercontent.com/u/50896974?s=200&v=4",
        isAdmin: true,
        __typename: "Account",
    },
    role: DatasetAccessRole.Maintainer,
};

export const mockDatasetListCollaboratorsQuery: DatasetListCollaboratorsQuery = {
    datasets: {
        byId: {
            id: "did:odf:fed01d2d57c90bacc31605c01e722b04c56bb77de3218d6969833c9485988746b2ff0",
            kind: DatasetKind.Root,
            name: "account.tokens.transfers",
            owner: {
                id: "did:odf:fed016b61ed2ab1b63a006b61ed2ab1b63a00b016d65607000000e0821aafbf163e6f",
                accountName: "kamu",
                __typename: "Account",
            },
            alias: "kamu/account.tokens.transfers",
            visibility: {
                __typename: "PrivateDatasetVisibility",
            },
            __typename: "Dataset",
            collaboration: {
                accountRoles: {
                    nodes: [
                        {
                            account: {
                                id: "did:odf:fed0137bc34f6025c18860e00d69737134224c02b6c27e069c9f3610a93ace02aba01",
                                accountName: "test-user",
                                displayName: "Test User",
                                accountType: AccountType.User,
                                avatarUrl: "https://avatars.githubusercontent.com/u/51016717?v=4",
                                isAdmin: false,
                                __typename: "Account",
                            },
                            role: DatasetAccessRole.Maintainer,
                            __typename: "AccountWithRole",
                        },
                    ],
                    totalCount: 1,
                    pageInfo: {
                        hasNextPage: false,
                        hasPreviousPage: false,
                        currentPage: 0,
                        totalPages: 1,
                        __typename: "PageBasedInfo",
                    },
                    __typename: "AccountWithRoleConnection",
                },
                __typename: "DatasetCollaboration",
            },
        },
        __typename: "Datasets",
    },
};

export const mockDatasetSearchCollaboratorQuery: DatasetSearchCollaboratorQuery = {
    search: {
        __typename: "Search",
        nameLookup: {
            __typename: "NameLookupResultConnection",
            nodes: [
                {
                    __typename: "Account",
                    id: "did:odf:fed01132a9b24e416337a9f64c322f684bffc19549a42aa3e258ee11af48492a8074e",
                    accountName: "bmis-bycatch.org",
                    displayName: "Bycatch Management Information System",
                    accountType: AccountType.User,
                    avatarUrl: "https://cdn-icons-png.flaticon.com/128/10197/10197245.png",
                    isAdmin: false,
                },
            ],
        },
    },
};

export const mockSetRoleCollaboratorMutation: SetRoleCollaboratorMutation = {
    datasets: {
        byId: {
            collaboration: {
                setRole: {
                    message: "Success",
                    __typename: "SetRoleResultSuccess",
                },
                __typename: "DatasetCollaborationMut",
            },
            __typename: "DatasetMut",
        },
        __typename: "DatasetsMut",
    },
};

export const mockUnsetRoleCollaboratorMutation: UnsetRoleCollaboratorMutation = {
    datasets: {
        byId: {
            collaboration: {
                unsetRoles: {
                    message: "Success",
                    __typename: "UnsetRoleResultSuccess",
                },
                __typename: "DatasetCollaborationMut",
            },
            __typename: "DatasetMut",
        },
        __typename: "DatasetsMut",
    },
};
