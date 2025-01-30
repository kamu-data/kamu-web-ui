import { DataRow, DataSchemaField } from "../../interface/dataset.interface";

export const extractSchemaFieldsFromData = (data: DataRow): DataSchemaField[] => {
    return Object.keys(data).map((item: string) => ({
        name: item,
        repetition: "",
        type: "",
        logicalType: "",
    }));
};
