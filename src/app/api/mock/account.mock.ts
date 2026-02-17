/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { mockFlowPollingSourceFragmentFetchUrl } from "src/app/dataset-flow/flows-table/flows-table.helpers.mock";
import {
    mockDatasetMainDataId,
    mockOwnerFieldsWithAvatar,
    mockPublicDatasetVisibility,
} from "src/app/search/mock.data";

import {
    AccountByNameQuery,
    AccountChangeEmailMutation,
    AccountDatasetFlowsPausedQuery,
    AccountFlowsAsCardsQuery,
    AccountListDatasetsWithFlowsQuery,
    AccountListFlowsQuery,
    AccountPauseFlowsMutation,
    AccountPrimaryCardsQuery,
    AccountProvider,
    AccountResumeFlowsMutation,
    AccountType,
    AccountWebhookCardsQuery,
    AccountWithEmailQuery,
    ChangeAccountUsernameMutation,
    ChangeAdminPasswordMutation,
    ChangeUserPasswordMutation,
    DatasetFlowType,
    DatasetKind,
    DeleteAccountByNameMutation,
    FlowProcessAutoStopReason,
    FlowProcessEffectiveState,
    FlowStatus,
} from "@api/kamu.graphql.interface";
import { mockAccountDetails } from "@api/mock/auth.mock";

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
                                datasetId:
                                    "did:odf:fed014aee1c33d51f36c21fab6f13444bdce6fe3d5762cbb889adead63498f57f4168",
                                description: {
                                    ingestResult: null,
                                    pollingSource: mockFlowPollingSourceFragmentFetchUrl,
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
                                    accountProvider: AccountProvider.Password,
                                },
                                outcome: {
                                    message: "SUCCESS",
                                    __typename: "FlowSuccessResult",
                                },
                                timing: {
                                    initiatedAt: "2024-06-10T07:00:30+00:00",
                                    firstAttemptScheduledAt: "2024-06-10T07:00:31+00:00",
                                    scheduledAt: "2024-06-10T07:00:31+00:00",
                                    awaitingExecutorSince: "2024-06-10T07:00:31+00:00",
                                    runningSince: "2024-06-10T07:00:31.306400327+00:00",
                                    lastAttemptFinishedAt: "2024-06-10T07:00:31.337328+00:00",
                                    __typename: "FlowTimingRecords",
                                },
                                startCondition: null,
                                retryPolicy: null,
                                taskIds: [],
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
                        __typename: "FlowConnection",
                    },
                    tiles: {
                        nodes: [
                            {
                                flowId: "0",
                                datasetId: mockDatasetMainDataId,
                                status: FlowStatus.Finished,
                                outcome: {
                                    message: "SUCCESS",
                                    __typename: "FlowSuccessResult",
                                },
                                timing: {
                                    initiatedAt: "2024-06-10T07:00:30+00:00",
                                    firstAttemptScheduledAt: "2024-06-10T07:00:31+00:00",
                                    scheduledAt: "2024-06-10T07:00:31+00:00",
                                    awaitingExecutorSince: "2024-06-10T07:00:31+00:00",
                                    runningSince: "2024-06-10T07:00:31.306400327+00:00",
                                    lastAttemptFinishedAt: "2024-06-10T07:00:31.337328+00:00",
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
                                    __typename: "Account",
                                    ...mockOwnerFieldsWithAvatar,
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
                                    __typename: "Account",
                                    ...mockOwnerFieldsWithAvatar,
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
                                    __typename: "Account",
                                    ...mockOwnerFieldsWithAvatar,
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
                                    __typename: "Account",
                                    ...mockOwnerFieldsWithAvatar,
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

export const mockChangeAccountUsernameMutation: ChangeAccountUsernameMutation = {
    accounts: {
        byName: {
            rename: {
                newName: "kamu",
                message: "Account renamed",
                __typename: "RenameAccountSuccess",
            },
            __typename: "AccountMut",
        },
        __typename: "AccountsMut",
    },
};

export const mockChangeAccountUsernameMutationError: ChangeAccountUsernameMutation = {
    accounts: {
        byName: {
            rename: {
                message: "Failed",
                __typename: "RenameAccountNameNotUnique",
            },
            __typename: "AccountMut",
        },
        __typename: "AccountsMut",
    },
};

export const mockChangeAdminPasswordMutation: ChangeAdminPasswordMutation = {
    accounts: {
        byName: {
            modifyPassword: {
                message: "Password modified",
                __typename: "ModifyPasswordSuccess",
            },
            __typename: "AccountMut",
        },
        __typename: "AccountsMut",
    },
};

export const mockChangeAdminPasswordMutationError: ChangeAdminPasswordMutation = {
    accounts: {
        byName: {
            modifyPassword: {
                __typename: "ModifyPasswordWrongOldPassword",
            },
            __typename: "AccountMut",
        },
        __typename: "AccountsMut",
    },
};

export const mockChangeUserPasswordMutation: ChangeUserPasswordMutation = {
    accounts: {
        byName: {
            modifyPasswordWithConfirmation: {
                __typename: "ModifyPasswordSuccess",
                message: "Password changed",
            },
            __typename: "AccountMut",
        },
        __typename: "AccountsMut",
    },
};

export const mockChangeUserPasswordMutationError: ChangeUserPasswordMutation = {
    accounts: {
        byName: {
            modifyPasswordWithConfirmation: {
                __typename: "ModifyPasswordWrongOldPassword",
                message: "Password not changed",
            },
            __typename: "AccountMut",
        },
        __typename: "AccountsMut",
    },
};

export const mockAccountFlowsAsCardsQuery: AccountFlowsAsCardsQuery = {
    accounts: {
        byName: {
            flows: {
                processes: {
                    allCards: {
                        nodes: [
                            {
                                flowType: DatasetFlowType.Ingest,
                                dataset: {
                                    id: "did:odf:fed01ac74ce96a0822763f55c84f8d48695647bd48bb79b0b1ae0f3a3c873807444f5",
                                    kind: DatasetKind.Root,
                                    name: "account.tokens.transfers",
                                    owner: {
                                        id: "did:odf:fed016b61ed2ab1b63a006b61ed2ab1b63a00b016d65607000000e0821aafbf163e6f",
                                        accountName: "kamu",
                                        accountProvider: AccountProvider.Password,
                                        avatarUrl: "https://avatars.githubusercontent.com/u/50896974?s=200&v=4",
                                        __typename: "Account",
                                    },
                                    alias: "kamu/account.tokens.transfers",
                                    visibility: {
                                        anonymousAvailable: false,
                                        __typename: "PublicDatasetVisibility",
                                    },
                                    __typename: "Dataset",
                                },
                                summary: {
                                    effectiveState: FlowProcessEffectiveState.StoppedAuto,
                                    consecutiveFailures: 1,
                                    lastSuccessAt: null,
                                    lastAttemptAt: "2025-11-11T10:53:42.239144541+00:00",
                                    lastFailureAt: "2025-11-11T10:53:42.239144541+00:00",
                                    nextPlannedAt: null,
                                    stopPolicy: {
                                        dummy: true,
                                        __typename: "FlowTriggerStopPolicyNever",
                                    },
                                    autoStoppedReason: FlowProcessAutoStopReason.UnrecoverableFailure,
                                    autoStoppedAt: "2025-11-11T10:53:42.239144541+00:00",
                                    __typename: "FlowProcessSummary",
                                },
                                __typename: "DatasetFlowProcess",
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
                        __typename: "AccountFlowProcessCardConnection",
                    },
                    fullRollup: {
                        total: 14,
                        active: 1,
                        failing: 2,
                        paused: 3,
                        stopped: 8,
                        unconfigured: 0,
                        worstConsecutiveFailures: 14,
                        __typename: "FlowProcessGroupRollup",
                    },
                    __typename: "AccountFlowProcesses",
                },
                __typename: "AccountFlows",
            },
            __typename: "Account",
        },
        __typename: "Accounts",
    },
};

export const mockAccountFlowsAsCardsQueryWithWebhook: AccountFlowsAsCardsQuery = {
    accounts: {
        byName: {
            flows: {
                processes: {
                    allCards: {
                        nodes: [
                            {
                                id: "d20a935e-0ccb-4844-b1bb-f4b5b9b0279a",
                                name: "qwert",
                                summary: {
                                    effectiveState: FlowProcessEffectiveState.PausedManual,
                                    consecutiveFailures: 0,
                                    lastSuccessAt: null,
                                    lastAttemptAt: null,
                                    lastFailureAt: null,
                                    nextPlannedAt: null,
                                    stopPolicy: {
                                        maxFailures: 5,
                                        __typename: "FlowTriggerStopPolicyAfterConsecutiveFailures",
                                    },
                                    autoStoppedReason: null,
                                    autoStoppedAt: null,
                                    __typename: "FlowProcessSummary",
                                },
                                __typename: "WebhookFlowSubProcess",
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
                        __typename: "AccountFlowProcessCardConnection",
                    },
                    fullRollup: {
                        total: 14,
                        active: 1,
                        failing: 2,
                        paused: 3,
                        stopped: 8,
                        unconfigured: 0,
                        worstConsecutiveFailures: 14,
                        __typename: "FlowProcessGroupRollup",
                    },
                    __typename: "AccountFlowProcesses",
                },
                __typename: "AccountFlows",
            },
            __typename: "Account",
        },
        __typename: "Accounts",
    },
};

export const mockAccountFlowsAsCardsQueryEmpty: AccountFlowsAsCardsQuery = {
    accounts: {
        byName: {
            flows: {
                processes: {
                    allCards: {
                        nodes: [],
                        totalCount: 0,
                        pageInfo: {
                            hasNextPage: false,
                            hasPreviousPage: false,
                            currentPage: 0,
                            totalPages: 1,
                            __typename: "PageBasedInfo",
                        },
                        __typename: "AccountFlowProcessCardConnection",
                    },
                    fullRollup: {
                        total: 14,
                        active: 1,
                        failing: 2,
                        paused: 3,
                        stopped: 8,
                        unconfigured: 0,
                        worstConsecutiveFailures: 14,
                        __typename: "FlowProcessGroupRollup",
                    },
                    __typename: "AccountFlowProcesses",
                },
                __typename: "AccountFlows",
            },
            __typename: "Account",
        },
        __typename: "Accounts",
    },
};

export const mockAccountFlowsPrimaryCardsQuery: AccountPrimaryCardsQuery = {
    accounts: {
        byName: {
            flows: {
                processes: {
                    primaryCards: {
                        nodes: [
                            {
                                flowType: DatasetFlowType.Ingest,
                                dataset: {
                                    id: "did:odf:fed01ac74ce96a0822763f55c84f8d48695647bd48bb79b0b1ae0f3a3c873807444f5",
                                    kind: DatasetKind.Root,
                                    name: "account.tokens.transfers",
                                    owner: {
                                        id: "did:odf:fed016b61ed2ab1b63a006b61ed2ab1b63a00b016d65607000000e0821aafbf163e6f",
                                        accountName: "kamu",
                                        accountProvider: AccountProvider.Password,
                                        avatarUrl: "https://avatars.githubusercontent.com/u/50896974?s=200&v=4",
                                        __typename: "Account",
                                    },
                                    alias: "kamu/account.tokens.transfers",
                                    visibility: {
                                        anonymousAvailable: false,
                                        __typename: "PublicDatasetVisibility",
                                    },
                                    __typename: "Dataset",
                                },
                                summary: {
                                    effectiveState: FlowProcessEffectiveState.StoppedAuto,
                                    consecutiveFailures: 1,
                                    lastSuccessAt: null,
                                    lastAttemptAt: "2025-11-11T10:53:42.239144541+00:00",
                                    lastFailureAt: "2025-11-11T10:53:42.239144541+00:00",
                                    nextPlannedAt: null,
                                    stopPolicy: {
                                        dummy: true,
                                        __typename: "FlowTriggerStopPolicyNever",
                                    },
                                    autoStoppedReason: FlowProcessAutoStopReason.UnrecoverableFailure,
                                    autoStoppedAt: "2025-11-11T10:53:42.239144541+00:00",
                                    __typename: "FlowProcessSummary",
                                },
                                __typename: "DatasetFlowProcess",
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
                        __typename: "DatasetFlowProcessConnection",
                    },
                    primaryRollup: {
                        total: 12,
                        active: 1,
                        failing: 2,
                        paused: 2,
                        stopped: 7,
                        unconfigured: 0,
                        worstConsecutiveFailures: 14,
                        __typename: "FlowProcessGroupRollup",
                    },
                    __typename: "AccountFlowProcesses",
                },

                __typename: "AccountFlows",
            },
            __typename: "Account",
        },
        __typename: "Accounts",
    },
};

export const mockAccountFlowsWebhookCardsQuery: AccountWebhookCardsQuery = {
    accounts: {
        byName: {
            flows: {
                processes: {
                    webhookCards: {
                        nodes: [],
                        totalCount: 1,
                        pageInfo: {
                            hasNextPage: false,
                            hasPreviousPage: false,
                            currentPage: 0,
                            totalPages: 1,
                            __typename: "PageBasedInfo",
                        },
                        __typename: "WebhookFlowSubProcessConnection",
                    },
                    webhookRollup: {
                        total: 2,
                        active: 0,
                        failing: 0,
                        paused: 1,
                        stopped: 1,
                        unconfigured: 0,
                        worstConsecutiveFailures: 5,
                        __typename: "FlowProcessGroupRollup",
                    },
                    __typename: "AccountFlowProcesses",
                },
                __typename: "AccountFlows",
            },
            __typename: "Account",
        },
        __typename: "Accounts",
    },
};
