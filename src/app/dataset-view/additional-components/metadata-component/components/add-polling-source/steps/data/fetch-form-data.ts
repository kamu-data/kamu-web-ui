import AppValues from "src/app/common/app.values";
import { ControlType, JsonFormData } from "../../add-polling-source-form.types";

export const FETCH_FORM_DATA: JsonFormData = {
    url: {
        controls: [
            {
                name: "url",
                label: "Url",
                value: "",
                type: ControlType.TEXT,
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
                type: ControlType.EVENT_TIME,
                tooltip:
                    "Describes how event time is extracted from the source metadata.",
                options: {
                    innerTooltips: {
                        fromMetadata:
                            "Extracts event time from the source's metadata.",
                        fromPath:
                            "Extracts event time from the path component of the source.",
                    },
                },
                validators: {},
            },
            {
                name: "headers",
                value: "",
                label: "Headers",
                type: ControlType.ARRAY_KEY_VALUE,
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
                tooltip:
                    "After source was processed once it will never be ingested again.",
                type: ControlType.CACHE,
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
                type: ControlType.TEXT,
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
                type: ControlType.ORDER,
                tooltip:
                    "Specifies how input files should be ordered before ingestion. Order is important as every file will be processed individually and will advance the dataset's watermark.",
                validators: {},
            },
            {
                name: "eventTime",
                label: "Event time",
                value: "",
                type: ControlType.EVENT_TIME,
                tooltip:
                    "Describes how event time is extracted from the source metadata.",
                validators: {},
                options: {
                    innerTooltips: {
                        fromMetadata:
                            "Extracts event time from the source's metadata.",
                        fromPath:
                            "Extracts event time from the path component of the source.",
                    },
                },
            },
            {
                name: "cache",
                label: "Use cache",
                value: "",
                type: ControlType.CACHE,
                tooltip:
                    "After source was processed once it will never be ingested again.",
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
                type: ControlType.TEXT,
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
                type: ControlType.ARRAY_KEY,
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
                type: ControlType.ARRAY_KEY,
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
                type: ControlType.ARRAY_KEY_VALUE,
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
