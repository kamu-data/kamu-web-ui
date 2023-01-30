import { DisplayTimeComponent } from "src/app/components/display-time/display-time.component";
import { EventRowDescriptorsByField } from "../../dynamic-events/dynamic-events.model";
import { HashPropertyComponent } from "../common/hash-property/hash-property.component";
import { OffsetIntervalPropertyComponent } from "../common/offset-interval-property/offset-interval-property.component";
import { SizePropertyComponent } from "../common/size-property/size-property.component";

export const ADD_DATA_SOURCE_DESCRIPTORS: EventRowDescriptorsByField = {
    "AddData.string.addDataWatermark": {
        label: "Watermark:",
        tooltip: "Last watermark of the output data stream.",
        presentationComponent: DisplayTimeComponent,
        separateRowForValue: false,
        dataTestId: "add-data-watermark",
    },

    "AddData.DataSlice.logicalHash": {
        label: "Logical hash:",
        tooltip: "Logical hash sum of the data in this slice.",
        presentationComponent: HashPropertyComponent,
        separateRowForValue: false,
        dataTestId: "add-data-data-slice-logical-hash",
    },

    "AddData.DataSlice.physicalHash": {
        label: "Physical hash:",
        tooltip: "Hash sum of the data part file.",
        presentationComponent: HashPropertyComponent,
        separateRowForValue: false,
        dataTestId: "add-data-data-slice-physical-hash",
    },

    "AddData.DataSlice.interval": {
        label: "Interval:",
        tooltip: "Data slice produced by the transaction.",
        presentationComponent: OffsetIntervalPropertyComponent,
        separateRowForValue: false,
        dataTestId: "add-data-data-slice-interval",
    },

    "AddData.DataSlice.size": {
        label: "Size:",
        tooltip: "Size of data file in bytes.",
        presentationComponent: SizePropertyComponent,
        separateRowForValue: false,
        dataTestId: "add-data-data-slice-size",
    },

    "AddData.Checkpoint.physicalHash": {
        label: "Physical hash:",
        tooltip: "Hash sum of the checkpoint file.",
        presentationComponent: HashPropertyComponent,
        separateRowForValue: false,
        dataTestId: "add-data-checkpoint-physical-hash",
    },

    "AddData.Checkpoint.size": {
        label: "Size:",
        tooltip: "Size of checkpoint file in bytes.",
        presentationComponent: SizePropertyComponent,
        separateRowForValue: false,
        dataTestId: "add-data-checkpoint-size",
    },
};
