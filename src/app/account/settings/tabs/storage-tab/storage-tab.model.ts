/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { MaybeNull } from "@interface/app.types";

export interface AccountStorageQuota {
    /** `null` when the account's storage is unlimited */
    limitBytes: MaybeNull<number>;
    usedBytes: number;
    dataBytes: number;
    checkpointsBytes: number;
    linkedObjectsBytes: number;
}

export enum StorageQuotaState {
    UNLIMITED = "unlimited",
    WITHIN_QUOTA = "within-quota",
    NEAR_QUOTA = "near-quota",
    QUOTA_REACHED = "quota-reached",
}

export interface StorageUsageSegment {
    id: "data" | "checkpoints" | "linked-objects";
    label: string;
    bytes: number;
    /** Width of the segment in the usage bar */
    percent: number;
}
