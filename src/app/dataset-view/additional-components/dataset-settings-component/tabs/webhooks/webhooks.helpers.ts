/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { WebhooksTexts } from "@common/tooltips/webhooks.text";
import { UrlScheme } from "@common/validation/url.validators";
import { WebhookSubscriptionStatus } from "@api/kamu.graphql.interface";

export class WebhooksHelpers {
    /** The schemes the backend accepts in a target URL; it checks whether the host resolves to loopback itself */
    public static targetUrlSchemes(loopbackTargetsOnly: boolean): UrlScheme[] {
        return loopbackTargetsOnly ? ["http", "https"] : ["https"];
    }

    public static targetUrlHint(loopbackTargetsOnly: boolean): string {
        return loopbackTargetsOnly ? WebhooksTexts.TARGET_URL_HINT_LOOPBACK_ONLY : WebhooksTexts.TARGET_URL_HINT;
    }

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
