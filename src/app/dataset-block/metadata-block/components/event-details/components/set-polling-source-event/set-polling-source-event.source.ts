import { LinkPropertyComponent } from "./../common/link-property/link-property.component";

import { SeparatorPropertyComponent } from "../common/separator-property/separator-property.component";
import { SimplePropertyComponent } from "../common/simple-property/simple-property.component";
import { MergeStrategyPropertyComponent } from "../common/merge-strategy-property/merge-strategy-property.component";
import { SqlQueryViewerComponent } from "../common/sql-query-viewer/sql-query-viewer.component";
import { SchemaPropertyComponent } from "../common/schema-property/schema-property.component";
import { EnvVariablesPropertyComponent } from "../common/env-variables-property/env-variables-property.component";
import { CardsPropertyComponent } from "../common/cards-property/cards-property.component";
import { EnginePropertyComponent } from "../common/engine-property/engine-property.component";
import { EventRowDescriptorsByField } from "../../dynamic-events/dynamic-events.model";
import { TooltipsTexts } from "src/app/common/tooltips.text";

export const SET_POLLING_SOURCE_DESCRIPTORS: EventRowDescriptorsByField = {
    "SetPollingSource.FetchStepUrl.url": {
        label: "Url:",
        tooltip: TooltipsTexts.URL,
        presentationComponent: LinkPropertyComponent,
        separateRowForValue: false,
        dataTestId: "setPollingSource-fetchStepUrl-url",
    },

    "SetPollingSource.FetchStepFilesGlob.path": {
        label: "Path:",
        tooltip: TooltipsTexts.PATH,
        presentationComponent: SimplePropertyComponent,
        separateRowForValue: false,
        dataTestId: "setPollingSource-FetchStepFilesGlob-path",
    },

    "SetPollingSource.FetchStepContainer.image": {
        label: "Image:",
        tooltip: TooltipsTexts.IMAGE,
        presentationComponent: SimplePropertyComponent,
        separateRowForValue: false,
        dataTestId: "setPollingSource-fetchStepContainer-image",
    },

    "SetPollingSource.FetchStepContainer.env": {
        label: "Environment variables:",
        tooltip: TooltipsTexts.ENVIROMENT_VARIABLES,
        presentationComponent: EnvVariablesPropertyComponent,
        separateRowForValue: false,
        dataTestId: "setPollingSource-fetchStepContainer-env",
    },

    "SetPollingSource.MergeStrategyLedger.__typename": {
        label: "Strategy:",
        tooltip: TooltipsTexts.MERGE_STRATEGY_LEDGER,
        presentationComponent: MergeStrategyPropertyComponent,
        separateRowForValue: false,
        dataTestId: "setPollingSource-mergeStrategyLedger-__typename",
    },

    "SetPollingSource.MergeStrategyAppend.__typename": {
        label: "Strategy:",
        tooltip: TooltipsTexts.MERGE_STRATEGY_APPEND,
        presentationComponent: MergeStrategyPropertyComponent,
        separateRowForValue: false,
        dataTestId: "setPollingSource-mergeStrategyAppend-__typename",
    },

    "SetPollingSource.MergeStrategyLedger.primaryKey": {
        label: "Primary key:",
        tooltip: TooltipsTexts.PRIMARY_KEYS,
        presentationComponent: CardsPropertyComponent,
        separateRowForValue: false,
        dataTestId: "setPollingSource-mergeStrategyLedger-primaryKey",
    },

    "SetPollingSource.TransformSql.engine": {
        label: "Engine:",
        tooltip: TooltipsTexts.ENGINE,
        presentationComponent: EnginePropertyComponent,
        separateRowForValue: false,
        dataTestId: "setPollingSource-transformSql-engine",
    },

    "SetPollingSource.TransformSql.queries": {
        label: "Queries:",
        tooltip: TooltipsTexts.QUERIES,
        presentationComponent: SqlQueryViewerComponent,
        separateRowForValue: true,
        dataTestId: "setPollingSource-transformSql-queries",
    },

    "SetPollingSource.ReadStepJsonLines.schema": {
        label: "Schema:",
        tooltip: TooltipsTexts.SCHEMA,
        presentationComponent: SchemaPropertyComponent,
        separateRowForValue: false,
        dataTestId: "setPollingSource-readStepJsonLines-schema",
    },

    "SetPollingSource.ReadStepCsv.separator": {
        label: "Separator:",
        tooltip: TooltipsTexts.SEPARATOR,
        presentationComponent: SeparatorPropertyComponent,
        separateRowForValue: false,
        dataTestId: "setPollingSource-readStepCsv-separator",
    },

    "SetPollingSource.ReadStepCsv.schema": {
        label: "Schema:",
        tooltip: TooltipsTexts.SCHEMA,
        presentationComponent: SchemaPropertyComponent,
        separateRowForValue: false,
        dataTestId: "setPollingSource-readStepCsv-schema",
    },

    "SetPollingSource.ReadStepCsv.header": {
        label: "Header:",
        tooltip: TooltipsTexts.HEADER,
        presentationComponent: SimplePropertyComponent,
        separateRowForValue: false,
        dataTestId: "setPollingSource-readStepCsv-header",
    },
    "SetPollingSource.ReadStepCsv.enforceSchema": {
        label: "Enforce schema:",
        tooltip: TooltipsTexts.ENFORCE_SCHEMA,
        presentationComponent: SimplePropertyComponent,
        separateRowForValue: false,
        dataTestId: "setPollingSource-readStepCsv-enforceSchema",
    },

    "SetPollingSource.ReadStepCsv.timestampFormat": {
        label: "Timestamp format:",
        tooltip: TooltipsTexts.TIMESTAMP_FORMAT,
        presentationComponent: SimplePropertyComponent,
        separateRowForValue: false,
        dataTestId: "setPollingSource-readStepCsv-timestampFormat",
    },

    "SetPollingSource.PrepStepDecompress.format": {
        label: "Format:",
        tooltip: TooltipsTexts.DECOMPRESS_FORMAT,
        presentationComponent: SimplePropertyComponent,
        separateRowForValue: false,
        dataTestId: "setPollingSource-prepStepDecompress-format",
    },

    "SetPollingSource.PrepStepDecompress.subPath": {
        label: "SubPath:",
        tooltip: TooltipsTexts.DECOMPRESS_SUB_PATH,
        presentationComponent: LinkPropertyComponent,
        separateRowForValue: false,
        dataTestId: "setPollingSource-prepStepDecompress-subPath",
    },

    "SetPollingSource.PrepStepPipe.command": {
        label: "Command:",
        tooltip: TooltipsTexts.COMMAND,
        presentationComponent: SimplePropertyComponent,
        separateRowForValue: false,
        dataTestId: "setPollingSource-prepStepPipe-command",
    },
};
