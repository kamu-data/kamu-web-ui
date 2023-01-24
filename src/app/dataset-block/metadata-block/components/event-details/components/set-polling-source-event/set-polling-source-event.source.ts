import { LinkPropertyComponent } from "./../common/link-property/link-property.component";

import { SeparatorPropertyComponent } from "../common/separator-property/separator-property.component";
import { SimplePropertyComponent } from "../common/simple-property/simple-property.component";
import { MergeStrategyPropertyComponent } from "../common/merge-strategy-property/merge-strategy-property.component";
import { SqlQueryViewerComponent } from "../common/sql-query-viewer/sql-query-viewer.component";
import { SchemaPropertyComponent } from "../common/schema-property/schema-property.component";
import { EnvVariablesPropertyComponent } from "../common/env-variables-property/env-variables-property.component";
import { CardsPropertyComponent } from "../common/cards-property/cards-property.component";
import { EnginePropertyComponent } from "../common/engine-property/engine-property.component";
import { EventRowDescriptor } from "../../builder.events";

export const SET_POLLING_SOURCE_DESCRIPTORS: Record<
    string,
    EventRowDescriptor
> = {
    "SetPollingSource.FetchStepUrl.url": {
        label: "Url:",
        tooltip: "URL of the data source.",
        presentationComponent: LinkPropertyComponent,
        separateRowForValue: false,
        dataTestId: "setPollingSource-fetchStepUrl-url",
    },

    "SetPollingSource.FetchStepContainer.image": {
        label: "Image:",
        tooltip: "Image name and and an optional tag.",
        presentationComponent: SimplePropertyComponent,
        separateRowForValue: false,
        dataTestId: "setPollingSource-fetchStepContainer-image",
    },

    "SetPollingSource.FetchStepContainer.env": {
        label: "Environment variables:",
        tooltip:
            "Environment variables to propagate into or set in the container.",
        presentationComponent: EnvVariablesPropertyComponent,
        separateRowForValue: false,
        dataTestId: "setPollingSource-fetchStepContainer-env",
    },

    "SetPollingSource.MergeStrategyLedger.__typename": {
        label: "Strategy:",
        tooltip:
            "Merge strategy determines how newly ingested data should be combined with the data that already exists in the dataset.",
        presentationComponent: MergeStrategyPropertyComponent,
        separateRowForValue: false,
        dataTestId: "setPollingSource-mergeStrategyLedger-__typename",
    },

    "SetPollingSource.MergeStrategyLedger.primaryKey": {
        label: "Primary key:",
        tooltip:
            "Names of the columns that uniquely identify the record throughout its lifetime.",
        presentationComponent: CardsPropertyComponent,
        separateRowForValue: false,
        dataTestId: "setPollingSource-mergeStrategyLedger-primaryKey",
    },

    "SetPollingSource.TransformSql.engine": {
        label: "Engine:",
        tooltip: "Identifier of the engine used for this transformation.",
        presentationComponent: EnginePropertyComponent,
        separateRowForValue: false,
        dataTestId: "setPollingSource-transformSql-engine",
    },

    "SetPollingSource.TransformSql.queries": {
        label: "Queries:",
        tooltip: "Queries use for specifying multi-step SQL transformations.",
        presentationComponent: SqlQueryViewerComponent,
        separateRowForValue: true,
        dataTestId: "setPollingSource-transformSql-queries",
    },

    "SetPollingSource.ReadStepJsonLines.schema": {
        label: "Schema:",
        tooltip:
            "A DDL-formatted schema. Schema can be used to coerce values into more appropriate data types.",
        presentationComponent: SchemaPropertyComponent,
        separateRowForValue: false,
        dataTestId: "setPollingSource-readStepJsonLines-schema",
    },

    "SetPollingSource.ReadStepCsv.separator": {
        label: "Separator:",
        tooltip:
            "Sets a single character as a separator for each field and value.",
        presentationComponent: SeparatorPropertyComponent,
        separateRowForValue: false,
        dataTestId: "setPollingSource-readStepCsv-separator",
    },

    "SetPollingSource.ReadStepCsv.schema": {
        label: "Schema:",
        tooltip:
            "A DDL-formatted schema. Schema can be used to coerce values into more appropriate data types.",
        presentationComponent: SchemaPropertyComponent,
        separateRowForValue: false,
        dataTestId: "setPollingSource-readStepCsv-schema",
    },

    "SetPollingSource.ReadStepCsv.header": {
        label: "Header:",
        tooltip: "Use the first line as names of columns.",
        presentationComponent: SimplePropertyComponent,
        separateRowForValue: false,
        dataTestId: "setPollingSource-readStepCsv-header",
    },
    "SetPollingSource.ReadStepCsv.enforceSchema": {
        label: "Enforce schema:",
        tooltip:
            "If it is set to true, the specified or inferred schema will be forcibly applied to datasource files, and headers in CSV files will be ignored. If the option is set to false, the schema will be validated against all headers in CSV files in the case when the header option is set to true.",
        presentationComponent: SimplePropertyComponent,
        separateRowForValue: false,
        dataTestId: "setPollingSource-readStepCsv-enforceSchema",
    },

    "SetPollingSource.ReadStepCsv.timestampFormat": {
        label: "Timestamp format:",
        tooltip: "Sets the string that indicates a timestamp format.",
        presentationComponent: SimplePropertyComponent,
        separateRowForValue: false,
        dataTestId: "setPollingSource-readStepCsv-timestampFormat",
    },

    "SetPollingSource.PrepStepDecompress.format": {
        label: "Format:",
        tooltip: "Name of a compression algorithm used on data.",
        presentationComponent: SimplePropertyComponent,
        separateRowForValue: false,
        dataTestId: "setPollingSource-prepStepDecompress-format",
    },

    "SetPollingSource.PrepStepDecompress.subPath": {
        label: "SubPath:",
        tooltip:
            "Path to a data file within a multi-file archive. Can contain glob patterns.",
        presentationComponent: LinkPropertyComponent,
        separateRowForValue: false,
        dataTestId: "setPollingSource-prepStepDecompress-subPath",
    },

    "SetPollingSource.PrepStepPipe.command": {
        label: "Command:",
        tooltip: "Command to execute and its arguments.",
        presentationComponent: SimplePropertyComponent,
        separateRowForValue: false,
        dataTestId: "setPollingSource-prepStepPipe-command",
    },
};
