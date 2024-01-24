import { AddPushSourceSection, SetPollingSourceSection } from "src/app/shared/shared.types";
import { SchemaType } from "../../form-components/schema-field/schema-field.component";
import { EventTimeSourceKind, FetchKind } from "./add-polling-source-form.types";

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
