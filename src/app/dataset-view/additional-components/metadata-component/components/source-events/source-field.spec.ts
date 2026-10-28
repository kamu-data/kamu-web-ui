/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { AbstractControl, FormArray, FormControl } from "@angular/forms";

import { DataSchemaField } from "@interface/dataset-schema.interface";

import {
    ControlType,
    ReadKind,
} from "src/app/dataset-view/additional-components/metadata-component/components/source-events/add-polling-source/add-polling-source-form.types";
import { SourceOrder } from "src/app/dataset-view/additional-components/metadata-component/components/source-events/add-polling-source/process-form.service.types";
import { ControlLayout } from "src/app/dataset-view/additional-components/metadata-component/components/source-events/source-event-controls.types";
import {
    layoutValidators,
    sourceField,
} from "src/app/dataset-view/additional-components/metadata-component/components/source-events/source-field";
import {
    eventTimeControl,
    nameValueGroup,
    nameValueListControl,
    numberInputControl,
    textControl,
    textListControl,
    topicGroup,
    topicListControl,
    valueControl,
} from "src/app/dataset-view/additional-components/metadata-component/components/source-events/source-section";

const ALWAYS = (): boolean => true;

const TEXT_LAYOUT: ControlLayout = { name: "url", label: "Url", tooltip: "", type: ControlType.TEXT };
const NUMBER_LAYOUT: ControlLayout = {
    name: "port",
    label: "Port",
    tooltip: "",
    type: ControlType.NUMBER,
    min: 1,
    max: 65535,
};

interface FieldCase {
    layout: ControlLayout;
    fits: AbstractControl;
    misfits: AbstractControl;
}

// For each layout type, a control its entry creates and one of another type.
const CASES: FieldCase[] = [
    {
        layout: TEXT_LAYOUT,
        fits: textControl(""),
        misfits: valueControl(false)([]),
    },
    {
        layout: { name: "dateFormat", label: "Date format", tooltip: "", type: ControlType.TYPEAHEAD, list: [] },
        fits: textControl(""),
        misfits: valueControl(1)([]),
    },
    {
        layout: NUMBER_LAYOUT,
        fits: numberInputControl()([]),
        misfits: valueControl(false)([]),
    },
    {
        layout: { name: "header", label: "Header", tooltip: "", type: ControlType.CHECKBOX },
        fits: valueControl(false)([]),
        misfits: textControl(""),
    },
    {
        layout: { name: "cache", label: "Use cache", tooltip: "", type: ControlType.CACHE },
        fits: valueControl(true)([]),
        misfits: textControl(""),
    },
    {
        layout: { name: "order", label: "Order", tooltip: "", type: ControlType.ORDER },
        fits: valueControl(SourceOrder.BY_NAME)([]),
        misfits: textControl("ALPHABETICAL"),
    },
    {
        layout: {
            name: "jsonKind",
            label: "Format",
            tooltip: "",
            type: ControlType.JSON_KIND,
            readFormatDescriptors: [],
        },
        fits: valueControl(ReadKind.ND_JSON)([]),
        misfits: textControl("Yaml"),
    },
    {
        layout: { name: "schema", label: "Schema", tooltip: "", type: ControlType.SCHEMA },
        fits: valueControl<DataSchemaField[]>([])([]),
        misfits: textControl(""),
    },
    {
        layout: {
            name: "eventTime",
            label: "Event time",
            tooltip: "",
            type: ControlType.EVENT_TIME,
            options: { innerTooltips: {} },
        },
        fits: eventTimeControl()([]),
        misfits: nameValueGroup(),
    },
    {
        layout: {
            name: "headers",
            label: "Headers",
            tooltip: "",
            type: ControlType.ARRAY_KEY_VALUE,
            options: { buttonText: "" },
        },
        fits: nameValueListControl()([]),
        misfits: new FormArray([topicGroup()]),
    },
    {
        layout: { name: "topics", label: "Topics", tooltip: "", type: ControlType.TOPICS, options: { buttonText: "" } },
        fits: topicListControl()([]),
        misfits: new FormArray([nameValueGroup()]),
    },
    {
        layout: {
            name: "primaryKey",
            label: "Primary key",
            tooltip: "",
            type: ControlType.ARRAY_KEY,
            placeholder: "",
            options: { buttonText: "" },
        },
        fits: textListControl()([]),
        misfits: new FormControl(""),
    },
];

describe("sourceField", () => {
    CASES.forEach(({ layout, fits, misfits }) => {
        it(`should pair a ${layout.type} layout with the control its entry creates`, () => {
            const field = sourceField(layout, fits, ALWAYS);

            expect(field.control).toBe(fits);
            expect(field.name).toBe(layout.name);
            expect(field.shown).toBe(ALWAYS);
        });

        it(`should reject a ${layout.type} layout paired with another type of control`, () => {
            expect(() => sourceField(layout, misfits, ALWAYS)).toThrow(
                `The control "${layout.name}" does not fit a ${layout.type} field`,
            );
        });
    });
});

describe("layoutValidators", () => {
    it("should check a number field is whole and within its range", () => {
        const control = new FormControl<number>(0, layoutValidators(NUMBER_LAYOUT));
        expect(control.errors).toEqual({ min: { min: 1, actual: 0 } });

        control.setValue(1.5);
        expect(control.errors).toEqual({ integer: true });

        control.setValue(65536);
        expect(control.errors).toEqual({ max: { max: 65535, actual: 65536 } });
    });

    it("should add nothing to other fields", () => {
        expect(layoutValidators(TEXT_LAYOUT)).toEqual([]);
    });
});
