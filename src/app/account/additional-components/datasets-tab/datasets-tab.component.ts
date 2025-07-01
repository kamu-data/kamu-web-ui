/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ChangeDetectionStrategy, inject, Input } from "@angular/core";
import { Component } from "@angular/core";
import { AccountTabs } from "../../account.constants";
import { NavigationService } from "src/app/services/navigation.service";
import { isNil } from "src/app/common/helpers/app.helpers";
import RoutingResolvers from "src/app/common/resolvers/routing-resolvers";
import { DatasetsAccountResolverResponse } from "src/app/interface/dataset.interface";
import { PaginationComponent } from "../../../common/components/pagination-component/pagination.component";
import { DatasetListItemComponent } from "../../../common/components/dataset-list-component/dataset-list-item/dataset-list-item.component";
import { NgIf, NgFor } from "@angular/common";

@Component({
    selector: "app-datasets-tab",
    templateUrl: "./datasets-tab.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [NgIf, NgFor, DatasetListItemComponent, PaginationComponent],
})
export class DatasetsTabComponent {
    @Input(RoutingResolvers.ACCOUNT_DATASETS_KEY) public accountResolverResponse: DatasetsAccountResolverResponse;
    public isClickableRow = true;

    private navigationService = inject(NavigationService);

    public get currentPage(): number {
        return this.accountResolverResponse.datasetsResponse.pageInfo.currentPage + 1;
    }

    public get accountName(): string {
        return this.accountResolverResponse.accountName;
    }

    public onPageChange(currentPage?: number): void {
        if (isNil(currentPage) || currentPage === 1) {
            this.navigationService.navigateToOwnerView(this.accountName, AccountTabs.DATASETS);
            return;
        }
        this.navigationService.navigateToOwnerView(this.accountName, AccountTabs.DATASETS, currentPage);
    }
}
