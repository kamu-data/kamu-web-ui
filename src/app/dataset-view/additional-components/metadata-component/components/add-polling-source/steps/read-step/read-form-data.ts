import { JsonFormData } from "../../add-polling-source-form.types";

export const READ_FORM_DATA: JsonFormData = {
    csv: {
        controls: [
            {
                name: "separator",
                label: "Separator",
                value: "",
                type: "text",
                placeholder: "Enter separator",
                validators: {},
            },
            {
                name: "encoding",
                label: "Encoding",
                value: "",
                type: "text",
                placeholder: "Enter encoding",
                validators: {},
            },
            {
                name: "quote",
                label: "Quote",
                value: "",
                type: "text",
                placeholder: "Enter quote",
                validators: {},
            },
            {
                name: "header",
                label: "Header",
                value: false,
                type: "checkbox",
                validators: {},
                dataTestId: "header",
            },
        ],
    },
    jsonLines: {
        controls: [
            {
                name: "dateFormat",
                label: "Date formatr",
                value: "",
                type: "text",
                placeholder: "Enter date",
                validators: {},
            },
        ],
    },
    geoJson: {
        controls: [],
    },
    esriShapefile: {
        controls: [],
    },
    parquet: {
        controls: [],
    },
};
