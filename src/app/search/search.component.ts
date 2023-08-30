import { NavigationEnd, Router, RouterEvent } from "@angular/router";
import { SearchService } from "./search.service";
import { DatasetSearchResult, SearchFilters } from "../interface/search.interface";
import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { BaseComponent } from "../common/base.component";
import { NavigationService } from "../services/navigation.service";
import { DatasetInfo } from "../interface/navigation.interface";
import { requireValue } from "../common/app.helpers";
import ProjectLinks from "../project-links";
import { filter, map } from "rxjs/operators";
import { Observable } from "rxjs";

@Component({
    selector: "app-search",
    templateUrl: "./search.component.html",
    styleUrls: ["./search.component.sass"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchComponent extends BaseComponent implements OnInit {
    public searchValue = "";
    public currentPage = 1; // TODO: Should be zero-based and only offset for display
    public tableData$: Observable<DatasetSearchResult> = this.searchService.onOverviewSearchChanges;

    private sortOptions: { value: string; label: string; active: boolean }[] = [
        { value: "best", label: "Best match", active: true },
        { value: "recently", label: "Recently indexed", active: false },
        { value: "least", label: "Least recently indexed", active: false },
    ];

    public allComplete = false;

    public tableData: {
        hasResultQuantity: boolean;
        resultUnitText: string;
        isClickableRow: boolean;
        sortOptions: { value: string; label: string; active: boolean }[];
    };

    public filters: SearchFilters[] = [
        {
            name: "Search for:",
            isTitle: true,
            completed: true,
            disabled: true,
            subtasks: [
                {
                    name: "Datasets",
                    isTitle: false,
                    completed: true,
                    color: "primary",
                    disabled: false,
                },
                {
                    name: "Collections",
                    isTitle: false,
                    completed: false,
                    disabled: true,
                    color: "primary",
                },
                {
                    name: "Users",
                    isTitle: false,
                    completed: false,
                    disabled: true,
                    color: "primary",
                },
                {
                    name: "Organizations",
                    isTitle: false,
                    completed: false,
                    disabled: true,
                    color: "primary",
                },
            ],
        },
        {
            name: "Datasets:",
            isTitle: true,
            completed: true,
            disabled: true,
            subtasks: [
                {
                    name: "Root",
                    isTitle: false,
                    completed: true,
                    color: "primary",
                    disabled: false,
                },
                {
                    name: "Derivative",
                    isTitle: false,
                    completed: true,
                    color: "primary",
                    disabled: false,
                },
                {
                    name: "Updated within:",
                    isTitle: true,
                    completed: true,
                    disabled: true,
                    subtasks: [
                        {
                            name: "Last day",
                            isTitle: false,
                            completed: false,
                            color: "primary",
                            disabled: false,
                        },
                        {
                            name: "Last month",
                            isTitle: false,
                            completed: false,
                            color: "primary",
                            disabled: false,
                        },
                        {
                            name: "Last year",
                            isTitle: false,
                            completed: false,
                            color: "primary",
                            disabled: false,
                        },
                    ],
                },
            ],
        },
    ];

    constructor(
        private navigationService: NavigationService,
        private searchService: SearchService,
        private router: Router,
    ) {
        super();
    }

    public ngOnInit(): void {
        this.initTableData();

        this.changePageAndSearch();

        this.trackSubscriptions(
            this.router.events
                .pipe(
                    filter((event) => event instanceof NavigationEnd),
                    map((event) => event as RouterEvent),
                )
                .subscribe(() => this.changePageAndSearch()),
        );
    }

    private changePageAndSearch(): void {
        let queryValue = "";
        const queryParam = this.activatedRoute.snapshot.queryParamMap.get(ProjectLinks.URL_QUERY_PARAM_QUERY);
        if (queryParam) {
            queryValue = requireValue(queryParam);
        }
        this.searchValue = queryValue;

        let page = 1;
        const pageParam = this.activatedRoute.snapshot.queryParamMap.get(ProjectLinks.URL_QUERY_PARAM_PAGE);
        if (pageParam) {
            page = +requireValue(pageParam);
        }
        this.currentPage = page;

        this.onSearchDatasets();
    }

    private initTableData(): void {
        this.tableData = {
            resultUnitText: "dataset(s) found",
            hasResultQuantity: true,
            isClickableRow: true,
            sortOptions: this.sortOptions,
        };
    }

    public onPageChange(currentPage: number): void {
        currentPage ? (this.currentPage = currentPage) : (this.currentPage = 1);
        if (this.currentPage === 1) {
            this.navigationService.navigateToSearch(this.searchValue);
            return;
        }
        this.navigationService.navigateToSearch(this.searchValue, currentPage);
    }

    public onSelectDataset(data: DatasetInfo): void {
        this.navigationService.navigateToDatasetView({
            accountName: data.accountName,
            datasetName: data.datasetName,
        });
    }

    private onSearchDatasets(): void {
        this.searchService.searchDatasets(this.searchValue, this.currentPage - 1);
    }

    public updateAllComplete() {
        this.allComplete = this.filters.every((t) => t.subtasks?.every((sub) => sub.completed));
    }
}
