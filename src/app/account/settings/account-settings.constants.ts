/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

export enum AccountSettingsTabs {
    PROFILE = "profile",
    ACCOUNT = "admin",
    APPEARANCE = "appearance",
    ACCESSIBILITY = "accessibility",
    NOTIFICATIONS = "notifications",
    BILLING = "billing",
    EMAILS = "emails",
    SECURITY = "security",
    ORGANIZATIONS = "organizations",
    ACCESS_TOKENS = "access-tokens",
}

export enum TokenCreateStep {
    INITIAL = "initial",
    GENERATE = "generate",
    FINISH = "finish",
}
