/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { AbstractControl, FormArray, FormControl, FormGroup, ValidatorFn } from "@angular/forms";

import { MaybeNull } from "@interface/app.types";
import { DataSchemaField } from "@interface/dataset-schema.interface";

import {
    ControlType,
    DecompressFormat,
    EventTimeSourceKind,
    FetchKind,
    MergeKind,
    PrepareKind,
    ReadFormatControlType,
    ReadKind,
} from "src/app/dataset-view/additional-components/metadata-component/components/source-events/add-polling-source/add-polling-source-form.types";
import { SourceOrder } from "src/app/dataset-view/additional-components/metadata-component/components/source-events/add-polling-source/process-form.service.types";

// The controls of the source event editor. A step holds the controls of its current kind, so every
// control but `kind` is optional; these types list every control any kind adds.

export type TextControl = FormControl<string>;

/** An `<input type="number">`: empty until the user types, then the number, or `null` once cleared. */
export type NumberInputControl = FormControl<MaybeNull<number> | string>;

export interface NameValueControls {
    name: TextControl;
    value: TextControl;
}

export interface TopicControls {
    path: TextControl;
    qos: TextControl;
}

/** `pattern` and `timestampFormat` apply only while `kind` is "From path"; `pattern` is required then. */
export interface EventTimeControls {
    kind: FormControl<EventTimeSourceKind>;
    pattern: TextControl;
    timestampFormat: TextControl;
}

export interface FetchControls {
    kind: FormControl<FetchKind>;
    url?: TextControl;
    path?: TextControl;
    image?: TextControl;
    host?: TextControl;
    port?: NumberInputControl;
    username?: TextControl;
    password?: TextControl;
    chainId?: NumberInputControl;
    nodeUrl?: TextControl;
    filter?: TextControl;
    signature?: TextControl;
    eventTime?: FormGroup<EventTimeControls>;
    headers?: FormArray<FormGroup<NameValueControls>>;
    env?: FormArray<FormGroup<NameValueControls>>;
    command?: FormArray<TextControl>;
    args?: FormArray<TextControl>;
    topics?: FormArray<FormGroup<TopicControls>>;
    cache?: FormControl<boolean>;
    order?: FormControl<SourceOrder>;
}

export interface ReadControls {
    kind: FormControl<ReadKind>;
    jsonKind?: FormControl<ReadKind>;
    schema?: FormControl<DataSchemaField[]>;
    subPath?: TextControl;
    header?: FormControl<boolean>;
    inferSchema?: FormControl<boolean>;
    encoding?: TextControl;
    separator?: TextControl;
    quote?: TextControl;
    escape?: TextControl;
    nullValue?: TextControl;
    dateFormat?: TextControl;
    timestampFormat?: TextControl;
}

export interface MergeControls {
    kind: FormControl<MergeKind>;
    primaryKey?: FormArray<TextControl>;
    compareColumns?: FormArray<TextControl>;
}

export interface PipeStepControls {
    kind: FormControl<PrepareKind.PIPE>;
    command: TextControl;
}

export interface DecompressStepControls {
    kind: FormControl<PrepareKind.DECOMPRESS>;
    format: FormControl<DecompressFormat>;
    subPath: TextControl;
}

export type PrepareStepForm = FormGroup<PipeStepControls> | FormGroup<DecompressStepControls>;

export interface PollingSourceControls {
    fetch: FormGroup<FetchControls>;
    prepare: FormArray<PrepareStepForm>;
    read: FormGroup<ReadControls>;
    merge: FormGroup<MergeControls>;
}

export interface PushSourceControls {
    sourceName: TextControl;
    read: FormGroup<ReadControls>;
    merge: FormGroup<MergeControls>;
}

/** The controls of a step, keyed by name. */
export type ControlsOf<T> = { [K in keyof T]: AbstractControl };

/** The names of a step's optional controls: those a kind adds and removes. */
export type OptionalControlName<T> = { [K in keyof T]-?: undefined extends T[K] ? K : never }[keyof T] & string;

/** Builds a control for a step from the validators its config lists. */
export type ControlFactory<C> = (validators: ValidatorFn[]) => C;

interface ControlLayoutBase {
    name: string;
    label: string;
    tooltip: string;
    /** Adds `Validators.required` and marks the label. */
    required?: boolean;
    /** Validators from `@common/validation`, besides `required`. */
    validators?: ValidatorFn[];
    dataTestId?: string;
}

interface ArrayFieldOptions {
    buttonText: string;
}

