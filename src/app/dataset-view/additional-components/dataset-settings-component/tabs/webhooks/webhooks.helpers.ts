/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { WebhookSubscriptionStatus } from "@api/kamu.graphql.interface";

export class WebhooksHelpers {
    public static webhookStatusBadgeOptions(status: WebhookSubscriptionStatus): {
        iconName: string;
        className: string;
    } {
        switch (status) {
            case WebhookSubscriptionStatus.Enabled: {
                return { iconName: "check_circle", className: "status-enabled" };
            }
            case WebhookSubscriptionStatus.Paused: {
                return { iconName: "pause", className: "status-paused" };
            }
            case WebhookSubscriptionStatus.Unverified: {
                return { iconName: "warning", className: "status-unverified" };
            }
            case WebhookSubscriptionStatus.Unreachable: {
                return { iconName: "block", className: "status-unreachable" };
            }
            default:
                return { iconName: "", className: "" };
        }
    }
}
