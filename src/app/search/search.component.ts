import { ActivatedRoute } from "@angular/router";
import { AppSearchService } from "./search.service";
import { DatasetSearchResult } from "../interface/search.interface";
import AppValues from "../common/app.values";
import {
    AfterContentInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    HostListener,
    OnInit,
} from "@angular/core";
import { ThemePalette } from "@angular/material/core";
import { BaseComponent } from "../common/base.component";
import { NavigationService } from "../services/navigation.service";
import {
    DatasetSearchOverviewFragment,
    PageBasedInfo,
} from "../api/kamu.graphql.interface";
import { DatasetInfo } from "../interface/navigation.interface";
import { requireValue } from "../common/app.helpers";

export interface SearchFilters {
    name?: string;
    isTitle: boolean;
    completed: boolean;
    disabled: boolean;
    color?: ThemePalette;
    subtasks?: SearchFilters[];
}

@Component({
    selector: "app-search",
    templateUrl: "./search.component.html",
    styleUrls: ["./search.component.sass"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchComponent
    extends BaseComponent
    implements OnInit, AfterContentInit
{
    public isMobileView = false;
    public searchValue = "";
    public currentPage = 1; // TODO: Should be zero-based and only offset for display
    public isMinimizeSearchAdditionalButtons = false;

    private sortOptions: { value: string; label: string; active: boolean }[] = [
        { value: "best", label: "Best match", active: true },
        { value: "recently", label: "Recently indexed", active: false },
        { value: "least", label: "Least recently indexed", active: false },
    ];

    public allComplete = false;
    public tableData: {
        tableSource: DatasetSearchOverviewFragment[];
        hasResultQuantity: boolean;
        resultUnitText: string;
        isClickableRow: boolean;
        pageInfo: PageBasedInfo;
        totalCount: number;
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

    public searchData: DatasetSearchOverviewFragment[] = [];

    @HostListener("window:resize", ["$event"])
    private checkWindowSize(): void {
        this.isMinimizeSearchAdditionalButtons = AppValues.isMobileView();
        this.isMobileView = AppValues.isMobileView();
    }

    constructor(
        private navigationService: NavigationService,
        private appSearchService: AppSearchService,
        private activatedRoute: ActivatedRoute,
        private cdr: ChangeDetectorRef,
    ) {
        super();
    }

    public ngAfterContentInit(): void {
        this.tableData.tableSource = this.searchData;
    }

    public ngOnInit(): void {
        this.checkWindowSize();
        this.initTableData();

        this.changePageAndSearch();

        this.trackSubscriptions(
            this.appSearchService.onSearchQueryChanges.subscribe(
                (value: string) => {
                    this.searchValue = value;
                    const pageParam =
                        this.activatedRoute.snapshot.queryParamMap.get("page");
                    if (pageParam) {
                        this.currentPage = 1;
                    }
                    this.onSearchDatasets(value, this.currentPage);
                },
            ),
            this.appSearchService.onOverviewSearchChanges.subscribe(
                (data: DatasetSearchResult) => {
                    this.tableData.tableSource = data.datasets;
                    this.tableData.pageInfo = data.pageInfo;
                    this.tableData.totalCount = data.totalCount;
                    this.cdr.markForCheck();
                },
            ),
        );
    }

    private changePageAndSearch(): void {
        let page = 1;
        let queryValue = "";
        const queryParam =
            this.activatedRoute.snapshot.queryParamMap.get("query");
        if (queryParam) {
            queryValue = requireValue(queryParam);
            this.searchValue = queryValue;
        }
        const pageParam =
            this.activatedRoute.snapshot.queryParamMap.get("page");
        if (pageParam) {
            page = +requireValue(pageParam);
        }
        this.currentPage = page;
        this.onSearchDatasets(queryValue, page);
    }

    private initTableData(): void {
        this.tableData = {
            tableSource: this.searchData,
            resultUnitText: "dataset(s) found",
            hasResultQuantity: true,
            isClickableRow: true,
            pageInfo: {
                hasNextPage: false,
                hasPreviousPage: false,
                totalPages: 1,
                currentPage: 1,
            },
            totalCount: 0,
            sortOptions: this.sortOptions,
        };
    }

    public onPageChange(params: {
        currentPage: number;
        isClick: boolean;
    }): void {
        params.currentPage
            ? (this.currentPage = params.currentPage)
            : (this.currentPage = 1);
        this.appSearchService.searchQueryChanges(this.searchValue);
        if (this.currentPage === 1) {
            this.navigationService.navigateToSearch(this.searchValue);
            return;
        }
        this.navigationService.navigateToSearch(
            this.searchValue,
            params.currentPage,
        );
    }

    public onSelectDataset(data: DatasetInfo): void {
        this.navigationService.navigateToDatasetView({
            accountName: data.accountName,
            datasetName: data.datasetName,
        });
    }

    public onSearchDatasets(searchValue: string, page = 1): void {
        this.appSearchService.searchDatasets(searchValue, page - 1);
    }

    public updateAllComplete() {
        this.allComplete = this.filters.every((t) =>
            t.subtasks?.every((sub) => sub.completed),
        );
    }
}
