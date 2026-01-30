/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import ProjectLinks from "src/app/project-links";
import { ChangeDetectionStrategy, Component, inject, Input } from "@angular/core";
import { AccountFragment } from "src/app/api/kamu.graphql.interface";
import { AccountTabs } from "./account.constants";
import AppValues from "src/app/common/values/app.values";
import { promiseWithCatch } from "src/app/common/helpers/app.helpers";
import { AccountService } from "src/app/account/account.service";
import { map, shareReplay } from "rxjs/operators";
import { Observable } from "rxjs";
import { MaybeNull } from "src/app/interface/app.types";
import { AccountNotFoundError } from "src/app/common/values/errors";
import { ModalService } from "../common/components/modal/modal.service";
import { LoggedUserService } from "../auth/logged-user.service";
import RoutingResolvers from "../common/resolvers/routing-resolvers";
import { DisplayAccountNamePipe } from "../common/pipes/display-account-name.pipe";
import { RouterLink, RouterOutlet } from "@angular/router";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { MatDividerModule } from "@angular/material/divider";
import { FeatureFlagDirective } from "../common/directives/feature-flag.directive";
import { NgIf, AsyncPipe } from "@angular/common";

@Component({
    selector: "app-account",
    templateUrl: "./account.component.html",
    styleUrls: ["./account.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        //-----//
        AsyncPipe,
        NgIf,
        RouterLink,
        RouterOutlet,
        //-----//
        MatButtonToggleModule,
        MatDividerModule,
        MatIconModule,
        //-----//
        DisplayAccountNamePipe,
        FeatureFlagDirective,
    ],
})
export class AccountComponent {
    @Input(ProjectLinks.URL_PARAM_ACCOUNT_NAME) public set accountName(value: string) {
        this.user$ = this.pipelineAccountByName(value);
        this.datasetTotalCount$ = this.accountService.getDatasetsTotalCountByAccountName(value);
    }
    @Input(RoutingResolvers.ACCOUNT_ACTIVE_TAB_KEY) public activeTab: AccountTabs;
    public datasetTotalCount$: Observable<number>;

    public readonly AccountTabs = AccountTabs;
    public readonly URL_ACCOUNT_SELECT = ProjectLinks.URL_ACCOUNT_SELECT;
    public isDropdownMenu = false;
    public user$: Observable<AccountFragment>;

    private modalService = inject(ModalService);
    private accountService = inject(AccountService);
    private loggedUserService = inject(LoggedUserService);

    public avatarLink(user: AccountFragment): string {
        return user.avatarUrl ?? AppValues.DEFAULT_AVATAR_URL;
    }

    public isLoggedUser(user: AccountFragment): boolean {
        return this.loggedUserService.maybeCurrentlyLoggedInUser?.accountName === user.accountName;
    }

    public showFlows(user: AccountFragment): boolean {
        return this.isLoggedUser(user) || Boolean(this.loggedUserService.maybeCurrentlyLoggedInUser?.isAdmin);
    }

    public showSettings(user: AccountFragment): boolean {
        return (
            this.loggedUserService.maybeCurrentlyLoggedInUser?.accountName !== user.accountName &&
            Boolean(this.loggedUserService.maybeCurrentlyLoggedInUser?.isAdmin)
        );
    }

    public onEditProfile(): void {
        promiseWithCatch(
            this.modalService.warning({
                message: AppValues.UNIMPLEMENTED_MESSAGE,
                yesButtonText: "Ok",
            }),
        );
    }

    public onFollow(): void {
        promiseWithCatch(
            this.modalService.warning({
                message: AppValues.UNIMPLEMENTED_MESSAGE,
                yesButtonText: "Ok",
            }),
        );
    }

    private pipelineAccountByName(accountName: string): Observable<AccountFragment> {
        return this.accountService.fetchAccountByName(accountName).pipe(
            shareReplay(),
            map((account: MaybeNull<AccountFragment>) => {
                if (account) return account;
                throw new AccountNotFoundError();
            }),
        );
    }
}
