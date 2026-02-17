/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { WebhookSubscriptionStatus } from "@api/kamu.graphql.interface";

import { WebhooksHelpers } from "./webhooks.helpers";

interface TestCase {
    webhookSubscriptionStatus: WebhookSubscriptionStatus;
    expectedOption: { iconName: string; className: string };
}

describe("DatasetSettingsHelpers", () => {
    [
        {
            webhookSubscriptionStatus: WebhookSubscriptionStatus.Enabled,
            expectedOption: { iconName: "check_circle", className: "status-enabled" },
        },
        {
            webhookSubscriptionStatus: WebhookSubscriptionStatus.Paused,
            expectedOption: { iconName: "pause", className: "status-paused" },
        },
        {
            webhookSubscriptionStatus: WebhookSubscriptionStatus.Unverified,
            expectedOption: { iconName: "warning", className: "status-unverified" },
        },
        {
            webhookSubscriptionStatus: WebhookSubscriptionStatus.Unreachable,
            expectedOption: { iconName: "block", className: "status-unreachable" },
        },
        {
            webhookSubscriptionStatus: WebhookSubscriptionStatus.Removed,
            expectedOption: { iconName: "", className: "" },
        },
    ].forEach((testCase: TestCase) => {
        it(`should check status badge options with status=${testCase.webhookSubscriptionStatus}`, () => {
            expect(WebhooksHelpers.webhookStatusBadgeOptions(testCase.webhookSubscriptionStatus)).toEqual(
                testCase.expectedOption,
            );
        });
    });
});
