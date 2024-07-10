import { SqlQueryStep, Transform } from "src/app/api/kamu.graphql.interface";

export interface JsonFormValidators {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    pattern?: string | RegExp;
    min?: number;
}

interface JsonFormControlOptions {
    buttonText?: string;
    formArrayName?: string;
    innerTooltips?: Record<string, string>;
}

export interface ReadFormatControlType {
    label: string;
    value: string;
}

export interface JsonFormControl {
    name: string;
    label: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    value: any;
    type: ControlType;
    tooltip?: string;
    placeholder?: string;
    options?: JsonFormControlOptions;
    required?: boolean;
    validators: JsonFormValidators;
    dataTestId?: string;
    list?: string[];
    readFormatDescriptors?: ReadFormatControlType[];
}

export type JsonFormData = Record<
    string,
    {
        controls: JsonFormControl[];
    }
>;

export enum ControlType {
    TEXT = "text",
    ARRAY_KEY_VALUE = "array-key-value",
    TOPICS = "topics",
    CHECKBOX = "checkbox",
    ARRAY_KEY = "array-key",
    SCHEMA = "schema",
    EVENT_TIME = "event-time",
    CACHE = "cache",
    ORDER = "order",
    TYPEAHEAD = "typeahead",
    JSON_KIND = "json-kind",
    NUMBER = "number",
}

export enum FetchKind {
    URL = "Url",
    FILES_GLOB = "FilesGlob",
    CONTAINER = "Container",
    MQTT = "Mqtt",
    ETHEREUM_LOGS = "EthereumLogs",
}

export enum ReadKind {
    CSV = "Csv",
    ALL_GEO = "AllGeo",
    GEO_JSON = "GeoJson",
    ND_GEO_JSON = "NdGeoJson",
    ESRI_SHAPEFILE = "EsriShapefile",
    PARQUET = "Parquet",
    All_JSON = "AllJson",
    JSON = "Json",
    ND_JSON = "NdJson",
}

export enum MergeKind {
    APPEND = "Append",
    LEDGER = "Ledger",
    SNAPSHOT = "Snapshot",
}

export enum PrepareKind {
    PIPE = "Pipe",
    DECOMPRESS = "Decompress",
}

export enum DecompressFormat {
    ZIP = "Zip",
    GZIP = "Gzip",
}

export enum PreprocessKind {
    SQL = "Sql",
}

export enum EventTimeSourceKind {
    FROM_METADATA = "FromMetadata",
    FROM_PATH = "FromPath",
    FROM_SYSTEM_TIME = "FromSystemTime",
}

export interface AddPollingSourceEditFormType {
    kind?: string;
    fetch: {
        kind: FetchKind;
        eventTime?: {
            kind: EventTimeSourceKind;
            pattern?: string;
            timestampFormat?: string;
        };
        headers?: NameValue[];
        env?: NameValue[];
        command?: string[];
        args?: string[];
        path?: string;
        url?: string;
        order?: string;
        topics?: TopicsType[];
        chainId?: number;
        nodeUrl?: string;
        filter?: string;
        signature?: string;
    };
    read: {
        kind: ReadKind;
        jsonKind?: ReadKind;
        subPath?: string;
        schema?: string[];
        separator?: string;
        encoding?: string;
        quote?: string;
        escape?: string;
        dateFormat?: string;
        timestampFormat?: string;
    };
    merge: {
        kind: MergeKind;
        primaryKey?: string[];
        compareColumns?: string[];
    };
    preprocess?: Transform & {
        kind: PreprocessKind.SQL;
        query?: string;
    };
    prepare?: {
        kind: PrepareKind;
        command?: string[] | string;
        format?: string;
        subPath?: string;
    }[];
}

export interface EditFormParseType {
    content: {
        event: AddPollingSourceEditFormType;
    };
}

export interface NameValue {
    name: string;
    value: string;
}

export interface TopicsType {
    path: string;
    qos?: string;
}

export interface PreprocessStepValue {
    engine: string;
    queries: Omit<SqlQueryStep, "__typename">[];
}
