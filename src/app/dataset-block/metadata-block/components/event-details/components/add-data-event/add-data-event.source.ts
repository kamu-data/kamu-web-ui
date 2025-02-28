/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { DisplayTimeComponent } from "src/app/common/components/display-time/display-time.component";
import { EventRowDescriptorsByField } from "../../dynamic-events/dynamic-events.model";
import { HashPropertyComponent } from "../common/hash-property/hash-property.component";
import { OffsetIntervalPropertyComponent } from "../common/offset-interval-property/offset-interval-property.component";
import { SizePropertyComponent } from "../common/size-property/size-property.component";
import { AddDataTooltipsTexts } from "src/app/common/tooltips/add-data.text";
import { SimplePropertyComponent } from "../common/simple-property/simple-property.component";

export const ADD_DATA_SOURCE_DESCRIPTORS: EventRowDescriptorsByField = {
    "AddData.string.newWatermark": {
        label: "New watermark:",
        tooltip: AddDataTooltipsTexts.NEW_WATERMARK,
        presentationComponent: DisplayTimeComponent,
        separateRowForValue: false,
        dataTestId: "add-data-new_watermark",
    },

    "AddData.string.prevCheckpoint": {
        label: "Previous checkpoint:",
        tooltip: AddDataTooltipsTexts.PREV_CHECKPOINT,
        presentationComponent: HashPropertyComponent,
        separateRowForValue: false,
        dataTestId: "add-data-prev-checkpoint",
    },

    "AddData.number.prevOffset": {
        label: "Previous offset:",
        tooltip: AddDataTooltipsTexts.PREVIOUS_OFFSET,
        presentationComponent: SimplePropertyComponent,
        separateRowForValue: false,
        dataTestId: "add-data-prev-offset",
    },

    "AddData.SourceState.sourceName": {
        label: "Source name:",
        tooltip: AddDataTooltipsTexts.SOURCE_NAME,
        presentationComponent: SimplePropertyComponent,
        separateRowForValue: false,
        dataTestId: "add-data-source-state-source-name",
    },

    "AddData.SourceState.kind": {
        label: "Kind:",
        tooltip: AddDataTooltipsTexts.KIND,
        presentationComponent: SimplePropertyComponent,
        separateRowForValue: false,
        dataTestId: "add-data-source-state-kind",
    },

    "AddData.SourceState.value": {
        label: "Value:",
        tooltip: AddDataTooltipsTexts.VALUE,
        presentationComponent: SimplePropertyComponent,
        separateRowForValue: false,
        dataTestId: "add-data-source-state-value",
    },

    "AddData.DataSlice.logicalHash": {
        label: "Logical hash:",
        tooltip: AddDataTooltipsTexts.LOGICAL_HASH,
        presentationComponent: HashPropertyComponent,
        separateRowForValue: false,
        dataTestId: "add-data-data-slice-logical-hash",
    },

    "AddData.DataSlice.physicalHash": {
        label: "Physical hash:",
        tooltip: AddDataTooltipsTexts.DATA_SLICE_PHYSICAL_HASH,
        presentationComponent: HashPropertyComponent,
        separateRowForValue: false,
        dataTestId: "add-data-data-slice-physical-hash",
    },

    "AddData.DataSlice.offsetInterval": {
        label: "Offset interval:",
        tooltip: AddDataTooltipsTexts.DATA_SLICE_INTERVAL,
        presentationComponent: OffsetIntervalPropertyComponent,
        separateRowForValue: false,
        dataTestId: "add-data-data-slice-offset-interval",
    },

    "AddData.DataSlice.size": {
        label: "Size:",
        tooltip: AddDataTooltipsTexts.DATA_SLICE_SIZE,
        presentationComponent: SizePropertyComponent,
        separateRowForValue: false,
        dataTestId: "add-data-data-slice-size",
    },

    "AddData.Checkpoint.physicalHash": {
        label: "Physical hash:",
        tooltip: AddDataTooltipsTexts.CHECKPOINT_PHYSICAL_HASH,
        presentationComponent: HashPropertyComponent,
        separateRowForValue: false,
        dataTestId: "add-data-checkpoint-physical-hash",
    },

    "AddData.Checkpoint.size": {
        label: "Size:",
        tooltip: AddDataTooltipsTexts.CHECKPOINT_SIZE,
        presentationComponent: SizePropertyComponent,
        separateRowForValue: false,
        dataTestId: "add-data-checkpoint-size",
    },
};
