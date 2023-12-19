import AppValues from "src/app/common/app.values";
import { ControlType, JsonFormData } from "../../add-polling-source-form.types";
import { SetPollingSourceToolipsTexts } from "src/app/common/tooltips/tooltips.text";
import { SourcesToolipsTexts } from "src/app/common/tooltips/sources.text";

export const FETCH_FORM_DATA: JsonFormData = {
    url: {
        controls: [
            {
                name: "url",
                label: "Url",
                value: "",
                type: ControlType.TEXT,
                placeholder: "Enter url",
                tooltip: SetPollingSourceToolipsTexts.URL,
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
                tooltip: SetPollingSourceToolipsTexts.EVENT_TIME,
                options: {
                    innerTooltips: {
                        fromMetadata: SetPollingSourceToolipsTexts.EVENT_TIME_FROM_METADATA,
                        fromPath: SetPollingSourceToolipsTexts.EVENT_TIME_FROM_PATH,
                        fromSystemTime: SetPollingSourceToolipsTexts.EVENT_TIME_SYSTEM_TIME,
                    },
                },
                validators: {},
            },
            {
                name: "headers",
                value: "",
                label: "Headers",
                type: ControlType.ARRAY_KEY_VALUE,
                tooltip: SourcesToolipsTexts.HEADERS,
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
                tooltip: SetPollingSourceToolipsTexts.CACHE,
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
                tooltip: SetPollingSourceToolipsTexts.PATH,
                validators: {
                    required: true,
                },
            },

            {
                name: "order",
                label: "Order",
                value: "NONE",
                type: ControlType.ORDER,
                tooltip: SetPollingSourceToolipsTexts.PATH,
                validators: {},
            },
            {
                name: "eventTime",
                label: "Event time",
                value: "",
                type: ControlType.EVENT_TIME,
                tooltip: SetPollingSourceToolipsTexts.EVENT_TIME,
                validators: {},
                options: {
                    innerTooltips: {
                        fromMetadata: SetPollingSourceToolipsTexts.EVENT_TIME_FROM_METADATA,
                        fromPath: SetPollingSourceToolipsTexts.EVENT_TIME_FROM_PATH,
                    },
                },
            },
            {
                name: "cache",
                label: "Use cache",
                value: "",
                type: ControlType.CACHE,
                tooltip: SetPollingSourceToolipsTexts.CACHE,
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
                tooltip: SetPollingSourceToolipsTexts.IMAGE,
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
                tooltip: SetPollingSourceToolipsTexts.COMMANDS,
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
                tooltip: SetPollingSourceToolipsTexts.ARGUMENTS,
                options: {
                    formArrayName: "args",
                    buttonText: "+ Add argument",
                },
                validators: {},
            },

            {
                name: "env",
                value: [
                    {
                        name: "ETH_NODE_PROVIDER_URL",
                        value: null,
                    },
                ],
                label: "Environment variables",
                type: ControlType.ARRAY_KEY_VALUE,
                tooltip: SetPollingSourceToolipsTexts.ENVIROMENT_VARIABLES,
                options: {
                    formArrayName: "env",
                    buttonText: "+ Add variable",
                },
                validators: {},
            },
        ],
    },
};
