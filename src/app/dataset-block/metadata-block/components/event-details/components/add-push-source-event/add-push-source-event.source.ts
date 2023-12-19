import { EventRowDescriptorsByField } from "../../dynamic-events/dynamic-events.model";
import { SimplePropertyComponent } from "../common/simple-property/simple-property.component";
import { AddPushSourceToolipsTexts } from "src/app/common/tooltips/add-push-source.text";
import { StepTypePropertyComponent } from "../common/step-type-property/step-type-property.component";
import { SchemaPropertyComponent } from "../common/schema-property/schema-property.component";
import { SeparatorPropertyComponent } from "../common/separator-property/separator-property.component";
import { MergeStrategyPropertyComponent } from "../common/merge-strategy-property/merge-strategy-property.component";
import { EnginePropertyComponent } from "../common/engine-property/engine-property.component";
import { SqlQueryViewerComponent } from "../common/sql-query-viewer/sql-query-viewer.component";
import { CardsPropertyComponent } from "../common/cards-property/cards-property.component";
import { SourcesToolipsTexts } from "src/app/common/tooltips/sources.text";

export const ADD_PUSH_SOURCE_DESCRIPTORS: EventRowDescriptorsByField = {
    "AddPushSource.string.sourceName": {
        label: "Source name:",
        tooltip: AddPushSourceToolipsTexts.SOURCE_NAME,
        presentationComponent: SimplePropertyComponent,
        separateRowForValue: false,
        dataTestId: "add-push-source-name",
    },

    "AddPushSource.ReadStepCsv.__typename": {
        label: "Type:",
        tooltip: SourcesToolipsTexts.READ_CSV,
        presentationComponent: StepTypePropertyComponent,
        separateRowForValue: false,
        dataTestId: "add-push-source-ReadStepCsv-__typename",
    },

    "AddPushSource.ReadStepCsv.schema": {
        label: "Schema:",
        tooltip: SourcesToolipsTexts.SCHEMA,
        presentationComponent: SchemaPropertyComponent,
        separateRowForValue: false,
        dataTestId: "add-push-source-readStepCsv-schema",
    },

    "AddPushSource.ReadStepCsv.separator": {
        label: "Separator:",
        tooltip: SourcesToolipsTexts.SEPARATOR,
        presentationComponent: SeparatorPropertyComponent,
        separateRowForValue: false,
        dataTestId: "add-push-source-readStepCsv-separator",
    },

    "AddPushSource.ReadStepCsv.encoding": {
        label: "Encoding:",
        tooltip: SourcesToolipsTexts.ENCODING,
        presentationComponent: SimplePropertyComponent,
        separateRowForValue: false,
        dataTestId: "add-push-source-readStepCsv-encoding",
    },

    "AddPushSource.ReadStepCsv.quote": {
        label: "Quote character:",
        tooltip: SourcesToolipsTexts.QUOTE,
        presentationComponent: SimplePropertyComponent,
        separateRowForValue: false,
        dataTestId: "add-push-source-readStepCsv-quote",
    },

    "AddPushSource.ReadStepCsv.escape": {
        label: "Escape character:",
        tooltip: SourcesToolipsTexts.ESCAPE,
        presentationComponent: SimplePropertyComponent,
        separateRowForValue: false,
        dataTestId: "add-push-source-readStepCsv-escape",
    },

    "AddPushSource.ReadStepCsv.comment": {
        label: "Comment character:",
        tooltip: SourcesToolipsTexts.COMMENT,
        presentationComponent: SimplePropertyComponent,
        separateRowForValue: false,
        dataTestId: "add-push-source-readStepCsv-comment",
    },

    "AddPushSource.ReadStepCsv.enforceSchema": {
        label: "Enforce schema:",
        tooltip: SourcesToolipsTexts.ENFORCE_SCHEMA,
        presentationComponent: SimplePropertyComponent,
        separateRowForValue: false,
        dataTestId: "add-push-source-readStepCsv-enforceSchema",
    },

    "AddPushSource.ReadStepCsv.inferSchema": {
        label: "Infer schema:",
        tooltip: SourcesToolipsTexts.INFER_SCHEMA,
        presentationComponent: SimplePropertyComponent,
        separateRowForValue: false,
        dataTestId: "add-push-source-readStepCsv-inferSchema",
    },

    "AddPushSource.ReadStepCsv.ignoreLeadingWhiteSpace": {
        label: "Ignore leading whitespace:",
        tooltip: SourcesToolipsTexts.IGNORE_LEADING_WHITESPACE,
        presentationComponent: SimplePropertyComponent,
        separateRowForValue: false,
        dataTestId: "add-push-source-readStepCsv-ignoreLeadingWhiteSpace",
    },

    "AddPushSource.ReadStepCsv.ignoreTrailingWhiteSpace": {
        label: "Ignore trailing whitespace:",
        tooltip: SourcesToolipsTexts.QUIGNORE_TRAILING_WHITESPACEOTE,
        presentationComponent: SimplePropertyComponent,
        separateRowForValue: false,
        dataTestId: "add-push-source-readStepCsv-ignoreTrailingWhiteSpace",
    },

    "AddPushSource.ReadStepCsv.nullValue": {
        label: "Null value:",
        tooltip: SourcesToolipsTexts.NULL_VALUE,
        presentationComponent: SimplePropertyComponent,
        separateRowForValue: false,
        dataTestId: "add-push-source-readStepCsv-nullValue",
    },

    "AddPushSource.ReadStepCsv.emptyValue": {
        label: "Empty value:",
        tooltip: SourcesToolipsTexts.EMPTY_VALUE,
        presentationComponent: SimplePropertyComponent,
        separateRowForValue: false,
        dataTestId: "add-push-source-readStepCsv-emptyValue",
    },

    "AddPushSource.ReadStepCsv.nanValue": {
        label: "Nan value:",
        tooltip: SourcesToolipsTexts.NAN_VALUE,
        presentationComponent: SimplePropertyComponent,
        separateRowForValue: false,
        dataTestId: "add-push-source-readStepCsv-nanValue",
    },

    "AddPushSource.ReadStepCsv.positiveInf": {
        label: "Possitive infinity:",
        tooltip: SourcesToolipsTexts.POSITIVE_INFINITY,
        presentationComponent: SimplePropertyComponent,
        separateRowForValue: false,
        dataTestId: "add-push-source-readStepCsv-positiveInf",
    },

    "AddPushSource.ReadStepCsv.negativeInf": {
        label: "Negative infinity:",
        tooltip: SourcesToolipsTexts.NEGATIVE_INFINITY,
        presentationComponent: SimplePropertyComponent,
        separateRowForValue: false,
        dataTestId: "add-push-source-readStepCsv-negativeInf",
    },

    "AddPushSource.ReadStepCsv.dateFormat": {
        label: "Date format:",
        tooltip: SourcesToolipsTexts.DATE_FORMAT,
        presentationComponent: SimplePropertyComponent,
        separateRowForValue: false,
        dataTestId: "add-push-source-readStepCsv-dateFormat",
    },

    "AddPushSource.ReadStepCsv.multiLine": {
        label: "Multi line:",
        tooltip: SourcesToolipsTexts.MULTI_LINE,
        presentationComponent: SimplePropertyComponent,
        separateRowForValue: false,
        dataTestId: "add-push-source-readStepCsv-multiLine",
    },

    "AddPushSource.ReadStepCsv.timestampFormat": {
        label: "Timestamp format:",
        tooltip: SourcesToolipsTexts.TIMESTAMP_FORMAT,
        presentationComponent: SimplePropertyComponent,
        separateRowForValue: false,
        dataTestId: "add-push-source-readStepCsv-timestampFormat",
    },

    "AddPushSource.MergeStrategyAppend.__typename": {
        label: "Strategy:",
        tooltip: SourcesToolipsTexts.MERGE_STRATEGY_APPEND,
        presentationComponent: MergeStrategyPropertyComponent,
        separateRowForValue: false,
        dataTestId: "add-push-source-mergeStrategyAppend-__typename",
    },

    "AddPushSource.TransformSql.engine": {
        label: "Engine:",
        tooltip: SourcesToolipsTexts.ENGINE,
        presentationComponent: EnginePropertyComponent,
        separateRowForValue: false,
        dataTestId: "add-push-source-transformSql-engine",
    },

    "AddPushSource.TransformSql.queries": {
        label: "Queries:",
        tooltip: SourcesToolipsTexts.QUERIES,
        presentationComponent: SqlQueryViewerComponent,
        separateRowForValue: true,
        dataTestId: "add-push-source-transformSql-queries",
    },

    "AddPushSource.MergeStrategyLedger.__typename": {
        label: "Strategy:",
        tooltip: SourcesToolipsTexts.MERGE_STRATEGY_LEDGER,
        presentationComponent: MergeStrategyPropertyComponent,
        separateRowForValue: false,
        dataTestId: "add-push-source-mergeStrategyLedger-__typename",
    },

    "AddPushSource.MergeStrategyLedger.primaryKey": {
        label: "Primary key:",
        tooltip: SourcesToolipsTexts.PRIMARY_KEYS,
        presentationComponent: CardsPropertyComponent,
        separateRowForValue: false,
        dataTestId: "add-push-source-mergeStrategyLedger-primaryKey",
    },

    "AddPushSource.ReadStepJson.__typename": {
        label: "Type:",
        tooltip: SourcesToolipsTexts.READ_JSON,
        presentationComponent: StepTypePropertyComponent,
        separateRowForValue: false,
        dataTestId: "add-push-source-ReadStepJson-__typename",
    },

    "AddPushSource.ReadStepJson.schema": {
        label: "Schema:",
        tooltip: SourcesToolipsTexts.SCHEMA,
        presentationComponent: SchemaPropertyComponent,
        separateRowForValue: false,
        dataTestId: "add-push-source-ReadStepJson-schema",
    },

    "AddPushSource.ReadStepJson.encoding": {
        label: "Encoding:",
        tooltip: SourcesToolipsTexts.READ_JSON_ENCODING,
        presentationComponent: SimplePropertyComponent,
        separateRowForValue: false,
        dataTestId: "add-push-source-ReadStepJson-encoding",
    },

    "AddPushSource.ReadStepJson.dateFormat": {
        label: "Date format:",
        tooltip: SourcesToolipsTexts.DATE_FORMAT,
        presentationComponent: SimplePropertyComponent,
        separateRowForValue: false,
        dataTestId: "add-push-source-ReadStepJson-dateFormat",
    },

    "AddPushSource.ReadStepNdGeoJson.__typename": {
        label: "Type:",
        tooltip: SourcesToolipsTexts.READ_ND_GEO_JSON,
        presentationComponent: StepTypePropertyComponent,
        separateRowForValue: false,
        dataTestId: "add-push-source-ReadStepNdGeoJson-__typename",
    },

    "AddPushSource.ReadStepJson.timestampFormat": {
        label: "Timestamp format:",
        tooltip: SourcesToolipsTexts.TIMESTAMP_FORMAT,
        presentationComponent: SimplePropertyComponent,
        separateRowForValue: false,
        dataTestId: "add-push-source-ReadStepJson-timestampFormat",
    },

    "AddPushSource.ReadStepJson.subPath": {
        label: "SubPath:",
        tooltip: SourcesToolipsTexts.READ_JSON_SUB_PATH,
        presentationComponent: SimplePropertyComponent,
        separateRowForValue: false,
        dataTestId: "add-push-source-ReadStepJson-subPath",
    },

    "AddPushSource.MergeStrategySnapshot.__typename": {
        label: "Strategy:",
        tooltip: SourcesToolipsTexts.SNAPSHOT_STRATEGY,
        presentationComponent: MergeStrategyPropertyComponent,
        separateRowForValue: false,
        dataTestId: "add-push-source-MergeStrategySnapshot-__typename",
    },

    "AddPushSource.MergeStrategySnapshot.primaryKey": {
        label: "Primary key:",
        tooltip: SourcesToolipsTexts.PRIMARY_KEYS,
        presentationComponent: CardsPropertyComponent,
        separateRowForValue: false,
        dataTestId: "add-push-source-MergeStrategySnapshot-__primaryKey",
    },

    "AddPushSource.MergeStrategySnapshot.compareColumns": {
        label: "Compare columns:",
        tooltip: SourcesToolipsTexts.COMPARE_COLUMNS,
        presentationComponent: CardsPropertyComponent,
        separateRowForValue: false,
        dataTestId: "add-push-source-MergeStrategySnapshot-compareColumns",
    },

    "AddPushSource.MergeStrategySnapshot.observationColumn": {
        label: "Observation column:",
        tooltip: SourcesToolipsTexts.OBSERVATION_COLUMN,
        presentationComponent: SimplePropertyComponent,
        separateRowForValue: false,
        dataTestId: "add-push-source-MergeStrategySnapshot-observationColumn",
    },

    "AddPushSource.MergeStrategySnapshot.obsvAdded": {
        label: "Observation added:",
        tooltip: SourcesToolipsTexts.OBSERVATION_ADDED,
        presentationComponent: SimplePropertyComponent,
        separateRowForValue: false,
        dataTestId: "add-push-source-MergeStrategySnapshot-obsvAdded",
    },

    "AddPushSource.MergeStrategySnapshot.obsvChanged": {
        label: "Observation changed:",
        tooltip: SourcesToolipsTexts.OBSERVATION_CHANGED,
        presentationComponent: SimplePropertyComponent,
        separateRowForValue: false,
        dataTestId: "add-push-source-MergeStrategySnapshot-obsvChanged",
    },

    "AddPushSource.MergeStrategySnapshot.obsvRemoved": {
        label: "Observation removed:",
        tooltip: SourcesToolipsTexts.OBSERVATION_REMOVED,
        presentationComponent: SimplePropertyComponent,
        separateRowForValue: false,
        dataTestId: "add-push-source-MergeStrategySnapshot-obsvRemoved",
    },

    "AddPushSource.ReadStepGeoJson.__typename": {
        label: "Type:",
        tooltip: SourcesToolipsTexts.READ_GEO_JSON,
        presentationComponent: StepTypePropertyComponent,
        separateRowForValue: false,
        dataTestId: "add-push-source-ReadStepGeoJson-__typename",
    },

    "AddPushSource.ReadStepGeoJson.schema": {
        label: "Schema:",
        tooltip: SourcesToolipsTexts.SCHEMA,
        presentationComponent: SchemaPropertyComponent,
        separateRowForValue: false,
        dataTestId: "add-push-source-ReadStepGeoJson-schema",
    },

    "AddPushSource.ReadStepEsriShapefile.__typename": {
        label: "Type:",
        tooltip: SourcesToolipsTexts.READ_ESRI_SHAPE_FILE,
        presentationComponent: StepTypePropertyComponent,
        separateRowForValue: false,
        dataTestId: "add-push-source-ReadStepEsriShapefile-__typename",
    },

    "AddPushSource.ReadStepEsriShapefile.schema": {
        label: "Schema:",
        tooltip: SourcesToolipsTexts.SCHEMA,
        presentationComponent: SchemaPropertyComponent,
        separateRowForValue: false,
        dataTestId: "add-push-source-ReadStepEsriShapefile-schema",
    },

    "AddPushSource.ReadStepEsriShapefile.subPath": {
        label: "Sub path:",
        tooltip: SourcesToolipsTexts.SUB_PATH,
        presentationComponent: SimplePropertyComponent,
        separateRowForValue: false,
        dataTestId: "add-push-source-ReadStepEsriShapefile-subPath",
    },

    "AddPushSource.ReadStepParquet.__typename": {
        label: "Type:",
        tooltip: SourcesToolipsTexts.READ_PARQUET,
        presentationComponent: StepTypePropertyComponent,
        separateRowForValue: false,
        dataTestId: "add-push-source-ReadStepParquet-__typename",
    },

    "AddPushSource.ReadStepParquet.schema": {
        label: "Schema:",
        tooltip: SourcesToolipsTexts.SCHEMA,
        presentationComponent: SchemaPropertyComponent,
        separateRowForValue: false,
        dataTestId: "add-push-source-ReadStepParquet-schema",
    },

    "AddPushSource.ReadStepJsonLines.__typename": {
        label: "Type:",
        tooltip: SourcesToolipsTexts.READ_JSON_LINES,
        presentationComponent: StepTypePropertyComponent,
        separateRowForValue: false,
        dataTestId: "add-push-source-ReadStepJsonLines-__typename",
    },

    "AddPushSource.ReadStepNdJson.__typename": {
        label: "Type:",
        tooltip: SourcesToolipsTexts.READ_ND_JSON,
        presentationComponent: StepTypePropertyComponent,
        separateRowForValue: false,
        dataTestId: "add-push-source-ReadStepNdJson-__typename",
    },

    "AddPushSource.ReadStepJsonLines.primitivesAsString": {
        label: "Primitive as string:",
        tooltip: SourcesToolipsTexts.PRIMITIVE_AS_STRING,
        presentationComponent: SimplePropertyComponent,
        separateRowForValue: false,
        dataTestId: "add-push-source-readStepJsonLines-primitivesAsString",
    },
};
