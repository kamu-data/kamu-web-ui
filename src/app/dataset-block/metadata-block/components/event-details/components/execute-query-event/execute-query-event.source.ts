import { SimplePropertyComponent } from "./../common/simple-property/simple-property.component";
import { EventRowDescriptorsByField } from "../../dynamic-events/dynamic-events.model";
import { TimePropertyComponent } from "../common/time-property/time-property.component";
import { IntervalPropertyComponent } from "../common/interval-property/interval-property.component";

export const EXECUTE_QUERY_SOURCE_DESCRIPTORS: EventRowDescriptorsByField = {
    "ExecuteQuery.DataSlice.logicalHash": {
        label: "Logical hash:",
        tooltip: "Logical hash sum of the data in this slice.",
        presentationComponent: SimplePropertyComponent,
        separateRowForValue: false,
        dataTestId: "execute-query-data-slice-engine",
    },
    "ExecuteQuery.DataSlice.physicalHash": {
        label: "Physical hash:",
        tooltip: "Hash sum of the data part file.",
        presentationComponent: SimplePropertyComponent,
        separateRowForValue: false,
        dataTestId: "execute-query-data-slice-physical-hash",
    },

    "ExecuteQuery.DataSlice.interval": {
        label: "Interval:",
        tooltip: "Data slice produced by the transaction.",
        presentationComponent: IntervalPropertyComponent,
        separateRowForValue: false,
        dataTestId: "execute-query-data-slice-interval",
    },

    "ExecuteQuery.string.inputCheckpoint": {
        label: "Checkpoint:",
        tooltip:
            "Hash of the checkpoint file used to restore transformation state.",
        presentationComponent: SimplePropertyComponent,
        separateRowForValue: false,
        dataTestId: "execute-query-inputCheckpoint",
    },

    "ExecuteQuery.string.watermark": {
        label: "Watermark:",
        tooltip: "Last watermark of the output data stream.",
        presentationComponent: TimePropertyComponent,
        separateRowForValue: false,
        dataTestId: "execute-query-watermark",
    },

    "ExecuteQuery.Checkpoint.physicalHash": {
        label: "Physical hash:",
        tooltip: "Hash sum of the checkpoint file.",
        presentationComponent: SimplePropertyComponent,
        separateRowForValue: false,
        dataTestId: "execute-query-checkpoint-physical-hash",
    },

    "ExecuteQuery.Checkpoint.size": {
        label: "Size:",
        tooltip: "Size of checkpoint file in bytes.",
        presentationComponent: SimplePropertyComponent,
        separateRowForValue: false,
        dataTestId: "execute-query-checkpoint-size",
    },

    "ExecuteQuery.InputSlice.datasetId": {
        label: "Id:",
        tooltip: "Input dataset identifier.",
        presentationComponent: SimplePropertyComponent,
        separateRowForValue: false,
        dataTestId: "execute-query-input-slice-id",
    },

    "ExecuteQuery.InputSlice.blockInterval": {
        label: "Block interval:",
        tooltip: "Blocks that went into this transaction.",
        presentationComponent: IntervalPropertyComponent,
        separateRowForValue: false,
        dataTestId: "execute-query-input-slice-block-interval",
    },

    "ExecuteQuery.InputSlice.dataInterval": {
        label: "Data interval:",
        tooltip: "Data that went into this transaction.",
        presentationComponent: IntervalPropertyComponent,
        separateRowForValue: false,
        dataTestId: "execute-query-input-slice-data-interval",
    },
};
