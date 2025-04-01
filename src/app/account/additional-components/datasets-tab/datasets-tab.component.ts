/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ChangeDetectionStrategy, inject, Input, OnChanges, SimpleChanges } from "@angular/core";
import { Component } from "@angular/core";
import { AccountTabs } from "../../account.constants";
import { NavigationService } from "src/app/services/navigation.service";
import { isNil } from "src/app/common/helpers/app.helpers";
import RoutingResolvers from "src/app/common/resolvers/routing-resolvers";
import { DatasetsAccountResolverResponse } from "src/app/interface/dataset.interface";

@Component({
    selector: "app-datasets-tab",
    templateUrl: "./datasets-tab.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DatasetsTabComponent implements OnChanges {
    @Input(RoutingResolvers.ACCOUNT_DATASETS_KEY) public accountResolverResponse: DatasetsAccountResolverResponse;
    public isClickableRow = true;

    public ngOnChanges(changes: SimpleChanges): void {
        if (
            changes.accountResolverResponse &&
            changes.accountResolverResponse.previousValue !== changes.accountResolverResponse.currentValue
        ) {
            this.accountResolverResponse = changes.accountResolverResponse
                .currentValue as DatasetsAccountResolverResponse;
        }
    }

    private navigationService = inject(NavigationService);

    public get currentPage(): number {
        return this.accountResolverResponse.response.pageInfo.currentPage + 1;
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
