import { SetPollingSourceToolipsTexts } from "src/app/common/tooltips/tooltips.text";
import { FetchKind, MergeKind, ReadKind } from "./add-polling-source-form.types";

export interface RadioControlType {
    id: string;
    value: string;
    icon: string;
    label: string;
    tooltip?: string;
}

export const FETCH_STEP_RADIO_CONTROLS: RadioControlType[] = [
    {
        id: "from-url",
        value: FetchKind.URL,
        icon: "link",
        label: "Sync from URL",
        tooltip: SetPollingSourceToolipsTexts.FROM_URL,
    },
    {
        id: "from-filesGlob",
        value: FetchKind.FILES_GLOB,
        icon: "file_upload",
        label: "Sync from files GLOB",
        tooltip: SetPollingSourceToolipsTexts.FROM_FILES_GLOB,
    },
    {
        id: "from-container",
        value: FetchKind.CONTAINER,
        icon: "input",
        label: "Sync from container",
        tooltip: SetPollingSourceToolipsTexts.FROM_CONTAINER,
    },
];

export const READ_STEP_RADIO_CONTROLS: RadioControlType[] = [
    {
        id: "csv",
        value: ReadKind.CSV,
        icon: "format_quote",
        label: "CSV",
        tooltip: SetPollingSourceToolipsTexts.READ_CSV,
    },

    {
        id: "all_json",
        value: ReadKind.All_JSON,
        icon: "data_object",
        label: "Json",
        tooltip: SetPollingSourceToolipsTexts.READ_JSON,
    },

    {
        id: "all_geo",
        value: ReadKind.ALL_GEO,
        icon: "public",
        label: "Geo",
        tooltip: SetPollingSourceToolipsTexts.READ_GEO_JSON,
    },
    {
        id: "esriShapefile",
        value: ReadKind.ESRI_SHAPEFILE,
        icon: "rounded_corner",
        label: "ESRI Shapefile",
        tooltip: SetPollingSourceToolipsTexts.READ_ESRI_SHAPE_FILE,
    },
    {
        id: "parquet",
        value: ReadKind.PARQUET,
        icon: "view_array",
        label: "Parquet",
        tooltip: SetPollingSourceToolipsTexts.READ_PARQUET,
    },
];

export const MERGE_STEP_RADIO_CONTROLS: RadioControlType[] = [
    {
        id: "append",
        value: MergeKind.APPEND,
        icon: "post_add",
        label: "Append strategy",
        tooltip: SetPollingSourceToolipsTexts.APPEND_STRATEGY,
    },
    {
        id: "ledger",
        value: MergeKind.LEDGER,
        icon: "account_tree",
        label: "Ledger strategy",
        tooltip: SetPollingSourceToolipsTexts.LEDGER_STRATEGY,
    },
    {
        id: "snapshot",
        value: MergeKind.SNAPSHOT,
        icon: "filter_center_focus",
        label: "Snapshot strategy",
        tooltip: SetPollingSourceToolipsTexts.SNAPSHOT_STRATEGY,
    },
];
