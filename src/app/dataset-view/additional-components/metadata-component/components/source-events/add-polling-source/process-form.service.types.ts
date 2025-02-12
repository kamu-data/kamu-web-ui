import { SchemaType } from "../../form-components/schema-field/schema-field.component";
import { AddPushSourceSection } from "../add-push-source/add-push-source-form.types";
import { EventTimeSourceKind, FetchKind, SetPollingSourceSection } from "./add-polling-source-form.types";

export enum SourceOrder {
    NONE = "NONE",
    BY_NAME = "ByName",
    BY_EVENT_TIME = "ByEventTime",
}

export interface OrderControlType {
    fetch: {
        kind: FetchKind;
        order?: SourceOrder;
        cache?: { kind: string };
        eventTime?: { kind: EventTimeSourceKind; pattern?: string; timestampFormat?: string };
    };
}
export interface SchemaControlType {
    read: {
        schema?: SchemaType[] | string[];
    };
}

export type SourcesSection = SetPollingSourceSection | AddPushSourceSection;
