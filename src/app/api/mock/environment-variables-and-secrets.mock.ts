import {
    DatasetKind,
    DeleteEnvVariableMutation,
    ExposedEnvVariableValueQuery,
    ListEnvVariablesQuery,
    ModifyEnvVariableMutation,
    SaveEnvVariableMutation,
} from "../kamu.graphql.interface";

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
                id: "did:odf:fed016b61ed2ab1b63a006b61ed2ab1b63a00b016d65607000000e0821aafbf163e6f",
                accountName: "kamu",
            },
            alias: "kamu/account.tokens.portfolio",
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

export const mockSaveEnvVariableMutation: SaveEnvVariableMutation = {
    datasets: {
        __typename: "DatasetsMut",
        byId: {
            __typename: "DatasetMut",
            envVars: {
                __typename: "DatasetEnvVarsMut",
                saveEnvVariable: {
                    __typename: "SaveDatasetEnvVarResultSuccess",
                    message: "Success",
                    envVar: {
                        __typename: "ViewDatasetEnvVar",
                        id: "9ee366c3-d7c6-464b-b3df-39bfccfec3cc",
                        key: "key-10",
                        value: null,
                        isSecret: true,
                    },
                },
            },
        },
    },
};

export const mockSaveEnvVariableMutationError: SaveEnvVariableMutation = {
    datasets: {
        __typename: "DatasetsMut",
        byId: {
            __typename: "DatasetMut",
            envVars: {
                __typename: "DatasetEnvVarsMut",
                saveEnvVariable: {
                    __typename: "SaveDatasetEnvVarResultDuplicate",
                    message: "Error",
                    datasetEnvVarKey: "9ee366c3-d7c6-464b-b3df-39bfccfec3cc",
                },
            },
        },
    },
};

export const mockModifyEnvVariableMutation: ModifyEnvVariableMutation = {
    datasets: {
        byId: {
            envVars: {
                modifyEnvVariable: {
                    message: "Success",
                    envVarId: "10937430-43ed-4f87-a687-3365fea9d942",
                    __typename: "ModifyDatasetEnvVarResultSuccess",
                },
                __typename: "DatasetEnvVarsMut",
            },
            __typename: "DatasetMut",
        },
        __typename: "DatasetsMut",
    },
};

export const mockModifyEnvVariableMutationError: ModifyEnvVariableMutation = {
    datasets: {
        byId: {
            envVars: {
                modifyEnvVariable: {
                    message: "Error",
                    envVarId: "10937430-43ed-4f87-a687-3365fea9d942",
                    __typename: "ModifyDatasetEnvVarResultNotFound",
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
