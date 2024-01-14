import AppValues from "src/app/common/app.values";
import { ControlType, JsonFormData } from "../../add-polling-source/add-polling-source-form.types";
import { SetPollingSourceTooltipsTexts } from "src/app/common/tooltips/tooltips.text";
import { SourcesTooltipsTexts } from "src/app/common/tooltips/sources.text";

export const FETCH_FORM_DATA: JsonFormData = {
    url: {
        controls: [
            {
                name: "url",
                label: "Url",
                value: "",
                type: ControlType.TEXT,
                placeholder: "Enter url",
                tooltip: SetPollingSourceTooltipsTexts.URL,
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
                tooltip: SetPollingSourceTooltipsTexts.EVENT_TIME,
                options: {
                    innerTooltips: {
                        fromMetadata: SetPollingSourceTooltipsTexts.EVENT_TIME_FROM_METADATA,
                        fromPath: SetPollingSourceTooltipsTexts.EVENT_TIME_FROM_PATH,
                        fromSystemTime: SetPollingSourceTooltipsTexts.EVENT_TIME_SYSTEM_TIME,
                    },
                },
                validators: {},
            },
            {
                name: "headers",
                value: "",
                label: "Headers",
                type: ControlType.ARRAY_KEY_VALUE,
                tooltip: SourcesTooltipsTexts.HEADERS,
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
                tooltip: SetPollingSourceTooltipsTexts.CACHE,
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
                tooltip: SetPollingSourceTooltipsTexts.PATH,
                validators: {
                    required: true,
                },
            },

            {
                name: "order",
                label: "Order",
                value: "NONE",
                type: ControlType.ORDER,
                tooltip: SetPollingSourceTooltipsTexts.PATH,
                validators: {},
            },
            {
                name: "eventTime",
                label: "Event time",
                value: "",
                type: ControlType.EVENT_TIME,
                tooltip: SetPollingSourceTooltipsTexts.EVENT_TIME,
                validators: {},
                options: {
                    innerTooltips: {
                        fromMetadata: SetPollingSourceTooltipsTexts.EVENT_TIME_FROM_METADATA,
                        fromPath: SetPollingSourceTooltipsTexts.EVENT_TIME_FROM_PATH,
                    },
                },
            },
            {
                name: "cache",
                label: "Use cache",
                value: "",
                type: ControlType.CACHE,
                tooltip: SetPollingSourceTooltipsTexts.CACHE,
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
                tooltip: SetPollingSourceTooltipsTexts.IMAGE,
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
                tooltip: SetPollingSourceTooltipsTexts.COMMANDS,
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
                tooltip: SetPollingSourceTooltipsTexts.ARGUMENTS,
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
                tooltip: SetPollingSourceTooltipsTexts.ENVIRONMENT_VARIABLES,
                options: {
                    formArrayName: "env",
                    buttonText: "+ Add variable",
                },
                validators: {},
            },
        ],
    },
};
