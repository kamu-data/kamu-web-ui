import { LinkPropertyComponent } from "../common/link-property/link-property.component";
import { SimplePropertyComponent } from "../common/simple-property/simple-property.component";
import { EnvVariablesPropertyComponent } from "../common/env-variables-property/env-variables-property.component";
import { CardsPropertyComponent } from "../common/cards-property/cards-property.component";
import { EventRowDescriptorsByField } from "../../dynamic-events/dynamic-events.model";
import { SetPollingSourceToolipsTexts } from "src/app/common/tooltips/tooltips.text";
import { EventTimePropertyComponent } from "../common/event-time-property/event-time-property.component";
import { CachePropertyComponent } from "../common/cache-property/cache-property.component";
import { OrderPropertyComponent } from "../common/order-property/order-property.component";
import { CommandPropertyComponent } from "../common/command-property/command-property.component";
import { StepTypePropertyComponent } from "../common/step-type-property/step-type-property.component";
import { SourcesToolipsTexts } from "src/app/common/tooltips/sources.text";
import { getSourcesDescriptors } from "../common-sources/sources-event.source";

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

    "SetPollingSource.MergeStrategyLedger.__typename": getSourcesDescriptors(
        "SetPollingSource.MergeStrategyLedger.__typename",
    ),

    "SetPollingSource.MergeStrategyAppend.__typename": getSourcesDescriptors(
        "SetPollingSource.MergeStrategyAppend.__typename",
    ),

    "SetPollingSource.MergeStrategyLedger.primaryKey": getSourcesDescriptors(
        "SetPollingSource.MergeStrategyLedger.primaryKey",
    ),

    "SetPollingSource.TransformSql.engine": getSourcesDescriptors("SetPollingSource.TransformSql.engine"),

    "SetPollingSource.TransformSql.queries": getSourcesDescriptors("SetPollingSource.TransformSql.queries"),

    "SetPollingSource.ReadStepJsonLines.__typename": getSourcesDescriptors(
        "SetPollingSource.ReadStepJsonLines.__typename",
    ),

    "SetPollingSource.ReadStepJsonLines.schema": getSourcesDescriptors("SetPollingSource.ReadStepJsonLines.schema"),

    "SetPollingSource.ReadStepCsv.__typename": getSourcesDescriptors("SetPollingSource.ReadStepCsv.__typename"),

    "SetPollingSource.ReadStepCsv.separator": getSourcesDescriptors("SetPollingSource.ReadStepCsv.separator"),

    "SetPollingSource.ReadStepCsv.schema": getSourcesDescriptors("SetPollingSource.ReadStepCsv.schema"),

    "SetPollingSource.ReadStepCsv.encoding": getSourcesDescriptors("SetPollingSource.ReadStepCsv.encoding"),

    "SetPollingSource.ReadStepCsv.quote": getSourcesDescriptors("SetPollingSource.ReadStepCsv.quote"),

    "SetPollingSource.ReadStepCsv.escape": getSourcesDescriptors("SetPollingSource.ReadStepCsv.escape"),

    "SetPollingSource.ReadStepCsv.comment": getSourcesDescriptors("SetPollingSource.ReadStepCsv.comment"),

    "SetPollingSource.ReadStepCsv.header": getSourcesDescriptors("SetPollingSource.ReadStepCsv.header"),

    "SetPollingSource.ReadStepCsv.enforceSchema": getSourcesDescriptors("SetPollingSource.ReadStepCsv.enforceSchema"),

    "SetPollingSource.ReadStepCsv.inferSchema": getSourcesDescriptors("SetPollingSource.ReadStepCsv.inferSchema"),

    "SetPollingSource.ReadStepCsv.ignoreLeadingWhiteSpace": getSourcesDescriptors(
        "SetPollingSource.ReadStepCsv.ignoreLeadingWhiteSpace",
    ),

    "SetPollingSource.ReadStepCsv.ignoreTrailingWhiteSpace": getSourcesDescriptors(
        "SetPollingSource.ReadStepCsv.ignoreTrailingWhiteSpace",
    ),

    "SetPollingSource.ReadStepCsv.nullValue": getSourcesDescriptors("SetPollingSource.ReadStepCsv.nullValue"),

    "SetPollingSource.ReadStepCsv.emptyValue": getSourcesDescriptors("SetPollingSource.ReadStepCsv.emptyValue"),

    "SetPollingSource.ReadStepCsv.nanValue": getSourcesDescriptors("SetPollingSource.ReadStepCsv.nanValue"),

    "SetPollingSource.ReadStepCsv.positiveInf": getSourcesDescriptors("SetPollingSource.ReadStepCsv.positiveInf"),

    "SetPollingSource.ReadStepCsv.negativeInf": getSourcesDescriptors("SetPollingSource.ReadStepCsv.negativeInf"),

    "SetPollingSource.ReadStepCsv.dateFormat": getSourcesDescriptors("SetPollingSource.ReadStepCsv.dateFormat"),

    "SetPollingSource.ReadStepCsv.multiLine": getSourcesDescriptors("SetPollingSource.ReadStepCsv.multiLine"),

    "SetPollingSource.ReadStepGeoJson.__typename": getSourcesDescriptors("SetPollingSource.ReadStepGeoJson.__typename"),

    "SetPollingSource.ReadStepNdGeoJson.__typename": getSourcesDescriptors(
        "SetPollingSource.ReadStepNdGeoJson.__typename",
    ),

    "SetPollingSource.ReadStepNdGeoJson.schema": getSourcesDescriptors("SetPollingSource.ReadStepNdGeoJson.schema"),

    "SetPollingSource.ReadStepJson.__typename": getSourcesDescriptors("SetPollingSource.ReadStepJson.__typename"),

    "SetPollingSource.ReadStepJson.schema": getSourcesDescriptors("SetPollingSource.ReadStepJson.schema"),

    "SetPollingSource.ReadStepJson.encoding": getSourcesDescriptors("SetPollingSource.ReadStepJson.encoding"),

    "SetPollingSource.ReadStepJson.dateFormat": getSourcesDescriptors("SetPollingSource.ReadStepJson.dateFormat"),

    "SetPollingSource.ReadStepJson.timestampFormat": getSourcesDescriptors(
        "SetPollingSource.ReadStepJson.timestampFormat",
    ),

    "SetPollingSource.ReadStepJson.subPath": getSourcesDescriptors("SetPollingSource.ReadStepJson.subPath"),

    "SetPollingSource.ReadStepNdJson.__typename": getSourcesDescriptors("SetPollingSource.ReadStepNdJson.__typename"),

    "SetPollingSource.ReadStepNdJson.dateFormat": getSourcesDescriptors("SetPollingSource.ReadStepNdJson.dateFormat"),

    "SetPollingSource.ReadStepNdJson.encoding": getSourcesDescriptors("SetPollingSource.ReadStepNdJson.encoding"),

    "SetPollingSource.ReadStepNdJson.timestampFormat": getSourcesDescriptors(
        "SetPollingSource.ReadStepNdJson.timestampFormat",
    ),

    "SetPollingSource.ReadStepGeoJson.schema": getSourcesDescriptors("SetPollingSource.ReadStepGeoJson.schema"),

    "SetPollingSource.ReadStepCsv.timestampFormat": getSourcesDescriptors(
        "SetPollingSource.ReadStepCsv.timestampFormat",
    ),

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

    "SetPollingSource.MergeStrategySnapshot.__typename": getSourcesDescriptors(
        "SetPollingSource.MergeStrategySnapshot.__typename",
    ),

    "SetPollingSource.MergeStrategySnapshot.primaryKey": getSourcesDescriptors(
        "SetPollingSource.MergeStrategySnapshot.primaryKey",
    ),

    "SetPollingSource.MergeStrategySnapshot.compareColumns": getSourcesDescriptors(
        "SetPollingSource.MergeStrategySnapshot.compareColumns",
    ),

    "SetPollingSource.MergeStrategySnapshot.observationColumn": getSourcesDescriptors(
        "SetPollingSource.MergeStrategySnapshot.observationColumn",
    ),

    "SetPollingSource.MergeStrategySnapshot.obsvAdded": getSourcesDescriptors(
        "SetPollingSource.MergeStrategySnapshot.obsvAdded",
    ),

    "SetPollingSource.MergeStrategySnapshot.obsvChanged": getSourcesDescriptors(
        "SetPollingSource.MergeStrategySnapshot.obsvChanged",
    ),

    "SetPollingSource.MergeStrategySnapshot.obsvRemoved": getSourcesDescriptors(
        "SetPollingSource.MergeStrategySnapshot.obsvRemoved",
    ),

    "SetPollingSource.ReadStepEsriShapefile.__typename": getSourcesDescriptors(
        "SetPollingSource.ReadStepEsriShapefile.__typename",
    ),

    "SetPollingSource.ReadStepEsriShapefile.schema": getSourcesDescriptors(
        "SetPollingSource.ReadStepEsriShapefile.schema",
    ),

    "SetPollingSource.ReadStepEsriShapefile.subPath": getSourcesDescriptors(
        "SetPollingSource.ReadStepEsriShapefile.subPath",
    ),

    "SetPollingSource.ReadStepJsonLines.dateFormat": getSourcesDescriptors(
        "SetPollingSource.ReadStepJsonLines.dateFormat",
    ),

    "SetPollingSource.ReadStepJsonLines.encoding": getSourcesDescriptors("SetPollingSource.ReadStepJsonLines.encoding"),

    "SetPollingSource.ReadStepJsonLines.multiLine": getSourcesDescriptors(
        "SetPollingSource.ReadStepJsonLines.multiLine",
    ),

    "SetPollingSource.ReadStepJsonLines.primitivesAsString": getSourcesDescriptors(
        "SetPollingSource.ReadStepJsonLines.primitivesAsString",
    ),

    "SetPollingSource.ReadStepJsonLines.timestampFormat": getSourcesDescriptors(
        "SetPollingSource.ReadStepJsonLines.timestampFormat",
    ),

    "SetPollingSource.ReadStepParquet.__typename": getSourcesDescriptors("SetPollingSource.ReadStepParquet.__typename"),

    "SetPollingSource.ReadStepParquet.schema": getSourcesDescriptors("SetPollingSource.ReadStepParquet.schema"),
};
