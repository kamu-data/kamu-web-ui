import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { SearchApi } from "../api/search.api";
import {
    DatasetIDsInterface,
    SearchOverviewInterface,
} from "../interface/search.interface";
import {
    Dataset,
    Scalars,
    SearchDatasetsOverviewQuery,
} from "../api/kamu.graphql.interface";
import Maybe from "graphql/tsutils/Maybe";

@Injectable()
export class AppSearchService {
    public searchData: SearchOverviewInterface;
    private searchChanges$: Subject<string> = new Subject<string>();
    private searchDataChanges$: Subject<SearchOverviewInterface> =
        new Subject<SearchOverviewInterface>();
    private autocompleteDatasetChanges$: Subject<DatasetIDsInterface[]> =
        new Subject<DatasetIDsInterface[]>();

    constructor(private searchApi: SearchApi) {}

    public searchChanges(searchValue: string): void {
        this.searchChanges$.next(searchValue);
    }
    public get onSearchChanges(): Observable<string> {
        return this.searchChanges$.asObservable();
    }
    public searchDataChanges(searchData: SearchOverviewInterface): void {
        this.searchDataChanges$.next(searchData);
    }
    public get onSearchDataChanges(): Observable<SearchOverviewInterface> {
        return this.searchDataChanges$.asObservable();
    }
    public autocompleteDatasetChanges(searchData: DatasetIDsInterface[]) {
        this.autocompleteDatasetChanges$.next(searchData);
    }
    public get onAutocompleteDatasetChanges(): Observable<
        DatasetIDsInterface[]
    > {
        return this.autocompleteDatasetChanges$.asObservable();
    }
    public search(searchValue: string, page = 0): void {
        this.searchApi
            .searchOverview(searchValue, page)
            .subscribe((data: SearchDatasetsOverviewQuery) => {
                let datasets: Dataset[] = data.search.query.nodes as Dataset[];
                let pageInfo = data.search.query.pageInfo;
                let totalCount: Maybe<Scalars["Int"]> =
                    data.search.query.totalCount;

                this.searchData = {
                    datasets,
                    pageInfo,
                    totalCount,
                    currentPage: page + 1 || 1,
                };
                this.searchDataChanges(this.searchData);
            });
    }

    public autocompleteDatasetSearch(search: string): void {
        this.searchApi.autocompleteDatasetSearch(search).subscribe(
            (data: DatasetIDsInterface[]) => {
                this.autocompleteDatasetChanges(data);
            },
            () => {
                this.autocompleteDatasetChanges([]);
            },
        );
    }
}
