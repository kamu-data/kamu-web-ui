/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ChangeDetectionStrategy, Component, inject, Input, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatCheckboxModule } from "@angular/material/checkbox";

import { DatasetListComponent } from "@common/components/dataset-list-component/dataset-list.component";
import { PagePastEndComponent } from "@common/components/page-past-end/page-past-end.component";
import { PaginationComponent } from "@common/components/pagination-component/pagination.component";
import { FeatureFlagDirective } from "@common/directives/feature-flag.directive";
import { positiveIntegerFromParam, queryParamValue } from "@common/helpers/url-params.helpers";
import RoutingResolvers from "@common/resolvers/routing-resolvers";
import { MaybeUndefined } from "@interface/app.types";
import { DatasetSearchResult, SearchFilters } from "@interface/search.interface";

import ProjectLinks from "src/app/project-links";
import { NavigationService } from "src/app/services/navigation.service";

@Component({
    selector: "app-search",
    templateUrl: "./search.component.html",
    styleUrls: ["./search.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        //-----//
        FormsModule,
        //-----//
        MatCheckboxModule,
        //-----//
        DatasetListComponent,
        FeatureFlagDirective,
        PaginationComponent,
        PagePastEndComponent,
    ],
})
export class SearchComponent implements OnInit {
    @Input({ alias: ProjectLinks.URL_QUERY_PARAM_QUERY, transform: queryParamValue })
    public set search(value: MaybeUndefined<string>) {
        this.searchValue = value ?? "";
    }
    @Input({ alias: ProjectLinks.URL_QUERY_PARAM_PAGE, transform: queryParamValue })
    public set page(value: MaybeUndefined<string>) {
        this.currentPage = positiveIntegerFromParam(value) ?? 1;
    }
    @Input(RoutingResolvers.SEARCH_KEY) public data: DatasetSearchResult;

    private navigationService = inject(NavigationService);

    public searchValue: string;
    public currentPage: number; // TODO: Should be zero-based and only offset for display

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
