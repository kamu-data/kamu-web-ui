import { SqlQueryStep, Transform } from "src/app/api/kamu.graphql.interface";

export interface JsonFormValidators {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    pattern?: string | RegExp;
}

interface JsonFormControlOptions {
    buttonText?: string;
    formArrayName?: string;
    innerTooltips?: Record<string, string>;
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
    CHECKBOX = "checkbox",
    ARRAY_KEY = "array-key",
    SCHEMA = "schema",
    EVENT_TIME = "event-time",
    CACHE = "cache",
    ORDER = "order",
    TYPEAHEAD = "typeahead",
}

export enum FetchKind {
    URL = "url",
    FILES_GLOB = "filesGlob",
    CONTAINER = "container",
}

export enum ReadKind {
    CSV = "csv",
    JSON_LINES = "jsonLines",
    GEO_JSON = "geoJson",
    ESRI_SHAPEFILE = "esriShapefile",
    PARQUET = "parquet",
}

export enum MergeKind {
    APPEND = "append",
    LEDGER = "ledger",
    SNAPSHOT = "snapshot",
}

export enum PrepareKind {
    PIPE = "pipe",
    DECOMPRESS = "decompress",
}

export enum DecompressFormat {
    ZIP = "zip",
    GZIP = "gzip",
}

export enum PreprocessKind {
    SQL = "sql",
}

export enum EventTimeSourceKind {
    FROM_METADATA = "fromMetadata",
    FROM_PATH = "fromPath",
    FROM_SYSTEM_TIME = "fromSystemTime",
}

export interface EditFormType {
    kind?: string;
    fetch: {
        kind: FetchKind;
        eventTime?: {
            kind: string;
            pattern?: string;
            timestampFormat?: string;
        };
        headers?: NameValue[];
        env?: NameValue[];
        command?: string[];
        args?: string[];
        path?: string;
    };
    read: {
        kind: ReadKind;
        schema?: string[];
        separator?: string;
        encoding?: string;
        quote?: string;
        escape?: string;
        enforceSchema?: boolean;
        nanValue?: string;
        positiveInf?: string;
        negativeInf?: string;
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
        event: EditFormType;
    };
}

export interface NameValue {
    name: string;
    value: string;
}

export interface PreprocessStepValue {
    engine: string;
    queries: Omit<SqlQueryStep, "__typename">[];
}
