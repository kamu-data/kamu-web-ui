import { TooltipsTexts } from "src/app/common/tooltips.text";

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
        value: "url",
        icon: "link",
        label: "Sync from URL",
        tooltip: TooltipsTexts.FROM_URL,
    },
    {
        id: "from-filesGlob",
        value: "filesGlob",
        icon: "file_upload",
        label: "Sync from files GLOB",
        tooltip: TooltipsTexts.FROM_FILES_GLOB,
    },
    {
        id: "from-container",
        value: "container",
        icon: "input",
        label: "Sync from container",
        tooltip: TooltipsTexts.FROM_CONTAINER,
    },
];

export const READ_STEP_RADIO_CONTROLS: RadioControlType[] = [
    {
        id: "csv",
        value: "csv",
        icon: "format_quote",
        label: "CSV",
        tooltip: TooltipsTexts.READ_CSV,
    },
    {
        id: "jsonLines",
        value: "jsonLines",
        icon: "document_scanner",
        label: "Json Lines",
        tooltip: TooltipsTexts.READ_JSON_LINES,
    },
    {
        id: "geoJson",
        value: "geoJson",
        icon: "public",
        label: "Geo Json",
        tooltip: TooltipsTexts.READ_GEO_JSON,
    },
    {
        id: "esriShapefile",
        value: "esriShapefile",
        icon: "rounded_corner",
        label: "ESRI Shapefile",
        tooltip: TooltipsTexts.READ_ESRI_SHAPE_FILE,
    },
    {
        id: "parquet",
        value: "parquet",
        icon: "view_array",
        label: "Parquet",
        tooltip: TooltipsTexts.READ_PARQUET,
    },
];

export const MERGE_STEP_RADIO_CONTROLS: RadioControlType[] = [
    {
        id: "append",
        value: "append",
        icon: "post_add",
        label: "Append strategy",
        tooltip: TooltipsTexts.APPEND_STRATEGY,
    },
    {
        id: "ledger",
        value: "ledger",
        icon: "account_tree",
        label: "Ledger strategy",
        tooltip: TooltipsTexts.LEDGER_STRATEGY,
    },
    {
        id: "snapshot",
        value: "snapshot",
        icon: "filter_center_focus",
        label: "Snapshot strategy",
        tooltip: TooltipsTexts.SNAPSHOT_STRATEGY,
    },
];
