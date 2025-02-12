import { MaybeNull } from "../../interface/app.types";
import { DataRow, DatasetSchema } from "src/app/interface/dataset.interface";

export interface GlobalQuerySearchItem {
    datasetAlias: string;
    schema: MaybeNull<DatasetSchema>;
}

export interface SqlQueryResponseState {
    schema: MaybeNull<DatasetSchema>;
    content: DataRow[];
    involvedDatasetsId: string[];
}
