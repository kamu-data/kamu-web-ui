import { DisplayTimeComponent } from "./../../../../../../components/display-time/display-time.component";
import { SimplePropertyComponent } from "./../common/simple-property/simple-property.component";
import { EventRowDescriptorsByField } from "../../dynamic-events/dynamic-events.model";
import { OffsetIntervalPropertyComponent } from "../common/offset-interval-property/offset-interval-property.component";
import { SizePropertyComponent } from "../common/size-property/size-property.component";
import { HashPropertyComponent } from "../common/hash-property/hash-property.component";
import { BlockIntervalPropertyComponent } from "../common/block-interval-property/block-interval-property.component";
import { DatasetNameByIdPropertyComponent } from "../common/dataset-name-by-id-property/dataset-name-by-id-property.component";
import { ExecuteQueryToolipsTexts } from "src/app/common/tooltips/execute-query.text";

export const EXECUTE_QUERY_SOURCE_DESCRIPTORS: EventRowDescriptorsByField = {
    "ExecuteQuery.DataSlice.logicalHash": {
        label: "Logical hash:",
        tooltip: ExecuteQueryToolipsTexts.DATA_SLICE_LOGICAL_HASH,
        presentationComponent: HashPropertyComponent,
        separateRowForValue: false,
        dataTestId: "execute-query-data-slice-engine",
    },
    "ExecuteQuery.DataSlice.physicalHash": {
        label: "Physical hash:",
        tooltip: ExecuteQueryToolipsTexts.DATA_SLICE_PHYSICAL_HASH,
        presentationComponent: HashPropertyComponent,
        separateRowForValue: false,
        dataTestId: "execute-query-data-slice-physical-hash",
    },

    "ExecuteQuery.DataSlice.interval": {
        label: "Interval:",
        tooltip: ExecuteQueryToolipsTexts.DATA_SLICE_INTERVAL,
        presentationComponent: OffsetIntervalPropertyComponent,
        separateRowForValue: false,
        dataTestId: "execute-query-data-slice-interval",
    },

    "ExecuteQuery.string.inputCheckpoint": {
        label: "Checkpoint:",
        tooltip: ExecuteQueryToolipsTexts.INPUT_CHECKPOINT,
        presentationComponent: SimplePropertyComponent,
        separateRowForValue: false,
        dataTestId: "execute-query-inputCheckpoint",
    },

    "ExecuteQuery.string.watermark": {
        label: "Watermark:",
        tooltip: ExecuteQueryToolipsTexts.WATERMARK,
        presentationComponent: DisplayTimeComponent,
        separateRowForValue: false,
        dataTestId: "execute-query-watermark",
    },

    "ExecuteQuery.Checkpoint.physicalHash": {
        label: "Physical hash:",
        tooltip: ExecuteQueryToolipsTexts.CHECKPOINT_PHYSICAL_HASH,
        presentationComponent: HashPropertyComponent,
        separateRowForValue: false,
        dataTestId: "execute-query-checkpoint-physical-hash",
    },

    "ExecuteQuery.Checkpoint.size": {
        label: "Size:",
        tooltip: ExecuteQueryToolipsTexts.CHECKPOINT_SIZE,
        presentationComponent: SizePropertyComponent,
        separateRowForValue: false,
        dataTestId: "execute-query-checkpoint-size",
    },

    "ExecuteQuery.InputSlice.datasetId": {
        label: "Name:",
        tooltip: ExecuteQueryToolipsTexts.INPUT_SLICE_DATASET_ID,
        presentationComponent: DatasetNameByIdPropertyComponent,
        separateRowForValue: false,
        dataTestId: "execute-query-input-slice-name",
    },

    "ExecuteQuery.InputSlice.id": {
        label: "Id:",
        tooltip: ExecuteQueryToolipsTexts.INPUT_SLICE_ID,
        presentationComponent: SimplePropertyComponent,
        separateRowForValue: false,
        dataTestId: "execute-query-input-slice-id",
    },

    "ExecuteQuery.InputSlice.blockInterval": {
        label: "Block interval:",
        tooltip: ExecuteQueryToolipsTexts.INPUT_SLICE_BLOCK_INTERVAL,
        presentationComponent: BlockIntervalPropertyComponent,
        separateRowForValue: false,
        dataTestId: "execute-query-input-slice-block-interval",
    },

    "ExecuteQuery.InputSlice.dataInterval": {
        label: "Data interval:",
        tooltip: ExecuteQueryToolipsTexts.INPUT_SLICE_DATA_INTERVAL,
        presentationComponent: OffsetIntervalPropertyComponent,
        separateRowForValue: false,
        dataTestId: "execute-query-input-slice-data-interval",
    },
};
