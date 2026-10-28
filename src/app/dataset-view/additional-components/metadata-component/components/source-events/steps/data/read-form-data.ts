/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { SourcesTooltipsTexts } from "@common/tooltips/sources.text";
import { singleCharValidator } from "@common/validation/text.validators";
import { OdfDefaultValues } from "@common/values/app-odf-default.values";
import { DataSchemaField } from "@interface/dataset-schema.interface";

import { schemaValidator } from "src/app/dataset-view/additional-components/metadata-component/components/form-components/schema-field/schema-field.component.helpers";
import {
    ControlType,
    ReadKind,
} from "src/app/dataset-view/additional-components/metadata-component/components/source-events/add-polling-source/add-polling-source-form.types";
import {
    JsonFormData,
    ReadControls,
} from "src/app/dataset-view/additional-components/metadata-component/components/source-events/source-event-controls.types";
import { valueControl } from "src/app/dataset-view/additional-components/metadata-component/components/source-events/source-section";

export const READ_FORM_DATA: JsonFormData<ReadControls> = {
    Csv: {
        controls: [
            {
                name: "schema",
                create: valueControl<DataSchemaField[]>([]),
                label: "Schema",
                type: ControlType.SCHEMA,
                validators: [schemaValidator],
                tooltip: SourcesTooltipsTexts.SCHEMA,
            },
            {
                name: "header",
                create: valueControl(OdfDefaultValues.CSV_HEADER),
                label: "Header",
                type: ControlType.CHECKBOX,
                tooltip: SourcesTooltipsTexts.HEADER,
                dataTestId: "header",
            },
            {
                name: "encoding",
                create: valueControl(OdfDefaultValues.CSV_ENCODING),
                label: "Encoding",
                type: ControlType.TEXT,
                tooltip: SourcesTooltipsTexts.ENCODING,
                placeholder: "Enter encoding type...",
            },
            {
                name: "separator",
                create: valueControl(OdfDefaultValues.CSV_SEPARATOR),
                label: "Separator",
                type: ControlType.TYPEAHEAD,
                placeholder: "--Select character--",
                tooltip: SourcesTooltipsTexts.SEPARATOR,
                list: [",", ";", "|"],
                validators: [singleCharValidator()],
            },

            {
                name: "quote",
                create: valueControl(OdfDefaultValues.CSV_QUOTE),
                label: "Quote character",
                type: ControlType.TYPEAHEAD,
                placeholder: "--Select character--",
                tooltip: SourcesTooltipsTexts.QUOTE,
                list: ['"', "'"],
                validators: [singleCharValidator()],
            },
            {
                name: "escape",
                create: valueControl(OdfDefaultValues.CSV_ESCAPE),
                label: "Escape character",
                type: ControlType.TYPEAHEAD,
                placeholder: "Enter escape character...",
                tooltip: SourcesTooltipsTexts.ESCAPE,
                list: ["\\"],
                validators: [singleCharValidator()],
            },
            {
                name: "nullValue",
                create: valueControl(OdfDefaultValues.CSV_NULL_VALUE),
                label: "Null value",
                type: ControlType.TEXT,
                tooltip: SourcesTooltipsTexts.NULL_VALUE,
                placeholder: "Enter null value...",
            },
            {
                name: "dateFormat",
                create: valueControl(OdfDefaultValues.CSV_DATE_FORMAT),
                label: "Date format",
                type: ControlType.TYPEAHEAD,
                tooltip: SourcesTooltipsTexts.DATE_FORMAT,
                placeholder: "--Select format--",
                list: ["rfc3339"],
            },
            {
                name: "timestampFormat",
                create: valueControl(OdfDefaultValues.CSV_TIMESTAMP_FORMAT),
                label: "Timestamp format",
                type: ControlType.TYPEAHEAD,
                placeholder: "--Select format--",
                tooltip: SourcesTooltipsTexts.TIMESTAMP_FORMAT,
                list: ["rfc3339"],
            },
            {
                name: "inferSchema",
                create: valueControl(OdfDefaultValues.CSV_INFER_SCHEMA),
                label: "Infer schema",
                type: ControlType.CHECKBOX,
                tooltip: SourcesTooltipsTexts.INFER_SCHEMA,
                dataTestId: "inferSchema",
            },
        ],
    },
    AllGeo: {
        controls: [
            {
                name: "schema",
                create: valueControl<DataSchemaField[]>([]),
                label: "Schema",
                type: ControlType.SCHEMA,
                validators: [schemaValidator],
                tooltip: SourcesTooltipsTexts.SCHEMA,
            },
            {
                name: "jsonKind",
                create: valueControl(ReadKind.GEO_JSON),
                label: "Select reader format",
                type: ControlType.JSON_KIND,
                tooltip: SourcesTooltipsTexts.READ_JSON,
                readFormatDescriptors: [
                    { label: "Geo JSON", value: ReadKind.GEO_JSON },
                    { label: "Newline-delimited Geo JSON", value: ReadKind.ND_GEO_JSON },
                ],
            },
        ],
    },
    EsriShapefile: {
        controls: [
            {
                name: "schema",
                create: valueControl<DataSchemaField[]>([]),
                label: "Schema",
                type: ControlType.SCHEMA,
                validators: [schemaValidator],
                tooltip: SourcesTooltipsTexts.SCHEMA,
            },
            {
                name: "subPath",
                create: valueControl(""),
                label: "Path",
                type: ControlType.TEXT,
                tooltip: SourcesTooltipsTexts.SUB_PATH,
                placeholder: "Enter path to data file...",
            },
        ],
    },
    Parquet: {
        controls: [
            {
                name: "schema",
                create: valueControl<DataSchemaField[]>([]),
                label: "Schema",
                tooltip: SourcesTooltipsTexts.SCHEMA,
                type: ControlType.SCHEMA,
                validators: [schemaValidator],
            },
        ],
    },
    AllJson: {
        controls: [
            {
                name: "schema",
                create: valueControl<DataSchemaField[]>([]),
                label: "Schema",
                type: ControlType.SCHEMA,
                validators: [schemaValidator],
                tooltip: SourcesTooltipsTexts.SCHEMA,
            },
            {
                name: "jsonKind",
                create: valueControl(ReadKind.JSON),
                label: "Select reader format",
                type: ControlType.JSON_KIND,
                tooltip: SourcesTooltipsTexts.READ_JSON,
                readFormatDescriptors: [
                    { label: "JSON", value: ReadKind.JSON },
                    { label: "Newline-delimited JSON", value: ReadKind.ND_JSON },
                ],
            },
            {
                name: "subPath",
                create: valueControl(""),
                label: "Path to data file",
                type: ControlType.TEXT,
                tooltip: SourcesTooltipsTexts.SUB_PATH,
                placeholder: "Enter path to data file...",
                shownWhen: (form) => form.controls.jsonKind?.value === ReadKind.JSON,
            },
            {
                name: "encoding",
                create: valueControl(OdfDefaultValues.CSV_ENCODING),
                label: "Encoding",
                type: ControlType.TEXT,
                tooltip: SourcesTooltipsTexts.ENCODING,
                placeholder: "Enter encoding...",
            },
            {
                name: "dateFormat",
                create: valueControl("rfc3339"),
                label: "Date format",
                type: ControlType.TYPEAHEAD,
                tooltip: SourcesTooltipsTexts.DATE_FORMAT,
                placeholder: "--Select format--",
                list: ["rfc3339"],
            },
            {
                name: "timestampFormat",
                create: valueControl("rfc3339"),
                label: "Timestamp format",
                type: ControlType.TYPEAHEAD,
                placeholder: "--Select format--",
                tooltip: SourcesTooltipsTexts.TIMESTAMP_FORMAT,
                list: ["rfc3339"],
            },
        ],
    },
};
