import { SchemaType } from "../form-components/schema-field/schema-field.component";

export enum SourceOrder {
    NONE = "NONE",
    BY_NAME = "BY_NAME",
    BY_EVENT_TIME = "BY_EVENT_TIME",
}

export interface OrderControlType {
    fetch: {
        order?: string;
    };
}
export interface SchemaControlType {
    read: {
        schema?: SchemaType[] | string[];
    };
}
