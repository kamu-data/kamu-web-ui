import { MaybeNull } from "./../../common/app.types";
import { DatasetSchema } from "src/app/interface/dataset.interface";

export interface GlobalQuerySearchItem {
    datasetAlias: string;
    schema: MaybeNull<DatasetSchema>;
}
