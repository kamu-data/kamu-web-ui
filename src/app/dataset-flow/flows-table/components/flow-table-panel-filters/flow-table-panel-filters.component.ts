/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { NgIf } from "@angular/common";
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatIconModule } from "@angular/material/icon";

import { AngularMultiSelectModule } from "angular2-multiselect-dropdown";
import { DropdownSettings } from "angular2-multiselect-dropdown/lib/multiselect.interface";
import {
    DROPDOWN_ACCOUNT_SETTINGS,
    DROPDOWN_DATASET_SETTINGS,
    DROPDOWN_STATUS_SETTINGS,
    FilterStatusType,
    FlowsTableFiltersOptions,
} from "src/app/dataset-flow/flows-table/flows-table.types";

import { AccountFragment, DatasetBasicsFragment, FlowStatus } from "@api/kamu.graphql.interface";
import { MaybeNull } from "@interface/app.types";

@Component({
    selector: "app-flow-table-panel-filters",
    imports: [
        //-----//
        NgIf,
        FormsModule,
        //-----//
        AngularMultiSelectModule,
        MatIconModule,
    ],
    templateUrl: "./flow-table-panel-filters.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FlowTablePanelFiltersComponent implements OnInit {
    @Input({ required: true }) public onlySystemFlows: boolean;
    @Input({ required: true }) public hasDatasetColumn: boolean;
    @Input({ required: true }) public accountFlowInitiators: AccountFragment[];
    @Input({ required: true }) public involvedDatasets: DatasetBasicsFragment[];

    @Input({ required: true }) public selectedDatasetItems: DatasetBasicsFragment[] = [];
    @Input({ required: true }) public selectedAccountItems: AccountFragment[] = [];
    @Input({ required: true }) public selectedStatusItems: FilterStatusType[] = [];

    @Output() public searchByFiltersChange = new EventEmitter<MaybeNull<FlowsTableFiltersOptions>>();
    @Output() public resetFiltersChange = new EventEmitter<void>();

    public filterAccountSettings = DROPDOWN_ACCOUNT_SETTINGS;
    public dropdownDatasetList: DatasetBasicsFragment[] = [];
    public dropdownAccountList: AccountFragment[] = [];
    public dropdownStatustList: FilterStatusType[] = [];

    public readonly FILTER_DATASET_SETTINGS: DropdownSettings = DROPDOWN_DATASET_SETTINGS;
    public readonly FILTER_STATUS_SETTINGS: DropdownSettings = DROPDOWN_STATUS_SETTINGS;
    private readonly FILTERED_ITEMS_COUNT = 10;

    public ngOnInit(): void {
        this.dropdownStatustList = Object.entries(FlowStatus).map(([key]) => {
            return { id: key, status: key };
        });
        this.dropdownStatustList = [{ id: "All", status: "All" }, ...this.dropdownStatustList];
        this.dropdownAccountList = this.accountFlowInitiators.slice(0, this.FILTERED_ITEMS_COUNT);
        this.dropdownDatasetList = this.involvedDatasets;
    }

    public onSearch(): void {
        this.searchByFiltersChange.emit({
            accounts: this.selectedAccountItems,
            datasets: this.selectedDatasetItems,
            status:
                !this.selectedStatusItems.length || this.selectedStatusItems[0].status === "All"
                    ? this.hasDatasetColumn
                        ? [FlowStatus.Finished]
                        : null
                    : [this.selectedStatusItems[0].status.toUpperCase() as FlowStatus],
            onlySystemFlows: this.onlySystemFlows,
        });
    }

    public onResetFilters(): void {
        this.searchByFiltersChange.emit({
            accounts: [],
            datasets: [],
            status: this.hasDatasetColumn ? [FlowStatus.Finished] : null,
            onlySystemFlows: false,
        });
        this.resetFiltersChange.emit();
        this.filterAccountSettings.disabled = false;
    }
}
