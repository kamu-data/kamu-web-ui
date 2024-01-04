import { EventRowDescriptorsByField } from "../../dynamic-events/dynamic-events.model";
import { SimplePropertyComponent } from "../common/simple-property/simple-property.component";
import { AddPushSourceToolipsTexts } from "src/app/common/tooltips/add-push-source.text";
import { getSourcesDescriptors } from "../common-sources/sources-event.source";

export const ADD_PUSH_SOURCE_DESCRIPTORS: EventRowDescriptorsByField = {
    "AddPushSource.string.sourceName": {
        label: "Source name:",
        tooltip: AddPushSourceToolipsTexts.SOURCE_NAME,
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

    "AddPushSource.ReadStepCsv.comment": getSourcesDescriptors("AddPushSource.ReadStepCsv.comment"),

    "AddPushSource.ReadStepCsv.enforceSchema": getSourcesDescriptors("AddPushSource.ReadStepCsv.enforceSchema"),

    "AddPushSource.ReadStepCsv.inferSchema": getSourcesDescriptors("AddPushSource.ReadStepCsv.inferSchema"),

    "AddPushSource.ReadStepCsv.header": getSourcesDescriptors("AddPushSource.ReadStepCsv.header"),

    "AddPushSource.ReadStepCsv.ignoreLeadingWhiteSpace": getSourcesDescriptors(
        "AddPushSource.ReadStepCsv.ignoreLeadingWhiteSpace",
    ),

    "AddPushSource.ReadStepCsv.ignoreTrailingWhiteSpace": getSourcesDescriptors(
        "AddPushSource.ReadStepCsv.ignoreTrailingWhiteSpace",
    ),

    "AddPushSource.ReadStepCsv.nullValue": getSourcesDescriptors("AddPushSource.ReadStepCsv.nullValue"),

    "AddPushSource.ReadStepCsv.emptyValue": getSourcesDescriptors("AddPushSource.ReadStepCsv.emptyValue"),

    "AddPushSource.ReadStepCsv.nanValue": getSourcesDescriptors("AddPushSource.ReadStepCsv.nanValue"),

    "AddPushSource.ReadStepCsv.positiveInf": getSourcesDescriptors("AddPushSource.ReadStepCsv.positiveInf"),

    "AddPushSource.ReadStepCsv.negativeInf": getSourcesDescriptors("AddPushSource.ReadStepCsv.negativeInf"),

    "AddPushSource.ReadStepCsv.dateFormat": getSourcesDescriptors("AddPushSource.ReadStepCsv.dateFormat"),

    "AddPushSource.ReadStepCsv.multiLine": getSourcesDescriptors("AddPushSource.ReadStepCsv.multiLine"),

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

    "AddPushSource.MergeStrategySnapshot.observationColumn": getSourcesDescriptors(
        "AddPushSource.MergeStrategySnapshot.observationColumn",
    ),

    "AddPushSource.MergeStrategySnapshot.obsvAdded": getSourcesDescriptors(
        "AddPushSource.MergeStrategySnapshot.obsvAdded",
    ),

    "AddPushSource.MergeStrategySnapshot.obsvChanged": getSourcesDescriptors(
        "AddPushSource.MergeStrategySnapshot.obsvChanged",
    ),

    "AddPushSource.MergeStrategySnapshot.obsvRemoved": getSourcesDescriptors(
        "AddPushSource.MergeStrategySnapshot.obsvRemoved",
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

    "AddPushSource.ReadStepJsonLines.__typename": getSourcesDescriptors("AddPushSource.ReadStepJsonLines.__typename"),

    "AddPushSource.ReadStepNdJson.__typename": getSourcesDescriptors("AddPushSource.ReadStepNdJson.__typename"),

    "AddPushSource.ReadStepJsonLines.primitivesAsString": getSourcesDescriptors(
        "AddPushSource.ReadStepJsonLines.primitivesAsString",
    ),

    "AddPushSource.ReadStepJsonLines.schema": getSourcesDescriptors("AddPushSource.ReadStepJsonLines.schema"),

    "AddPushSource.ReadStepNdGeoJson.schema": getSourcesDescriptors("AddPushSource.ReadStepNdGeoJson.schema"),

    "AddPushSource.ReadStepNdJson.dateFormat": getSourcesDescriptors("AddPushSource.ReadStepNdJson.dateFormat"),

    "AddPushSource.ReadStepNdJson.encoding": getSourcesDescriptors("AddPushSource.ReadStepNdJson.encoding"),

    "AddPushSource.ReadStepNdJson.timestampFormat": getSourcesDescriptors(
        "AddPushSource.ReadStepNdJson.timestampFormat",
    ),

    "AddPushSource.ReadStepJsonLines.dateFormat": getSourcesDescriptors("AddPushSource.ReadStepJsonLines.dateFormat"),

    "AddPushSource.ReadStepJsonLines.encoding": getSourcesDescriptors("AddPushSource.ReadStepJsonLines.encoding"),

    "AddPushSource.ReadStepJsonLines.timestampFormat": getSourcesDescriptors(
        "AddPushSource.ReadStepJsonLines.timestampFormat",
    ),
};
