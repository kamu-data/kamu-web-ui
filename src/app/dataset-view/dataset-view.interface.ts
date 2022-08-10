import { PageBasedInfo } from "../api/kamu.graphql.interface";

export enum DatasetViewTypeEnum {
    overview = "overview",
    data = "data",
    metadata = "metadata",
    linage = "linage",
    discussions = "discussions",
    history = "history",
}

export interface TableContentInterface {
    isTableHeader: boolean;
    displayedColumns?: any[];
    isResultQuantity: boolean;
    isClickableRow: boolean;
    totalCount: number;
}
