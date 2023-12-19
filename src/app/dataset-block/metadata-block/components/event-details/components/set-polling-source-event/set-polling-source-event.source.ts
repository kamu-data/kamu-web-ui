import { LinkPropertyComponent } from "../common/link-property/link-property.component";

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
import { CommandPropertyComponent } from "../common/command-property/command-property.component";
import { StepTypePropertyComponent } from "../common/step-type-property/step-type-property.component";
import { SourcesToolipsTexts } from "src/app/common/tooltips/sources.text";

export const SET_POLLING_SOURCE_DESCRIPTORS: EventRowDescriptorsByField = {
    "SetPollingSource.FetchStepUrl.__typename": {
        label: "Type:",
        tooltip: SetPollingSourceToolipsTexts.FROM_URL,
        presentationComponent: StepTypePropertyComponent,
        separateRowForValue: false,
        dataTestId: "setPollingSource-FetchStepUrl-__typename",
    },

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
        tooltip: SourcesToolipsTexts.HEADERS,
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

    "SetPollingSource.FetchStepFilesGlob.__typename": {
        label: "Type:",
        tooltip: SetPollingSourceToolipsTexts.FROM_FILES_GLOB,
        presentationComponent: StepTypePropertyComponent,
        separateRowForValue: false,
        dataTestId: "setPollingSource-FetchStepFilesGlob-__typename",
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

    "SetPollingSource.FetchStepContainer.__typename": {
        label: "Type:",
        tooltip: SetPollingSourceToolipsTexts.FROM_CONTAINER,
        presentationComponent: StepTypePropertyComponent,
        separateRowForValue: false,
        dataTestId: "setPollingSource-FetchStepContainer-__typename",
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
        tooltip: SourcesToolipsTexts.MERGE_STRATEGY_LEDGER,
        presentationComponent: MergeStrategyPropertyComponent,
        separateRowForValue: false,
        dataTestId: "setPollingSource-mergeStrategyLedger-__typename",
    },

    "SetPollingSource.MergeStrategyAppend.__typename": {
        label: "Strategy:",
        tooltip: SourcesToolipsTexts.MERGE_STRATEGY_APPEND,
        presentationComponent: MergeStrategyPropertyComponent,
        separateRowForValue: false,
        dataTestId: "setPollingSource-mergeStrategyAppend-__typename",
    },

    "SetPollingSource.MergeStrategyLedger.primaryKey": {
        label: "Primary key:",
        tooltip: SourcesToolipsTexts.PRIMARY_KEYS,
        presentationComponent: CardsPropertyComponent,
        separateRowForValue: false,
        dataTestId: "setPollingSource-mergeStrategyLedger-primaryKey",
    },

    "SetPollingSource.TransformSql.engine": {
        label: "Engine:",
        tooltip: SourcesToolipsTexts.ENGINE,
        presentationComponent: EnginePropertyComponent,
        separateRowForValue: false,
        dataTestId: "setPollingSource-transformSql-engine",
    },

    "SetPollingSource.TransformSql.queries": {
        label: "Queries:",
        tooltip: SourcesToolipsTexts.QUERIES,
        presentationComponent: SqlQueryViewerComponent,
        separateRowForValue: true,
        dataTestId: "setPollingSource-transformSql-queries",
    },

    "SetPollingSource.ReadStepJsonLines.__typename": {
        label: "Type:",
        tooltip: SourcesToolipsTexts.READ_JSON_LINES,
        presentationComponent: StepTypePropertyComponent,
        separateRowForValue: false,
        dataTestId: "setPollingSource-ReadStepJsonLines-__typename",
    },

    "SetPollingSource.ReadStepJsonLines.schema": {
        label: "Schema:",
        tooltip: SourcesToolipsTexts.SCHEMA,
        presentationComponent: SchemaPropertyComponent,
        separateRowForValue: false,
        dataTestId: "setPollingSource-readStepJsonLines-schema",
    },

    "SetPollingSource.ReadStepCsv.__typename": {
        label: "Type:",
        tooltip: SourcesToolipsTexts.READ_CSV,
        presentationComponent: StepTypePropertyComponent,
        separateRowForValue: false,
        dataTestId: "setPollingSource-ReadStepCsv-__typename",
    },

    "SetPollingSource.ReadStepCsv.separator": {
        label: "Separator:",
        tooltip: SourcesToolipsTexts.SEPARATOR,
        presentationComponent: SeparatorPropertyComponent,
        separateRowForValue: false,
        dataTestId: "setPollingSource-readStepCsv-separator",
    },

    "SetPollingSource.ReadStepCsv.schema": {
        label: "Schema:",
        tooltip: SourcesToolipsTexts.SCHEMA,
        presentationComponent: SchemaPropertyComponent,
        separateRowForValue: false,
        dataTestId: "setPollingSource-readStepCsv-schema",
    },

    "SetPollingSource.ReadStepCsv.encoding": {
        label: "Encoding:",
        tooltip: SourcesToolipsTexts.ENCODING,
        presentationComponent: SimplePropertyComponent,
        separateRowForValue: false,
        dataTestId: "setPollingSource-readStepCsv-encoding",
    },

    "SetPollingSource.ReadStepCsv.quote": {
        label: "Quote character:",
        tooltip: SourcesToolipsTexts.QUOTE,
        presentationComponent: SimplePropertyComponent,
        separateRowForValue: false,
        dataTestId: "setPollingSource-readStepCsv-quote",
    },

    "SetPollingSource.ReadStepCsv.escape": {
        label: "Escape character:",
        tooltip: SourcesToolipsTexts.ESCAPE,
        presentationComponent: SimplePropertyComponent,
        separateRowForValue: false,
        dataTestId: "setPollingSource-readStepCsv-escape",
    },

    "SetPollingSource.ReadStepCsv.comment": {
        label: "Comment character:",
        tooltip: SourcesToolipsTexts.COMMENT,
        presentationComponent: SimplePropertyComponent,
        separateRowForValue: false,
        dataTestId: "setPollingSource-readStepCsv-comment",
    },

    "SetPollingSource.ReadStepCsv.header": {
        label: "Header:",
        tooltip: SourcesToolipsTexts.HEADER,
        presentationComponent: SimplePropertyComponent,
        separateRowForValue: false,
        dataTestId: "setPollingSource-readStepCsv-header",
    },

    "SetPollingSource.ReadStepCsv.enforceSchema": {
        label: "Enforce schema:",
        tooltip: SourcesToolipsTexts.ENFORCE_SCHEMA,
        presentationComponent: SimplePropertyComponent,
        separateRowForValue: false,
        dataTestId: "setPollingSource-readStepCsv-enforceSchema",
    },

    "SetPollingSource.ReadStepCsv.inferSchema": {
        label: "Infer schema:",
        tooltip: SourcesToolipsTexts.INFER_SCHEMA,
        presentationComponent: SimplePropertyComponent,
        separateRowForValue: false,
        dataTestId: "setPollingSource-readStepCsv-inferSchema",
    },

    "SetPollingSource.ReadStepCsv.ignoreLeadingWhiteSpace": {
        label: "Ignore leading whitespace:",
        tooltip: SourcesToolipsTexts.IGNORE_LEADING_WHITESPACE,
        presentationComponent: SimplePropertyComponent,
        separateRowForValue: false,
        dataTestId: "setPollingSource-readStepCsv-ignoreLeadingWhiteSpace",
    },

    "SetPollingSource.ReadStepCsv.ignoreTrailingWhiteSpace": {
        label: "Ignore trailing whitespace:",
        tooltip: SourcesToolipsTexts.QUIGNORE_TRAILING_WHITESPACEOTE,
        presentationComponent: SimplePropertyComponent,
        separateRowForValue: false,
        dataTestId: "setPollingSource-readStepCsv-ignoreTrailingWhiteSpace",
    },

    "SetPollingSource.ReadStepCsv.nullValue": {
        label: "Null value:",
        tooltip: SourcesToolipsTexts.NULL_VALUE,
        presentationComponent: SimplePropertyComponent,
        separateRowForValue: false,
        dataTestId: "setPollingSource-readStepCsv-nullValue",
    },

    "SetPollingSource.ReadStepCsv.emptyValue": {
        label: "Empty value:",
        tooltip: SourcesToolipsTexts.EMPTY_VALUE,
        presentationComponent: SimplePropertyComponent,
        separateRowForValue: false,
        dataTestId: "setPollingSource-readStepCsv-emptyValue",
    },

    "SetPollingSource.ReadStepCsv.nanValue": {
        label: "Nan value:",
        tooltip: SourcesToolipsTexts.NAN_VALUE,
        presentationComponent: SimplePropertyComponent,
        separateRowForValue: false,
        dataTestId: "setPollingSource-readStepCsv-nanValue",
    },

    "SetPollingSource.ReadStepCsv.positiveInf": {
        label: "Possitive infinity:",
        tooltip: SourcesToolipsTexts.POSITIVE_INFINITY,
        presentationComponent: SimplePropertyComponent,
        separateRowForValue: false,
        dataTestId: "setPollingSource-readStepCsv-positiveInf",
    },

    "SetPollingSource.ReadStepCsv.negativeInf": {
        label: "Negative infinity:",
        tooltip: SourcesToolipsTexts.NEGATIVE_INFINITY,
        presentationComponent: SimplePropertyComponent,
        separateRowForValue: false,
        dataTestId: "setPollingSource-readStepCsv-negativeInf",
    },

    "SetPollingSource.ReadStepCsv.dateFormat": {
        label: "Date format:",
        tooltip: SourcesToolipsTexts.DATE_FORMAT,
        presentationComponent: SimplePropertyComponent,
        separateRowForValue: false,
        dataTestId: "setPollingSource-readStepCsv-dateFormat",
    },

    "SetPollingSource.ReadStepCsv.multiLine": {
        label: "Multi line:",
        tooltip: SourcesToolipsTexts.MULTI_LINE,
        presentationComponent: SimplePropertyComponent,
        separateRowForValue: false,
        dataTestId: "setPollingSource-readStepCsv-multiLine",
    },

    "SetPollingSource.ReadStepGeoJson.__typename": {
        label: "Type:",
        tooltip: SourcesToolipsTexts.READ_GEO_JSON,
        presentationComponent: StepTypePropertyComponent,
        separateRowForValue: false,
        dataTestId: "setPollingSource-ReadStepGeoJson-__typename",
    },

    "SetPollingSource.ReadStepNdGeoJson.__typename": {
        label: "Type:",
        tooltip: SourcesToolipsTexts.READ_ND_GEO_JSON,
        presentationComponent: StepTypePropertyComponent,
        separateRowForValue: false,
        dataTestId: "setPollingSource-ReadStepNdGeoJson-__typename",
    },

    "SetPollingSource.ReadStepNdGeoJson.schema": {
        label: "Schema:",
        tooltip: SourcesToolipsTexts.SCHEMA,
        presentationComponent: SchemaPropertyComponent,
        separateRowForValue: false,
        dataTestId: "setPollingSource-ReadStepNdGeoJson-schema",
    },

    "SetPollingSource.ReadStepJson.__typename": {
        label: "Type:",
        tooltip: SourcesToolipsTexts.READ_JSON,
        presentationComponent: StepTypePropertyComponent,
        separateRowForValue: false,
        dataTestId: "setPollingSource-ReadStepJson-__typename",
    },

    "SetPollingSource.ReadStepJson.schema": {
        label: "Schema:",
        tooltip: SourcesToolipsTexts.SCHEMA,
        presentationComponent: SchemaPropertyComponent,
        separateRowForValue: false,
        dataTestId: "setPollingSource-ReadStepJson-schema",
    },

    "SetPollingSource.ReadStepJson.encoding": {
        label: "Encoding:",
        tooltip: SourcesToolipsTexts.READ_JSON_ENCODING,
        presentationComponent: SimplePropertyComponent,
        separateRowForValue: false,
        dataTestId: "setPollingSource-ReadStepJson-encoding",
    },

    "SetPollingSource.ReadStepJson.dateFormat": {
        label: "Date format:",
        tooltip: SourcesToolipsTexts.DATE_FORMAT,
        presentationComponent: SimplePropertyComponent,
        separateRowForValue: false,
        dataTestId: "setPollingSource-ReadStepJson-dateFormat",
    },

    "SetPollingSource.ReadStepJson.timestampFormat": {
        label: "Timestamp format:",
        tooltip: SourcesToolipsTexts.TIMESTAMP_FORMAT,
        presentationComponent: SimplePropertyComponent,
        separateRowForValue: false,
        dataTestId: "setPollingSource-ReadStepJson-timestampFormat",
    },

    "SetPollingSource.ReadStepJson.subPath": {
        label: "SubPath:",
        tooltip: SourcesToolipsTexts.READ_JSON_SUB_PATH,
        presentationComponent: SimplePropertyComponent,
        separateRowForValue: false,
        dataTestId: "setPollingSource-ReadStepJson-subPath",
    },

    "SetPollingSource.ReadStepNdJson.__typename": {
        label: "Type:",
        tooltip: SourcesToolipsTexts.READ_ND_JSON,
        presentationComponent: StepTypePropertyComponent,
        separateRowForValue: false,
        dataTestId: "setPollingSource-ReadStepNdJson-__typename",
    },

    "SetPollingSource.ReadStepNdJson.dateFormat": {
        label: "Date format:",
        tooltip: SourcesToolipsTexts.DATE_FORMAT,
        presentationComponent: SimplePropertyComponent,
        separateRowForValue: false,
        dataTestId: "setPollingSource-ReadStepNdJson-dateFormat",
    },

    "SetPollingSource.ReadStepNdJson.encoding": {
        label: "Encoding:",
        tooltip: SourcesToolipsTexts.READ_JSON_ENCODING,
        presentationComponent: SimplePropertyComponent,
        separateRowForValue: false,
        dataTestId: "setPollingSource-ReadStepNdJson-encoding",
    },

    "SetPollingSource.ReadStepNdJson.timestampFormat": {
        label: "Timestamp format:",
        tooltip: SourcesToolipsTexts.TIMESTAMP_FORMAT,
        presentationComponent: SimplePropertyComponent,
        separateRowForValue: false,
        dataTestId: "setPollingSource-ReadStepNdJson-timestampFormat",
    },

    "SetPollingSource.ReadStepGeoJson.schema": {
        label: "Schema:",
        tooltip: SourcesToolipsTexts.SCHEMA,
        presentationComponent: SchemaPropertyComponent,
        separateRowForValue: false,
        dataTestId: "setPollingSource-ReadStepGeoJson-schema",
    },

    "SetPollingSource.ReadStepCsv.timestampFormat": {
        label: "Timestamp format:",
        tooltip: SourcesToolipsTexts.TIMESTAMP_FORMAT,
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
        presentationComponent: CommandPropertyComponent,
        separateRowForValue: false,
        dataTestId: "setPollingSource-prepStepPipe-command",
    },

    "SetPollingSource.MergeStrategySnapshot.__typename": {
        label: "Strategy:",
        tooltip: SourcesToolipsTexts.SNAPSHOT_STRATEGY,
        presentationComponent: MergeStrategyPropertyComponent,
        separateRowForValue: false,
        dataTestId: "setPollingSource-MergeStrategySnapshot-__typename",
    },

    "SetPollingSource.MergeStrategySnapshot.primaryKey": {
        label: "Primary key:",
        tooltip: SourcesToolipsTexts.PRIMARY_KEYS,
        presentationComponent: CardsPropertyComponent,
        separateRowForValue: false,
        dataTestId: "setPollingSource-MergeStrategySnapshot-__primaryKey",
    },

    "SetPollingSource.MergeStrategySnapshot.compareColumns": {
        label: "Compare columns:",
        tooltip: SourcesToolipsTexts.COMPARE_COLUMNS,
        presentationComponent: CardsPropertyComponent,
        separateRowForValue: false,
        dataTestId: "setPollingSource-MergeStrategySnapshot-compareColumns",
    },

    "SetPollingSource.MergeStrategySnapshot.observationColumn": {
        label: "Observation column:",
        tooltip: SourcesToolipsTexts.OBSERVATION_COLUMN,
        presentationComponent: SimplePropertyComponent,
        separateRowForValue: false,
        dataTestId: "setPollingSource-MergeStrategySnapshot-observationColumn",
    },

    "SetPollingSource.MergeStrategySnapshot.obsvAdded": {
        label: "Observation added:",
        tooltip: SourcesToolipsTexts.OBSERVATION_ADDED,
        presentationComponent: SimplePropertyComponent,
        separateRowForValue: false,
        dataTestId: "setPollingSource-MergeStrategySnapshot-obsvAdded",
    },

    "SetPollingSource.MergeStrategySnapshot.obsvChanged": {
        label: "Observation changed:",
        tooltip: SourcesToolipsTexts.OBSERVATION_CHANGED,
        presentationComponent: SimplePropertyComponent,
        separateRowForValue: false,
        dataTestId: "setPollingSource-MergeStrategySnapshot-obsvChanged",
    },

    "SetPollingSource.MergeStrategySnapshot.obsvRemoved": {
        label: "Observation removed:",
        tooltip: SourcesToolipsTexts.OBSERVATION_REMOVED,
        presentationComponent: SimplePropertyComponent,
        separateRowForValue: false,
        dataTestId: "setPollingSource-MergeStrategySnapshot-obsvRemoved",
    },

    "SetPollingSource.ReadStepEsriShapefile.__typename": {
        label: "Type:",
        tooltip: SourcesToolipsTexts.READ_ESRI_SHAPE_FILE,
        presentationComponent: StepTypePropertyComponent,
        separateRowForValue: false,
        dataTestId: "setPollingSource-ReadStepEsriShapefile-__typename",
    },

    "SetPollingSource.ReadStepEsriShapefile.schema": {
        label: "Schema:",
        tooltip: SourcesToolipsTexts.SCHEMA,
        presentationComponent: SchemaPropertyComponent,
        separateRowForValue: false,
        dataTestId: "setPollingSource-ReadStepEsriShapefile-schema",
    },

    "SetPollingSource.ReadStepEsriShapefile.subPath": {
        label: "Sub path:",
        tooltip: SourcesToolipsTexts.SUB_PATH,
        presentationComponent: SimplePropertyComponent,
        separateRowForValue: false,
        dataTestId: "setPollingSource-ReadStepEsriShapefile-subPath",
    },

    "SetPollingSource.ReadStepJsonLines.dateFormat": {
        label: "Date format:",
        tooltip: SourcesToolipsTexts.DATE_FORMAT,
        presentationComponent: SimplePropertyComponent,
        separateRowForValue: false,
        dataTestId: "setPollingSource-readStepJsonLines-dateFormat",
    },

    "SetPollingSource.ReadStepJsonLines.encoding": {
        label: "Encoding:",
        tooltip: SourcesToolipsTexts.ENCODING,
        presentationComponent: SimplePropertyComponent,
        separateRowForValue: false,
        dataTestId: "setPollingSource-readStepJsonLines-encoding",
    },

    "SetPollingSource.ReadStepJsonLines.multiLine": {
        label: "Multi line:",
        tooltip: SourcesToolipsTexts.MULTI_LINE,
        presentationComponent: SimplePropertyComponent,
        separateRowForValue: false,
        dataTestId: "setPollingSource-readStepJsonLines-multiLine",
    },

    "SetPollingSource.ReadStepJsonLines.primitivesAsString": {
        label: "Primitive as string:",
        tooltip: SourcesToolipsTexts.PRIMITIVE_AS_STRING,
        presentationComponent: SimplePropertyComponent,
        separateRowForValue: false,
        dataTestId: "setPollingSource-readStepJsonLines-primitivesAsString",
    },

    "SetPollingSource.ReadStepJsonLines.timestampFormat": {
        label: "Timestamp format:",
        tooltip: SourcesToolipsTexts.TIMESTAMP_FORMAT,
        presentationComponent: SimplePropertyComponent,
        separateRowForValue: false,
        dataTestId: "setPollingSource-readStepJsonLines-timestampFormat",
    },

    "SetPollingSource.ReadStepParquet.__typename": {
        label: "Type:",
        tooltip: SourcesToolipsTexts.READ_PARQUET,
        presentationComponent: StepTypePropertyComponent,
        separateRowForValue: false,
        dataTestId: "setPollingSource-ReadStepParquet-__typename",
    },

    "SetPollingSource.ReadStepParquet.schema": {
        label: "Schema:",
        tooltip: SourcesToolipsTexts.SCHEMA,
        presentationComponent: SchemaPropertyComponent,
        separateRowForValue: false,
        dataTestId: "setPollingSource-ReadStepParquet-schema",
    },
};
