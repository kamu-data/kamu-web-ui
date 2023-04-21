import { JsonFormData } from "../../add-polling-source-form.types";

export const READ_FORM_DATA: JsonFormData = {
    csv: {
        controls: [
            {
                name: "schema",
                label: "Schema",
                value: "",
                type: "schema",
                tooltip:
                    "A DDL-formatted schema. Schema can be used to coerce values into more appropriate data types.",
                validators: {},
            },
            {
                name: "header",
                label: "Header",
                value: false,
                type: "checkbox",
                tooltip: "Use the first line as names of columns.",
                validators: {},
                dataTestId: "header",
            },
            {
                name: "encoding",
                label: "Encoding",
                value: "",
                type: "text",
                tooltip: "Decodes the CSV files by the given encoding type.",
                placeholder: "Enter encoding type...",
                validators: {},
            },
            {
                name: "separator",
                label: "Separator",
                value: "",
                type: "typeahead",
                placeholder: "--Select character--",
                tooltip:
                    "Sets a single character as a separator for each field and value.",
                list: [",", ";", "|"],
                validators: {
                    maxLength: 1,
                },
            },

            {
                name: "quote",
                label: "Quote character",
                value: "",
                type: "typeahead",
                placeholder: "--Select character--",
                tooltip:
                    "Sets a single character used for escaping quoted values where the separator can be part of the value. Set an empty string to turn off quotations.",
                list: ['"', "'"],
                validators: {
                    maxLength: 1,
                },
            },
            {
                name: "escape",
                label: "Escape character",
                value: "",
                type: "typeahead",
                placeholder: "Enter escape character...",
                tooltip:
                    "Sets a single character used for escaping quotes inside an already quoted value.",
                list: ["/"],
                validators: {
                    maxLength: 1,
                },
            },
            {
                name: "comment",
                label: "Comment character",
                value: "",
                type: "typeahead",
                placeholder: "--Select character--",
                tooltip:
                    "Sets a single character used for skipping lines beginning with this character.",
                list: ["#", "*"],
                validators: {
                    maxLength: 1,
                },
            },
            {
                name: "nullValue",
                label: "Null value",
                value: "",
                type: "text",
                tooltip: "Sets the string representation of a null value.",
                placeholder: "Enter null value...",
                validators: {},
            },
            {
                name: "emptyValue",
                label: "Empty value",
                value: "",
                type: "text",
                tooltip: "Sets the string representation of an empty value.",
                placeholder: "Enter empty value...",
                validators: {},
            },
            {
                name: "nanValue",
                label: "Nan value",
                value: "",
                type: "text",
                tooltip:
                    "Sets the string representation of a non-number value.",
                placeholder: "Enter nan value...",
                validators: {},
            },
            {
                name: "positiveInf",
                label: "Positive infinity value",
                value: "",
                type: "text",
                tooltip:
                    "Sets the string representation of a positive infinity value.",
                placeholder: "Enter positive infinity value...",
                validators: {},
            },
            {
                name: "negativeInf",
                label: "Negative infinity value",
                value: "",
                type: "text",
                tooltip:
                    "Sets the string representation of a negative infinity value.",
                placeholder: "Enter negative infinity value...",
                validators: {},
            },
            {
                name: "dateFormat",
                label: "Date format",
                value: "",
                type: "typeahead",
                tooltip: "Sets the string that indicates a date format.",
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
                type: "typeahead",
                placeholder: "--Select format--",
                tooltip: "Sets the string that indicates a timestamp format.",
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
                type: "checkbox",
                tooltip:
                    "If it is set to true, the specified or inferred schema will be forcibly applied to datasource files, and headers in CSV files will be ignored. If the option is set to false, the schema will be validated against all headers in CSV files in the case when the header option is set to true.",
                validators: {},
                dataTestId: "enforceSchema",
            },
            {
                name: "inferSchema",
                label: "Infer schema",
                value: false,
                type: "checkbox",
                tooltip:
                    "Infers the input schema automatically from data. It requires one extra pass over the data.",
                validators: {},
                dataTestId: "inferSchema",
            },
            {
                name: "ignoreLeadingWhiteSpace",
                label: "Ignore leading whitespace",
                value: false,
                type: "checkbox",
                tooltip:
                    "A flag indicating whether or not leading whitespaces from values being read should be skipped.",
                validators: {},
                dataTestId: "ignoreLeadingWhiteSpace",
            },
            {
                name: "ignoreTrailingWhiteSpace",
                label: "Ignore trailing whitespace",
                value: false,
                type: "checkbox",
                tooltip:
                    "A flag indicating whether or not trailing whitespaces from values being read should be skipped.",
                validators: {},
                dataTestId: "ignoreTrailingWhiteSpace",
            },
            {
                name: "multiLine",
                label: "Multi line",
                value: false,
                type: "checkbox",
                tooltip: "Parse one record, which may span multiple lines.",
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
                type: "schema",
                tooltip:
                    "A DDL-formatted schema. Schema can be used to coerce values into more appropriate data types.",
                validators: {},
            },
            {
                name: "dateFormat",
                label: "Date format",
                value: "",
                type: "text",
                tooltip: "Sets the string that indicates a date format.",
                placeholder: "Enter date",
                validators: {},
            },
            {
                name: "encoding",
                label: "Encoding",
                value: "",
                type: "text",
                tooltip:
                    "Allows to forcibly set one of standard basic or extended encoding.",
                placeholder: "Enter encoding...",
                validators: {},
            },
            {
                name: "timestampFormat",
                label: "Timestamp format",
                value: "",
                type: "text",
                tooltip: "Sets the string that indicates a timestamp format.",
                placeholder: "Enter timestamp format...",
                validators: {},
            },
            {
                name: "multiLine",
                label: "MultiLine",
                value: false,
                type: "checkbox",
                tooltip:
                    "Parse one record, which may span multiple lines, per file.",
                validators: {},
                dataTestId: "multiLine",
            },
            {
                name: "primitivesAsString",
                label: "Primitives as string",
                value: false,
                type: "checkbox",
                tooltip: "Infers all primitive values as a string type.",
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
                type: "schema",
                tooltip:
                    "A DDL-formatted schema. Schema can be used to coerce values into more appropriate data types.",
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
                type: "schema",
                tooltip:
                    "A DDL-formatted schema. Schema can be used to coerce values into more appropriate data types.",
                validators: {},
            },
            {
                name: "subPath",
                label: "Path",
                value: "",
                type: "text",
                tooltip:
                    "Path to a data file within a multi-file archive. Can contain glob patterns.",
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
                tooltip:
                    "A DDL-formatted schema. Schema can be used to coerce values into more appropriate data types.",
                type: "schema",
                validators: {},
            },
        ],
    },
};
