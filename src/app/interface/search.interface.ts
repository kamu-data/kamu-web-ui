import { ThemePalette } from "@angular/material/core";
import {
    DatasetBasicsFragment,
    DatasetSearchOverviewFragment,
    PageBasedInfo,
} from "../api/kamu.graphql.interface";

export interface DatasetSearchResult {
    datasets: DatasetSearchOverviewFragment[];
    totalCount: number;
    pageInfo: PageBasedInfo;
    currentPage: number;
}

export interface DatasetAutocompleteItem {
    dataset: DatasetBasicsFragment;
    __typename: TypeNames;
}

export enum TypeNames {
    allDataType = "all",
    datasetType = "Dataset",
}

export interface SearchFilters {
    name?: string;
    isTitle: boolean;
    completed: boolean;
    disabled: boolean;
    color?: ThemePalette;
    subtasks?: SearchFilters[];
}
