import { SourceOrder } from "../../source-events/add-polling-source/process-form.service.types";

export interface OrderControlType {
    label: string;
    value: SourceOrder;
}

export const ORDER_RADIO_CONTROL: OrderControlType[] = [
    { label: "None", value: SourceOrder.NONE },
    { label: "By name", value: SourceOrder.BY_NAME },
    { label: "By event time", value: SourceOrder.BY_EVENT_TIME },
];
