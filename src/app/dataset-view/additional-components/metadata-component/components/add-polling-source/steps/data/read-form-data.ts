import { SetPollingSourceToolipsTexts } from "src/app/common/tooltips/tooltips.text";
import { ControlType, JsonFormData } from "../../add-polling-source-form.types";

export const READ_FORM_DATA: JsonFormData = {
    csv: {
        controls: [
            {
                name: "schema",
                label: "Schema",
                value: "",
                type: ControlType.SCHEMA,
                tooltip: SetPollingSourceToolipsTexts.SCHEMA,
                validators: {},
            },
            {
                name: "header",
                label: "Header",
                value: false,
                type: ControlType.CHECKBOX,
                tooltip: SetPollingSourceToolipsTexts.HEADER,
                validators: {},
                dataTestId: "header",
            },
            {
                name: "encoding",
                label: "Encoding",
                value: "",
                type: ControlType.TEXT,
                tooltip: SetPollingSourceToolipsTexts.ENCODING,
                placeholder: "Enter encoding type...",
                validators: {},
            },
            {
                name: "separator",
                label: "Separator",
                value: "",
                type: ControlType.TYPEAHEAD,
                placeholder: "--Select character--",
                tooltip: SetPollingSourceToolipsTexts.SEPARATOR,
                list: [",", ";", "|"],
                validators: {
                    maxLength: 1,
                },
            },

            {
                name: "quote",
                label: "Quote character",
                value: "",
                type: ControlType.TYPEAHEAD,
                placeholder: "--Select character--",
                tooltip: SetPollingSourceToolipsTexts.QUOTE,
                list: ['"', "'"],
                validators: {
                    maxLength: 1,
                },
            },
            {
                name: "escape",
                label: "Escape character",
                value: "",
                type: ControlType.TYPEAHEAD,
                placeholder: "Enter escape character...",
                tooltip: SetPollingSourceToolipsTexts.ESCAPE,
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
                tooltip: SetPollingSourceToolipsTexts.COMMENT,
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
                tooltip: SetPollingSourceToolipsTexts.NULL_VALUE,
                placeholder: "Enter null value...",
                validators: {},
            },
            {
                name: "emptyValue",
                label: "Empty value",
                value: "",
                type: ControlType.TEXT,
                tooltip: SetPollingSourceToolipsTexts.EMPTY_VALUE,
                placeholder: "Enter empty value...",
                validators: {},
            },
            {
                name: "nanValue",
                label: "Nan value",
                value: "",
                type: ControlType.TEXT,
                tooltip: SetPollingSourceToolipsTexts.NAN_VALUE,
                placeholder: "Enter nan value...",
                validators: {},
            },
            {
                name: "positiveInf",
                label: "Positive infinity value",
                value: "",
                type: ControlType.TEXT,
                tooltip: SetPollingSourceToolipsTexts.POSITIVE_INFINITY,
                placeholder: "Enter positive infinity value...",
                validators: {},
            },
            {
                name: "negativeInf",
                label: "Negative infinity value",
                value: "",
                type: ControlType.TEXT,
                tooltip: SetPollingSourceToolipsTexts.NEGATIVE_INFINITY,
                placeholder: "Enter negative infinity value...",
                validators: {},
            },
            {
                name: "dateFormat",
                label: "Date format",
                value: "",
                type: ControlType.TYPEAHEAD,
                tooltip: SetPollingSourceToolipsTexts.DATE_FORMAT,
                placeholder: "--Select format--",
                list: [
                    "YYYY-MM-DDTHH:mm:ss.sss",
                    "YYYY-MM-DDTHH:mm:ss",
                    "YYYY-MM-DD",
                    "YYYY-M-DTHH:mm:ss.sss",
                    "YYYY-M-DTHH:mm:ss",
                    "YYYY-M-D",
                ],
                validators: {},
            },
            {
                name: "timestampFormat",
                label: "Timestamp format",
                value: "",
                type: ControlType.TYPEAHEAD,
                placeholder: "--Select format--",
                tooltip: SetPollingSourceToolipsTexts.TIMESTAMP_FORMAT,
                list: [
                    "YYYY-MM-DDTHH:mm:ss.sss",
                    "YYYY-MM-DDTHH:mm:ss",
                    "YYYY-MM-DD",
                    "YYYY-M-DTHH:mm:ss.sss",
                    "YYYY-M-DTHH:mm:ss",
                    "YYYY-M-D",
                ],
                validators: {},
            },
            {
                name: "enforceSchema",
                label: "Enforce schema",
                value: false,
                type: ControlType.CHECKBOX,
                tooltip: SetPollingSourceToolipsTexts.ENFORCE_SCHEMA,
                validators: {},
                dataTestId: "enforceSchema",
            },
            {
                name: "inferSchema",
                label: "Infer schema",
                value: false,
                type: ControlType.CHECKBOX,
                tooltip: SetPollingSourceToolipsTexts.INFER_SCHEMA,
                validators: {},
                dataTestId: "inferSchema",
            },
            {
                name: "ignoreLeadingWhiteSpace",
                label: "Ignore leading whitespace",
                value: false,
                type: ControlType.CHECKBOX,
                tooltip: SetPollingSourceToolipsTexts.IGNORE_LEADING_WHITESPACE,
                validators: {},
                dataTestId: "ignoreLeadingWhiteSpace",
            },
            {
                name: "ignoreTrailingWhiteSpace",
                label: "Ignore trailing whitespace",
                value: false,
                type: ControlType.CHECKBOX,
                tooltip:
                    SetPollingSourceToolipsTexts.QUIGNORE_TRAILING_WHITESPACEOTE,
                validators: {},
                dataTestId: "ignoreTrailingWhiteSpace",
            },
            {
                name: "multiLine",
                label: "Multi line",
                value: false,
                type: ControlType.CHECKBOX,
                tooltip: SetPollingSourceToolipsTexts.MULTI_LINE,
                validators: {},
                dataTestId: "multiLine",
            },
        ],
    },
    jsonLines: {
        controls: [
            {
                name: "schema",
                label: "Schema",
                value: "",
                type: ControlType.SCHEMA,
                tooltip: SetPollingSourceToolipsTexts.SCHEMA,
                validators: {},
            },
            {
                name: "encoding",
                label: "Encoding",
                value: "",
                type: ControlType.TEXT,
                tooltip: SetPollingSourceToolipsTexts.ENCODING,
                placeholder: "Enter encoding...",
                validators: {},
            },
            {
                name: "dateFormat",
                label: "Date format",
                value: "",
                type: ControlType.TYPEAHEAD,
                tooltip: SetPollingSourceToolipsTexts.DATE_FORMAT,
                placeholder: "--Select format--",
                list: [
                    "YYYY-MM-DDTHH:mm:ss.sss",
                    "YYYY-MM-DDTHH:mm:ss",
                    "YYYY-MM-DD",
                    "YYYY-M-DTHH:mm:ss.sss",
                    "YYYY-M-DTHH:mm:ss",
                    "YYYY-M-D",
                ],
                validators: {},
            },

            {
                name: "timestampFormat",
                label: "Timestamp format",
                value: "",
                type: ControlType.TYPEAHEAD,
                placeholder: "--Select format--",
                tooltip: SetPollingSourceToolipsTexts.TIMESTAMP_FORMAT,
                list: [
                    "YYYY-MM-DDTHH:mm:ss.sss",
                    "YYYY-MM-DDTHH:mm:ss",
                    "YYYY-MM-DD",
                    "YYYY-M-DTHH:mm:ss.sss",
                    "YYYY-M-DTHH:mm:ss",
                    "YYYY-M-D",
                ],
                validators: {},
            },
            {
                name: "multiLine",
                label: "MultiLine",
                value: false,
                type: ControlType.CHECKBOX,
                tooltip: SetPollingSourceToolipsTexts.MULTI_LINE,
                validators: {},
                dataTestId: "multiLine",
            },
            {
                name: "primitivesAsString",
                label: "Primitives as string",
                value: false,
                type: ControlType.CHECKBOX,
                tooltip: SetPollingSourceToolipsTexts.PRIMITIVE_AS_STRING,
                validators: {},
                dataTestId: "primitivesAsString",
            },
        ],
    },
    geoJson: {
        controls: [
            {
                name: "schema",
                label: "Schema",
                value: "",
                type: ControlType.SCHEMA,
                tooltip: SetPollingSourceToolipsTexts.SCHEMA,
                validators: {},
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
                tooltip: SetPollingSourceToolipsTexts.SCHEMA,
                validators: {},
            },
            {
                name: "subPath",
                label: "Path",
                value: "",
                type: ControlType.TEXT,
                tooltip: SetPollingSourceToolipsTexts.SUB_PATH,
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
                tooltip: SetPollingSourceToolipsTexts.SCHEMA,
                type: ControlType.SCHEMA,
                validators: {},
            },
        ],
    },
};