type TextLayout = ControlLayoutBase & { type: ControlType.TEXT; placeholder?: string; inputType?: "text" | "password" };
type TypeaheadLayout = ControlLayoutBase & { type: ControlType.TYPEAHEAD; placeholder?: string; list: string[] };
/** A number field states its range: the step builds its whole-number and range validators, and its input, from it. */
type NumberLayout = ControlLayoutBase & { type: ControlType.NUMBER; placeholder?: string; min: number; max?: number };
type CheckboxLayout = ControlLayoutBase & { type: ControlType.CHECKBOX };
type CacheLayout = ControlLayoutBase & { type: ControlType.CACHE };
type OrderLayout = ControlLayoutBase & { type: ControlType.ORDER };
type JsonKindLayout = ControlLayoutBase & {
    type: ControlType.JSON_KIND;
    readFormatDescriptors: ReadFormatControlType[];
};
type SchemaLayout = ControlLayoutBase & { type: ControlType.SCHEMA };
type EventTimeLayout = ControlLayoutBase & {
    type: ControlType.EVENT_TIME;
    options: { innerTooltips: Record<string, string> };
};
type KeyValueLayout = ControlLayoutBase & { type: ControlType.ARRAY_KEY_VALUE; options: ArrayFieldOptions };
type TopicsLayout = ControlLayoutBase & { type: ControlType.TOPICS; options: ArrayFieldOptions };
type ArrayKeyLayout = ControlLayoutBase & {
    type: ControlType.ARRAY_KEY;
    placeholder: string;
    options: ArrayFieldOptions;
};

/** How a step renders one of its controls: which field component, with what label and options. */
export type ControlLayout =
    | TextLayout
    | TypeaheadLayout
    | NumberLayout
    | CheckboxLayout
    | CacheLayout
    | OrderLayout
    | JsonKindLayout
    | SchemaLayout
    | EventTimeLayout
    | KeyValueLayout
    | TopicsLayout
    | ArrayKeyLayout;

interface FieldState<C> {
    control: C;
    shown: () => boolean;
}

/** A field of a step that edits one value: its layout, with the control the step built for it. */
export type ScalarSourceField =
    | ((TextLayout | TypeaheadLayout) & FieldState<TextControl>)
    | (NumberLayout & FieldState<NumberInputControl>)
    | ((CheckboxLayout | CacheLayout) & FieldState<FormControl<boolean>>)
    | (OrderLayout & FieldState<FormControl<SourceOrder>>)
    | (JsonKindLayout & FieldState<FormControl<ReadKind>>);

/** A field of a step that edits a group or a list of values. */
export type CompositeSourceField =
    | (SchemaLayout & FieldState<FormControl<DataSchemaField[]>>)
    | (EventTimeLayout & FieldState<FormGroup<EventTimeControls>>)
    | (KeyValueLayout & FieldState<FormArray<FormGroup<NameValueControls>>>)
    | (TopicsLayout & FieldState<FormArray<FormGroup<TopicControls>>>)
    | (ArrayKeyLayout & FieldState<FormArray<TextControl>>);

export type SourceField = ScalarSourceField | CompositeSourceField;

/** The layouts that can render a control of type `C`; the order matters, as enum controls are string controls too. */
type LayoutFor<C> =
    C extends FormControl<boolean>
        ? CheckboxLayout | CacheLayout
        : C extends FormControl<SourceOrder>
          ? OrderLayout
          : C extends FormControl<ReadKind>
            ? JsonKindLayout
            : C extends TextControl
              ? TextLayout | TypeaheadLayout
              : C extends NumberInputControl
                ? NumberLayout
                : C extends FormControl<DataSchemaField[]>
                  ? SchemaLayout
                  : C extends FormGroup<EventTimeControls>
                    ? EventTimeLayout
                    : C extends FormArray<FormGroup<NameValueControls>>
                      ? KeyValueLayout
                      : C extends FormArray<FormGroup<TopicControls>>
                        ? TopicsLayout
                        : C extends FormArray<TextControl>
                          ? ArrayKeyLayout
                          : never;

/**
 * A config entry of a step: an optional control's name, a factory for that control's type, and a
 * layout that can render it. An entry cannot name a control the step does not have, build a
 * control of another type, or render it with a field made for another type.
 */
export type JsonFormControl<T extends ControlsOf<T>> = {
    [K in OptionalControlName<T>]: LayoutFor<Required<T>[K]> & {
        name: K;
        create: ControlFactory<Required<T>[K]>;
        /** Shows the field only while this holds; the control stays in the form either way. */
        shownWhen?: (form: FormGroup<T>) => boolean;
        /** Controls of the same step whose changes revalidate this one, for validators that read them. */
        dependsOn?: readonly OptionalControlName<T>[];
    };
}[OptionalControlName<T>];

/** The config entries of a step, per kind. */
export type JsonFormData<T extends ControlsOf<T>> = Record<string, { controls: JsonFormControl<T>[] }>;
