/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { SetPollingSourceTooltipsTexts } from "@common/tooltips/set-polling-source-tooltips.text";
import { SourcesTooltipsTexts } from "@common/tooltips/sources.text";
import { integerInRangeValidators } from "@common/validation/number.validators";
import { urlValidator } from "@common/validation/url.validators";

import { ControlType } from "src/app/dataset-view/additional-components/metadata-component/components/source-events/add-polling-source/add-polling-source-form.types";
import { SourceOrder } from "src/app/dataset-view/additional-components/metadata-component/components/source-events/add-polling-source/process-form.service.types";
import {
    FetchControls,
    JsonFormData,
} from "src/app/dataset-view/additional-components/metadata-component/components/source-events/source-event-controls.types";
import {
    eventTimeControl,
    nameValueListControl,
    numberInputControl,
    textListControl,
    topicListControl,
    valueControl,
} from "src/app/dataset-view/additional-components/metadata-component/components/source-events/source-section";

export const FETCH_FORM_DATA: JsonFormData<FetchControls> = {
    Url: {
        controls: [
            {
                name: "url",
                create: valueControl(""),
                label: "Url",
                type: ControlType.TEXT,
                placeholder: "Enter url",
                tooltip: SetPollingSourceTooltipsTexts.URL,
                required: true,
                validators: [urlValidator(["http", "https"])],
            },
            {
                name: "eventTime",
                create: eventTimeControl(),
                label: "Event time",
                type: ControlType.EVENT_TIME,
                tooltip: SetPollingSourceTooltipsTexts.EVENT_TIME,
                options: {
                    innerTooltips: {
                        fromMetadata: SetPollingSourceTooltipsTexts.EVENT_TIME_FROM_METADATA,
                        fromPath: SetPollingSourceTooltipsTexts.EVENT_TIME_FROM_PATH,
                        fromSystemTime: SetPollingSourceTooltipsTexts.EVENT_TIME_SYSTEM_TIME,
                    },
                },
            },
            {
                name: "headers",
                create: nameValueListControl(),
                label: "Headers",
                type: ControlType.ARRAY_KEY_VALUE,
                tooltip: SourcesTooltipsTexts.HEADERS,
                options: {
                    buttonText: "+ Add headers",
                },
            },
            {
                name: "cache",
                create: valueControl(false),
                label: "Use cache",
                tooltip: SetPollingSourceTooltipsTexts.CACHE,
                type: ControlType.CACHE,
            },
        ],
    },
    FilesGlob: {
        controls: [
            {
                name: "path",
                create: valueControl(""),
                label: "Path",
                type: ControlType.TEXT,
                placeholder: "Enter path",
                tooltip: SetPollingSourceTooltipsTexts.PATH,
                required: true,
            },

            {
                name: "order",
                create: valueControl(SourceOrder.NONE),
                label: "Order",
                type: ControlType.ORDER,
                tooltip: SetPollingSourceTooltipsTexts.PATH,
            },
            {
                name: "eventTime",
                create: eventTimeControl(),
                label: "Event time",
                type: ControlType.EVENT_TIME,
                tooltip: SetPollingSourceTooltipsTexts.EVENT_TIME,
                options: {
                    innerTooltips: {
                        fromMetadata: SetPollingSourceTooltipsTexts.EVENT_TIME_FROM_METADATA,
                        fromPath: SetPollingSourceTooltipsTexts.EVENT_TIME_FROM_PATH,
                    },
                },
            },
            {
                name: "cache",
                create: valueControl(false),
                label: "Use cache",
                type: ControlType.CACHE,
                tooltip: SetPollingSourceTooltipsTexts.CACHE,
            },
        ],
    },
    Container: {
        controls: [
            {
                name: "image",
                create: valueControl(""),
                label: "Image",
                type: ControlType.TEXT,
                placeholder: "Enter image..",
                tooltip: SetPollingSourceTooltipsTexts.IMAGE,
                required: true,
            },
            {
                name: "command",
                create: textListControl(),
                label: "Commands",
                placeholder: "Enter command...",
                type: ControlType.ARRAY_KEY,
                tooltip: SetPollingSourceTooltipsTexts.COMMANDS,
                options: {
                    buttonText: "+ Add command",
                },
            },
            {
                name: "args",
                create: textListControl(),
                label: "Arguments",
                placeholder: "Enter argument...",
                type: ControlType.ARRAY_KEY,
                tooltip: SetPollingSourceTooltipsTexts.ARGUMENTS,
                options: {
                    buttonText: "+ Add argument",
                },
            },

            {
                name: "env",
                create: nameValueListControl(),
                label: "Environment variables",
                type: ControlType.ARRAY_KEY_VALUE,
                tooltip: SetPollingSourceTooltipsTexts.ENVIRONMENT_VARIABLES,
                options: {
                    buttonText: "+ Add variable",
                },
            },
        ],
    },
    Mqtt: {
        controls: [
            {
                name: "host",
                create: valueControl(""),
                label: "Host",
                type: ControlType.TEXT,
                placeholder: "Enter host",
                tooltip: SetPollingSourceTooltipsTexts.MQTT_HOST,
                required: true,
            },
            {
                name: "port",
                create: numberInputControl(),
                label: "Port",
                type: ControlType.NUMBER,
                placeholder: "Enter port",
                tooltip: SetPollingSourceTooltipsTexts.MQTT_PORT,
                required: true,
            },
            {
                name: "username",
                create: valueControl(""),
                label: "Username",
                type: ControlType.TEXT,
                placeholder: "Enter username",
                tooltip: SetPollingSourceTooltipsTexts.MQTT_USERNAME,
            },
            {
                name: "password",
                create: valueControl(""),
                label: "Password",
                type: ControlType.TEXT,
                placeholder: "Enter password",
                tooltip: SetPollingSourceTooltipsTexts.MQTT_PASSWORD,
            },
            {
                name: "topics",
                create: topicListControl(),
                label: "Topics",
                type: ControlType.TOPICS,
                tooltip: SetPollingSourceTooltipsTexts.MQTT_TOPICS,
                options: {
                    buttonText: "+ Add new topic",
                },
                required: true,
            },
        ],
    },
    EthereumLogs: {
        controls: [
            {
                name: "chainId",
                create: numberInputControl(),
                label: "Chain ID",
                type: ControlType.NUMBER,
                placeholder: "Enter id",
                tooltip: SetPollingSourceTooltipsTexts.ETHEREUM_LOGS_CHAIN_ID,
                validators: integerInRangeValidators(0),
            },
            {
                name: "nodeUrl",
                create: valueControl(""),
                label: "Node url",
                type: ControlType.TEXT,
                placeholder: "Enter url",
                tooltip: SetPollingSourceTooltipsTexts.ETHEREUM_LOGS_NODE_URL,
                validators: [urlValidator(["http", "https"])],
            },
            {
                name: "filter",
                create: valueControl(""),
                label: "Filter",
                type: ControlType.TEXT,
                placeholder: "Enter filter",
                tooltip: SetPollingSourceTooltipsTexts.ETHEREUM_LOGS_FILTER,
            },
            {
                name: "signature",
                create: valueControl(""),
                label: "Signature",
                type: ControlType.TEXT,
                placeholder: "Enter signature",
                tooltip: SetPollingSourceTooltipsTexts.ETHEREUM_LOGS_SIGNATURE,
            },
        ],
    },
};
