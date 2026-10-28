/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

export class WebhooksTexts {
    public static readonly TARGET_URL_HINT =
        "Must be an HTTPS URL. Localhost and other loopback addresses are not allowed";
    public static readonly TARGET_URL_HINT_LOOPBACK_ONLY =
        "This server delivers webhooks only to itself: use an HTTP or HTTPS URL on localhost or another loopback address";
}
