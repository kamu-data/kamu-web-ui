import AppValues from "src/app/common/app.values";
import { JsonFormData } from "../../add-polling-source-form.types";

export const FETCH_FORM_DATA: JsonFormData = {
    url: {
        controls: [
            {
                name: "url",
                label: "Url",
                value: "",
                type: "text",
                placeholder: "Enter url",
                tooltip: "URL of the data source.",
                validators: {
                    required: true,
                    pattern: AppValues.URL_PATTERN,
                },
            },
            {
                name: "eventTime",
                label: "Event time",
                value: "",
                type: "event-time",
                tooltip:
                    "Describes how event time is extracted from the source metadata.",
                validators: {},
            },
            {
                name: "headers",
                value: "",
                label: "Headers",
                type: "array-key-value",
                tooltip:
                    "Headers to pass during the request (e.g. HTTP Authorization)",
                options: {
                    formArrayName: "headers",
                    buttonText: "+ Add headers",
                },
                validators: {},
            },
            {
                name: "cache",
                label: "Use cache",
                value: "",
                type: "cache",
                validators: {},
            },
        ],
    },
    filesGlob: {
        controls: [
            {
                name: "path",
                label: "Path",
                value: "",
                type: "text",
                placeholder: "Enter path",
                tooltip: "Path with a glob pattern.",
                validators: {
                    required: true,
                },
            },

            {
                name: "order",
                label: "Order",
                value: "none",
                type: "order",
                tooltip:
                    "Specifies how input files should be ordered before ingestion.Order is important as every file will be processed individually and will advance the dataset's watermark.",
                validators: {},
            },
            {
                name: "eventTime",
                label: "Event time",
                value: "",
                type: "event-time",
                tooltip:
                    "Describes how event time is extracted from the source metadata.",
                validators: {},
            },
            {
                name: "cache",
                label: "Use cache",
                value: "",
                type: "cache",
                validators: {},
            },
        ],
    },
    container: {
        controls: [
            {
                name: "image",
                label: "Image",
                value: "",
                type: "text",
                placeholder: "Enter image..",
                tooltip: "Image name and and an optional tag.",
                validators: {
                    required: true,
                },
            },
            {
                name: "command",
                label: "Commands",
                placeholder: "Enter command...",
                value: "",
                type: "array-key",
                tooltip:
                    "Specifies the entrypoint. Not executed within a shell. The default OCI image's ENTRYPOINT is used if this is not provided.",
                options: {
                    formArrayName: "command",
                    buttonText: "+ Add command",
                },
                validators: {},
            },
            {
                name: "args",
                label: "Arguments",
                placeholder: "Enter argument...",
                value: "",
                type: "array-key",
                tooltip:
                    "Arguments to the entrypoint. The OCI image's CMD is used if this is not provided.",
                options: {
                    formArrayName: "args",
                    buttonText: "+ Add argument",
                },
                validators: {},
            },

            {
                name: "env",
                value: "",
                label: "Environment variables",
                type: "array-key-value",
                tooltip:
                    "Environment variables to propagate into or set in the container.",
                options: {
                    formArrayName: "env",
                    buttonText: "+ Add variable",
                },
                validators: {},
            },
        ],
    },
};
