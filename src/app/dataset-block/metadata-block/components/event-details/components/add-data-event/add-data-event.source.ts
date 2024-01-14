import { DisplayTimeComponent } from "src/app/components/display-time/display-time.component";
import { EventRowDescriptorsByField } from "../../dynamic-events/dynamic-events.model";
import { HashPropertyComponent } from "../common/hash-property/hash-property.component";
import { OffsetIntervalPropertyComponent } from "../common/offset-interval-property/offset-interval-property.component";
import { SizePropertyComponent } from "../common/size-property/size-property.component";
import { AddDataTooltipsTexts } from "src/app/common/tooltips/add-data.text";

export const ADD_DATA_SOURCE_DESCRIPTORS: EventRowDescriptorsByField = {
    "AddData.string.addDataWatermark": {
        label: "Watermark:",
        tooltip: AddDataTooltipsTexts.WATERMARK,
        presentationComponent: DisplayTimeComponent,
        separateRowForValue: false,
        dataTestId: "add-data-watermark",
    },

    "AddData.string.inputCheckpoint": {
        label: "Input hash:",
        tooltip: AddDataTooltipsTexts.INPUT_HASH,
        presentationComponent: HashPropertyComponent,
        separateRowForValue: false,
        dataTestId: "add-data-input-checkpoint",
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

    "AddData.DataSlice.interval": {
        label: "Interval:",
        tooltip: AddDataTooltipsTexts.DATA_SLICE_INTERVAL,
        presentationComponent: OffsetIntervalPropertyComponent,
        separateRowForValue: false,
        dataTestId: "add-data-data-slice-interval",
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
