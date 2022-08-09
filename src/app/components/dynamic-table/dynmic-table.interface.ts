import {
    DataSchemaField,
    SearchHistoryInterface,
    SearchOverviewDatasetsInterface
} from "../../interface/search.interface";

export type TableSourceInterface = SearchOverviewDatasetsInterface[] | SearchHistoryInterface[] | DataSchemaField[];