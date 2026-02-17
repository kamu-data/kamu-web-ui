/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ChangeDetectionStrategy, Component, inject, Input } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { ActivatedRoute, ParamMap } from "@angular/router";

import { DatasetBasicsFragment, FlowStatus } from "@api/kamu.graphql.interface";
import RoutingResolvers from "@common/resolvers/routing-resolvers";
import AppValues from "@common/values/app.values";
import { NgbNavChangeEvent, NgbNavModule } from "@ng-bootstrap/ng-bootstrap";
import { MaybeUndefined } from "src/app/interface/app.types";
import ProjectLinks from "src/app/project-links";
import { NavigationService } from "src/app/services/navigation.service";

import { AccountTabs } from "../../account.constants";
import { AccountFlowsActivitySubtabComponent } from "./account-flows-subtabs/account-flows-activity-subtab/account-flows-activity-subtab.component";
import { AccountFlowsProcessesSubtabComponent } from "./account-flows-subtabs/account-flows-processes-subtab/account-flows-processes-subtab.component";
import { AccountFlowsNav, ProcessCardFilterMode } from "./account-flows-tab.types";
import { AccountFlowsType } from "./resolvers/account-flows.resolver";

@Component({
    selector: "app-account-flows-tab",
    templateUrl: "./account-flows-tab.component.html",
    styleUrls: ["./account-flows-tab.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        //-----//
        MatIconModule,
        MatProgressBarModule,
        NgbNavModule,
        //-----//
        AccountFlowsActivitySubtabComponent,
        AccountFlowsProcessesSubtabComponent,
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
            nextNav === AccountFlowsNav.PROCESSES ? ProcessCardFilterMode.RECENT_ACTIVITY : undefined,
        );
    }
}
