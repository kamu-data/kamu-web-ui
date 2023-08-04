export class AddDataToolipsTexts {
    public static readonly WATERMARK = "Last watermark of the output data stream.";
    public static readonly INPUT_HASH = "Hash of the checkpoint file used to restore ingestion state.";
    public static readonly LOGICAL_HASH = "Logical hash sum of the data in this slice.";
    public static readonly DATA_SLICE_PHYSICAL_HASH = "Hash sum of the data part file.";
    public static readonly DATA_SLICE_INTERVAL = "Data slice produced by the transaction.";
    public static readonly DATA_SLICE_SIZE = "Size of data file in bytes.";
    public static readonly CHECKPOINT_PHYSICAL_HASH = "Hash sum of the checkpoint file.";
    public static readonly CHECKPOINT_SIZE = "Size of checkpoint file in bytes.";
}
