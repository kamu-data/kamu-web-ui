import { inject, Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { SearchApi } from "../api/search.api";
import { DatasetAutocompleteItem, DatasetSearchResult } from "../interface/search.interface";
import { DatasetSearchOverviewFragment, SearchDatasetsOverviewQuery } from "../api/kamu.graphql.interface";

@Injectable({ providedIn: "root" })
export class SearchService {
    private searchOverview$: Subject<DatasetSearchResult> = new Subject<DatasetSearchResult>();
    private searchAutocomplete$: Subject<DatasetAutocompleteItem[]> = new Subject<DatasetAutocompleteItem[]>();

    private searchApi = inject(SearchApi);

    private emitSearchOverviewChanged(searchData: DatasetSearchResult): void {
        this.searchOverview$.next(searchData);
    }

    public get searchOverviewChanges(): Observable<DatasetSearchResult> {
        return this.searchOverview$.asObservable();
    }

    private emitSearchAutocompleteChanged(autocompleteData: DatasetAutocompleteItem[]) {
        this.searchAutocomplete$.next(autocompleteData);
    }

    public get searchAutocompleteChanges(): Observable<DatasetAutocompleteItem[]> {
        return this.searchAutocomplete$.asObservable();
    }

    public searchDatasets(searchQuery: string, page = 0): void {
        this.searchApi.overviewDatasetSearch(searchQuery, page).subscribe((data: SearchDatasetsOverviewQuery) => {
            const datasets: DatasetSearchOverviewFragment[] = data.search.query.nodes;
            const pageInfo = data.search.query.pageInfo;
            const totalCount: number = data.search.query.totalCount;

            this.emitSearchOverviewChanged({
                datasets,
                pageInfo,
                totalCount,
                currentPage: page + 1,
            });
        });
    }

    public autocompleteDatasetSearch(searchQuery: string): void {
        this.searchApi.autocompleteDatasetSearch(searchQuery).subscribe(
            (data: DatasetAutocompleteItem[]) => {
                this.emitSearchAutocompleteChanged(data);
            },
            () => {
                this.emitSearchAutocompleteChanged([]);
            },
        );
    }
}
