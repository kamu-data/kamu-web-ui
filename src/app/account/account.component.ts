/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { AsyncPipe } from "@angular/common";
import { ChangeDetectionStrategy, Component, inject, Input } from "@angular/core";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { MatDividerModule } from "@angular/material/divider";
import { MatIconModule } from "@angular/material/icon";
import { RouterLink, RouterOutlet } from "@angular/router";

import { Observable } from "rxjs";

import { CopyToClipboardComponent } from "@common/components/copy-to-clipboard/copy-to-clipboard.component";
import { ModalService } from "@common/components/modal/modal.service";
import { FeatureFlagDirective } from "@common/directives/feature-flag.directive";
import { promiseWithCatch } from "@common/helpers/app.helpers";
import { DisplayAccountNamePipe } from "@common/pipes/display-account-name.pipe";
import { DisplayDatasetIdPipe } from "@common/pipes/display-dataset-id.pipe";
import RoutingResolvers from "@common/resolvers/routing-resolvers";
import AppValues from "@common/values/app.values";
import { AccountFragment } from "@api/kamu.graphql.interface";

import { AccountTabs } from "src/app/account/account.constants";
import { AccountService } from "src/app/account/account.service";
import { LoggedUserService } from "src/app/auth/logged-user.service";
import ProjectLinks from "src/app/project-links";

@Component({
    selector: "app-account",
    templateUrl: "./account.component.html",
    styleUrls: ["./account.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        //-----//
        AsyncPipe,
        RouterLink,
        RouterOutlet,
        //-----//
        MatButtonToggleModule,
        MatDividerModule,
        MatIconModule,
        //-----//
        CopyToClipboardComponent,
        DisplayAccountNamePipe,
        DisplayDatasetIdPipe,
        FeatureFlagDirective,
    ],
})
export class AccountComponent {
    @Input(ProjectLinks.URL_PARAM_ACCOUNT_NAME) public set accountName(value: string) {
        this.datasetTotalCount$ = this.accountService.getDatasetsTotalCountByAccountName(value);
    }
    @Input(RoutingResolvers.ACCOUNT_KEY) public account: AccountFragment;
    @Input(RoutingResolvers.ACCOUNT_ACTIVE_TAB_KEY) public activeTab: AccountTabs;
    public datasetTotalCount$: Observable<number>;

    public readonly AccountTabs = AccountTabs;
    public readonly URL_ACCOUNT_SELECT = ProjectLinks.URL_ACCOUNT_SELECT;
    public isDropdownMenu = false;

    private modalService = inject(ModalService);
    private accountService = inject(AccountService);
    private loggedUserService = inject(LoggedUserService);

    public avatarLink(): string {
        return this.account.avatarUrl ?? AppValues.DEFAULT_AVATAR_URL;
    }

    public isLoggedUser(): boolean {
        return this.loggedUserService.maybeCurrentlyLoggedInUser?.accountName === this.account.accountName;
    }

    public showFlows(): boolean {
        return this.isLoggedUser() || Boolean(this.loggedUserService.maybeCurrentlyLoggedInUser?.isAdmin);
    }

    public showSettings(): boolean {
        return (
            this.loggedUserService.maybeCurrentlyLoggedInUser?.accountName !== this.account.accountName &&
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
}
