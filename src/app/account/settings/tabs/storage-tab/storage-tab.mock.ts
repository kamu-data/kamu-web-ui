/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { AccountStorageQuota } from "src/app/account/settings/tabs/storage-tab/storage-tab.model";

const MB = 1_000_000;

export const mockStorageQuotaWithinLimit: AccountStorageQuota = {
    limitBytes: 1000 * MB,
    usedBytes: 640 * MB,
    dataBytes: 500 * MB,
    checkpointsBytes: 40 * MB,
    linkedObjectsBytes: 100 * MB,
};

export const mockStorageQuotaNearLimit: AccountStorageQuota = {
    limitBytes: 1000 * MB,
    usedBytes: 950 * MB,
    dataBytes: 900 * MB,
    checkpointsBytes: 50 * MB,
    linkedObjectsBytes: 0,
};

export const mockStorageQuotaReached: AccountStorageQuota = {
    limitBytes: 1000 * MB,
    usedBytes: 1200 * MB,
    dataBytes: 1200 * MB,
    checkpointsBytes: 0,
    linkedObjectsBytes: 0,
};

export const mockStorageQuotaUnlimited: AccountStorageQuota = {
    limitBytes: null,
    usedBytes: 2000 * MB,
    dataBytes: 1500 * MB,
    checkpointsBytes: 500 * MB,
    linkedObjectsBytes: 0,
};
