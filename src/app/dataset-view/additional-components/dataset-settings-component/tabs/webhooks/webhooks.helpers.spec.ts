/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { WebhooksTexts } from "@common/tooltips/webhooks.text";
import { WebhookSubscriptionStatus } from "@api/kamu.graphql.interface";

import { WebhooksHelpers } from "src/app/dataset-view/additional-components/dataset-settings-component/tabs/webhooks/webhooks.helpers";

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

    [
        { loopbackTargetsOnly: false, schemes: ["https"] },
        { loopbackTargetsOnly: true, schemes: ["http", "https"] },
    ].forEach(({ loopbackTargetsOnly, schemes }) => {
        it(`should accept the target URL schemes ${schemes.join(", ")} with loopbackTargetsOnly=${loopbackTargetsOnly}`, () => {
            expect(WebhooksHelpers.targetUrlSchemes(loopbackTargetsOnly)).toEqual(schemes);
        });
    });

    [
        { loopbackTargetsOnly: false, hint: WebhooksTexts.TARGET_URL_HINT },
        { loopbackTargetsOnly: true, hint: WebhooksTexts.TARGET_URL_HINT_LOOPBACK_ONLY },
    ].forEach(({ loopbackTargetsOnly, hint }) => {
        it(`should give the target URL hint with loopbackTargetsOnly=${loopbackTargetsOnly}`, () => {
            expect(WebhooksHelpers.targetUrlHint(loopbackTargetsOnly)).toBe(hint);
        });
    });
});
