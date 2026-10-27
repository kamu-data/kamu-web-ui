/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { SqlQueryStep, Transform } from "@api/kamu.graphql.interface";
import { DataSchemaField } from "@interface/dataset-schema.interface";

export enum SetPollingSourceSection {
    READ = "read",
    FETCH = "fetch",
    MERGE = "merge",
    PREPROCESS = "preprocess",
    PREPARE = "prepare",
}

export interface JsonFormValidators {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    pattern?: string | RegExp;
    min?: number;
}

export interface ReadFormatControlType {
    label: string;
    value: string;
}

interface JsonFormControlBase {
    name: string;
    label: string;
    tooltip: string;
    validators: JsonFormValidators;
    dataTestId?: string;
}

interface JsonFormArrayOptions {
    formArrayName: string;
    buttonText: string;
}

/** A control of a source event step, configured per kind; `type` decides which fields it has. */
export type JsonFormControl = JsonFormControlBase &
    (
        | { type: ControlType.TEXT | ControlType.NUMBER; value: string; placeholder?: string }
        | { type: ControlType.CHECKBOX; value: boolean }
        | { type: ControlType.CACHE | ControlType.ORDER; value: string }
        | { type: ControlType.TYPEAHEAD; value: string; placeholder?: string; list: string[] }
        | { type: ControlType.JSON_KIND; value: string; readFormatDescriptors: ReadFormatControlType[] }
        | { type: ControlType.ARRAY_KEY_VALUE | ControlType.TOPICS; options: JsonFormArrayOptions }
        | { type: ControlType.ARRAY_KEY; placeholder: string; options: Pick<JsonFormArrayOptions, "buttonText"> }
        | { type: ControlType.EVENT_TIME; options: { innerTooltips: Record<string, string> } }
        | { type: ControlType.SCHEMA }
    );

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
    CHANGELOG_STREAM = "ChangelogStream",
    UPSERT_STREAM = "UpsertStream",
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
        image?: string;
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
        schema: DataSchemaField[];
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
        event: Omit<AddPollingSourceEditFormType, "read"> & {
            read: Omit<AddPollingSourceEditFormType["read"], "schema"> & {
                schema?: {
                    fields: DataSchemaField[];
                };
            };
        };
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
