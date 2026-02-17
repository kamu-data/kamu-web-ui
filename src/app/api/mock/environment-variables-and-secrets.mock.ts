/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { mockOwnerFieldsWithAvatar, mockPublicDatasetVisibility } from "src/app/search/mock.data";

import {
    DatasetKind,
    DeleteEnvVariableMutation,
    ExposedEnvVariableValueQuery,
    ListEnvVariablesQuery,
    UpsertEnvVariableMutation,
} from "@api/kamu.graphql.interface";

export const MOCK_PER_PAGE = 5;
export const MOCK_PAGE = 1;
export const MOCK_KEY = "mock-key";
export const MOCK_VALUE = "mock-value";
export const MOCK_IS_SECRET = true;
export const MOCK_ENV_VAR_ID = "10937430-43ed-4f87-a687-3365fea9d942";
export const MOCK_NEW_VALUE = "mock-new-value";

export const mockListEnvVariablesQuery: ListEnvVariablesQuery = {
    datasets: {
        byOwnerAndName: {
            id: "did:odf:fed016c0070664336545c0f49dc6a7a860c6862ab3336b630c2d7e779394a26da2e1e",
            kind: DatasetKind.Derivative,
            name: "account.tokens.portfolio",
            owner: {
                __typename: "Account",
                ...mockOwnerFieldsWithAvatar,
            },
            alias: "kamu/account.tokens.portfolio",
            visibility: mockPublicDatasetVisibility,
            envVars: {
                listEnvVariables: {
                    totalCount: 5,
                    nodes: [
                        {
                            id: "10937430-43ed-4f87-a687-3365fea9d942",
                            key: "key-1",
                            value: "value-1",
                            isSecret: false,
                            __typename: "ViewDatasetEnvVar",
                        },
                        {
                            id: "0545c6f4-4609-45ac-bf70-1c3cfb02f50b",
                            key: "key-2",
                            value: "value-2",
                            isSecret: false,
                            __typename: "ViewDatasetEnvVar",
                        },
                        {
                            id: "6583ad2f-3b5f-4bb7-93ab-7c9c1ad77099",
                            key: "key-3",
                            value: null,
                            isSecret: true,
                            __typename: "ViewDatasetEnvVar",
                        },
                        {
                            id: "2ddc35f1-e01f-429f-b8a3-25fc998ecf2b",
                            key: "key-4",
                            value: null,
                            isSecret: true,
                            __typename: "ViewDatasetEnvVar",
                        },
                        {
                            id: "2c8c2cc0-a01e-496c-b662-95081bddcbb7",
                            key: "key-5",
                            value: null,
                            isSecret: true,
                            __typename: "ViewDatasetEnvVar",
                        },
                    ],
                    pageInfo: {
                        hasNextPage: false,
                        hasPreviousPage: false,
                        currentPage: 0,
                        totalPages: 1,
                        __typename: "PageBasedInfo",
                    },
                    __typename: "ViewDatasetEnvVarConnection",
                },
                __typename: "DatasetEnvVars",
            },
            __typename: "Dataset",
        },
        __typename: "Datasets",
    },
};

export const mockUpsertEnvVariableMutationCreated: UpsertEnvVariableMutation = {
    datasets: {
        byId: {
            envVars: {
                upsertEnvVariable: {
                    message: "Created",
                    envVar: {
                        id: "05c146a0-f781-4bc6-a9d6-a4a7629c2b7c",
                        key: "key-1",
                        value: "value-1",
                        isSecret: false,
                        __typename: "ViewDatasetEnvVar",
                    },
                    __typename: "UpsertDatasetEnvVarResultCreated",
                },
                __typename: "DatasetEnvVarsMut",
            },
            __typename: "DatasetMut",
        },
        __typename: "DatasetsMut",
    },
};

export const mockUpsertEnvVariableMutationUpdated: UpsertEnvVariableMutation = {
    datasets: {
        byId: {
            envVars: {
                upsertEnvVariable: {
                    message: "Updated",
                    envVar: {
                        id: "015854a3-74a7-4abc-908e-e49a5ebe904f",
                        key: "key1",
                        value: "value12",
                        isSecret: false,
                        __typename: "ViewDatasetEnvVar",
                    },
                    __typename: "UpsertDatasetEnvVarResultUpdated",
                },
                __typename: "DatasetEnvVarsMut",
            },
            __typename: "DatasetMut",
        },
        __typename: "DatasetsMut",
    },
};

export const mockUpsertEnvVariableMutationUpToDate: UpsertEnvVariableMutation = {
    datasets: {
        byId: {
            envVars: {
                upsertEnvVariable: {
                    message: "Dataset env var is up to date",
                    __typename: "UpsertDatasetEnvVarUpToDate",
                },
                __typename: "DatasetEnvVarsMut",
            },
            __typename: "DatasetMut",
        },
        __typename: "DatasetsMut",
    },
};

export const mockDeleteEnvVariableMutation: DeleteEnvVariableMutation = {
    datasets: {
        byId: {
            envVars: {
                deleteEnvVariable: {
                    message: "Success",
                    envVarId: "10937430-43ed-4f87-a687-3365fea9d942",
                    __typename: "DeleteDatasetEnvVarResultSuccess",
                },
                __typename: "DatasetEnvVarsMut",
            },
            __typename: "DatasetMut",
        },
        __typename: "DatasetsMut",
    },
};

export const mockDeleteEnvVariableMutationError: DeleteEnvVariableMutation = {
    datasets: {
        byId: {
            envVars: {
                deleteEnvVariable: {
                    message: "Error",
                    envVarId: "10937430-43ed-4f87-a687-3365fea9d942",
                    __typename: "DeleteDatasetEnvVarResultNotFound",
                },
                __typename: "DatasetEnvVarsMut",
            },
            __typename: "DatasetMut",
        },
        __typename: "DatasetsMut",
    },
};

export const mockExposedEnvVariableValueQuery: ExposedEnvVariableValueQuery = {
    datasets: {
        byOwnerAndName: {
            envVars: {
                exposedValue: "value-10",
                __typename: "DatasetEnvVars",
            },
            __typename: "Dataset",
        },
        __typename: "Datasets",
    },
};
