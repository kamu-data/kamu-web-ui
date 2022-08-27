import { DataRow } from "src/app/dataset-view/dataset.subscriptions.interface";
import { DataSchemaField } from "../../interface/search.interface";

export type TableSourceRowInterface = DataSchemaField | DataRow;
export type TableSourceInterface = TableSourceRowInterface[];
