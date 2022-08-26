import { AppSearchService } from "./search.service";
import { SearchOverviewInterface } from "../interface/search.interface";
import AppValues from "../common/app.values";
import { MatSidenav } from "@angular/material/sidenav";
import { SideNavService } from "../services/sidenav.service";
import {
    AfterContentInit,
    Component,
    HostListener,
    OnInit,
    ViewChild,
} from "@angular/core";
import { ThemePalette } from "@angular/material/core";
import { BaseComponent } from "../common/base.component";
import { NavigationService } from "../services/navigation.service";
import { Dataset, PageBasedInfo } from "../api/kamu.graphql.interface";
import { DatasetInfo } from "../interface/navigation.interface";
import { DatasetViewTypeEnum } from "../dataset-view/dataset-view.interface";
import { logError } from "../common/app.helpers";

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
export class SearchComponent
    extends BaseComponent
    implements OnInit, AfterContentInit
{
    @ViewChild("sidenav", { static: true }) public sidenav?: MatSidenav;
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
        tableSource: Dataset[];
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

    public searchData: Dataset[] = [];

    @HostListener("window:resize", ["$event"])
    private checkWindowSize(): void {
        this.isMinimizeSearchAdditionalButtons = AppValues.isMobileView();
        this.isMobileView = AppValues.isMobileView();

        if (AppValues.isMobileView()) {
            this.sidenavService.close()
                .catch(e => logError(e));
        } else {
            this.sidenavService.open()
                .catch(e => logError(e));
        }
    }

    constructor(
        private navigationService: NavigationService,
        private appSearchService: AppSearchService,
        private sidenavService: SideNavService,
    ) {
        super();
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

        this.trackSubscriptions(
            this.appSearchService.onSearchChanges.subscribe((value: string) => {
                this.searchValue = value;
                this.onSearch(value, this.currentPage);
            }),
            this.appSearchService.onSearchDataChanges.subscribe(
                (data: SearchOverviewInterface) => {
                    this.tableData.tableSource = data.datasets;
                    this.tableData.pageInfo = data.pageInfo;
                    this.tableData.totalCount = data.totalCount;
                    this.currentPage = data.currentPage;
                },
            ),
        );
    }

    private changePageAndSearch(): void {
        let page = 1;
        let currentId = "";

        if (this.searchString.split("?id=").length > 1) {
            currentId = this.searchString.split("?id=")[1].split("&")[0];
            this.searchValue = currentId;

            const searchPageParams: string[] = this.searchString.split("&p=");
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
        this.currentPage = params.currentPage;
        this.navigationService.navigateToSearch(
            this.searchValue,
            params.currentPage,
        );
    }

    public onSelectDataset(data: DatasetInfo): void {
        this.navigationService.navigateToDatasetView({
            accountName: data.accountName,
            datasetName: data.datasetName,
            tab: DatasetViewTypeEnum.Overview,
        });
    }

    public onSearch(searchValue: string, page = 1): void {
        this.appSearchService.search(searchValue, page - 1);
    }

    public updateAllComplete() {
        this.allComplete =
            this.filters.every((t) =>
                t.subtasks?.every((sub) => sub.completed),
            );
    }
}
