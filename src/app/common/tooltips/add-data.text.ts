/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

export class AddDataTooltipsTexts {
    public static readonly NEW_WATERMARK = "Last watermark of the output data stream.";
    public static readonly PREV_CHECKPOINT = "Hash of the checkpoint file used to restore ingestion state.";
    public static readonly PREVIOUS_OFFSET = "Last offset of the previous data slice.";
    public static readonly LOGICAL_HASH = "Logical hash sum of the data in this slice.";
    public static readonly DATA_SLICE_PHYSICAL_HASH = "Hash sum of the data part file.";
    public static readonly DATA_SLICE_INTERVAL = "Data slice produced by the transaction.";
    public static readonly DATA_SLICE_SIZE = "Size of data file in bytes.";
    public static readonly CHECKPOINT_PHYSICAL_HASH = "Hash sum of the checkpoint file.";
    public static readonly CHECKPOINT_SIZE = "Size of checkpoint file in bytes.";
    public static readonly SOURCE_NAME = "Identifies the source that the state corresponds to.";
    public static readonly KIND = "Identifies the type of the state.";
    public static readonly VALUE = "Opaque value representing the state.";
}
