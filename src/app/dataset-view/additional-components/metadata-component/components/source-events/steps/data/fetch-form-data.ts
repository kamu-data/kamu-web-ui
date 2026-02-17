/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { SetPollingSourceTooltipsTexts } from "@common/tooltips/set-polling-source-tooltips.text";
import { SourcesTooltipsTexts } from "@common/tooltips/sources.text";
import AppValues from "@common/values/app.values";

import { ControlType, JsonFormData } from "../../add-polling-source/add-polling-source-form.types";

export const FETCH_FORM_DATA: JsonFormData = {
    Url: {
        controls: [
            {
                name: "url",
                label: "Url",
                value: "",
                type: ControlType.TEXT,
                placeholder: "Enter url",
                tooltip: SetPollingSourceTooltipsTexts.URL,
                validators: {
                    required: true,
                    pattern: AppValues.URL_PATTERN,
                },
            },
            {
                name: "eventTime",
                label: "Event time",
                value: "",
                type: ControlType.EVENT_TIME,
                tooltip: SetPollingSourceTooltipsTexts.EVENT_TIME,
                options: {
                    innerTooltips: {
                        fromMetadata: SetPollingSourceTooltipsTexts.EVENT_TIME_FROM_METADATA,
                        fromPath: SetPollingSourceTooltipsTexts.EVENT_TIME_FROM_PATH,
                        fromSystemTime: SetPollingSourceTooltipsTexts.EVENT_TIME_SYSTEM_TIME,
                    },
                },
                validators: {},
            },
            {
                name: "headers",
                value: "",
                label: "Headers",
                type: ControlType.ARRAY_KEY_VALUE,
                tooltip: SourcesTooltipsTexts.HEADERS,
                options: {
                    formArrayName: "headers",
                    buttonText: "+ Add headers",
                },
                validators: {},
            },
            {
                name: "cache",
                label: "Use cache",
                value: "",
                tooltip: SetPollingSourceTooltipsTexts.CACHE,
                type: ControlType.CACHE,
                validators: {},
            },
        ],
    },
    FilesGlob: {
        controls: [
            {
                name: "path",
                label: "Path",
                value: "",
                type: ControlType.TEXT,
                placeholder: "Enter path",
                tooltip: SetPollingSourceTooltipsTexts.PATH,
                validators: {
                    required: true,
                },
            },

            {
                name: "order",
                label: "Order",
                value: "NONE",
                type: ControlType.ORDER,
                tooltip: SetPollingSourceTooltipsTexts.PATH,
                validators: {},
            },
            {
                name: "eventTime",
                label: "Event time",
                value: "",
                type: ControlType.EVENT_TIME,
                tooltip: SetPollingSourceTooltipsTexts.EVENT_TIME,
                validators: {},
                options: {
                    innerTooltips: {
                        fromMetadata: SetPollingSourceTooltipsTexts.EVENT_TIME_FROM_METADATA,
                        fromPath: SetPollingSourceTooltipsTexts.EVENT_TIME_FROM_PATH,
                    },
                },
            },
            {
                name: "cache",
                label: "Use cache",
                value: "",
                type: ControlType.CACHE,
                tooltip: SetPollingSourceTooltipsTexts.CACHE,
                validators: {},
            },
        ],
    },
    Container: {
        controls: [
            {
                name: "image",
                label: "Image",
                value: "",
                type: ControlType.TEXT,
                placeholder: "Enter image..",
                tooltip: SetPollingSourceTooltipsTexts.IMAGE,
                validators: {
                    required: true,
                },
            },
            {
                name: "command",
                label: "Commands",
                placeholder: "Enter command...",
                value: "",
                type: ControlType.ARRAY_KEY,
                tooltip: SetPollingSourceTooltipsTexts.COMMANDS,
                options: {
                    formArrayName: "command",
                    buttonText: "+ Add command",
                },
                validators: {},
            },
            {
                name: "args",
                label: "Arguments",
                placeholder: "Enter argument...",
                value: "",
                type: ControlType.ARRAY_KEY,
                tooltip: SetPollingSourceTooltipsTexts.ARGUMENTS,
                options: {
                    formArrayName: "args",
                    buttonText: "+ Add argument",
                },
                validators: {},
            },

            {
                name: "env",
                value: [
                    {
                        name: "ETH_NODE_PROVIDER_URL",
                        value: null,
                    },
                ],
                label: "Environment variables",
                type: ControlType.ARRAY_KEY_VALUE,
                tooltip: SetPollingSourceTooltipsTexts.ENVIRONMENT_VARIABLES,
                options: {
                    formArrayName: "env",
                    buttonText: "+ Add variable",
                },
                validators: {},
            },
        ],
    },
    Mqtt: {
        controls: [
            {
                name: "host",
                label: "Host",
                value: "",
                type: ControlType.TEXT,
                placeholder: "Enter host",
                tooltip: SetPollingSourceTooltipsTexts.MQTT_HOST,
                validators: {
                    required: true,
                },
            },
            {
                name: "port",
                label: "Port",
                value: "",
                type: ControlType.NUMBER,
                placeholder: "Enter port",
                tooltip: SetPollingSourceTooltipsTexts.MQTT_PORT,
                validators: {
                    required: true,
                },
            },
            {
                name: "username",
                label: "Username",
                value: "",
                type: ControlType.TEXT,
                placeholder: "Enter username",
                tooltip: SetPollingSourceTooltipsTexts.MQTT_USERNAME,
                validators: {},
            },
            {
                name: "password",
                label: "Password",
                value: "",
                type: ControlType.TEXT,
                placeholder: "Enter password",
                tooltip: SetPollingSourceTooltipsTexts.MQTT_PASSWORD,
                validators: {},
            },
            {
                name: "topics",
                value: [],
                label: "Topics",
                type: ControlType.TOPICS,
                tooltip: SetPollingSourceTooltipsTexts.MQTT_TOPICS,
                options: {
                    formArrayName: "topics",
                    buttonText: "+ Add new topic",
                },
                validators: {
                    required: true,
                },
            },
        ],
    },
    EthereumLogs: {
        controls: [
            {
                name: "chainId",
                label: "Chain ID",
                value: "",
                type: ControlType.NUMBER,
                placeholder: "Enter id",
                tooltip: SetPollingSourceTooltipsTexts.ETHEREUM_LOGS_CHAIN_ID,
                validators: { min: 0, pattern: AppValues.ZERO_OR_POSITIVE_PATTERN },
            },
            {
                name: "nodeUrl",
                label: "Node url",
                value: "",
                type: ControlType.TEXT,
                placeholder: "Enter url",
                tooltip: SetPollingSourceTooltipsTexts.ETHEREUM_LOGS_NODE_URL,
                validators: {
                    pattern: AppValues.URL_PATTERN,
                },
            },
            {
                name: "filter",
                label: "Filter",
                value: "",
                type: ControlType.TEXT,
                placeholder: "Enter filter",
                tooltip: SetPollingSourceTooltipsTexts.ETHEREUM_LOGS_FILTER,
                validators: {},
            },
            {
                name: "signature",
                label: "Signature",
                value: "",
                type: ControlType.TEXT,
                placeholder: "Enter signature",
                tooltip: SetPollingSourceTooltipsTexts.ETHEREUM_LOGS_SIGNATURE,
                validators: {},
            },
        ],
    },
};
