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
                tooltip:
                    "Names of the columns that uniquely identify the record throughout its lifetime",
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
                tooltip:
                    "Names of the columns that uniquely identify the record throughout its lifetime",
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
                tooltip:
                    "Names of the columns to compared to determine if a row has changed between two snapshots.",
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
                tooltip:
                    "Name of the observation type column that will be added to the data.",
                placeholder: "Enter column name...",
                validators: {},
            },
            {
                name: "obsvAdded",
                label: "Observation added",
                value: "",
                type: "text",
                tooltip:
                    "Name of the observation type when the data with certain primary key is seen for the first time.",
                placeholder: "Enter name...",
                validators: {},
            },
            {
                name: "obsvChanged",
                label: "Observation changed",
                value: "",
                type: "text",
                tooltip:
                    "Name of the observation type when the data with certain primary key has changed compared to the last time it was seen.",
                placeholder: "Enter name...",
                validators: {},
            },
            {
                name: "obsvRemoved",
                label: "Observation removed",
                value: "",
                type: "text",
                tooltip:
                    "Name of the observation type when the data with certain primary key has been seen before but now is missing from the snapshot.",
                placeholder: "Enter name...",
                validators: {},
            },
        ],
    },
};
