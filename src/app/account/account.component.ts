/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import ProjectLinks from "src/app/project-links";
import { ChangeDetectionStrategy, Component, inject, Input, OnChanges, OnInit, SimpleChanges } from "@angular/core";
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

@Component({
    selector: "app-account",
    templateUrl: "./account.component.html",
    styleUrls: ["./account.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountComponent implements OnChanges, OnInit {
    @Input(ProjectLinks.URL_PARAM_ACCOUNT_NAME) public accountName: string;
    @Input(RoutingResolvers.ACCOUNT_ACTIVE_TAB_KEY) public activeTab: AccountTabs;
    public datasetTotalCount$: Observable<number>;

    public readonly AccountTabs = AccountTabs;
    public readonly URL_ACCOUNT_SELECT = ProjectLinks.URL_ACCOUNT_SELECT;
    public isDropdownMenu = false;
    public user$: Observable<AccountFragment>;

    private modalService = inject(ModalService);
    private accountService = inject(AccountService);
    private loggedUserService = inject(LoggedUserService);

    public ngOnInit(): void {
        this.datasetTotalCount$ = this.accountService.getDatasetsTotalCountByAccountName(this.accountName);
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes.accountName && changes.accountName.previousValue !== changes.accountName.currentValue) {
            this.user$ = this.pipelineAccountByName(changes.accountName.currentValue as string);
        }
    }

    public avatarLink(user: AccountFragment): string {
        return user.avatarUrl ?? AppValues.DEFAULT_AVATAR_URL;
    }

    public isLoggedUser(user: AccountFragment): boolean {
        return this.loggedUserService.maybeCurrentlyLoggedInUser?.accountName === user.accountName;
    }

    public showFlows(user: AccountFragment): boolean {
        return this.isLoggedUser(user) || Boolean(this.loggedUserService.maybeCurrentlyLoggedInUser?.isAdmin);
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
