/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

export enum SliceUnit {
    KB = "KB",
    MB = "MB",
    GB = "GB",
}

export const sliceSizeMapper: Record<SliceUnit, number> = {
    [SliceUnit.KB]: Math.pow(2, 10),
    [SliceUnit.MB]: Math.pow(2, 20),
    [SliceUnit.GB]: Math.pow(2, 30),
};
