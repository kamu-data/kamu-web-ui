/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

export class ExecuteTransformTooltipsTexts {
    public static readonly DATA_SLICE_LOGICAL_HASH = "Logical hash sum of the data in this slice.";
    public static readonly DATA_SLICE_PHYSICAL_HASH = "Hash sum of the data part file.";
    public static readonly DATA_SLICE_INTERVAL = "Data slice produced by the transaction.";
    public static readonly WATERMARK = "Last watermark of the output data stream.";
    public static readonly CHECKPOINT_PHYSICAL_HASH = "Hash sum of the checkpoint file.";
    public static readonly CHECKPOINT_SIZE = "Size of checkpoint file in bytes.";
    public static readonly PREVIOUS_CHECKPOINT = "Hash of the checkpoint file used to restore transformation state.";
    public static readonly PREVIOUS_OFFSET = "Last offset of the previous data slice.";
    public static readonly INPUT_DATASET_ID = "Input dataset identifier.";
    public static readonly INPUT_PREVIOUS_BLOCK_HASH =
        "Last block of the input dataset that was previously incorporated into the derivative transformation.";
    public static readonly INPUT_NEW_BLOCK_HASH =
        "Hash of the last block that will be incorporated into the derivative transformation.";
    public static readonly INPUT_PREV_OFFSET =
        "Last data record offset in the input dataset that was previously incorporated into the derivative transformation.";
    public static readonly INPUT_NEW_OFFSET =
        "Offset of the last data record that will be incorporated into the derivative transformation.";
}
