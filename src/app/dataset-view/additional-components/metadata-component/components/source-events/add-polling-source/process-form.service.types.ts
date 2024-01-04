import { AddPushSourceSection, SetPollingSourceSection } from "src/app/shared/shared.types";
import { SchemaType } from "../../form-components/schema-field/schema-field.component";

export enum SourceOrder {
    NONE = "NONE",
    BY_NAME = "byName",
    BY_EVENT_TIME = "byEventTime",
}

export interface OrderControlType {
    fetch: {
        kind: string;
        order?: SourceOrder;
        cache?: { kind: string };
        eventTime?: { kind: string; pattern?: string; timestampFormat?: string };
    };
}
export interface SchemaControlType {
    read: {
        schema?: SchemaType[] | string[];
    };
}

export type SourcesSection = SetPollingSourceSection | AddPushSourceSection;
