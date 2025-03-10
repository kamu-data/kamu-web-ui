/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import ProjectLinks from "src/app/project-links";
import { ChangeDetectionStrategy, Component, inject, Input, OnInit } from "@angular/core";
import { AccountFragment } from "src/app/api/kamu.graphql.interface";
import { AccountTabs } from "./account.constants";
import AppValues from "src/app/common/values/app.values";
import { promiseWithCatch } from "src/app/common/helpers/app.helpers";
import { AccountService } from "src/app/account/account.service";
import { DatasetsAccountResponse } from "src/app/interface/dataset.interface";
import { map, shareReplay } from "rxjs/operators";
import { Observable } from "rxjs";
import { MaybeNull, MaybeUndefined } from "src/app/interface/app.types";
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
export class AccountComponent implements OnInit {
    @Input(ProjectLinks.URL_PARAM_ACCOUNT_NAME) public accountName: string;
    @Input(ProjectLinks.URL_QUERY_PARAM_TAB) public set tab(value: MaybeUndefined<AccountTabs>) {
        this.activeTab = value && Object.values(AccountTabs).includes(value) ? value : AccountTabs.DATASETS;
    }
    @Input(RoutingResolvers.ACCOUNT_KEY) public accountDatasets: DatasetsAccountResponse;

    public activeTab: AccountTabs;
    public page: number;

    public readonly AccountTabs = AccountTabs;
    public isDropdownMenu = false;
    public user$: Observable<AccountFragment>;

    private modalService = inject(ModalService);
    private accountService = inject(AccountService);
    private loggedUserService = inject(LoggedUserService);

    public ngOnInit(): void {
        this.user$ = this.pipelineAccountByName(this.accountName);
    }

    public avatarLink(user: AccountFragment): string {
        return user.avatarUrl ?? AppValues.DEFAULT_AVATAR_URL;
    }

    public isLoggedUser(user: AccountFragment): boolean {
        return this.loggedUserService.maybeCurrentlyLoggedInUser?.accountName === user.accountName;
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
