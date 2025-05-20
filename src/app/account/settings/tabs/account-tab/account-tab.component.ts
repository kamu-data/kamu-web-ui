/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { ParamMap, Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { AccountService } from "src/app/account/account.service";
import { LoggedUserService } from "src/app/auth/logged-user.service";
import { BaseComponent } from "src/app/common/components/base.component";
import { ModalService } from "src/app/common/components/modal/modal.service";
import { promiseWithCatch } from "src/app/common/helpers/app.helpers";
import { MaybeNullOrUndefined, MaybeUndefined } from "src/app/interface/app.types";
import ProjectLinks from "src/app/project-links";
import { NavigationService } from "src/app/services/navigation.service";

@Component({
    selector: "app-account-tab",
    templateUrl: "./account-tab.component.html",
    styleUrls: ["./account-tab.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountTabComponent extends BaseComponent {
    private modalService = inject(ModalService);
    private loggedUserService = inject(LoggedUserService);
    private router = inject(Router);
    private accountService = inject(AccountService);
    private toastrService = inject(ToastrService);
    private navigationService = inject(NavigationService);

    public deleteAccount(): void {
        const message = "Do you want to delete a account";
        promiseWithCatch(
            this.modalService.error({
                title: "Delete",
                message: message,
                yesButtonText: "Ok",
                noButtonText: "Cancel",
                handler: (ok) => {
                    if (ok) {
                        const accountName =
                            this.isOwnerPage && !this.accountName
                                ? this.loggedUserService.currentlyLoggedInUser.accountName
                                : (this.accountName as string);
                        this.accountService
                            .deleteAccountByName(accountName)
                            .pipe(takeUntilDestroyed(this.destroyRef))
                            .subscribe((success: boolean) => {
                                if (success) {
                                    this.toastrService.success("The account has been deleted.");
                                    if (this.accountName) {
                                        this.navigationService.navigateToHome();
                                    } else {
                                        this.loggedUserService.logout();
                                    }
                                }
                            });
                    }
                },
            }),
        );
    }

    public get isAdmin(): boolean {
        return this.loggedUserService.isAdmin;
    }

    public get isOwnerPage(): boolean {
        return this.router.url.includes(ProjectLinks.URL_SETTINGS);
    }

    public get accountName(): MaybeNullOrUndefined<string> {
        const paramMap: MaybeUndefined<ParamMap> = this.activatedRoute?.parent?.parent?.snapshot.paramMap;
        return paramMap?.get(ProjectLinks.URL_PARAM_ACCOUNT_NAME);
    }
}
