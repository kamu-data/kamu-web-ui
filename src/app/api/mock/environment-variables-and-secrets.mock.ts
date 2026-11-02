/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import {
    CreateEnvVariableMutation,
    DatasetKind,
    DeleteEnvVariableMutation,
    ExposedEnvVariableValueQuery,
    ListEnvVariablesQuery,
    UpsertEnvVariableMutation,
} from "@api/kamu.graphql.interface";

import { mockOwnerFieldsWithAvatar, mockPublicDatasetVisibility } from "src/app/search/mock.data";

export const MOCK_PER_PAGE = 5;
export const MOCK_PAGE = 1;
export const MOCK_VAR_KEY = "mock-key";
export const MOCK_VAR_VALUE = "mock-value";
export const MOCK_NEW_VALUE = "mock-new-value";
export const MOCK_UPSERT_ENV_VAR_CREATED_MESSAGE = "Created";
export const MOCK_UPSERT_ENV_VAR_UPDATED_MESSAGE = "Updated";
export const MOCK_UPSERT_ENV_VAR_UP_TO_DATE_MESSAGE = "Dataset env var is up to date";
export const MOCK_EXPOSED_ENV_VAR_VALUE = "value-10";
export const MOCK_ENV_VAR_ALREADY_EXISTS_MESSAGE = "Environment variable with 'mock-key' key already exists";
export const MOCK_ENV_VAR_INVALID_KEY_MESSAGE = "Invalid variable name 'mock-key'";
export const MOCK_ENV_VAR_VALUE_TOO_LONG_MESSAGE = "Value of 'mock-key' is 16385 bytes long, the limit is 16384";
export const MOCK_ENV_VAR_TOO_MANY_ENTRIES_MESSAGE = "A dataset can have at most 256 variables";

export const mockListEnvVariablesQuery: ListEnvVariablesQuery = {
    datasets: {
        byOwnerAndName: {
            id: "did:odf:fed016c0070664336545c0f49dc6a7a860c6862ab3336b630c2d7e779394a26da2e1e",
            kind: DatasetKind.Derivative,
            name: "account.tokens.portfolio",
            owner: {
                ...mockOwnerFieldsWithAvatar,
            },
            alias: "kamu/account.tokens.portfolio",
            visibility: mockPublicDatasetVisibility,
            envVars: {
                listEnvVariables: {
                    totalCount: 5,
                    nodes: [
                        {
                            key: "key-1",
                            value: "value-1",
                            isSecret: false,
                            __typename: "ViewDatasetEnvVar",
                        },
                        {
                            key: "key-2",
                            value: "value-2",
                            isSecret: false,
                            __typename: "ViewDatasetEnvVar",
                        },
                        {
                            key: "key-3",
                            value: null,
                            isSecret: true,
                            __typename: "ViewDatasetEnvVar",
                        },
                        {
                            key: "key-4",
                            value: null,
                            isSecret: true,
                            __typename: "ViewDatasetEnvVar",
                        },
                        {
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
                    message: MOCK_UPSERT_ENV_VAR_CREATED_MESSAGE,
                    envVar: {
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
                    message: MOCK_UPSERT_ENV_VAR_UPDATED_MESSAGE,
                    envVar: {
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
                    message: MOCK_UPSERT_ENV_VAR_UP_TO_DATE_MESSAGE,
                    __typename: "UpsertDatasetEnvVarUpToDate",
                },
                __typename: "DatasetEnvVarsMut",
            },
            __typename: "DatasetMut",
        },
        __typename: "DatasetsMut",
    },
};

export const mockCreateEnvVariableMutationCreated: CreateEnvVariableMutation = {
    datasets: {
        byId: {
            envVars: {
                createEnvVariable: {
                    message: MOCK_UPSERT_ENV_VAR_CREATED_MESSAGE,
                    envVar: {
                        key: MOCK_VAR_KEY,
                        value: MOCK_VAR_VALUE,
                        isSecret: false,
                        __typename: "ViewDatasetEnvVar",
                    },
                    __typename: "CreateDatasetEnvVarResultCreated",
                },
                __typename: "DatasetEnvVarsMut",
            },
            __typename: "DatasetMut",
        },
        __typename: "DatasetsMut",
    },
};

export const mockCreateEnvVariableMutationAlreadyExists: CreateEnvVariableMutation = {
    datasets: {
        byId: {
            envVars: {
                createEnvVariable: {
                    message: MOCK_ENV_VAR_ALREADY_EXISTS_MESSAGE,
                    __typename: "CreateDatasetEnvVarResultAlreadyExists",
                },
                __typename: "DatasetEnvVarsMut",
            },
            __typename: "DatasetMut",
        },
        __typename: "DatasetsMut",
    },
};

export const mockCreateEnvVariableMutationInvalidKey: CreateEnvVariableMutation = {
    datasets: {
        byId: {
            envVars: {
                createEnvVariable: {
                    message: MOCK_ENV_VAR_INVALID_KEY_MESSAGE,
                    __typename: "DatasetEnvVarInvalidKey",
                },
                __typename: "DatasetEnvVarsMut",
            },
            __typename: "DatasetMut",
        },
        __typename: "DatasetsMut",
    },
};

export const mockCreateEnvVariableMutationTooManyEntries: CreateEnvVariableMutation = {
    datasets: {
        byId: {
            envVars: {
                createEnvVariable: {
                    message: MOCK_ENV_VAR_TOO_MANY_ENTRIES_MESSAGE,
                    __typename: "DatasetEnvVarTooManyEntries",
                },
                __typename: "DatasetEnvVarsMut",
            },
            __typename: "DatasetMut",
        },
        __typename: "DatasetsMut",
    },
};

export const mockUpsertEnvVariableMutationValueTooLong: UpsertEnvVariableMutation = {
    datasets: {
        byId: {
            envVars: {
                upsertEnvVariable: {
                    message: MOCK_ENV_VAR_VALUE_TOO_LONG_MESSAGE,
                    __typename: "DatasetEnvVarValueTooLong",
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
                    envVarKey: MOCK_VAR_KEY,
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
                    envVarKey: MOCK_VAR_KEY,
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
                exposedValue: MOCK_EXPOSED_ENV_VAR_VALUE,
                __typename: "DatasetEnvVars",
            },
            __typename: "Dataset",
        },
        __typename: "Datasets",
    },
};
