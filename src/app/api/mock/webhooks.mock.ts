/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { CreateWebhookSubscriptionSuccess } from "src/app/dataset-view/additional-components/dataset-settings-component/tabs/webhooks/dataset-settings-webhooks-tab.component.types";

import {
    DatasetWebhookByIdQuery,
    DatasetWebhookCreateSubscriptionMutation,
    DatasetWebhookPauseSubscriptionMutation,
    DatasetWebhookReactivateSubscriptionMutation,
    DatasetWebhookRemoveSubscriptionMutation,
    DatasetWebhookResumeSubscriptionMutation,
    DatasetWebhookRotateSecretMutation,
    DatasetWebhookSubscriptionsQuery,
    DatasetWebhookUpdateSubscriptionMutation,
    WebhookEventTypesQuery,
    WebhookSubscriptionInput,
    WebhookSubscriptionStatus,
} from "@api/kamu.graphql.interface";

export const mockWebhookEventTypesQuery: WebhookEventTypesQuery = {
    webhooks: {
        __typename: "Webhooks",
        eventTypes: ["DATASET.REF.UPDATED"],
    },
};

export const mockDatasetWebhookSubscriptionsQuery: DatasetWebhookSubscriptionsQuery = {
    datasets: {
        byId: {
            webhooks: {
                subscriptions: [],
                __typename: "DatasetWebhooks",
            },
            __typename: "Dataset",
        },
        __typename: "Datasets",
    },
};

export const mockWebhookSubscriptionInput: WebhookSubscriptionInput = {
    targetUrl: "https://google.com",
    eventTypes: ["DATASET.REF.UPDATED"],
    label: "Test label",
};

export const mockDatasetWebhookCreateSubscriptionMutation: DatasetWebhookCreateSubscriptionMutation = {
    datasets: {
        byId: {
            webhooks: {
                createSubscription: {
                    __typename: "CreateWebhookSubscriptionResultSuccess",
                    secret: "ec37fd23ac2b9e2319f65720f93115f731be99391b4963bf14ffc7e27ff467c7",
                    subscriptionId: "11e3422b-7cf2-4176-9568-539e0071ae86",
                    message: "Success",
                },
                __typename: "DatasetWebhooksMut",
            },
            __typename: "DatasetMut",
        },
        __typename: "DatasetsMut",
    },
};

export const mockDatasetWebhookCreateSubscriptionMutationError: DatasetWebhookCreateSubscriptionMutation = {
    datasets: {
        byId: {
            webhooks: {
                createSubscription: {
                    __typename: "WebhookSubscriptionDuplicateLabel",
                    label: "Duplicate label",
                    message: "Failed",
                },
                __typename: "DatasetWebhooksMut",
            },
            __typename: "DatasetMut",
        },
        __typename: "DatasetsMut",
    },
};

export const mockDatasetWebhookRemoveSubscriptionMutation: DatasetWebhookRemoveSubscriptionMutation = {
    datasets: {
        byId: {
            webhooks: {
                subscription: {
                    remove: {
                        removed: true,
                        message: "Success",
                        __typename: "RemoveWebhookSubscriptionResultSuccess",
                    },
                    __typename: "WebhookSubscriptionMut",
                },
                __typename: "DatasetWebhooksMut",
            },
            __typename: "DatasetMut",
        },
        __typename: "DatasetsMut",
    },
};

export const mockDatasetWebhookRemoveSubscriptionMutationError: DatasetWebhookRemoveSubscriptionMutation = {
    datasets: {
        byId: {
            webhooks: {
                subscription: {
                    remove: {
                        removed: false,
                        message: "Failed",
                        __typename: "RemoveWebhookSubscriptionResultSuccess",
                    },
                    __typename: "WebhookSubscriptionMut",
                },
                __typename: "DatasetWebhooksMut",
            },
            __typename: "DatasetMut",
        },
        __typename: "DatasetsMut",
    },
};

export const mockDatasetWebhookPauseSubscriptionMutation: DatasetWebhookPauseSubscriptionMutation = {
    datasets: {
        byId: {
            webhooks: {
                subscription: {
                    pause: {
                        paused: true,
                        message: "Success",
                        __typename: "PauseWebhookSubscriptionResultSuccess",
                    },
                    __typename: "WebhookSubscriptionMut",
                },
                __typename: "DatasetWebhooksMut",
            },
            __typename: "DatasetMut",
        },
        __typename: "DatasetsMut",
    },
};

export const mockDatasetWebhookPauseSubscriptionMutationError: DatasetWebhookPauseSubscriptionMutation = {
    datasets: {
        byId: {
            webhooks: {
                subscription: {
                    pause: {
                        status: WebhookSubscriptionStatus.Unreachable,
                        message: "Failed",
                        __typename: "PauseWebhookSubscriptionResultUnexpected",
                    },
                    __typename: "WebhookSubscriptionMut",
                },
                __typename: "DatasetWebhooksMut",
            },
            __typename: "DatasetMut",
        },
        __typename: "DatasetsMut",
    },
};

