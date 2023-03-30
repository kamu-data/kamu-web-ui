/* eslint-disable @typescript-eslint/no-explicit-any */
export interface JsonFormValidators {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    pattern?: string | RegExp;
}

interface JsonFormControlOptions {
    buttonText?: string;
    formArrayName?: string;
}

export interface JsonFormControls {
    name: string;
    label: string;
    value: any;
    type: string;
    placeholder?: string;
    options?: JsonFormControlOptions;
    required?: boolean;
    validators: JsonFormValidators;
}

export type JsonFormData = Record<
    string,
    {
        controls: JsonFormControls[];
    }
>;

export enum ControlType {
    TEXT = "text",
    ARRAY_KEY_VALUE = "array-key-value",
    CHECKBOX = "checkbox",
}
