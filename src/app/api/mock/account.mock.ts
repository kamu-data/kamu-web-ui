/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { mockPublicDatasetVisibility } from "src/app/search/mock.data";
import { mockDatasetMainDataId } from "src/app/search/mock.data";
import {
    AccountByNameQuery,
    AccountChangeEmailMutation,
    AccountDatasetFlowsPausedQuery,
    AccountListDatasetsWithFlowsQuery,
    AccountListFlowsQuery,
    AccountPauseFlowsMutation,
    AccountResumeFlowsMutation,
    AccountType,
    AccountWithEmailQuery,
    DatasetKind,
    DeleteAccountByNameMutation,
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
                                    accountProvider: "password",
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
                                        accountProvider: "password",
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
                                    accountProvider: "password",
                                },
                                alias: "account.tokens.transfers",
                                visibility: mockPublicDatasetVisibility,
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
                                    accountProvider: "password",
                                },
                                alias: "account.tokens.transfers",
                                visibility: mockPublicDatasetVisibility,
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
                                    accountProvider: "password",
                                },
                                alias: "caccount.tokens.transfers",
                                visibility: mockPublicDatasetVisibility,
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
                                    accountProvider: "password",
                                },
                                alias: "account.tokens.transfers",
                                visibility: mockPublicDatasetVisibility,
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
                triggers: {
                    allPaused: true,
                    __typename: "AccountFlowTriggers",
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
                triggers: {
                    pauseAccountDatasetFlows: true,
                    __typename: "AccountFlowTriggersMut",
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
                triggers: {
                    pauseAccountDatasetFlows: false,
                    __typename: "AccountFlowTriggersMut",
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
                triggers: {
                    resumeAccountDatasetFlows: true,
                    __typename: "AccountFlowTriggersMut",
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
                triggers: {
                    resumeAccountDatasetFlows: false,
                    __typename: "AccountFlowTriggersMut",
                },
                __typename: "AccountFlowsMut",
            },
            __typename: "AccountMut",
        },
        __typename: "AccountsMut",
    },
};

export const mockAccountChangeEmailMutationSuccess: AccountChangeEmailMutation = {
    accounts: {
        byName: {
            updateEmail: {
                newEmail: "kamu23@example.com",
                message: "Success",
                __typename: "UpdateEmailSuccess",
            },
            __typename: "AccountMut",
        },
        __typename: "AccountsMut",
    },
};

export const mockAccountChangeEmailMutationError: AccountChangeEmailMutation = {
    accounts: {
        byName: {
            updateEmail: {
                message: "Non unique email",
                __typename: "UpdateEmailNonUnique",
            },
            __typename: "AccountMut",
        },
        __typename: "AccountsMut",
    },
};

export const mockAccountWithEmailQuery: AccountWithEmailQuery = {
    accounts: {
        byName: {
            id: "did:odf:fed016b61ed2ab1b63a006b61ed2ab1b63a00b016d65607000000e0821aafbf163e6f",
            accountName: "kamu",
            displayName: "kamu",
            avatarUrl: "https://avatars.githubusercontent.com/u/50896974?s=200&v=4",
            email: "kamu23@example.com",
            __typename: "Account",
        },
        __typename: "Accounts",
    },
};

export const mockDeleteAccountByNameMutation: DeleteAccountByNameMutation = {
    accounts: {
        byName: {
            delete: {
                message: "Account deleted",
                __typename: "DeleteAccountSuccess",
            },
            __typename: "AccountMut",
        },
        __typename: "AccountsMut",
    },
};
