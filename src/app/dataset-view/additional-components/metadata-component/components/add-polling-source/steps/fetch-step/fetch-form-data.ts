import AppValues from "src/app/common/app.values";
import { JsonFormData } from "../../add-polling-source-form.types";

export const fetchFormData: JsonFormData = {
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
        ],
    },
    container: {
        controls: [
            {
                name: "image",
                label: "Image",
                value: "",
                type: "text",
                placeholder: "Enter image",
                validators: {
                    required: true,
                },
            },
        ],
    },
};
