import { DisplayTimeComponent } from "src/app/components/display-time/display-time.component";
import { EventRowDescriptorsByField } from "../../dynamic-events/dynamic-events.model";
import { HashPropertyComponent } from "../common/hash-property/hash-property.component";
import { OffsetIntervalPropertyComponent } from "../common/offset-interval-property/offset-interval-property.component";
import { SizePropertyComponent } from "../common/size-property/size-property.component";
import { AddDataToolipsTexts } from "src/app/common/tooltips/add-data.text";

export const ADD_DATA_SOURCE_DESCRIPTORS: EventRowDescriptorsByField = {
    "AddData.string.addDataWatermark": {
        label: "Watermark:",
        tooltip: AddDataToolipsTexts.WATERMARK,
        presentationComponent: DisplayTimeComponent,
        separateRowForValue: false,
        dataTestId: "add-data-watermark",
    },

    "AddData.string.inputCheckpoint": {
        label: "Input hash:",
        tooltip: AddDataToolipsTexts.INPUT_HASH,
        presentationComponent: HashPropertyComponent,
        separateRowForValue: false,
        dataTestId: "add-data-input-checkpoint",
    },

    "AddData.DataSlice.logicalHash": {
        label: "Logical hash:",
        tooltip: AddDataToolipsTexts.LOGICAL_HASH,
        presentationComponent: HashPropertyComponent,
        separateRowForValue: false,
        dataTestId: "add-data-data-slice-logical-hash",
    },

    "AddData.DataSlice.physicalHash": {
        label: "Physical hash:",
        tooltip: AddDataToolipsTexts.DATA_SLICE_PHYSICAL_HASH,
        presentationComponent: HashPropertyComponent,
        separateRowForValue: false,
        dataTestId: "add-data-data-slice-physical-hash",
    },

    "AddData.DataSlice.interval": {
        label: "Interval:",
        tooltip: AddDataToolipsTexts.DATA_SLICE_INTERVAL,
        presentationComponent: OffsetIntervalPropertyComponent,
        separateRowForValue: false,
        dataTestId: "add-data-data-slice-interval",
    },

    "AddData.DataSlice.size": {
        label: "Size:",
        tooltip: AddDataToolipsTexts.DATA_SLICE_SIZE,
        presentationComponent: SizePropertyComponent,
        separateRowForValue: false,
        dataTestId: "add-data-data-slice-size",
    },

    "AddData.Checkpoint.physicalHash": {
        label: "Physical hash:",
        tooltip: AddDataToolipsTexts.CHECKPOINT_PHYSICAL_HASH,
        presentationComponent: HashPropertyComponent,
        separateRowForValue: false,
        dataTestId: "add-data-checkpoint-physical-hash",
    },

    "AddData.Checkpoint.size": {
        label: "Size:",
        tooltip: AddDataToolipsTexts.CHECKPOINT_SIZE,
        presentationComponent: SizePropertyComponent,
        separateRowForValue: false,
        dataTestId: "add-data-checkpoint-size",
    },
};
