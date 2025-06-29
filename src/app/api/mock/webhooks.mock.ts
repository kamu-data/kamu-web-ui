/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import {
    DatasetWebhookCreateSubscriptionMutation,
    DatasetWebhookPauseSubscriptionMutation,
    DatasetWebhookRemoveSubscriptionMutation,
    DatasetWebhookResumeSubscriptionMutation,
    DatasetWebhookSubscriptionsQuery,
    DatasetWebhookUpdateSubscriptionMutation,
    WebhookEventTypesQuery,
    WebhookSubscriptionInput,
    WebhookSubscriptionStatus,
} from "../kamu.graphql.interface";

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
