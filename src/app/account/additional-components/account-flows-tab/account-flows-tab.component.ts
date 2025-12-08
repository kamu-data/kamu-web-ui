/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ChangeDetectionStrategy, Component, inject, Input } from "@angular/core";
import { MaybeUndefined } from "src/app/interface/app.types";
import { DatasetBasicsFragment, FlowStatus } from "src/app/api/kamu.graphql.interface";
import { AccountTabs } from "../../account.constants";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatIconModule } from "@angular/material/icon";
import { ActivatedRoute, ParamMap } from "@angular/router";
import ProjectLinks from "src/app/project-links";
import { NgbNavChangeEvent, NgbNavModule } from "@ng-bootstrap/ng-bootstrap";
import { AccountFlowsNav, ProcessCardFilterMode } from "./account-flows-tab.types";
import RoutingResolvers from "src/app/common/resolvers/routing-resolvers";
import { AccountFlowsType } from "./resolvers/account-flows.resolver";
import AppValues from "src/app/common/values/app.values";
import { AccountFlowsActivitySubtabComponent } from "./account-flows-subtabs/account-flows-activity-subtab/account-flows-activity-subtab.component";
import { AccountFlowsDatasetsSubtabComponent } from "./account-flows-subtabs/account-flows-datasets-subtab/account-flows-datasets-subtab.component";
import { NavigationService } from "src/app/services/navigation.service";

@Component({
    selector: "app-account-flows-tab",
    templateUrl: "./account-flows-tab.component.html",
    styleUrls: ["./account-flows-tab.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        //-----//
        MatIconModule,
        MatProgressBarModule,
        NgbNavModule,

        //-----//
        AccountFlowsActivitySubtabComponent,
        AccountFlowsDatasetsSubtabComponent,
    ],
})
export class AccountFlowsTabComponent {
    @Input(RoutingResolvers.ACCOUNT_FLOWS_KEY) public set setAccountFlowsData(value: AccountFlowsType) {
        this.accountFlowsData = value;
    }

    private readonly activatedRoute = inject(ActivatedRoute);
    private readonly navigationService = inject(NavigationService);

    public searchByDataset: DatasetBasicsFragment[] = [];
    public accountFlowsData: AccountFlowsType;

    public readonly AccountFlowsNav: typeof AccountFlowsNav = AccountFlowsNav;
    public readonly FlowStatus: typeof FlowStatus = FlowStatus;
    public readonly DEFAULT_AVATAR_URL = AppValues.DEFAULT_AVATAR_URL;

    public get accountName(): string {
        const paramMap: MaybeUndefined<ParamMap> = this.activatedRoute?.parent?.parent?.snapshot.paramMap;
        return paramMap?.get(ProjectLinks.URL_PARAM_ACCOUNT_NAME) as string;
    }

    public onNavChange(event: NgbNavChangeEvent): void {
        const nextNav = event.nextId as AccountFlowsNav;
        this.navigationService.navigateToOwnerView(
            this.accountName,
            AccountTabs.FLOWS,
            undefined,
            nextNav,
            undefined,
            nextNav === AccountFlowsNav.DATASETS ? ProcessCardFilterMode.RECENT_ACTIVITY : undefined,
        );
    }
}
