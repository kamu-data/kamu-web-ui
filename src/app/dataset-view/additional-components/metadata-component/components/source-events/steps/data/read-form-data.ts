import { ControlType, JsonFormData, ReadKind } from "../../add-polling-source/add-polling-source-form.types";
import { SourcesToolipsTexts } from "src/app/common/tooltips/sources.text";

export const READ_FORM_DATA: JsonFormData = {
    csv: {
        controls: [
            {
                name: "schema",
                label: "Schema",
                value: "",
                type: ControlType.SCHEMA,
                tooltip: SourcesToolipsTexts.SCHEMA,
                validators: {},
            },
            {
                name: "header",
                label: "Header",
                value: false,
                type: ControlType.CHECKBOX,
                tooltip: SourcesToolipsTexts.HEADER,
                validators: {},
                dataTestId: "header",
            },
            {
                name: "encoding",
                label: "Encoding",
                value: "utf8",
                type: ControlType.TEXT,
                tooltip: SourcesToolipsTexts.ENCODING,
                placeholder: "Enter encoding type...",
                validators: {},
            },
            {
                name: "separator",
                label: "Separator",
                value: ",",
                type: ControlType.TYPEAHEAD,
                placeholder: "--Select character--",
                tooltip: SourcesToolipsTexts.SEPARATOR,
                list: [",", ";", "|"],
                validators: {
                    maxLength: 1,
                },
            },

            {
                name: "quote",
                label: "Quote character",
                value: '"',
                type: ControlType.TYPEAHEAD,
                placeholder: "--Select character--",
                tooltip: SourcesToolipsTexts.QUOTE,
                list: ['"', "'"],
                validators: {
                    maxLength: 1,
                },
            },
            {
                name: "escape",
                label: "Escape character",
                value: "\\",
                type: ControlType.TYPEAHEAD,
                placeholder: "Enter escape character...",
                tooltip: SourcesToolipsTexts.ESCAPE,
                list: ["\\"],
                validators: {
                    maxLength: 1,
                },
            },
            {
                name: "comment",
                label: "Comment character",
                value: "",
                type: ControlType.TYPEAHEAD,
                placeholder: "--Select character--",
                tooltip: SourcesToolipsTexts.COMMENT,
                list: ["#", "*"],
                validators: {
                    maxLength: 1,
                },
            },
            {
                name: "nullValue",
                label: "Null value",
                value: "",
                type: ControlType.TEXT,
                tooltip: SourcesToolipsTexts.NULL_VALUE,
                placeholder: "Enter null value...",
                validators: {},
            },
            {
                name: "emptyValue",
                label: "Empty value",
                value: "",
                type: ControlType.TEXT,
                tooltip: SourcesToolipsTexts.EMPTY_VALUE,
                placeholder: "Enter empty value...",
                validators: {},
            },
            {
                name: "nanValue",
                label: "Nan value",
                value: "NaN",
                type: ControlType.TEXT,
                tooltip: SourcesToolipsTexts.NAN_VALUE,
                placeholder: "Enter nan value...",
                validators: {},
            },
            {
                name: "positiveInf",
                label: "Positive infinity value",
                value: "Inf",
                type: ControlType.TEXT,
                tooltip: SourcesToolipsTexts.POSITIVE_INFINITY,
                placeholder: "Enter positive infinity value...",
                validators: {},
            },
            {
                name: "negativeInf",
                label: "Negative infinity value",
                value: "-Inf",
                type: ControlType.TEXT,
                tooltip: SourcesToolipsTexts.NEGATIVE_INFINITY,
                placeholder: "Enter negative infinity value...",
                validators: {},
            },
            {
                name: "dateFormat",
                label: "Date format",
                value: "rfc3339",
                type: ControlType.TYPEAHEAD,
                tooltip: SourcesToolipsTexts.DATE_FORMAT,
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
                tooltip: SourcesToolipsTexts.TIMESTAMP_FORMAT,
                list: ["rfc3339"],
                validators: {},
            },
            {
                name: "enforceSchema",
                label: "Enforce schema",
                value: true,
                type: ControlType.CHECKBOX,
                tooltip: SourcesToolipsTexts.ENFORCE_SCHEMA,
                validators: {},
                dataTestId: "enforceSchema",
            },
            {
                name: "inferSchema",
                label: "Infer schema",
                value: false,
                type: ControlType.CHECKBOX,
                tooltip: SourcesToolipsTexts.INFER_SCHEMA,
                validators: {},
                dataTestId: "inferSchema",
            },
            {
                name: "ignoreLeadingWhiteSpace",
                label: "Ignore leading whitespace",
                value: false,
                type: ControlType.CHECKBOX,
                tooltip: SourcesToolipsTexts.IGNORE_LEADING_WHITESPACE,
                validators: {},
                dataTestId: "ignoreLeadingWhiteSpace",
            },
            {
                name: "ignoreTrailingWhiteSpace",
                label: "Ignore trailing whitespace",
                value: false,
                type: ControlType.CHECKBOX,
                tooltip: SourcesToolipsTexts.QUIGNORE_TRAILING_WHITESPACEOTE,
                validators: {},
                dataTestId: "ignoreTrailingWhiteSpace",
            },
            {
                name: "multiLine",
                label: "Мultiple line",
                value: false,
                type: ControlType.CHECKBOX,
                tooltip: SourcesToolipsTexts.MULTI_LINE,
                validators: {},
                dataTestId: "multiLine",
            },
        ],
    },
    allGeo: {
        controls: [
            {
                name: "schema",
                label: "Schema",
                value: "",
                type: ControlType.SCHEMA,
                tooltip: SourcesToolipsTexts.SCHEMA,
                validators: {},
            },
            {
                name: "jsonKind",
                label: "Select reader format",
                value: "geoJson",
                type: ControlType.JSON_KIND,
                tooltip: SourcesToolipsTexts.READ_JSON,
                validators: {},
                readFormatDescriptors: [
                    { label: "Geo JSON", value: ReadKind.GEO_JSON },
                    { label: "Newline-delimited Geo JSON", value: ReadKind.ND_GEO_JSON },
                ],
            },
        ],
    },
    esriShapefile: {
        controls: [
            {
                name: "schema",
                label: "Schema",
                value: "",
                type: ControlType.SCHEMA,
                tooltip: SourcesToolipsTexts.SCHEMA,
                validators: {},
            },
            {
                name: "subPath",
                label: "Path",
                value: "",
                type: ControlType.TEXT,
                tooltip: SourcesToolipsTexts.SUB_PATH,
                placeholder: "Enter path to data file...",
                validators: {},
            },
        ],
    },
    parquet: {
        controls: [
            {
                name: "schema",
                label: "Schema",
                value: "",
                tooltip: SourcesToolipsTexts.SCHEMA,
                type: ControlType.SCHEMA,
                validators: {},
            },
        ],
    },
    allJson: {
        controls: [
            {
                name: "schema",
                label: "Schema",
                value: "",
                type: ControlType.SCHEMA,
                tooltip: SourcesToolipsTexts.SCHEMA,
                validators: {},
            },
            {
                name: "jsonKind",
                label: "Select reader format",
                value: ReadKind.JSON,
                type: ControlType.JSON_KIND,
                tooltip: SourcesToolipsTexts.READ_JSON,
                validators: {},
                readFormatDescriptors: [
                    { label: "JSON", value: ReadKind.JSON },
                    { label: "Newline-delimited JSON", value: ReadKind.ND_JSON },
                ],
            },
            {
                name: "encoding",
                label: "Encoding",
                value: "utf8",
                type: ControlType.TEXT,
                tooltip: SourcesToolipsTexts.ENCODING,
                placeholder: "Enter encoding...",
                validators: {},
            },
            {
                name: "dateFormat",
                label: "Date format",
                value: "rfc3339",
                type: ControlType.TYPEAHEAD,
                tooltip: SourcesToolipsTexts.DATE_FORMAT,
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
                tooltip: SourcesToolipsTexts.TIMESTAMP_FORMAT,
                list: ["rfc3339"],
                validators: {},
            },
        ],
    },
    ndGeoJson: {
        controls: [],
    },
    geoJson: {
        controls: [],
    },
    ndJson: {
        controls: [],
    },
    json: {
        controls: [],
    },
};