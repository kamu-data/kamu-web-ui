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
    label: string | null;
    value: string | null;
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
