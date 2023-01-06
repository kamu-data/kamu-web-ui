import { EventRow } from "../../factory.events";
import { SeparatorPropertyComponent } from "../common/separator-property/separator-property.component";
import { SimplePropertyComponent } from "../common/simple-property/simple-property.component";

export const SET_POLLING_SOURCE_DESCRIPTORS: Record<string, EventRow> = {
    "SetPollingSource.ReadStepCsv.separator": {
        label: "Separator:",
        tooltip:
            "Sets a single character as a separator for each field and value.",
        presentationComponent: SeparatorPropertyComponent,
    },

    "SetPollingSource.ReadStepCsv.schema": {
        label: "Schema:",
        tooltip:
            "A DDL-formatted schema. Schema can be used to coerce values into more appropriate data types.",
        presentationComponent: SimplePropertyComponent,
    },

    "SetPollingSource.ReadStepCsv.header": {
        label: "Header:",
        tooltip: "Use the first line as names of columns.",
        presentationComponent: SimplePropertyComponent,
    },
    "SetPollingSource.ReadStepCsv.enforceSchema": {
        label: "Enforce schema:",
        tooltip:
            "If it is set to true, the specified or inferred schema will be forcibly applied to datasource files, and headers in CSV files will be ignored. If the option is set to false, the schema will be validated against all headers in CSV files in the case when the header option is set to true.",
        presentationComponent: SimplePropertyComponent,
    },
};
