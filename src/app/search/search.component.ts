import { AppSearchService } from "./search.service";
import {
    PageInfoInterface,
    SearchOverviewDatasetsInterface,
    SearchOverviewInterface,
} from "../interface/search.interface";
import AppValues from "../common/app.values";
import { searchAdditionalButtonsEnum } from "./search.interface";
import { SearchAdditionalButtonInterface } from "../components/search-additional-buttons/search-additional-buttons.interface";
import { MatSidenav } from "@angular/material/sidenav";
import { SideNavService } from "../services/sidenav.service";
import { Router } from "@angular/router";
import {
    AfterContentInit,
    Component,
    HostListener,
    OnInit,
    ViewChild,
} from "@angular/core";
import { ThemePalette } from "@angular/material/core";

export interface SearchFilters {
    name?: string;
    isTitle?: boolean;
    completed?: boolean;
    disabled?: boolean;
    color?: ThemePalette;
    subtasks?: SearchFilters[];
}

@Component({
    selector: "app-search",
    templateUrl: "./search.component.html",
    styleUrls: ["./search.component.sass"],
})
export class SearchComponent implements OnInit, AfterContentInit {
    @ViewChild("sidenav", { static: true }) public sidenav?: MatSidenav;
    public isMobileView = false;
    public searchValue = "";
    public currentPage = 1; // TODO: Should be zero-based and only offset for display
    public isMinimizeSearchAdditionalButtons = false;
    public searchAdditionalButtonsData: SearchAdditionalButtonInterface[] = [
        {
            textButton: searchAdditionalButtonsEnum.Descission,
        },
        {
            textButton: searchAdditionalButtonsEnum.Reputation,
        },
        {
            textButton: searchAdditionalButtonsEnum.Explore,
            styleClassContainer: "app-active-button__container",
            styleClassButton: "app-active-button",
        },
        {
            textButton: searchAdditionalButtonsEnum.DeriveFrom,
            styleClassContainer: "app-active-button__container",
            styleClassButton: "app-active-button",
        },
    ];

    private sortOptions: { value: string; label: string; active: boolean }[] = [
        { value: "best", label: "Best match", active: true },
        { value: "recently", label: "Recently indexed", active: false },
        { value: "least", label: "Least recently indexed", active: false },
    ];

    public allComplete: boolean = false;
    public tableData: {
        tableSource: SearchOverviewDatasetsInterface[];
        isResultQuantity: boolean;
        resultUnitText: string;
        isClickableRow: boolean;
        pageInfo: PageInfoInterface;
        totalCount: number;
        sortOptions: { value: string; label: string; active: boolean }[];
    };
    public filters: SearchFilters[] = [
        {
            name: "Search for:",
            isTitle: true,
            subtasks: [
                { name: "Datasets", completed: true, color: "primary" },
                {
                    name: "Collections",
                    completed: false,
                    disabled: true,
                    color: "primary",
                },
                {
                    name: "Users",
                    completed: false,
                    disabled: true,
                    color: "primary",
                },
                {
                    name: "Organizations",
                    completed: false,
                    disabled: true,
                    color: "primary",
                },
            ],
        },
        {
            name: "Datasets:",
            isTitle: true,
            subtasks: [
                { name: "Root", completed: true, color: "primary" },
                { name: "Derivative", completed: true, color: "primary" },
                {
                    name: "Updated within:",
                    isTitle: true,
                    subtasks: [
                        {
                            name: "Last day",
                            completed: false,
                            color: "primary",
                        },
                        {
                            name: "Last month",
                            completed: false,
                            color: "primary",
                        },
                        {
                            name: "Last year",
                            completed: false,
                            color: "primary",
                        },
                    ],
                },
            ],
        },
    ];
    public searchData: SearchOverviewDatasetsInterface[] = [];
    private _window: Window;

    @HostListener("window:resize", ["$event"])
    private checkWindowSize(): void {
        this.isMinimizeSearchAdditionalButtons = AppValues.isMobileView();
        this.isMobileView = AppValues.isMobileView();

        if (AppValues.isMobileView()) {
            this.sidenavService.close();
        } else {
            this.sidenavService.open();
        }
    }

    constructor(
        private router: Router,
        private appSearchService: AppSearchService,
        private sidenavService: SideNavService,
    ) {
        this._window = window;
    }

    public ngAfterContentInit(): void {
        this.tableData.tableSource = this.searchData;

        this.changePageAndSearch();
    }

    public ngOnInit(): void {
        if (this.sidenav) {
            this.sidenavService.setSidenav(this.sidenav);
            this.checkWindowSize();
        }

        this.initTableData();

        this.changePageAndSearch();

        this.appSearchService.onSearchChanges.subscribe((value: string) => {
            this.searchValue = value;
            this.onSearch(value, this.currentPage);
        });

        this.appSearchService.onSearchDataChanges.subscribe(
            (data: SearchOverviewInterface) => {
                this.tableData.tableSource = data.dataset;
                this.tableData.pageInfo = data.pageInfo;
                this.tableData.totalCount = data.totalCount as number;
                this.currentPage = data.currentPage;
            },
        );
    }
    private changePageAndSearch(): void {
        let page = 1;
        let currentId = "";

        if (this._window.location.search.split("?id=").length > 1) {
            currentId = this._window.location.search
                .split("?id=")[1]
                .split("&")[0];
            this.searchValue = currentId;

            const searchPageParams: string[] =
                this._window.location.search.split("&p=");
            if (searchPageParams[1]) {
                page = Number(searchPageParams[1].split("&")[0]);
            }
        }

        this.currentPage = page;
        this.onSearch(currentId, page);
    }

    private initTableData(): void {
        this.tableData = {
            tableSource: this.searchData,
            resultUnitText: "dataset(s) found",
            isResultQuantity: true,
            isClickableRow: true,
            pageInfo: {
                hasNextPage: false,
                hasPreviousPage: false,
                totalPages: 1,
            },
            totalCount: 0,
            sortOptions: this.sortOptions,
        };
    }

    public onPageChange(params: {
        currentPage: number;
        isClick: boolean;
    }): void {
        this.currentPage = params.currentPage;

        this.router.navigate([AppValues.urlSearch], {
            queryParams: { id: this.searchValue, p: params.currentPage },
        });
    }

    public onSelectDataset(data: { ownerName: string; id: string }): void {
        const id: string = data.id;
        this.router.navigate([data.ownerName, AppValues.urlDatasetView], {
            queryParams: { id, type: AppValues.urlDatasetViewOverviewType },
        });
    }

    public onSearch(searchValue: string, page: number = 1): void {
        this.appSearchService.search(searchValue, page - 1);
    }

    public updateAllComplete() {
        this.allComplete =
            this.filters != null &&
            this.filters.every((t) =>
                t.subtasks?.every((sub) => sub.completed),
            );
    }
}
