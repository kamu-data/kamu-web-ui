import { SearchService } from "./search.service";
import { DatasetSearchResult, SearchFilters } from "../interface/search.interface";
import { ChangeDetectionStrategy, Component, inject, Input, numberAttribute, OnInit } from "@angular/core";
import { NavigationService } from "../services/navigation.service";
import ProjectLinks from "../project-links";
import { filter, map } from "rxjs/operators";
import { BehaviorSubject, combineLatest, Observable } from "rxjs";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { BaseComponent } from "../common/components/base.component";
import { NavigationEnd, Router, RouterEvent } from "@angular/router";

@Component({
    selector: "app-search",
    templateUrl: "./search.component.html",
    styleUrls: ["./search.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchComponent extends BaseComponent implements OnInit {
    @Input({ transform: numberAttribute, alias: ProjectLinks.URL_QUERY_PARAM_PAGE }) public set page(value: number) {
        this.page$.next(value ? value : 1);
    }
    @Input(ProjectLinks.URL_QUERY_PARAM_QUERY) public set searchValue(value: string) {
        this.searchValue$.next(value ? value : "");
    }

    public searchValue$: BehaviorSubject<string> = new BehaviorSubject<string>("");
    public page$: BehaviorSubject<number> = new BehaviorSubject<number>(1);

    private navigationService = inject(NavigationService);
    private searchService = inject(SearchService);
    private router = inject(Router);

    private currentSearchValue = "";
    public currentPage = 1; // TODO: Should be zero-based and only offset for display
    public tableData$: Observable<DatasetSearchResult> = this.searchService.searchOverviewChanges;

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

    public ngOnInit(): void {
        this.initTableData();
        this.changePageAndSearch();
        this.router.events
            .pipe(
                filter((event) => event instanceof NavigationEnd),
                map((event) => event as RouterEvent),
                takeUntilDestroyed(this.destroyRef),
            )
            .subscribe(() => this.changePageAndSearch());
    }

    private changePageAndSearch(): void {
        combineLatest([this.searchValue$.asObservable(), this.page$.asObservable()])
            .pipe(
                map(([searchValue, page]: [string, number]) => {
                    this.currentSearchValue = searchValue;
                    this.currentPage = page;
                    this.searchService.searchDatasets(searchValue, page - 1);
                }),
                takeUntilDestroyed(this.destroyRef),
            )
            .subscribe();
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
        if (currentPage === 1) {
            this.navigationService.navigateToSearch(this.currentSearchValue);
            return;
        }
        this.navigationService.navigateToSearch(this.currentSearchValue, currentPage);
    }

    public updateAllComplete() {
        this.allComplete = this.filters.every((t) => t.subtasks?.every((sub) => sub.completed));
    }
}
