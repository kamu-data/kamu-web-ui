/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ThemePalette } from "@angular/material/core";

import { DatasetBasicsFragment, DatasetSearchOverviewFragment, PageBasedInfo } from "@api/kamu.graphql.interface";

export interface DatasetSearchResult {
    datasets: DatasetSearchOverviewFragment[];
    totalCount: number;
    pageInfo: PageBasedInfo;
    currentPage: number;
    searchMode: SearchMode;
}

export enum SearchMode {
    TEXT_SEARCH = "textSearch",
    SEMANTIC_SEARCH = "semanticSearch",
}

export interface DatasetAutocompleteItem {
    dataset: DatasetBasicsFragment;
    dummy: boolean;
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
