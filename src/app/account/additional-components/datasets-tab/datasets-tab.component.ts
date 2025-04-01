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
import { DatasetsAccountResponse } from "src/app/interface/dataset.interface";
import ProjectLinks from "src/app/project-links";
import { ActivatedRoute } from "@angular/router";

@Component({
    selector: "app-datasets-tab",
    templateUrl: "./datasets-tab.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DatasetsTabComponent implements OnChanges {
    @Input(RoutingResolvers.ACCOUNT_DATASETS_KEY) public accountDatasets: DatasetsAccountResponse;
    public isClickableRow = true;

    private activatedRoute = inject(ActivatedRoute);

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes.accountDatasets && changes.accountDatasets.previousValue !== changes.accountDatasets.currentValue) {
            this.accountDatasets = changes.accountDatasets.currentValue as DatasetsAccountResponse;
        }
    }

    private navigationService = inject(NavigationService);

    public get currentPage(): number {
        return this.accountDatasets.pageInfo.currentPage + 1;
    }

    public get accountName(): string {
        return this.activatedRoute.parent?.parent?.snapshot.paramMap.get(ProjectLinks.URL_PARAM_ACCOUNT_NAME) ?? "";
    }

    public onPageChange(currentPage?: number): void {
        if (isNil(currentPage) || currentPage === 1) {
            this.navigationService.navigateToOwnerView(this.accountName, AccountTabs.DATASETS);
            return;
        }
        this.navigationService.navigateToOwnerView(this.accountName, AccountTabs.DATASETS, currentPage);
    }
}
