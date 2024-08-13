export class CompactionTooltipsTexts {
    public static readonly MAX_SLICE_SIZE = "Maximum size of a single data slice file.";
    public static readonly MAX_SLICE_RECORDS = "Maximum amount of records in a single data slice file";
    public static readonly RESET_BLOCK_FLATTEN_METADATA =
        "In this mode reset will discard all data but keep the latest version of all metadata like the source or transform, schema, licenses, attachments etc. Use this to quickly restart the processing from a clean slate without needing to repopulate the metadata.";
    public static readonly RESET_BLOCK_RECURSIVE =
        "Applies the reset operation the current dataset and all of its downstream datasets **owned by you**. This allows to quickly get derivative datasets into a consistent state by making them process data from the beginning.";
    public static readonly HARD_COMPACTION_RECURSIVE =
        "If the flag is selected then reset with flattened metadata for each downstream datasets recursively";
    public static readonly RESET_TO_SEED =
        "In this mode reset will discard all data except the very first (Seed) block.";
}
