import { ControlType, JsonFormData } from "../../add-polling-source-form.types";
import { SourcesToolipsTexts } from "src/app/common/tooltips/sources.text";

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
                type: ControlType.ARRAY_KEY,
                placeholder: "Enter primary key...",
                tooltip: SourcesToolipsTexts.PRIMARY_KEYS,
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
                tooltip: SourcesToolipsTexts.PRIMARY_KEYS,
                type: ControlType.ARRAY_KEY,
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
                type: ControlType.ARRAY_KEY,
                tooltip: SourcesToolipsTexts.COMPARE_COLUMNS,
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
                type: ControlType.TEXT,
                tooltip: SourcesToolipsTexts.OBSERVATION_COLUMN,
                placeholder: "Enter column name...",
                validators: {},
            },
            {
                name: "obsvAdded",
                label: "Observation added",
                value: "",
                type: ControlType.TEXT,
                tooltip: SourcesToolipsTexts.OBSERVATION_ADDED,
                placeholder: "Enter name...",
                validators: {},
            },
            {
                name: "obsvChanged",
                label: "Observation changed",
                value: "",
                type: ControlType.TEXT,
                tooltip: SourcesToolipsTexts.OBSERVATION_CHANGED,
                placeholder: "Enter name...",
                validators: {},
            },
            {
                name: "obsvRemoved",
                label: "Observation removed",
                value: "",
                type: ControlType.TEXT,
                tooltip: SourcesToolipsTexts.OBSERVATION_REMOVED,
                placeholder: "Enter name...",
                validators: {},
            },
        ],
    },
};
