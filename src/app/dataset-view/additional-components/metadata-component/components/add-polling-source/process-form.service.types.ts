import { SchemaType } from "../form-components/schema-field/schema-field.component";

export enum SourceOrder {
    NONE = "none",
    BY_NAME = "byName",
    BY_EVENT_TIME = "byEventTime",
}

export interface OrderControlType {
    fetch: {
        order?: string;
    };
}
export interface SchemaControlType {
    read: {
        schema: SchemaType[] | string[];
    };
}