export const mockDatasetWebhookResumeSubscriptionMutation: DatasetWebhookResumeSubscriptionMutation = {
    datasets: {
        byId: {
            webhooks: {
                subscription: {
                    resume: {
                        resumed: true,
                        message: "Success",
                        __typename: "ResumeWebhookSubscriptionResultSuccess",
                    },
                    __typename: "WebhookSubscriptionMut",
                },
                __typename: "DatasetWebhooksMut",
            },
            __typename: "DatasetMut",
        },
        __typename: "DatasetsMut",
    },
};

export const mockDatasetWebhookResumeSubscriptionMutationError: DatasetWebhookResumeSubscriptionMutation = {
    datasets: {
        byId: {
            webhooks: {
                subscription: {
                    resume: {
                        status: WebhookSubscriptionStatus.Unreachable,
                        message: "Failed",
                        __typename: "ResumeWebhookSubscriptionResultUnexpected",
                    },
                    __typename: "WebhookSubscriptionMut",
                },
                __typename: "DatasetWebhooksMut",
            },
            __typename: "DatasetMut",
        },
        __typename: "DatasetsMut",
    },
};

export const mockDatasetWebhookReactivateSubscriptionMutation: DatasetWebhookReactivateSubscriptionMutation = {
    datasets: {
        byId: {
            webhooks: {
                subscription: {
                    reactivate: {
                        message: "Success",
                        __typename: "ReactivateWebhookSubscriptionResultSuccess",
                    },
                    __typename: "WebhookSubscriptionMut",
                },
                __typename: "DatasetWebhooksMut",
            },
            __typename: "DatasetMut",
        },
    },
};

export const mockDatasetWebhookReactivateSubscriptionMutationError: DatasetWebhookReactivateSubscriptionMutation = {
    datasets: {
        byId: {
            webhooks: {
                subscription: {
                    reactivate: {
                        status: WebhookSubscriptionStatus.Paused,
                        message: "Failed",
                        __typename: "ReactivateWebhookSubscriptionResultUnexpected",
                    },
                    __typename: "WebhookSubscriptionMut",
                },
                __typename: "DatasetWebhooksMut",
            },
            __typename: "DatasetMut",
        },
        __typename: "DatasetsMut",
    },
};

export const mockDatasetWebhookUpdateSubscriptionMutation: DatasetWebhookUpdateSubscriptionMutation = {
    datasets: {
        byId: {
            webhooks: {
                subscription: {
                    update: {
                        updated: true,
                        message: "Success",
                        __typename: "UpdateWebhookSubscriptionResultSuccess",
                    },
                    __typename: "WebhookSubscriptionMut",
                },
                __typename: "DatasetWebhooksMut",
            },
            __typename: "DatasetMut",
        },
        __typename: "DatasetsMut",
    },
};

export const mockDatasetWebhookUpdateSubscriptionMutationError: DatasetWebhookUpdateSubscriptionMutation = {
    datasets: {
        byId: {
            webhooks: {
                subscription: {
                    update: {
                        status: WebhookSubscriptionStatus.Unreachable,
                        message: "Failed",
                        __typename: "UpdateWebhookSubscriptionResultUnexpected",
                    },
                    __typename: "WebhookSubscriptionMut",
                },
                __typename: "DatasetWebhooksMut",
            },
            __typename: "DatasetMut",
        },
        __typename: "DatasetsMut",
    },
};

export const mockDatasetWebhookByIdQuery: DatasetWebhookByIdQuery = {
    datasets: {
        byId: {
            webhooks: {
                subscription: {
                    id: "7a6781a8-233d-47bf-86cc-c1ae585a38bd",
                    label: "Label",
                    datasetId: "did:odf:fed01888a6a44954894780978ac256fa224b97fc42d6541c681147a552abd02fb6f93",
                    targetUrl: "https://mock.com/",
                    eventTypes: ["DATASET.REF.UPDATED"],
                    status: WebhookSubscriptionStatus.Enabled,
                    __typename: "WebhookSubscription",
                },
                __typename: "DatasetWebhooks",
            },
            __typename: "Dataset",
        },
        __typename: "Datasets",
    },
};

export const mockCreateWebhookSubscriptionSuccess: CreateWebhookSubscriptionSuccess = {
    input: mockWebhookSubscriptionInput,
    subscriptionId: "121231-32232-433434-12sasas",
    status: WebhookSubscriptionStatus.Enabled,
    secret: "sSASADSDF22323ssfdgfhfhhhh",
};

export const mockDatasetWebhookRotateSecretMutation: DatasetWebhookRotateSecretMutation = {
    datasets: {
        byId: {
            webhooks: {
                subscription: {
                    rotateSecret: {
                        newSecret: "5cb25e871e60edcfcb3227ebf5a5fe9457280eb3603bf5d489e732eddda187c3",
                        message: "Success",
                        __typename: "RotateWebhookSubscriptionSecretSuccess",
                    },
                    __typename: "WebhookSubscriptionMut",
                },
                __typename: "DatasetWebhooksMut",
            },
            __typename: "DatasetMut",
        },
        __typename: "DatasetsMut",
    },
};
