/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { DisplayTimeComponent } from "../../../../../../common/components/display-time/display-time.component";
import { SimplePropertyComponent } from "../common/simple-property/simple-property.component";
import { EventRowDescriptorsByField } from "../../dynamic-events/dynamic-events.model";
import { OffsetIntervalPropertyComponent } from "../common/offset-interval-property/offset-interval-property.component";
import { SizePropertyComponent } from "../common/size-property/size-property.component";
import { HashPropertyComponent } from "../common/hash-property/hash-property.component";
import { ExecuteTransformTooltipsTexts } from "src/app/common/tooltips/execute-transform.text";

export const EXECUTE_TRANSFORM_SOURCE_DESCRIPTORS: EventRowDescriptorsByField = {
    "ExecuteTransform.DataSlice.logicalHash": {
        label: "Logical hash:",
        tooltip: ExecuteTransformTooltipsTexts.DATA_SLICE_LOGICAL_HASH,
        presentationComponent: HashPropertyComponent,
        separateRowForValue: false,
        dataTestId: "execute-transform-data-slice-engine",
    },
    "ExecuteTransform.DataSlice.physicalHash": {
        label: "Physical hash:",
        tooltip: ExecuteTransformTooltipsTexts.DATA_SLICE_PHYSICAL_HASH,
        presentationComponent: HashPropertyComponent,
        separateRowForValue: false,
        dataTestId: "execute-transform-data-slice-physical-hash",
    },

    "ExecuteTransform.DataSlice.offsetInterval": {
        label: "Offset interval:",
        tooltip: ExecuteTransformTooltipsTexts.DATA_SLICE_INTERVAL,
        presentationComponent: OffsetIntervalPropertyComponent,
        separateRowForValue: false,
        dataTestId: "execute-transform-data-slice-offset-interval",
    },

    "ExecuteTransform.DataSlice.size": {
        label: "Size:",
        tooltip: ExecuteTransformTooltipsTexts.CHECKPOINT_SIZE,
        presentationComponent: SizePropertyComponent,
        separateRowForValue: false,
        dataTestId: "execute-transform-data-slice-size",
    },

    "ExecuteTransform.string.newWatermark": {
        label: "New watermark:",
        tooltip: ExecuteTransformTooltipsTexts.WATERMARK,
        presentationComponent: DisplayTimeComponent,
        separateRowForValue: false,
        dataTestId: "execute-transform-watermark",
    },

    "ExecuteTransform.string.prevCheckpoint": {
        label: "Previous checkpoint:",
        tooltip: ExecuteTransformTooltipsTexts.PREVIOUS_CHECKPOINT,
        presentationComponent: HashPropertyComponent,
        separateRowForValue: false,
        dataTestId: "execute-transform-prev-checkpoint",
    },

    "ExecuteTransform.number.prevOffset": {
        label: "Previous offset:",
        tooltip: ExecuteTransformTooltipsTexts.PREVIOUS_CHECKPOINT,
        presentationComponent: SimplePropertyComponent,
        separateRowForValue: false,
        dataTestId: "execute-transform-prev-offset",
    },

    "ExecuteTransform.Checkpoint.physicalHash": {
        label: "Physical hash:",
        tooltip: ExecuteTransformTooltipsTexts.CHECKPOINT_PHYSICAL_HASH,
        presentationComponent: HashPropertyComponent,
        separateRowForValue: false,
        dataTestId: "execute-transform-checkpoint-physical-hash",
    },

    "ExecuteTransform.Checkpoint.size": {
        label: "Size:",
        tooltip: ExecuteTransformTooltipsTexts.CHECKPOINT_SIZE,
        presentationComponent: SizePropertyComponent,
        separateRowForValue: false,
        dataTestId: "execute-transform-checkpoint-size",
    },

    "ExecuteTransform.ExecuteTransformInput.datasetId": {
        label: "Dataset ID:",
        tooltip: ExecuteTransformTooltipsTexts.INPUT_DATASET_ID,
        presentationComponent: HashPropertyComponent,
        separateRowForValue: false,
        dataTestId: "execute-transform-input-dataset-id",
    },

    "ExecuteTransform.ExecuteTransformInput.prevBlockHash": {
        label: "Previous block hash:",
        tooltip: ExecuteTransformTooltipsTexts.INPUT_PREVIOUS_BLOCK_HASH,
        presentationComponent: HashPropertyComponent,
        separateRowForValue: false,
        dataTestId: "execute-transform-input-slice-prev-block-hash",
    },

    "ExecuteTransform.ExecuteTransformInput.newBlockHash": {
        label: "New block hash:",
        tooltip: ExecuteTransformTooltipsTexts.INPUT_PREVIOUS_BLOCK_HASH,
        presentationComponent: HashPropertyComponent,
        separateRowForValue: false,
        dataTestId: "execute-transform-input-slice-new-block-hash",
    },

    "ExecuteTransform.ExecuteTransformInput.prevOffset": {
        label: "Previous offset:",
        tooltip: ExecuteTransformTooltipsTexts.INPUT_PREV_OFFSET,
        presentationComponent: SimplePropertyComponent,
        separateRowForValue: false,
        dataTestId: "execute-transform-input-slice-prev-offset",
    },

    "ExecuteTransform.ExecuteTransformInput.newOffset": {
        label: "New offset:",
        tooltip: ExecuteTransformTooltipsTexts.INPUT_NEW_OFFSET,
        presentationComponent: SimplePropertyComponent,
        separateRowForValue: false,
        dataTestId: "execute-transform-input-slice-new-offset",
    },
};
