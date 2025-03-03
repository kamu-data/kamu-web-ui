/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { SearchService } from "./search.service";
import { DatasetSearchResult, SearchFilters } from "../interface/search.interface";
import { ChangeDetectionStrategy, Component, inject, Input, OnInit } from "@angular/core";
import { NavigationService } from "../services/navigation.service";
import ProjectLinks from "../project-links";
import { Observable } from "rxjs";

@Component({
    selector: "app-search",
    templateUrl: "./search.component.html",
    styleUrls: ["./search.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchComponent implements OnInit {
    private navigationService = inject(NavigationService);
    private searchService = inject(SearchService);

    @Input(ProjectLinks.URL_QUERY_PARAM_QUERY) public set search(value: string) {
        this.searchValue = value ?? "";
    }

    public searchValue: string = "";
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
        this.currentPage = currentPage;
        if (currentPage === 1) {
            this.navigationService.navigateToSearch(this.searchValue);
            return;
        }
        this.navigationService.navigateToSearch(this.searchValue, currentPage);
    }

    public updateAllComplete() {
        this.allComplete = this.filters.every((t) => t.subtasks?.every((sub) => sub.completed));
    }
}
