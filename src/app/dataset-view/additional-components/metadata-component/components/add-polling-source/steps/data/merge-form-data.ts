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
                value: "",
                type: "array-key",
                options: {
                    formArrayName: "primaryKey",
                    buttonText: "+ Add primary key",
                },
                validators: {},
            },
        ],
    },
};
