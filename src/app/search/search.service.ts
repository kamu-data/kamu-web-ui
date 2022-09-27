import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { SearchApi } from "../api/search.api";
import {
    DatasetAutocompleteItem,
    DatasetSearchResult,
} from "../interface/search.interface";
import {
    DatasetSearchOverviewFragment,
    SearchDatasetsOverviewQuery,
} from "../api/kamu.graphql.interface";

@Injectable({ providedIn: "root" })
export class AppSearchService {
    private inputQueryChanges$: Subject<string> = new Subject<string>();
    private overviewSearchChanges$: Subject<DatasetSearchResult> =
        new Subject<DatasetSearchResult>();
    private autocompleteSearchChanges$: Subject<DatasetAutocompleteItem[]> =
        new Subject<DatasetAutocompleteItem[]>();

    constructor(private searchApi: SearchApi) {}

    public searchQueryChanges(searchValue: string): void {
        this.inputQueryChanges$.next(searchValue);
    }

    public get onSearchQueryChanges(): Observable<string> {
        return this.inputQueryChanges$.asObservable();
    }

    public overviewSearchChanges(searchData: DatasetSearchResult): void {
        this.overviewSearchChanges$.next(searchData);
    }

    public get onOverviewSearchChanges(): Observable<DatasetSearchResult> {
        return this.overviewSearchChanges$.asObservable();
    }

    public autocompleteSearchChanges(
        autocompleteData: DatasetAutocompleteItem[],
    ) {
        this.autocompleteSearchChanges$.next(autocompleteData);
    }

    public get onAutocompleteSearchChanges(): Observable<
        DatasetAutocompleteItem[]
    > {
        return this.autocompleteSearchChanges$.asObservable();
    }

    public searchDatasets(searchQuery: string, page = 0): void {
        this.searchApi
            .overviewDatasetSearch(searchQuery, page)
            .subscribe((data: SearchDatasetsOverviewQuery) => {
                const datasets: DatasetSearchOverviewFragment[] =
                    data.search.query.nodes;
                const pageInfo = data.search.query.pageInfo;
                const totalCount: number = data.search.query.totalCount ?? 0;

                this.overviewSearchChanges({
                    datasets,
                    pageInfo,
                    totalCount,
                    currentPage: page + 1 || 1,
                });
            });
    }

    public autocompleteDatasetSearch(searchQuery: string): void {
        this.searchApi.autocompleteDatasetSearch(searchQuery).subscribe(
            (data: DatasetAutocompleteItem[]) => {
                this.autocompleteSearchChanges(data);
            },
            () => {
                this.autocompleteSearchChanges([]);
            },
        );
    }
}
