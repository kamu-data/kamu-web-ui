/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { LinkPropertyComponent } from "../common/link-property/link-property.component";
import { SimplePropertyComponent } from "../common/simple-property/simple-property.component";
import { EnvVariablesPropertyComponent } from "../common/env-variables-property/env-variables-property.component";
import { CardsPropertyComponent } from "../common/cards-property/cards-property.component";
import { EventRowDescriptorsByField } from "../../dynamic-events/dynamic-events.model";
import { SetPollingSourceTooltipsTexts } from "src/app/common/tooltips/set-polling-source-tooltips.text";
import { EventTimePropertyComponent } from "../common/event-time-property/event-time-property.component";
import { CachePropertyComponent } from "../common/cache-property/cache-property.component";
import { OrderPropertyComponent } from "../common/order-property/order-property.component";
import { CommandPropertyComponent } from "../common/command-property/command-property.component";
import { StepTypePropertyComponent } from "../common/step-type-property/step-type-property.component";
import { SourcesTooltipsTexts } from "src/app/common/tooltips/sources.text";
import { getSourcesDescriptors } from "../common-sources/sources-event.source";
import { TopicsPropertyComponent } from "../common/topics-property/topics-property.component";
import { YamlEventViewerComponent } from "../../../../../../common/components/yaml-event-viewer/yaml-event-viewer.component";

