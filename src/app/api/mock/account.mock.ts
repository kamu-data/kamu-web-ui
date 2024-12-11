import { mockDatasetMainDataId } from "src/app/search/mock.data";
import {
    AccountByNameQuery,
    AccountDatasetFlowsPausedQuery,
    AccountListDatasetsWithFlowsQuery,
    AccountListFlowsQuery,
    AccountPauseFlowsMutation,
    AccountResumeFlowsMutation,
    AccountType,
    DatasetKind,
    FlowStatus,
} from "../kamu.graphql.interface";
import { mockAccountDetails } from "./auth.mock";

export const mockAccountByNameResponse: AccountByNameQuery = {
    __typename: "Query",
    accounts: {
        __typename: "Accounts",
        byName: {
            __typename: "Account",
            ...mockAccountDetails,
        },
    },
};

export const mockAccountByNameNotFoundResponse: AccountByNameQuery = {
    __typename: "Query",
    accounts: {
        __typename: "Accounts",
        byName: null,
    },
};

export const mockAccountListFlowsQuery: AccountListFlowsQuery = {
    accounts: {
        byName: {
            flows: {
                runs: {
                    table: {
                        nodes: [
                            {
                                description: {
                                    datasetId:
                                        "did:odf:fed014aee1c33d51f36c21fab6f13444bdce6fe3d5762cbb889adead63498f57f4168",
                                    ingestResult: null,
                                    __typename: "FlowDescriptionDatasetPollingIngest",
                                },
                                flowId: "0",
                                status: FlowStatus.Finished,
                                initiator: {
                                    id: "did:odf:fed016b61ed2ab1b63a006b61ed2ab1b63a00b016d65607000000e0821aafbf163e6f",
                                    accountName: "kamu",
                                    displayName: "kamu",
                                    accountType: AccountType.User,
                                    avatarUrl: "https://avatars.githubusercontent.com/u/50896974?s=200&v=4",
                                    isAdmin: true,
                                    __typename: "Account",
                                },
                                outcome: {
                                    message: "SUCCESS",
                                    __typename: "FlowSuccessResult",
                                },
                                timing: {
                                    awaitingExecutorSince: "2024-06-10T07:00:31+00:00",
                                    runningSince: "2024-06-10T07:00:31.306400327+00:00",
                                    finishedAt: "2024-06-10T07:00:31.337328+00:00",
                                    __typename: "FlowTimingRecords",
                                },
                                startCondition: null,
                                __typename: "Flow",
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
                        edges: [
                            {
                                node: {
                                    description: {
                                        datasetId:
                                            "did:odf:fed014aee1c33d51f36c21fab6f13444bdce6fe3d5762cbb889adead63498f57f4168",
                                        ingestResult: null,
                                        __typename: "FlowDescriptionDatasetPollingIngest",
                                    },
                                    flowId: "0",
                                    status: FlowStatus.Finished,
                                    initiator: {
                                        id: "did:odf:fed016b61ed2ab1b63a006b61ed2ab1b63a00b016d65607000000e0821aafbf163e6f",
                                        accountName: "kamu",
                                        displayName: "kamu",
                                        accountType: AccountType.User,
                                        avatarUrl: "https://avatars.githubusercontent.com/u/50896974?s=200&v=4",
                                        isAdmin: true,
                                        __typename: "Account",
                                    },
                                    outcome: {
                                        message: "SUCCESS",
                                        __typename: "FlowSuccessResult",
                                    },
                                    timing: {
                                        awaitingExecutorSince: "2024-06-10T07:00:31+00:00",
                                        runningSince: "2024-06-10T07:00:31.306400327+00:00",
                                        finishedAt: "2024-06-10T07:00:31.337328+00:00",
                                        __typename: "FlowTimingRecords",
                                    },
                                    startCondition: null,
                                    __typename: "Flow",
                                },
                                __typename: "FlowEdge",
                            },
                        ],
                        __typename: "FlowConnection",
                    },
                    tiles: {
                        nodes: [
                            {
                                flowId: "0",
                                description: {
                                    __typename: "FlowDescriptionDatasetPollingIngest",
                                    datasetId: mockDatasetMainDataId,
                                },
                                status: FlowStatus.Finished,

                                outcome: {
                                    message: "SUCCESS",
                                    __typename: "FlowSuccessResult",
                                },
                                timing: {
                                    awaitingExecutorSince: "2024-06-10T07:00:31+00:00",
                                    runningSince: "2024-06-10T07:00:31.306400327+00:00",
                                    finishedAt: "2024-06-10T07:00:31.337328+00:00",
                                    __typename: "FlowTimingRecords",
                                },

                                __typename: "Flow",
                            },
                        ],
                        totalCount: 1,

                        __typename: "FlowConnection",
                    },
                    __typename: "AccountFlowRuns",
                },
                __typename: "AccountFlows",
            },
            __typename: "Account",
        },
        __typename: "Accounts",
    },
};

export const mockAccountListDatasetsWithFlowsQuery: AccountListDatasetsWithFlowsQuery = {
    accounts: {
        byName: {
            flows: {
                runs: {
                    listDatasetsWithFlow: {
                        nodes: [
                            {
                                id: "did:odf:fed014aee1c33d51f36c21fab6f13444bdce6fe3d5762cbb889adead63498f57f4168",
                                kind: DatasetKind.Root,
                                name: "baccount.tokens.transfers",
                                owner: {
                                    id: "did:odf:fed016b61ed2ab1b63a006b61ed2ab1b63a00b016d65607000000e0821aafbf163e6f",
                                    accountName: "kamu",
                                    __typename: "Account",
                                },
                                alias: "account.tokens.transfers",
                                __typename: "Dataset",
                                metadata: {
                                    currentPollingSource: {
                                        fetch: {
                                            url: "https://api.etherscan.io/api?module=account&action=tokentx&address=0xeadb3840596cabf312f2bc88a4bb0b93a4e1ff5f&page=1&offset=1000&startblock=0&endblock=99999999&apikey=${{ env.ETHERSCAN_API_KEY }}",
                                            eventTime: null,
                                            headers: null,
                                            cache: null,
                                            __typename: "FetchStepUrl",
                                        },
                                        __typename: "SetPollingSource",
                                    },
                                    currentTransform: null,
                                    __typename: "DatasetMetadata",
                                },
                            },
                            {
                                id: "did:odf:fed014aee1c33d51f36c21fab6f13444bdce6fe3d5762cbb889adead63498f57f4168",
                                kind: DatasetKind.Root,
                                name: "account.tokens.transfers",
                                owner: {
                                    id: "did:odf:fed016b61ed2ab1b63a006b61ed2ab1b63a00b016d65607000000e0821aafbf163e6f",
                                    accountName: "kamu",
                                    __typename: "Account",
                                },
                                alias: "account.tokens.transfers",
                                __typename: "Dataset",
                                metadata: {
                                    currentPollingSource: {
                                        fetch: {
                                            url: "https://api.etherscan.io/api?module=account&action=tokentx&address=0xeadb3840596cabf312f2bc88a4bb0b93a4e1ff5f&page=1&offset=1000&startblock=0&endblock=99999999&apikey=${{ env.ETHERSCAN_API_KEY }}",
                                            eventTime: null,
                                            headers: null,
                                            cache: null,
                                            __typename: "FetchStepUrl",
                                        },
                                        __typename: "SetPollingSource",
                                    },
                                    currentTransform: null,
                                    __typename: "DatasetMetadata",
                                },
                            },
                            {
                                id: "did:odf:fed014aee1c33d51f36c21fab6f13444bdce6fe3d5762cbb889adead63498f57f4168",
                                kind: DatasetKind.Root,
                                name: "account.tokens.transfers",
                                owner: {
                                    id: "did:odf:fed016b61ed2ab1b63a006b61ed2ab1b63a00b016d65607000000e0821aafbf163e6f",
                                    accountName: "kamu",
                                    __typename: "Account",
                                },
                                alias: "caccount.tokens.transfers",
                                __typename: "Dataset",
                                metadata: {
                                    currentPollingSource: {
                                        fetch: {
                                            url: "https://api.etherscan.io/api?module=account&action=tokentx&address=0xeadb3840596cabf312f2bc88a4bb0b93a4e1ff5f&page=1&offset=1000&startblock=0&endblock=99999999&apikey=${{ env.ETHERSCAN_API_KEY }}",
                                            eventTime: null,
                                            headers: null,
                                            cache: null,
                                            __typename: "FetchStepUrl",
                                        },
                                        __typename: "SetPollingSource",
                                    },
                                    currentTransform: null,
                                    __typename: "DatasetMetadata",
                                },
                            },
                            {
                                id: "did:odf:fed014aee1c33d51f36c21fab6f13444bdce6fe3d5762cbb889adead63498f57f4168",
                                kind: DatasetKind.Root,
                                name: "account.tokens.transfers",
                                owner: {
                                    id: "did:odf:fed016b61ed2ab1b63a006b61ed2ab1b63a00b016d65607000000e0821aafbf163e6f",
                                    accountName: "kamu",
                                    __typename: "Account",
                                },
                                alias: "account.tokens.transfers",
                                __typename: "Dataset",
                                metadata: {
                                    currentPollingSource: {
                                        fetch: {
                                            url: "https://api.etherscan.io/api?module=account&action=tokentx&address=0xeadb3840596cabf312f2bc88a4bb0b93a4e1ff5f&page=1&offset=1000&startblock=0&endblock=99999999&apikey=${{ env.ETHERSCAN_API_KEY }}",
                                            eventTime: null,
                                            headers: null,
                                            cache: null,
                                            __typename: "FetchStepUrl",
                                        },
                                        __typename: "SetPollingSource",
                                    },
                                    currentTransform: null,
                                    __typename: "DatasetMetadata",
                                },
                            },
                        ],
                        __typename: "DatasetConnection",
                    },
                    __typename: "AccountFlowRuns",
                },
                __typename: "AccountFlows",
            },
            __typename: "Account",
        },
        __typename: "Accounts",
    },
};

export const mockAccountDatasetFlowsPausedQuery: AccountDatasetFlowsPausedQuery = {
    accounts: {
        byName: {
            flows: {
                configs: {
                    allPaused: true,
                    __typename: "AccountFlowConfigs",
                },
                __typename: "AccountFlows",
            },
            __typename: "Account",
        },
        __typename: "Accounts",
    },
};

export const mockAccountPauseFlowsMutationSuccess: AccountPauseFlowsMutation = {
    accounts: {
        byName: {
            flows: {
                configs: {
                    pauseAccountDatasetFlows: true,
                    __typename: "AccountFlowConfigsMut",
                },
                __typename: "AccountFlowsMut",
            },
            __typename: "AccountMut",
        },
        __typename: "AccountsMut",
    },
};

export const mockAccountPauseFlowsMutationError: AccountPauseFlowsMutation = {
    accounts: {
        byName: {
            flows: {
                configs: {
                    pauseAccountDatasetFlows: false,
                    __typename: "AccountFlowConfigsMut",
                },
                __typename: "AccountFlowsMut",
            },
            __typename: "AccountMut",
        },
        __typename: "AccountsMut",
    },
};

export const mockAccountResumeFlowsMutationSuccess: AccountResumeFlowsMutation = {
    accounts: {
        byName: {
            flows: {
                configs: {
                    resumeAccountDatasetFlows: true,
                    __typename: "AccountFlowConfigsMut",
                },
                __typename: "AccountFlowsMut",
            },
            __typename: "AccountMut",
        },
        __typename: "AccountsMut",
    },
};

export const mockAccountResumeFlowsMutationError: AccountResumeFlowsMutation = {
    accounts: {
        byName: {
            flows: {
                configs: {
                    resumeAccountDatasetFlows: false,
                    __typename: "AccountFlowConfigsMut",
                },
                __typename: "AccountFlowsMut",
            },
            __typename: "AccountMut",
        },
        __typename: "AccountsMut",
    },
};
