import AppValues from "src/app/common/app.values";
import { ControlType, JsonFormData } from "../../add-polling-source-form.types";
import { TooltipsTexts } from "src/app/common/tooltips.text";

export const FETCH_FORM_DATA: JsonFormData = {
    url: {
        controls: [
            {
                name: "url",
                label: "Url",
                value: "",
                type: ControlType.TEXT,
                placeholder: "Enter url",
                tooltip: TooltipsTexts.URL,
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
                tooltip: TooltipsTexts.EVENT_TIME,
                options: {
                    innerTooltips: {
                        fromMetadata: TooltipsTexts.EVENT_TIME_FROM_METADATA,
                        fromPath: TooltipsTexts.EVENT_TIME_FROM_PATH,
                    },
                },
                validators: {},
            },
            {
                name: "headers",
                value: "",
                label: "Headers",
                type: ControlType.ARRAY_KEY_VALUE,
                tooltip: TooltipsTexts.HEADERS,
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
                tooltip: TooltipsTexts.CACHE,
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
                tooltip: TooltipsTexts.PATH,
                validators: {
                    required: true,
                },
            },

            {
                name: "order",
                label: "Order",
                value: "none",
                type: ControlType.ORDER,
                tooltip: TooltipsTexts.PATH,
                validators: {},
            },
            {
                name: "eventTime",
                label: "Event time",
                value: "",
                type: ControlType.EVENT_TIME,
                tooltip: TooltipsTexts.EVENT_TIME,
                validators: {},
                options: {
                    innerTooltips: {
                        fromMetadata: TooltipsTexts.EVENT_TIME_FROM_METADATA,
                        fromPath: TooltipsTexts.EVENT_TIME_FROM_PATH,
                    },
                },
            },
            {
                name: "cache",
                label: "Use cache",
                value: "",
                type: ControlType.CACHE,
                tooltip: TooltipsTexts.CACHE,
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
                tooltip: TooltipsTexts.IMAGE,
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
                tooltip: TooltipsTexts.COMMANDS,
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
                tooltip: TooltipsTexts.ARGUMENTS,
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
                tooltip: TooltipsTexts.ENVIROMENT_VARIABLES,
                options: {
                    formArrayName: "env",
                    buttonText: "+ Add variable",
                },
                validators: {},
            },
        ],
    },
};
