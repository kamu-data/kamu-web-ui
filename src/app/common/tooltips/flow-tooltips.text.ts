/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

export class FlowTooltipsTexts {
    public static readonly UPDATE_SELECTOR_TOOLTIP = "Enable or disable updates with the defined options.";

    public static readonly RETRY_SELECTOR_TOOLTIP =
        "Enable or disable retries on flow failures with the defined options.";

    public static readonly STOP_POLICY_NEVER_TOOLTIP = "The flow will never be stopped regardless of failures.";

    public static readonly STOP_POLICY_AFTER_CONSECUTIVE_FAILURES_TOOLTIP =
        "The flow will be stopped after a specified number of consecutive failures.";

    public static readonly BREAKING_NO_ACTION_TOOLTIP =
        "No action will be taken on breaking changes. The next flow run will likely fail.";

    public static readonly BREAKING_RECOVER_TOOLTIP =
        "The flow will attempt to recover from the breaking change. This may involve resetting the dataset to metadata only.";

    public static readonly NEW_DATA_TRANSFORM_IMMEDIATE_TOOLTIP =
        "The transform will be launched immediately for the new data. This is useful for near-real-time processing, but consumes more computation resources.";

    public static readonly NEW_DATA_TRANSFORM_BUFFERING_TOOLTIP =
        "The transform will be launched for the new data after a certain threshold. This saves computation resources, but may introduce latency.";
}
