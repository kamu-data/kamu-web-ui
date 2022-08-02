import {
    PageInfoInterface,
    SearchHistoryInterface,
    SearchOverviewDatasetsInterface
} from "../interface/search.interface";
import {GetDatasetHistoryQuery, MetadataBlockFragment} from "../api/kamu.graphql.interface";

export enum DatasetViewTypeEnum {
    overview = "overview",
    data = "data",
    metadata = "metadata",
    linage = "linage",
    discussions = "discussions",
    history = "history",
}

export interface DatasetViewContentInterface {
    isTableHeader: boolean;
    displayedColumns?: any[];
    datasetDataSource?: SearchHistoryInterface[];
    datasetOverviewSource?: SearchHistoryInterface[];
    datasetMetadataSource?: SearchOverviewDatasetsInterface[];
    latestMetadataBlock?: MetadataBlockFragment;
    isResultQuantity: boolean;
    isClickableRow: boolean;
    pageInfo: PageInfoInterface;
    totalCount: number;
}
