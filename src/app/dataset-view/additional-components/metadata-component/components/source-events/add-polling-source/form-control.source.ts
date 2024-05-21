import { SetPollingSourceTooltipsTexts } from "src/app/common/tooltips/tooltips.text";
import { FetchKind, MergeKind, ReadKind } from "./add-polling-source-form.types";
import { SourcesTooltipsTexts } from "src/app/common/tooltips/sources.text";

export interface RadioControlType {
    id: string;
    value: string;
    icon: string;
    label: string;
    tooltip: string;
}

export const FETCH_STEP_RADIO_CONTROLS: RadioControlType[] = [
    {
        id: "from-url",
        value: FetchKind.URL,
        icon: "link",
        label: "Sync from URL",
        tooltip: SetPollingSourceTooltipsTexts.FROM_URL,
    },
    {
        id: "from-filesGlob",
        value: FetchKind.FILES_GLOB,
        icon: "file_upload",
        label: "Sync from files GLOB",
        tooltip: SetPollingSourceTooltipsTexts.FROM_FILES_GLOB,
    },
    {
        id: "from-container",
        value: FetchKind.CONTAINER,
        icon: "input",
        label: "Sync from container",
        tooltip: SetPollingSourceTooltipsTexts.FROM_CONTAINER,
    },
    {
        id: "from-mqtt",
        value: FetchKind.MQTT,
        icon: "rss_feed",
        label: "Sync from MQTT",
        tooltip: SetPollingSourceTooltipsTexts.FROM_MQTT,
    },
];

export const READ_STEP_RADIO_CONTROLS: RadioControlType[] = [
    {
        id: "csv",
        value: ReadKind.CSV,
        icon: "format_quote",
        label: "CSV",
        tooltip: SourcesTooltipsTexts.READ_CSV,
    },

    {
        id: "all_json",
        value: ReadKind.All_JSON,
        icon: "data_object",
        label: "Json",
        tooltip: SourcesTooltipsTexts.READ_JSON,
    },

    {
        id: "all_geo",
        value: ReadKind.ALL_GEO,
        icon: "public",
        label: "Geo",
        tooltip: SourcesTooltipsTexts.READ_GEO_JSON,
    },
    {
        id: "esriShapefile",
        value: ReadKind.ESRI_SHAPEFILE,
        icon: "rounded_corner",
        label: "ESRI Shapefile",
        tooltip: SourcesTooltipsTexts.READ_ESRI_SHAPE_FILE,
    },
    {
        id: "parquet",
        value: ReadKind.PARQUET,
        icon: "view_array",
        label: "Parquet",
        tooltip: SourcesTooltipsTexts.READ_PARQUET,
    },
];

export const MERGE_STEP_RADIO_CONTROLS: RadioControlType[] = [
    {
        id: "append",
        value: MergeKind.APPEND,
        icon: "post_add",
        label: "Append strategy",
        tooltip: SourcesTooltipsTexts.APPEND_STRATEGY,
    },
    {
        id: "ledger",
        value: MergeKind.LEDGER,
        icon: "account_tree",
        label: "Ledger strategy",
        tooltip: SourcesTooltipsTexts.LEDGER_STRATEGY,
    },
    {
        id: "snapshot",
        value: MergeKind.SNAPSHOT,
        icon: "filter_center_focus",
        label: "Snapshot strategy",
        tooltip: SourcesTooltipsTexts.SNAPSHOT_STRATEGY,
    },
];
