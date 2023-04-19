export interface OrderControlType {
    label: string;
    value: "none" | "byName" | "byEventTime";
}

export const ORDER_RADIO_CONTROL: OrderControlType[] = [
    { label: "None", value: "none" },
    { label: "By name", value: "byName" },
    { label: "By event time", value: "byEventTime" },
];
