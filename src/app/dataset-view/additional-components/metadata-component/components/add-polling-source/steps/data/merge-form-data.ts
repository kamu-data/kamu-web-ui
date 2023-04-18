import { JsonFormData } from "../../add-polling-source-form.types";

export const MERGE_FORM_DATA: JsonFormData = {
    append: {
        controls: [],
    },
    ledger: {
        controls: [
            {
                name: "primaryKey",
                label: "Primary keys",
                value: "",
                type: "array-key",
                placeholder: "Enter primary key...",
                options: {
                    formArrayName: "primaryKey",
                    buttonText: "+ Add primary key",
                },
                validators: {},
            },
        ],
    },
    snapshot: {
        controls: [
            {
                name: "primaryKey",
                label: "Primary keys",
                placeholder: "Enter primary key...",
                value: "",
                type: "array-key",
                options: {
                    formArrayName: "primaryKey",
                    buttonText: "+ Add primary key",
                },
                validators: {},
            },
            {
                name: "compareColumns",
                label: "Compare columns",
                placeholder: "Enter column name...",
                value: "",
                type: "array-key",
                options: {
                    formArrayName: "compareColumns",
                    buttonText: "+ Add column name",
                },
                validators: {},
            },
            {
                name: "observationColumn",
                label: "Observation column",
                value: "",
                type: "text",
                placeholder: "Enter column name...",
                validators: {},
            },
            {
                name: "observationColumn",
                label: "Observation column",
                value: "",
                type: "text",
                placeholder: "Enter column name...",
                validators: {},
            },
            {
                name: "obsvAdded",
                label: "Observation added",
                value: "",
                type: "text",
                placeholder: "Enter name...",
                validators: {},
            },
            {
                name: "obsvChanged",
                label: "Observation changed",
                value: "",
                type: "text",
                placeholder: "Enter name...",
                validators: {},
            },
            {
                name: "obsvRemoved",
                label: "Observation removed",
                value: "",
                type: "text",
                placeholder: "Enter name...",
                validators: {},
            },
        ],
    },
};
