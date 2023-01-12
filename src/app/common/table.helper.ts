import { DataRow, DataSchemaField } from "../interface/dataset.interface";

export const createSchemaFields = (data: DataRow): DataSchemaField[] => {
    return Object.keys(data).map((item: string) => ({
        name: item,
        repetition: "",
        type: "",
    }));
};
