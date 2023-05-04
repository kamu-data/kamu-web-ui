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
import { SetPollingSourceToolipsTexts } from "src/app/common/tooltips/tooltips.text";
import { EventTimePropertyComponent } from "../common/event-time-property/event-time-property.component";
import { CachePropertyComponent } from "../common/cache-property/cache-property.component";
import { OrderPropertyComponent } from "../common/order-property/order-property.component";

export const SET_POLLING_SOURCE_DESCRIPTORS: EventRowDescriptorsByField = {
    "SetPollingSource.FetchStepUrl.url": {
        label: "Url:",
        tooltip: SetPollingSourceToolipsTexts.URL,
        presentationComponent: LinkPropertyComponent,
        separateRowForValue: false,
        dataTestId: "setPollingSource-fetchStepUrl-url",
    },

    "SetPollingSource.FetchStepUrl.eventTime": {
        label: "Event time:",
        tooltip: SetPollingSourceToolipsTexts.EVENT_TIME,
        presentationComponent: EventTimePropertyComponent,
        separateRowForValue: false,
        dataTestId: "setPollingSource-fetchStepUrl-eventTime",
    },

    "SetPollingSource.FetchStepUrl.headers": {
        label: "Headers:",
        tooltip: SetPollingSourceToolipsTexts.HEADERS,
        presentationComponent: EnvVariablesPropertyComponent,
        separateRowForValue: false,
        dataTestId: "setPollingSource-fetchStepUrl-headers",
    },

    "SetPollingSource.FetchStepUrl.cache": {
        label: "Cache:",
        tooltip: SetPollingSourceToolipsTexts.CACHE,
        presentationComponent: CachePropertyComponent,
        separateRowForValue: false,
        dataTestId: "setPollingSource-fetchStepUrl-cache",
    },

    "SetPollingSource.FetchStepFilesGlob.path": {
        label: "Path:",
        tooltip: SetPollingSourceToolipsTexts.PATH,
        presentationComponent: SimplePropertyComponent,
        separateRowForValue: false,
        dataTestId: "setPollingSource-FetchStepFilesGlob-path",
    },

    "SetPollingSource.FetchStepFilesGlob.eventTime": {
        label: "Event time:",
        tooltip: SetPollingSourceToolipsTexts.EVENT_TIME,
        presentationComponent: EventTimePropertyComponent,
        separateRowForValue: false,
        dataTestId: "setPollingSource-FetchStepFilesGlob-eventTime",
    },

    "SetPollingSource.FetchStepFilesGlob.cache": {
        label: "Cache:",
        tooltip: SetPollingSourceToolipsTexts.CACHE,
        presentationComponent: CachePropertyComponent,
        separateRowForValue: false,
        dataTestId: "setPollingSource-FetchStepFilesGlob-cache",
    },

    "SetPollingSource.FetchStepFilesGlob.order": {
        label: "Order:",
        tooltip: SetPollingSourceToolipsTexts.ORDER,
        presentationComponent: OrderPropertyComponent,
        separateRowForValue: false,
        dataTestId: "setPollingSource-FetchStepFilesGlob-order",
    },

    "SetPollingSource.FetchStepContainer.image": {
        label: "Image:",
        tooltip: SetPollingSourceToolipsTexts.IMAGE,
        presentationComponent: SimplePropertyComponent,
        separateRowForValue: false,
        dataTestId: "setPollingSource-fetchStepContainer-image",
    },

    "SetPollingSource.FetchStepContainer.command": {
        label: "Commands:",
        tooltip: SetPollingSourceToolipsTexts.ENVIROMENT_VARIABLES,
        presentationComponent: CardsPropertyComponent,
        separateRowForValue: false,
        dataTestId: "setPollingSource-fetchStepContainer-command",
    },

    "SetPollingSource.FetchStepContainer.args": {
        label: "Arguments:",
        tooltip: SetPollingSourceToolipsTexts.ARGUMENTS,
        presentationComponent: CardsPropertyComponent,
        separateRowForValue: false,
        dataTestId: "setPollingSource-fetchStepContainer-args",
    },

    "SetPollingSource.FetchStepContainer.env": {
        label: "Environment variables:",
        tooltip: SetPollingSourceToolipsTexts.ENVIROMENT_VARIABLES,
        presentationComponent: EnvVariablesPropertyComponent,
        separateRowForValue: false,
        dataTestId: "setPollingSource-fetchStepContainer-env",
    },

    "SetPollingSource.MergeStrategyLedger.__typename": {
        label: "Strategy:",
        tooltip: SetPollingSourceToolipsTexts.MERGE_STRATEGY_LEDGER,
        presentationComponent: MergeStrategyPropertyComponent,
        separateRowForValue: false,
        dataTestId: "setPollingSource-mergeStrategyLedger-__typename",
    },

    "SetPollingSource.MergeStrategyAppend.__typename": {
        label: "Strategy:",
        tooltip: SetPollingSourceToolipsTexts.MERGE_STRATEGY_APPEND,
        presentationComponent: MergeStrategyPropertyComponent,
        separateRowForValue: false,
        dataTestId: "setPollingSource-mergeStrategyAppend-__typename",
    },

    "SetPollingSource.MergeStrategyLedger.primaryKey": {
        label: "Primary key:",
        tooltip: SetPollingSourceToolipsTexts.PRIMARY_KEYS,
        presentationComponent: CardsPropertyComponent,
        separateRowForValue: false,
        dataTestId: "setPollingSource-mergeStrategyLedger-primaryKey",
    },

    "SetPollingSource.TransformSql.engine": {
        label: "Engine:",
        tooltip: SetPollingSourceToolipsTexts.ENGINE,
        presentationComponent: EnginePropertyComponent,
        separateRowForValue: false,
        dataTestId: "setPollingSource-transformSql-engine",
    },

    "SetPollingSource.TransformSql.queries": {
        label: "Queries:",
        tooltip: SetPollingSourceToolipsTexts.QUERIES,
        presentationComponent: SqlQueryViewerComponent,
        separateRowForValue: true,
        dataTestId: "setPollingSource-transformSql-queries",
    },

    "SetPollingSource.ReadStepJsonLines.schema": {
        label: "Schema:",
        tooltip: SetPollingSourceToolipsTexts.SCHEMA,
        presentationComponent: SchemaPropertyComponent,
        separateRowForValue: false,
        dataTestId: "setPollingSource-readStepJsonLines-schema",
    },

    "SetPollingSource.ReadStepCsv.separator": {
        label: "Separator:",
        tooltip: SetPollingSourceToolipsTexts.SEPARATOR,
        presentationComponent: SeparatorPropertyComponent,
        separateRowForValue: false,
        dataTestId: "setPollingSource-readStepCsv-separator",
    },

    "SetPollingSource.ReadStepCsv.schema": {
        label: "Schema:",
        tooltip: SetPollingSourceToolipsTexts.SCHEMA,
        presentationComponent: SchemaPropertyComponent,
        separateRowForValue: false,
        dataTestId: "setPollingSource-readStepCsv-schema",
    },

    "SetPollingSource.ReadStepCsv.header": {
        label: "Header:",
        tooltip: SetPollingSourceToolipsTexts.HEADER,
        presentationComponent: SimplePropertyComponent,
        separateRowForValue: false,
        dataTestId: "setPollingSource-readStepCsv-header",
    },

    "SetPollingSource.ReadStepCsv.enforceSchema": {
        label: "Enforce schema:",
        tooltip: SetPollingSourceToolipsTexts.ENFORCE_SCHEMA,
        presentationComponent: SimplePropertyComponent,
        separateRowForValue: false,
        dataTestId: "setPollingSource-readStepCsv-enforceSchema",
    },

    "SetPollingSource.ReadStepCsv.timestampFormat": {
        label: "Timestamp format:",
        tooltip: SetPollingSourceToolipsTexts.TIMESTAMP_FORMAT,
        presentationComponent: SimplePropertyComponent,
        separateRowForValue: false,
        dataTestId: "setPollingSource-readStepCsv-timestampFormat",
    },

    "SetPollingSource.PrepStepDecompress.format": {
        label: "Format:",
        tooltip: SetPollingSourceToolipsTexts.DECOMPRESS_FORMAT,
        presentationComponent: SimplePropertyComponent,
        separateRowForValue: false,
        dataTestId: "setPollingSource-prepStepDecompress-format",
    },

    "SetPollingSource.PrepStepDecompress.subPath": {
        label: "SubPath:",
        tooltip: SetPollingSourceToolipsTexts.DECOMPRESS_SUB_PATH,
        presentationComponent: LinkPropertyComponent,
        separateRowForValue: false,
        dataTestId: "setPollingSource-prepStepDecompress-subPath",
    },

    "SetPollingSource.PrepStepPipe.command": {
        label: "Command:",
        tooltip: SetPollingSourceToolipsTexts.COMMAND,
        presentationComponent: SimplePropertyComponent,
        separateRowForValue: false,
        dataTestId: "setPollingSource-prepStepPipe-command",
    },

    "SetPollingSource.ReadStepEsriShapefile.schema": {
        label: "Schema:",
        tooltip: SetPollingSourceToolipsTexts.SCHEMA,
        presentationComponent: SchemaPropertyComponent,
        separateRowForValue: false,
        dataTestId: "setPollingSource-ReadStepEsriShapefile-schema",
    },

    "SetPollingSource.ReadStepEsriShapefile.subPath": {
        label: "Sub path:",
        tooltip: SetPollingSourceToolipsTexts.SUB_PATH,
        presentationComponent: SimplePropertyComponent,
        separateRowForValue: false,
        dataTestId: "setPollingSource-ReadStepEsriShapefile-subPath",
    },

    "SetPollingSource.ReadStepJsonLines.dateFormat": {
        label: "Date format:",
        tooltip: SetPollingSourceToolipsTexts.DATE_FORMAT,
        presentationComponent: SimplePropertyComponent,
        separateRowForValue: false,
        dataTestId: "setPollingSource-readStepJsonLines-dateFormat",
    },

    "SetPollingSource.ReadStepJsonLines.encoding": {
        label: "Encoding:",
        tooltip: SetPollingSourceToolipsTexts.ENCODING,
        presentationComponent: SimplePropertyComponent,
        separateRowForValue: false,
        dataTestId: "setPollingSource-readStepJsonLines-encoding",
    },

    "SetPollingSource.ReadStepJsonLines.multiLine": {
        label: "Multi line:",
        tooltip: SetPollingSourceToolipsTexts.MULTI_LINE,
        presentationComponent: SimplePropertyComponent,
        separateRowForValue: false,
        dataTestId: "setPollingSource-readStepJsonLines-multiLine",
    },

    "SetPollingSource.ReadStepJsonLines.primitivesAsString": {
        label: "Primitive as string:",
        tooltip: SetPollingSourceToolipsTexts.PRIMITIVE_AS_STRING,
        presentationComponent: SimplePropertyComponent,
        separateRowForValue: false,
        dataTestId: "setPollingSource-readStepJsonLines-primitivesAsString",
    },

    "SetPollingSource.ReadStepJsonLines.timestampFormat": {
        label: "Timestamp format:",
        tooltip: SetPollingSourceToolipsTexts.TIMESTAMP_FORMAT,
        presentationComponent: SimplePropertyComponent,
        separateRowForValue: false,
        dataTestId: "setPollingSource-readStepJsonLines-timestampFormat",
    },

    "SetPollingSource.ReadStepParquet.schema": {
        label: "Schema:",
        tooltip: SetPollingSourceToolipsTexts.SCHEMA,
        presentationComponent: SchemaPropertyComponent,
        separateRowForValue: false,
        dataTestId: "setPollingSource-ReadStepParquet-schema",
    },
};
