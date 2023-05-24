import { SchemaType } from "../form-components/schema-field/schema-field.component";

export enum SourceOrder {
    NONE = "NONE",
    BY_NAME = "byName",
    BY_EVENT_TIME = "byEventTime",
}

export interface OrderControlType {
    fetch: {
        order?: string;
        cache?: { kind: string };
    };
}
export interface SchemaControlType {
    read: {
        schema?: SchemaType[] | string[];
    };
}
