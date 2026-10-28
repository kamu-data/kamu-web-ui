/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { AbstractControl, FormArray, FormControl, FormGroup, ValidatorFn } from "@angular/forms";

import { integerInRangeValidators } from "@common/validation/number.validators";
import { MaybeNull } from "@interface/app.types";
import { DataSchemaField } from "@interface/dataset-schema.interface";

import {
    ControlType,
    ReadKind,
} from "src/app/dataset-view/additional-components/metadata-component/components/source-events/add-polling-source/add-polling-source-form.types";
import { SourceOrder } from "src/app/dataset-view/additional-components/metadata-component/components/source-events/add-polling-source/process-form.service.types";
import {
    ControlLayout,
    EventTimeControls,
    NameValueControls,
    ScalarSourceField,
    SourceField,
    TextControl,
    TopicControls,
} from "src/app/dataset-view/additional-components/metadata-component/components/source-events/source-event-controls.types";

// The config types tie each layout type to the type of control its entry creates. The generic step section cannot
// see that link, so these checks confirm the control's class and current value at runtime.

function isFormControlOf<V>(
    control: AbstractControl,
    isValue: (value: unknown) => value is V,
): control is FormControl<V> {
    return control instanceof FormControl && isValue(control.value);
}

function isString(value: unknown): value is string {
    return typeof value === "string";
}

function isNumberInput(value: unknown): value is MaybeNull<number> | string {
    return value === null || typeof value === "number" || typeof value === "string";
}

function isBoolean(value: unknown): value is boolean {
    return typeof value === "boolean";
}

function isSourceOrder(value: unknown): value is SourceOrder {
    return Object.values<unknown>(SourceOrder).includes(value);
}

function isReadKind(value: unknown): value is ReadKind {
    return Object.values<unknown>(ReadKind).includes(value);
}

function isSchema(value: unknown): value is DataSchemaField[] {
    return Array.isArray(value);
}

function isEventTimeGroup(control: AbstractControl): control is FormGroup<EventTimeControls> {
    return (
        control instanceof FormGroup && ["kind", "pattern", "timestampFormat"].every((name) => name in control.controls)
    );
}

function isFormArrayOf<C extends AbstractControl>(
    control: AbstractControl,
    isItem: (item: AbstractControl) => item is C,
): control is FormArray<C> {
    return control instanceof FormArray && control.controls.every(isItem);
}

function isTextControl(control: AbstractControl): control is TextControl {
    return isFormControlOf(control, isString);
}

function isNameValueGroup(control: AbstractControl): control is FormGroup<NameValueControls> {
    return control instanceof FormGroup && "name" in control.controls && "value" in control.controls;
}

function isTopicGroup(control: AbstractControl): control is FormGroup<TopicControls> {
    return control instanceof FormGroup && "path" in control.controls && "qos" in control.controls;
}

/** The validators a layout implies by its type, besides `required` and the ones it lists. */
export function layoutValidators(layout: ControlLayout): ValidatorFn[] {
    return layout.type === ControlType.NUMBER ? integerInRangeValidators(layout.min, layout.max) : [];
}

/** Pairs a config entry's layout with the control the step created for it; throws when their types disagree. */
export function sourceField(layout: ControlLayout, control: AbstractControl, shown: () => boolean): SourceField {
    switch (layout.type) {
        case ControlType.TEXT:
        case ControlType.TYPEAHEAD:
            if (isTextControl(control)) {
                return { ...layout, control, shown };
            }
            break;
        case ControlType.NUMBER:
            if (isFormControlOf(control, isNumberInput)) {
                return { ...layout, control, shown };
            }
            break;
        case ControlType.CHECKBOX:
        case ControlType.CACHE:
            if (isFormControlOf(control, isBoolean)) {
                return { ...layout, control, shown };
            }
            break;
        case ControlType.ORDER:
            if (isFormControlOf(control, isSourceOrder)) {
                return { ...layout, control, shown };
            }
            break;
        case ControlType.JSON_KIND:
            if (isFormControlOf(control, isReadKind)) {
                return { ...layout, control, shown };
            }
            break;
        case ControlType.SCHEMA:
            if (isFormControlOf(control, isSchema)) {
                return { ...layout, control, shown };
            }
            break;
        case ControlType.EVENT_TIME:
            if (isEventTimeGroup(control)) {
                return { ...layout, control, shown };
            }
            break;
        case ControlType.ARRAY_KEY_VALUE:
            if (isFormArrayOf(control, isNameValueGroup)) {
                return { ...layout, control, shown };
            }
            break;
        case ControlType.TOPICS:
            if (isFormArrayOf(control, isTopicGroup)) {
                return { ...layout, control, shown };
            }
            break;
        case ControlType.ARRAY_KEY:
            if (isFormArrayOf(control, isTextControl)) {
                return { ...layout, control, shown };
            }
            break;
    }
    throw new Error(`The control "${layout.name}" does not fit a ${layout.type} field`);
}

const SCALAR_FIELD_TYPES: readonly ControlType[] = [
    ControlType.TEXT,
    ControlType.TYPEAHEAD,
    ControlType.NUMBER,
    ControlType.CHECKBOX,
    ControlType.CACHE,
    ControlType.ORDER,
    ControlType.JSON_KIND,
];

export function isScalarSourceField(field: SourceField): field is ScalarSourceField {
    return SCALAR_FIELD_TYPES.includes(field.type);
}
