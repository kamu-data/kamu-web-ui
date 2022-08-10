import {
    DataSchemaField,
    SearchOverviewDatasetsInterface,
} from "../../interface/search.interface";

export type TableSourceInterface =
    | SearchOverviewDatasetsInterface[]
    | Object[]
    | DataSchemaField[];
