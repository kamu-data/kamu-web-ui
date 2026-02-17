/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { SourcesTooltipsTexts } from "@common/tooltips/sources.text";

import { EventRowDescriptor, EventRowDescriptorsByField } from "../../dynamic-events/dynamic-events.model";
import { CardsPropertyComponent } from "../common/cards-property/cards-property.component";
import { EnginePropertyComponent } from "../common/engine-property/engine-property.component";
import { MergeStrategyPropertyComponent } from "../common/merge-strategy-property/merge-strategy-property.component";
import { SchemaPropertyComponent } from "../common/schema-property/schema-property.component";
import { SeparatorPropertyComponent } from "../common/separator-property/separator-property.component";
import { SimplePropertyComponent } from "../common/simple-property/simple-property.component";
import { SqlQueryViewerComponent } from "../common/sql-query-viewer/sql-query-viewer.component";
import { StepTypePropertyComponent } from "../common/step-type-property/step-type-property.component";

export const SOURCES_EVENT_DESCRIPTORS: EventRowDescriptorsByField = {
    "ReadStepCsv.__typename": {
        label: "Type:",
        tooltip: SourcesTooltipsTexts.READ_CSV,
        presentationComponent: StepTypePropertyComponent,
        separateRowForValue: false,
        dataTestId: "readStepCsv-__typename",
    },
    "ReadStepCsv.schema": {
        label: "Schema:",
        tooltip: SourcesTooltipsTexts.SCHEMA,
        presentationComponent: SchemaPropertyComponent,
        separateRowForValue: true,
        dataTestId: "readStepCsv-schema",
    },
    "ReadStepCsv.separator": {
        label: "Separator:",
        tooltip: SourcesTooltipsTexts.SEPARATOR,
        presentationComponent: SeparatorPropertyComponent,
        separateRowForValue: false,
        dataTestId: "readStepCsv-separator",
    },
    "ReadStepCsv.quote": {
        label: "Quote character:",
        tooltip: SourcesTooltipsTexts.QUOTE,
        presentationComponent: SimplePropertyComponent,
        separateRowForValue: false,
        dataTestId: "readStepCsv-quote",
    },
    "ReadStepCsv.encoding": {
        label: "Encoding:",
        tooltip: SourcesTooltipsTexts.ENCODING,
        presentationComponent: SimplePropertyComponent,
        separateRowForValue: false,
        dataTestId: "readStepCsv-encoding",
    },
    "ReadStepCsv.escape": {
        label: "Escape character:",
        tooltip: SourcesTooltipsTexts.ESCAPE,
        presentationComponent: SimplePropertyComponent,
        separateRowForValue: false,
        dataTestId: "readStepCsv-escape",
    },
    "ReadStepCsv.inferSchema": {
        label: "Infer schema:",
        tooltip: SourcesTooltipsTexts.INFER_SCHEMA,
        presentationComponent: SimplePropertyComponent,
        separateRowForValue: false,
        dataTestId: "readStepCsv-inferSchema",
    },
    "ReadStepCsv.header": {
        label: "Header:",
        tooltip: SourcesTooltipsTexts.HEADER,
        presentationComponent: SimplePropertyComponent,
        separateRowForValue: false,
        dataTestId: "readStepCsv-header",
    },
    "ReadStepCsv.nullValue": {
        label: "Null value:",
        tooltip: SourcesTooltipsTexts.NULL_VALUE,
        presentationComponent: SimplePropertyComponent,
        separateRowForValue: false,
        dataTestId: "readStepCsv-nullValue",
    },
    "ReadStepCsv.dateFormat": {
        label: "Date format:",
        tooltip: SourcesTooltipsTexts.DATE_FORMAT,
        presentationComponent: SimplePropertyComponent,
        separateRowForValue: false,
        dataTestId: "readStepCsv-dateFormat",
    },
    "ReadStepCsv.timestampFormat": {
        label: "Timestamp format:",
        tooltip: SourcesTooltipsTexts.TIMESTAMP_FORMAT,
        presentationComponent: SimplePropertyComponent,
        separateRowForValue: false,
        dataTestId: "readStepCsv-timestampFormat",
    },
    "MergeStrategyAppend.__typename": {
        label: "Strategy:",
        tooltip: SourcesTooltipsTexts.MERGE_STRATEGY_APPEND,
        presentationComponent: MergeStrategyPropertyComponent,
        separateRowForValue: false,
        dataTestId: "mergeStrategyAppend-__typename",
    },
    "TransformSql.engine": {
        label: "Engine:",
        tooltip: SourcesTooltipsTexts.ENGINE,
        presentationComponent: EnginePropertyComponent,
        separateRowForValue: false,
        dataTestId: "transformSql-engine",
    },
    "TransformSql.queries": {
        label: "Queries:",
        tooltip: SourcesTooltipsTexts.QUERIES,
        presentationComponent: SqlQueryViewerComponent,
        separateRowForValue: true,
        dataTestId: "transformSql-queries",
    },
    "MergeStrategyLedger.__typename": {
        label: "Strategy:",
        tooltip: SourcesTooltipsTexts.MERGE_STRATEGY_LEDGER,
        presentationComponent: MergeStrategyPropertyComponent,
        separateRowForValue: false,
        dataTestId: "mergeStrategyLedger-__typename",
    },
    "MergeStrategyLedger.primaryKey": {
        label: "Primary key:",
        tooltip: SourcesTooltipsTexts.PRIMARY_KEYS,
        presentationComponent: CardsPropertyComponent,
        separateRowForValue: false,
        dataTestId: "mergeStrategyLedger-primaryKey",
    },
    "MergeStrategyChangelogStream.__typename": {
        label: "Strategy:",
        tooltip: SourcesTooltipsTexts.MERGE_STRATEGY_CHANGELOG_STREAM,
        presentationComponent: MergeStrategyPropertyComponent,
        separateRowForValue: false,
        dataTestId: "mergeStrategyLedger-__typename",
    },
    "MergeStrategyChangelogStream.primaryKey": {
        label: "Primary key:",
        tooltip: SourcesTooltipsTexts.PRIMARY_KEYS,
        presentationComponent: CardsPropertyComponent,
        separateRowForValue: false,
        dataTestId: "mergeStrategyChangelogStream-primaryKey",
    },
    "MergeStrategyUpsertStream.__typename": {
        label: "Strategy:",
        tooltip: SourcesTooltipsTexts.MERGE_STRATEGY_UPSERT_STREAM,
        presentationComponent: MergeStrategyPropertyComponent,
        separateRowForValue: false,
        dataTestId: "mergeStrategyUpsertStream-__typename",
    },
    "MergeStrategyUpsertStream.primaryKey": {
        label: "Primary key:",
        tooltip: SourcesTooltipsTexts.PRIMARY_KEYS,
        presentationComponent: CardsPropertyComponent,
        separateRowForValue: false,
        dataTestId: "mergeStrategyUpsertStream-primaryKey",
    },

    "ReadStepJson.__typename": {
        label: "Type:",
        tooltip: SourcesTooltipsTexts.READ_JSON,
        presentationComponent: StepTypePropertyComponent,
        separateRowForValue: false,
        dataTestId: "ReadStepJson-__typename",
    },
    "ReadStepJson.schema": {
        label: "Schema:",
        tooltip: SourcesTooltipsTexts.SCHEMA,
        presentationComponent: SchemaPropertyComponent,
        separateRowForValue: false,
        dataTestId: "readStepJson-schema",
    },
    "ReadStepJson.encoding": {
        label: "Encoding:",
        tooltip: SourcesTooltipsTexts.READ_JSON_ENCODING,
        presentationComponent: SimplePropertyComponent,
        separateRowForValue: false,
        dataTestId: "readStepJson-encoding",
    },
    "ReadStepJson.dateFormat": {
        label: "Date format:",
        tooltip: SourcesTooltipsTexts.DATE_FORMAT,
        presentationComponent: SimplePropertyComponent,
        separateRowForValue: false,
        dataTestId: "readStepJson-dateFormat",
    },
    "ReadStepNdGeoJson.__typename": {
        label: "Type:",
        tooltip: SourcesTooltipsTexts.READ_ND_GEO_JSON,
        presentationComponent: StepTypePropertyComponent,
        separateRowForValue: false,
        dataTestId: "readStepNdGeoJson-__typename",
    },
    "ReadStepJson.timestampFormat": {
        label: "Timestamp format:",
        tooltip: SourcesTooltipsTexts.TIMESTAMP_FORMAT,
        presentationComponent: SimplePropertyComponent,
        separateRowForValue: false,
        dataTestId: "readStepJson-timestampFormat",
    },
    "ReadStepJson.subPath": {
        label: "SubPath:",
        tooltip: SourcesTooltipsTexts.READ_JSON_SUB_PATH,
        presentationComponent: SimplePropertyComponent,
        separateRowForValue: false,
        dataTestId: "readStepJson-subPath",
    },
    "MergeStrategySnapshot.__typename": {
        label: "Strategy:",
        tooltip: SourcesTooltipsTexts.SNAPSHOT_STRATEGY,
        presentationComponent: MergeStrategyPropertyComponent,
        separateRowForValue: false,
        dataTestId: "mergeStrategySnapshot-__typename",
    },
    "MergeStrategySnapshot.primaryKey": {
        label: "Primary key:",
        tooltip: SourcesTooltipsTexts.PRIMARY_KEYS,
        presentationComponent: CardsPropertyComponent,
        separateRowForValue: false,
        dataTestId: "mergeStrategySnapshot-__primaryKey",
    },
    "MergeStrategySnapshot.compareColumns": {
        label: "Compare columns:",
        tooltip: SourcesTooltipsTexts.COMPARE_COLUMNS,
        presentationComponent: CardsPropertyComponent,
        separateRowForValue: false,
        dataTestId: "mergeStrategySnapshot-compareColumns",
    },
    "ReadStepGeoJson.__typename": {
        label: "Type:",
        tooltip: SourcesTooltipsTexts.READ_GEO_JSON,
        presentationComponent: StepTypePropertyComponent,
        separateRowForValue: false,
        dataTestId: "readStepGeoJson-__typename",
    },
    "ReadStepGeoJson.schema": {
        label: "Schema:",
        tooltip: SourcesTooltipsTexts.SCHEMA,
        presentationComponent: SchemaPropertyComponent,
        separateRowForValue: false,
        dataTestId: "readStepGeoJson-schema",
    },
    "ReadStepEsriShapefile.__typename": {
        label: "Type:",
        tooltip: SourcesTooltipsTexts.READ_ESRI_SHAPE_FILE,
        presentationComponent: StepTypePropertyComponent,
        separateRowForValue: false,
        dataTestId: "readStepEsriShapefile-__typename",
    },
    "ReadStepEsriShapefile.schema": {
        label: "Schema:",
        tooltip: SourcesTooltipsTexts.SCHEMA,
        presentationComponent: SchemaPropertyComponent,
        separateRowForValue: false,
        dataTestId: "readStepEsriShapefile-schema",
    },
    "ReadStepEsriShapefile.subPath": {
        label: "Sub path:",
        tooltip: SourcesTooltipsTexts.SUB_PATH,
        presentationComponent: SimplePropertyComponent,
        separateRowForValue: false,
        dataTestId: "readStepEsriShapefile-subPath",
    },
    "ReadStepParquet.__typename": {
        label: "Type:",
        tooltip: SourcesTooltipsTexts.READ_PARQUET,
        presentationComponent: StepTypePropertyComponent,
        separateRowForValue: false,
        dataTestId: "readStepParquet-__typename",
    },
    "ReadStepParquet.schema": {
        label: "Schema:",
        tooltip: SourcesTooltipsTexts.SCHEMA,
        presentationComponent: SchemaPropertyComponent,
        separateRowForValue: false,
        dataTestId: "readStepParquet-schema",
    },
    "ReadStepNdJson.__typename": {
        label: "Type:",
        tooltip: SourcesTooltipsTexts.READ_ND_JSON,
        presentationComponent: StepTypePropertyComponent,
        separateRowForValue: false,
        dataTestId: "readStepNdJson-__typename",
    },
    "ReadStepNdJson.schema": {
        label: "Schema:",
        tooltip: SourcesTooltipsTexts.SCHEMA,
        presentationComponent: SchemaPropertyComponent,
        separateRowForValue: false,
        dataTestId: "ReadStepNdJson-schema",
    },
    "ReadStepNdGeoJson.schema": {
        label: "Schema:",
        tooltip: SourcesTooltipsTexts.SCHEMA,
        presentationComponent: SchemaPropertyComponent,
        separateRowForValue: false,
        dataTestId: "readStepNdGeoJson-schema",
    },
    "ReadStepNdJson.dateFormat": {
        label: "Date format:",
        tooltip: SourcesTooltipsTexts.DATE_FORMAT,
        presentationComponent: SimplePropertyComponent,
        separateRowForValue: false,
        dataTestId: "readStepNdJson-dateFormat",
    },
    "ReadStepNdJson.encoding": {
        label: "Encoding:",
        tooltip: SourcesTooltipsTexts.READ_JSON_ENCODING,
        presentationComponent: SimplePropertyComponent,
        separateRowForValue: false,
        dataTestId: "readStepNdJson-encoding",
    },
    "ReadStepNdJson.timestampFormat": {
        label: "Timestamp format:",
        tooltip: SourcesTooltipsTexts.TIMESTAMP_FORMAT,
        presentationComponent: SimplePropertyComponent,
        separateRowForValue: false,
        dataTestId: "readStepNdJson-timestampFormat",
    },
};

export function getSourcesDescriptors(key: string): EventRowDescriptor {
    const data = key.split(".");
    const dataTestId = SOURCES_EVENT_DESCRIPTORS[`${data[1]}.${data[2]}`].dataTestId;
    const prefix = data[0][0].toLowerCase() + data[0].slice(1);
    return {
        ...SOURCES_EVENT_DESCRIPTORS[`${data[1]}.${data[2]}`],
        dataTestId: `${prefix}-${dataTestId ? dataTestId : "unknown-key"}`,
    };
}
