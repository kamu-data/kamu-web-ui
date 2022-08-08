import {
    SearchHistoryInterface,
    SearchOverviewDatasetsInterface
} from "../interface/search.interface";
import {
    MetadataBlockExtended,
    PageBasedInfo
} from "../api/kamu.graphql.interface";

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
    datasetHistorySource?: MetadataBlockExtended[];
    latestMetadataBlock?: MetadataBlockExtended;
    isResultQuantity: boolean;
    isClickableRow: boolean;
    pageInfo: PaginationInfoInterface;
    totalCount: number;
}

export interface PaginationInfoInterface extends PageBasedInfo {
    page?: number;
}
