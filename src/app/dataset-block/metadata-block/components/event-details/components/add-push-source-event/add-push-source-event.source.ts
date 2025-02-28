/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { EventRowDescriptorsByField } from "../../dynamic-events/dynamic-events.model";
import { SimplePropertyComponent } from "../common/simple-property/simple-property.component";
import { AddPushSourceTooltipsTexts } from "src/app/common/tooltips/add-push-source.text";
import { getSourcesDescriptors } from "../common-sources/sources-event.source";

export const ADD_PUSH_SOURCE_DESCRIPTORS: EventRowDescriptorsByField = {
    "AddPushSource.string.sourceName": {
        label: "Source name:",
        tooltip: AddPushSourceTooltipsTexts.SOURCE_NAME,
        presentationComponent: SimplePropertyComponent,
        separateRowForValue: false,
        dataTestId: "addPushSource-source-name",
    },

    "AddPushSource.ReadStepCsv.__typename": getSourcesDescriptors("AddPushSource.ReadStepCsv.__typename"),

    "AddPushSource.ReadStepCsv.schema": getSourcesDescriptors("AddPushSource.ReadStepCsv.schema"),

    "AddPushSource.ReadStepCsv.separator": getSourcesDescriptors("AddPushSource.ReadStepCsv.separator"),

    "AddPushSource.ReadStepCsv.encoding": getSourcesDescriptors("AddPushSource.ReadStepCsv.encoding"),

    "AddPushSource.ReadStepCsv.quote": getSourcesDescriptors("AddPushSource.ReadStepCsv.quote"),

    "AddPushSource.ReadStepCsv.escape": getSourcesDescriptors("AddPushSource.ReadStepCsv.escape"),

    "AddPushSource.ReadStepCsv.inferSchema": getSourcesDescriptors("AddPushSource.ReadStepCsv.inferSchema"),

    "AddPushSource.ReadStepCsv.header": getSourcesDescriptors("AddPushSource.ReadStepCsv.header"),

    "AddPushSource.ReadStepCsv.nullValue": getSourcesDescriptors("AddPushSource.ReadStepCsv.nullValue"),

    "AddPushSource.ReadStepCsv.dateFormat": getSourcesDescriptors("AddPushSource.ReadStepCsv.dateFormat"),

    "AddPushSource.ReadStepCsv.timestampFormat": getSourcesDescriptors("AddPushSource.ReadStepCsv.timestampFormat"),

    "AddPushSource.MergeStrategyAppend.__typename": getSourcesDescriptors(
        "AddPushSource.MergeStrategyAppend.__typename",
    ),

    "AddPushSource.TransformSql.engine": getSourcesDescriptors("AddPushSource.TransformSql.engine"),

    "AddPushSource.TransformSql.queries": getSourcesDescriptors("AddPushSource.TransformSql.queries"),

    "AddPushSource.MergeStrategyLedger.__typename": getSourcesDescriptors(
        "AddPushSource.MergeStrategyLedger.__typename",
    ),

    "AddPushSource.MergeStrategyLedger.primaryKey": getSourcesDescriptors(
        "AddPushSource.MergeStrategyLedger.primaryKey",
    ),

    "AddPushSource.ReadStepJson.__typename": getSourcesDescriptors("AddPushSource.ReadStepJson.__typename"),

    "AddPushSource.ReadStepJson.schema": getSourcesDescriptors("AddPushSource.ReadStepJson.schema"),

    "AddPushSource.ReadStepJson.encoding": getSourcesDescriptors("AddPushSource.ReadStepJson.encoding"),

    "AddPushSource.ReadStepJson.dateFormat": getSourcesDescriptors("AddPushSource.ReadStepJson.dateFormat"),

    "AddPushSource.ReadStepNdGeoJson.__typename": getSourcesDescriptors("AddPushSource.ReadStepNdGeoJson.__typename"),

    "AddPushSource.ReadStepJson.timestampFormat": getSourcesDescriptors("AddPushSource.ReadStepJson.timestampFormat"),

    "AddPushSource.ReadStepJson.subPath": getSourcesDescriptors("AddPushSource.ReadStepJson.subPath"),

    "AddPushSource.MergeStrategySnapshot.__typename": getSourcesDescriptors(
        "AddPushSource.MergeStrategySnapshot.__typename",
    ),

    "AddPushSource.MergeStrategySnapshot.primaryKey": getSourcesDescriptors(
        "AddPushSource.MergeStrategySnapshot.primaryKey",
    ),

    "AddPushSource.MergeStrategySnapshot.compareColumns": getSourcesDescriptors(
        "AddPushSource.MergeStrategySnapshot.compareColumns",
    ),

    "AddPushSource.ReadStepGeoJson.__typename": getSourcesDescriptors("AddPushSource.ReadStepGeoJson.__typename"),

    "AddPushSource.ReadStepGeoJson.schema": getSourcesDescriptors("AddPushSource.ReadStepGeoJson.schema"),

    "AddPushSource.ReadStepEsriShapefile.__typename": getSourcesDescriptors(
        "AddPushSource.ReadStepEsriShapefile.__typename",
    ),

    "AddPushSource.ReadStepEsriShapefile.schema": getSourcesDescriptors("AddPushSource.ReadStepEsriShapefile.schema"),

    "AddPushSource.ReadStepEsriShapefile.subPath": getSourcesDescriptors("AddPushSource.ReadStepEsriShapefile.subPath"),

    "AddPushSource.ReadStepParquet.__typename": getSourcesDescriptors("AddPushSource.ReadStepParquet.__typename"),

    "AddPushSource.ReadStepParquet.schema": getSourcesDescriptors("AddPushSource.ReadStepParquet.schema"),

    "AddPushSource.ReadStepNdJson.__typename": getSourcesDescriptors("AddPushSource.ReadStepNdJson.__typename"),

    "AddPushSource.ReadStepNdGeoJson.schema": getSourcesDescriptors("AddPushSource.ReadStepNdGeoJson.schema"),

    "AddPushSource.ReadStepNdJson.dateFormat": getSourcesDescriptors("AddPushSource.ReadStepNdJson.dateFormat"),

    "AddPushSource.ReadStepNdJson.encoding": getSourcesDescriptors("AddPushSource.ReadStepNdJson.encoding"),

    "AddPushSource.ReadStepNdJson.timestampFormat": getSourcesDescriptors(
        "AddPushSource.ReadStepNdJson.timestampFormat",
    ),
};
