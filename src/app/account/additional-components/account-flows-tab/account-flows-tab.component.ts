/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ChangeDetectionStrategy, Component, inject, Input } from "@angular/core";
import { ActivatedRoute, ParamMap } from "@angular/router";

import { NgbNavChangeEvent, NgbNavModule } from "@ng-bootstrap/ng-bootstrap";

import { enumValueOf, requireValue } from "@common/helpers/app.helpers";
import RoutingResolvers from "@common/resolvers/routing-resolvers";
import AppValues from "@common/values/app.values";
import { DatasetBasicsFragment, FlowStatus } from "@api/kamu.graphql.interface";
import { MaybeUndefined } from "@interface/app.types";

import { AccountTabs } from "src/app/account/account.constants";
import { AccountFlowsActivitySubtabComponent } from "src/app/account/additional-components/account-flows-tab/account-flows-subtabs/account-flows-activity-subtab/account-flows-activity-subtab.component";
import { AccountFlowsProcessesSubtabComponent } from "src/app/account/additional-components/account-flows-tab/account-flows-subtabs/account-flows-processes-subtab/account-flows-processes-subtab.component";
import {
    AccountFlowsNav,
    ProcessCardFilterMode,
} from "src/app/account/additional-components/account-flows-tab/account-flows-tab.types";
import { AccountFlowsType } from "src/app/account/additional-components/account-flows-tab/resolvers/account-flows.resolver";
import ProjectLinks from "src/app/project-links";
import { NavigationService } from "src/app/services/navigation.service";

@Component({
    selector: "app-account-flows-tab",
    templateUrl: "./account-flows-tab.component.html",
    styleUrls: ["./account-flows-tab.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        //-----//
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
        return requireValue(paramMap?.get(ProjectLinks.URL_PARAM_ACCOUNT_NAME), "Route has no account name");
    }

    public onNavChange(event: NgbNavChangeEvent): void {
        const nextNav = enumValueOf(AccountFlowsNav, event.nextId);
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
