/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import {
    ControlType,
    JsonFormData,
    ReadKind,
} from "src/app/dataset-view/additional-components/metadata-component/components/source-events/add-polling-source/add-polling-source-form.types";

import { SourcesTooltipsTexts } from "@common/tooltips/sources.text";
import { OdfDefaultValues } from "@common/values/app-odf-default.values";

export const READ_FORM_DATA: JsonFormData = {
    Csv: {
        controls: [
            {
                name: "schema",
                label: "Schema",
                value: "",
                type: ControlType.SCHEMA,
                tooltip: SourcesTooltipsTexts.SCHEMA,
                validators: {},
            },
            {
                name: "header",
                label: "Header",
                value: OdfDefaultValues.CSV_HEADER,
                type: ControlType.CHECKBOX,
                tooltip: SourcesTooltipsTexts.HEADER,
                validators: {},
                dataTestId: "header",
            },
            {
                name: "encoding",
                label: "Encoding",
                value: OdfDefaultValues.CSV_ENCODING,
                type: ControlType.TEXT,
                tooltip: SourcesTooltipsTexts.ENCODING,
                placeholder: "Enter encoding type...",
                validators: {},
            },
            {
                name: "separator",
                label: "Separator",
                value: OdfDefaultValues.CSV_SEPARATOR,
                type: ControlType.TYPEAHEAD,
                placeholder: "--Select character--",
                tooltip: SourcesTooltipsTexts.SEPARATOR,
                list: [",", ";", "|"],
                validators: {
                    maxLength: 1,
                },
            },

            {
                name: "quote",
                label: "Quote character",
                value: OdfDefaultValues.CSV_QUOTE,
                type: ControlType.TYPEAHEAD,
                placeholder: "--Select character--",
                tooltip: SourcesTooltipsTexts.QUOTE,
                list: ['"', "'"],
                validators: {
                    maxLength: 1,
                },
            },
            {
                name: "escape",
                label: "Escape character",
                value: OdfDefaultValues.CSV_ESCAPE,
                type: ControlType.TYPEAHEAD,
                placeholder: "Enter escape character...",
                tooltip: SourcesTooltipsTexts.ESCAPE,
                list: ["\\"],
                validators: {
                    maxLength: 1,
                },
            },
            {
                name: "nullValue",
                label: "Null value",
                value: OdfDefaultValues.CSV_NULL_VALUE,
                type: ControlType.TEXT,
                tooltip: SourcesTooltipsTexts.NULL_VALUE,
                placeholder: "Enter null value...",
                validators: {},
            },
            {
                name: "dateFormat",
                label: "Date format",
                value: OdfDefaultValues.CSV_DATE_FORMAT,
                type: ControlType.TYPEAHEAD,
                tooltip: SourcesTooltipsTexts.DATE_FORMAT,
                placeholder: "--Select format--",
                list: ["rfc3339"],
                validators: {},
            },
            {
                name: "timestampFormat",
                label: "Timestamp format",
                value: OdfDefaultValues.CSV_TIMESTAMP_FORMAT,
                type: ControlType.TYPEAHEAD,
                placeholder: "--Select format--",
                tooltip: SourcesTooltipsTexts.TIMESTAMP_FORMAT,
                list: ["rfc3339"],
                validators: {},
            },
            {
                name: "inferSchema",
                label: "Infer schema",
                value: OdfDefaultValues.CSV_INFER_SCHEMA,
                type: ControlType.CHECKBOX,
                tooltip: SourcesTooltipsTexts.INFER_SCHEMA,
                validators: {},
                dataTestId: "inferSchema",
            },
        ],
    },
    AllGeo: {
        controls: [
            {
                name: "schema",
                label: "Schema",
                value: "",
                type: ControlType.SCHEMA,
                tooltip: SourcesTooltipsTexts.SCHEMA,
                validators: {},
            },
            {
                name: "jsonKind",
                label: "Select reader format",
                value: ReadKind.GEO_JSON,
                type: ControlType.JSON_KIND,
                tooltip: SourcesTooltipsTexts.READ_JSON,
                validators: {},
                readFormatDescriptors: [
                    { label: "Geo JSON", value: ReadKind.GEO_JSON },
                    { label: "Newline-delimited Geo JSON", value: ReadKind.ND_GEO_JSON },
                ],
            },
        ],
    },
    EsriShapefile: {
        controls: [
            {
                name: "schema",
                label: "Schema",
                value: "",
                type: ControlType.SCHEMA,
                tooltip: SourcesTooltipsTexts.SCHEMA,
                validators: {},
            },
            {
                name: "subPath",
                label: "Path",
                value: "",
                type: ControlType.TEXT,
                tooltip: SourcesTooltipsTexts.SUB_PATH,
                placeholder: "Enter path to data file...",
                validators: {},
            },
        ],
    },
    Parquet: {
        controls: [
            {
                name: "schema",
                label: "Schema",
                value: "",
                tooltip: SourcesTooltipsTexts.SCHEMA,
                type: ControlType.SCHEMA,
                validators: {},
            },
        ],
    },
    AllJson: {
        controls: [
            {
                name: "schema",
                label: "Schema",
                value: "",
                type: ControlType.SCHEMA,
                tooltip: SourcesTooltipsTexts.SCHEMA,
                validators: {},
            },
            {
                name: "jsonKind",
                label: "Select reader format",
                value: ReadKind.JSON,
                type: ControlType.JSON_KIND,
                tooltip: SourcesTooltipsTexts.READ_JSON,
                validators: {},
                readFormatDescriptors: [
                    { label: "JSON", value: ReadKind.JSON },
                    { label: "Newline-delimited JSON", value: ReadKind.ND_JSON },
                ],
            },
            {
                name: "encoding",
                label: "Encoding",
                value: OdfDefaultValues.CSV_ENCODING,
                type: ControlType.TEXT,
                tooltip: SourcesTooltipsTexts.ENCODING,
                placeholder: "Enter encoding...",
                validators: {},
            },
            {
                name: "dateFormat",
                label: "Date format",
                value: "rfc3339",
                type: ControlType.TYPEAHEAD,
                tooltip: SourcesTooltipsTexts.DATE_FORMAT,
                placeholder: "--Select format--",
                list: ["rfc3339"],
                validators: {},
            },
            {
                name: "timestampFormat",
                label: "Timestamp format",
                value: "rfc3339",
                type: ControlType.TYPEAHEAD,
                placeholder: "--Select format--",
                tooltip: SourcesTooltipsTexts.TIMESTAMP_FORMAT,
                list: ["rfc3339"],
                validators: {},
            },
        ],
    },
    NdGeoJson: {
        controls: [],
    },
    GeoJson: {
        controls: [],
    },
    NdJson: {
        controls: [],
    },
    Json: {
        controls: [],
    },
};
