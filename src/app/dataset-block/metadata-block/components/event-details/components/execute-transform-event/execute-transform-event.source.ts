import { DisplayTimeComponent } from "../../../../../../components/display-time/display-time.component";
import { SimplePropertyComponent } from "../common/simple-property/simple-property.component";
import { EventRowDescriptorsByField } from "../../dynamic-events/dynamic-events.model";
import { OffsetIntervalPropertyComponent } from "../common/offset-interval-property/offset-interval-property.component";
import { SizePropertyComponent } from "../common/size-property/size-property.component";
import { HashPropertyComponent } from "../common/hash-property/hash-property.component";
import { BlockIntervalPropertyComponent } from "../common/block-interval-property/block-interval-property.component";
import { DatasetNameByIdPropertyComponent } from "../common/dataset-name-by-id-property/dataset-name-by-id-property.component";
import { ExecuteTransformTooltipsTexts } from "src/app/common/tooltips/execute-transform.text";

export const EXECUTE_QUERY_SOURCE_DESCRIPTORS: EventRowDescriptorsByField = {
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

    "ExecuteTransform.DataSlice.interval": {
        label: "Interval:",
        tooltip: ExecuteTransformTooltipsTexts.DATA_SLICE_INTERVAL,
        presentationComponent: OffsetIntervalPropertyComponent,
        separateRowForValue: false,
        dataTestId: "execute-transform-data-slice-interval",
    },

    "ExecuteTransform.string.inputCheckpoint": {
        label: "Checkpoint:",
        tooltip: ExecuteTransformTooltipsTexts.INPUT_CHECKPOINT,
        presentationComponent: SimplePropertyComponent,
        separateRowForValue: false,
        dataTestId: "execute-transform-inputCheckpoint",
    },

    "ExecuteTransform.string.watermark": {
        label: "Watermark:",
        tooltip: ExecuteTransformTooltipsTexts.WATERMARK,
        presentationComponent: DisplayTimeComponent,
        separateRowForValue: false,
        dataTestId: "execute-transform-watermark",
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

    "ExecuteTransform.InputSlice.datasetId": {
        label: "Name:",
        tooltip: ExecuteTransformTooltipsTexts.INPUT_SLICE_DATASET_ID,
        presentationComponent: DatasetNameByIdPropertyComponent,
        separateRowForValue: false,
        dataTestId: "execute-transform-input-slice-name",
    },

    "ExecuteTransform.InputSlice.id": {
        label: "Id:",
        tooltip: ExecuteTransformTooltipsTexts.INPUT_SLICE_ID,
        presentationComponent: SimplePropertyComponent,
        separateRowForValue: false,
        dataTestId: "execute-transform-input-slice-id",
    },

    "ExecuteTransform.InputSlice.blockInterval": {
        label: "Block interval:",
        tooltip: ExecuteTransformTooltipsTexts.INPUT_SLICE_BLOCK_INTERVAL,
        presentationComponent: BlockIntervalPropertyComponent,
        separateRowForValue: false,
        dataTestId: "execute-transform-input-slice-block-interval",
    },

    "ExecuteTransform.InputSlice.dataInterval": {
        label: "Data interval:",
        tooltip: ExecuteTransformTooltipsTexts.INPUT_SLICE_DATA_INTERVAL,
        presentationComponent: OffsetIntervalPropertyComponent,
        separateRowForValue: false,
        dataTestId: "execute-transform-input-slice-data-interval",
    },
};