export const SET_POLLING_SOURCE_DESCRIPTORS: EventRowDescriptorsByField = {
    "SetPollingSource.FetchStepUrl.__typename": {
        label: "Type:",
        tooltip: SetPollingSourceTooltipsTexts.FROM_URL,
        presentationComponent: StepTypePropertyComponent,
        separateRowForValue: false,
        dataTestId: "setPollingSource-FetchStepUrl-__typename",
    },

    "SetPollingSource.FetchStepUrl.url": {
        label: "Url:",
        tooltip: SetPollingSourceTooltipsTexts.URL,
        presentationComponent: LinkPropertyComponent,
        separateRowForValue: false,
        dataTestId: "setPollingSource-fetchStepUrl-url",
    },

    "SetPollingSource.FetchStepUrl.eventTime": {
        label: "Event time:",
        tooltip: SetPollingSourceTooltipsTexts.EVENT_TIME,
        presentationComponent: EventTimePropertyComponent,
        separateRowForValue: false,
        dataTestId: "setPollingSource-fetchStepUrl-eventTime",
    },

    "SetPollingSource.FetchStepUrl.headers": {
        label: "Headers:",
        tooltip: SourcesTooltipsTexts.HEADERS,
        presentationComponent: EnvVariablesPropertyComponent,
        separateRowForValue: false,
        dataTestId: "setPollingSource-fetchStepUrl-headers",
    },

    "SetPollingSource.FetchStepUrl.cache": {
        label: "Cache:",
        tooltip: SetPollingSourceTooltipsTexts.CACHE,
        presentationComponent: CachePropertyComponent,
        separateRowForValue: false,
        dataTestId: "setPollingSource-fetchStepUrl-cache",
    },

    "SetPollingSource.FetchStepMqtt.__typename": {
        label: "Type:",
        tooltip: SetPollingSourceTooltipsTexts.FROM_MQTT,
        presentationComponent: StepTypePropertyComponent,
        separateRowForValue: false,
        dataTestId: "setPollingSource-FetchStepMqtt-__typename",
    },

    "SetPollingSource.FetchStepMqtt.host": {
        label: "Host:",
        tooltip: SetPollingSourceTooltipsTexts.MQTT_HOST,
        presentationComponent: SimplePropertyComponent,
        separateRowForValue: false,
        dataTestId: "setPollingSource-FetchStepMqtt-host",
    },

    "SetPollingSource.FetchStepMqtt.port": {
        label: "Port:",
        tooltip: SetPollingSourceTooltipsTexts.MQTT_PORT,
        presentationComponent: SimplePropertyComponent,
        separateRowForValue: false,
        dataTestId: "setPollingSource-FetchStepMqtt-port",
    },

    "SetPollingSource.FetchStepMqtt.username": {
        label: "Username:",
        tooltip: SetPollingSourceTooltipsTexts.MQTT_USERNAME,
        presentationComponent: SimplePropertyComponent,
        separateRowForValue: false,
        dataTestId: "setPollingSource-FetchStepMqtt-username",
    },

    "SetPollingSource.FetchStepMqtt.password": {
        label: "Password:",
        tooltip: SetPollingSourceTooltipsTexts.MQTT_PASSWORD,
        presentationComponent: SimplePropertyComponent,
        separateRowForValue: false,
        dataTestId: "setPollingSource-FetchStepMqtt-password",
    },

    "SetPollingSource.FetchStepMqtt.topics": {
        label: "Topics:",
        tooltip: SetPollingSourceTooltipsTexts.MQTT_TOPICS,
        presentationComponent: TopicsPropertyComponent,
        separateRowForValue: false,
        dataTestId: "setPollingSource-FetchStepMqtt-topics",
    },

    "SetPollingSource.FetchStepEthereumLogs.__typename": {
        label: "Type:",
        tooltip: SetPollingSourceTooltipsTexts.FROM_ETHEREUM_LOGS,
        presentationComponent: StepTypePropertyComponent,
        separateRowForValue: false,
        dataTestId: "setPollingSource-FetchStepEthereumLogs-__typename",
    },

    "SetPollingSource.FetchStepEthereumLogs.chainId": {
        label: "Chain ID:",
        tooltip: SetPollingSourceTooltipsTexts.ETHEREUM_LOGS_CHAIN_ID,
        presentationComponent: SimplePropertyComponent,
        separateRowForValue: false,
        dataTestId: "setPollingSource-FetchStepEthereumLogs-chainId",
    },

    "SetPollingSource.FetchStepEthereumLogs.filter": {
        label: "Filter:",
        tooltip: SetPollingSourceTooltipsTexts.ETHEREUM_LOGS_FILTER,
        presentationComponent: YamlEventViewerComponent,
        separateRowForValue: true,
        dataTestId: "setPollingSource-FetchStepEthereumLogs-filter",
    },

    "SetPollingSource.FetchStepEthereumLogs.signature": {
        label: "Signature:",
        tooltip: SetPollingSourceTooltipsTexts.ETHEREUM_LOGS_SIGNATURE,
        presentationComponent: YamlEventViewerComponent,
        separateRowForValue: true,
        dataTestId: "setPollingSource-FetchStepEthereumLogs-signature",
    },

    "SetPollingSource.FetchStepEthereumLogs.nodeUrl": {
        label: "Node url:",
        tooltip: SetPollingSourceTooltipsTexts.ETHEREUM_LOGS_NODE_URL,
        presentationComponent: LinkPropertyComponent,
        separateRowForValue: false,
        dataTestId: "setPollingSource-FetchStepEthereumLogs-nodeUrl",
    },

    "SetPollingSource.FetchStepFilesGlob.__typename": {
        label: "Type:",
        tooltip: SetPollingSourceTooltipsTexts.FROM_FILES_GLOB,
        presentationComponent: StepTypePropertyComponent,
        separateRowForValue: false,
        dataTestId: "setPollingSource-FetchStepFilesGlob-__typename",
    },

    "SetPollingSource.FetchStepFilesGlob.path": {
        label: "Path:",
        tooltip: SetPollingSourceTooltipsTexts.PATH,
        presentationComponent: SimplePropertyComponent,
        separateRowForValue: false,
        dataTestId: "setPollingSource-FetchStepFilesGlob-path",
    },

    "SetPollingSource.FetchStepFilesGlob.eventTime": {
        label: "Event time:",
        tooltip: SetPollingSourceTooltipsTexts.EVENT_TIME,
        presentationComponent: EventTimePropertyComponent,
        separateRowForValue: false,
        dataTestId: "setPollingSource-FetchStepFilesGlob-eventTime",
    },

    "SetPollingSource.FetchStepFilesGlob.cache": {
        label: "Cache:",
        tooltip: SetPollingSourceTooltipsTexts.CACHE,
        presentationComponent: CachePropertyComponent,
        separateRowForValue: false,
        dataTestId: "setPollingSource-FetchStepFilesGlob-cache",
    },

    "SetPollingSource.FetchStepFilesGlob.order": {
        label: "Order:",
        tooltip: SetPollingSourceTooltipsTexts.ORDER,
        presentationComponent: OrderPropertyComponent,
        separateRowForValue: false,
        dataTestId: "setPollingSource-FetchStepFilesGlob-order",
    },

    "SetPollingSource.FetchStepContainer.__typename": {
        label: "Type:",
        tooltip: SetPollingSourceTooltipsTexts.FROM_CONTAINER,
        presentationComponent: StepTypePropertyComponent,
        separateRowForValue: false,
        dataTestId: "setPollingSource-FetchStepContainer-__typename",
    },

    "SetPollingSource.FetchStepContainer.image": {
        label: "Image:",
        tooltip: SetPollingSourceTooltipsTexts.IMAGE,
        presentationComponent: SimplePropertyComponent,
        separateRowForValue: false,
        dataTestId: "setPollingSource-fetchStepContainer-image",
    },

    "SetPollingSource.FetchStepContainer.command": {
        label: "Commands:",
        tooltip: SetPollingSourceTooltipsTexts.ENVIRONMENT_VARIABLES,
        presentationComponent: CardsPropertyComponent,
        separateRowForValue: false,
        dataTestId: "setPollingSource-fetchStepContainer-command",
    },

    "SetPollingSource.FetchStepContainer.args": {
        label: "Arguments:",
        tooltip: SetPollingSourceTooltipsTexts.ARGUMENTS,
        presentationComponent: CardsPropertyComponent,
        separateRowForValue: false,
        dataTestId: "setPollingSource-fetchStepContainer-args",
    },

    "SetPollingSource.FetchStepContainer.env": {
        label: "Environment variables:",
        tooltip: SetPollingSourceTooltipsTexts.ENVIRONMENT_VARIABLES,
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

    "SetPollingSource.MergeStrategyChangelogStream.__typename": getSourcesDescriptors(
        "SetPollingSource.MergeStrategyAppend.__typename",
    ),

    "SetPollingSource.MergeStrategyChangelogStream.primaryKey": getSourcesDescriptors(
        "SetPollingSource.MergeStrategyLedger.primaryKey",
    ),

    "SetPollingSource.MergeStrategyUpsertStream.__typename": getSourcesDescriptors(
        "SetPollingSource.MergeStrategyAppend.__typename",
    ),

    "SetPollingSource.MergeStrategyUpsertStream.primaryKey": getSourcesDescriptors(
        "SetPollingSource.MergeStrategyLedger.primaryKey",
    ),

    "SetPollingSource.TransformSql.engine": getSourcesDescriptors("SetPollingSource.TransformSql.engine"),

    "SetPollingSource.TransformSql.queries": getSourcesDescriptors("SetPollingSource.TransformSql.queries"),

    "SetPollingSource.ReadStepCsv.__typename": getSourcesDescriptors("SetPollingSource.ReadStepCsv.__typename"),

    "SetPollingSource.ReadStepCsv.separator": getSourcesDescriptors("SetPollingSource.ReadStepCsv.separator"),

    "SetPollingSource.ReadStepCsv.schema": getSourcesDescriptors("SetPollingSource.ReadStepCsv.schema"),

    "SetPollingSource.ReadStepCsv.encoding": getSourcesDescriptors("SetPollingSource.ReadStepCsv.encoding"),

    "SetPollingSource.ReadStepCsv.quote": getSourcesDescriptors("SetPollingSource.ReadStepCsv.quote"),

    "SetPollingSource.ReadStepCsv.escape": getSourcesDescriptors("SetPollingSource.ReadStepCsv.escape"),

    "SetPollingSource.ReadStepCsv.header": getSourcesDescriptors("SetPollingSource.ReadStepCsv.header"),

    "SetPollingSource.ReadStepCsv.inferSchema": getSourcesDescriptors("SetPollingSource.ReadStepCsv.inferSchema"),

    "SetPollingSource.ReadStepCsv.nullValue": getSourcesDescriptors("SetPollingSource.ReadStepCsv.nullValue"),

    "SetPollingSource.ReadStepCsv.dateFormat": getSourcesDescriptors("SetPollingSource.ReadStepCsv.dateFormat"),

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

    "SetPollingSource.ReadStepNdJson.schema": getSourcesDescriptors("SetPollingSource.ReadStepNdJson.schema"),

    "SetPollingSource.ReadStepNdJson.timestampFormat": getSourcesDescriptors(
        "SetPollingSource.ReadStepNdJson.timestampFormat",
    ),

    "SetPollingSource.ReadStepGeoJson.schema": getSourcesDescriptors("SetPollingSource.ReadStepGeoJson.schema"),

    "SetPollingSource.ReadStepCsv.timestampFormat": getSourcesDescriptors(
        "SetPollingSource.ReadStepCsv.timestampFormat",
    ),

    "SetPollingSource.PrepStepDecompress.format": {
        label: "Format:",
        tooltip: SetPollingSourceTooltipsTexts.DECOMPRESS_FORMAT,
        presentationComponent: SimplePropertyComponent,
        separateRowForValue: false,
        dataTestId: "setPollingSource-prepStepDecompress-format",
    },

    "SetPollingSource.PrepStepDecompress.subPath": {
        label: "SubPath:",
        tooltip: SetPollingSourceTooltipsTexts.DECOMPRESS_SUB_PATH,
        presentationComponent: LinkPropertyComponent,
        separateRowForValue: false,
        dataTestId: "setPollingSource-prepStepDecompress-subPath",
    },

    "SetPollingSource.PrepStepPipe.command": {
        label: "Command:",
        tooltip: SetPollingSourceTooltipsTexts.COMMAND,
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

    "SetPollingSource.ReadStepEsriShapefile.__typename": getSourcesDescriptors(
        "SetPollingSource.ReadStepEsriShapefile.__typename",
    ),

    "SetPollingSource.ReadStepEsriShapefile.schema": getSourcesDescriptors(
        "SetPollingSource.ReadStepEsriShapefile.schema",
    ),

    "SetPollingSource.ReadStepEsriShapefile.subPath": getSourcesDescriptors(
        "SetPollingSource.ReadStepEsriShapefile.subPath",
    ),

    "SetPollingSource.ReadStepParquet.__typename": getSourcesDescriptors("SetPollingSource.ReadStepParquet.__typename"),

    "SetPollingSource.ReadStepParquet.schema": getSourcesDescriptors("SetPollingSource.ReadStepParquet.schema"),
};
