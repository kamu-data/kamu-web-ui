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
                validators: {},
            },
            {
                name: "cache",
                label: "Use cache",
                value: "",
                type: "cache",
                validators: {},
            },
            {
                name: "headers",
                value: "",
                label: "Headers",
                type: "array-key-value",
                options: {
                    formArrayName: "headers",
                    buttonText: "+ Add headers",
                },
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
                validators: {
                    required: true,
                },
            },
            {
                name: "cache",
                label: "Use cache",
                value: "",
                type: "cache",
                validators: {},
            },
            // {
            //     name: "order",
            //     label: "Order",
            //     value: "",
            //     type: "text",
            //     placeholder: "Enter order",
            //     validators: {},
            // },
            {
                name: "eventTime",
                label: "Event time",
                value: "",
                type: "event-time",
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
                options: {
                    formArrayName: "env",
                    buttonText: "+ Add variable",
                },
                validators: {},
            },
        ],
    },
};
