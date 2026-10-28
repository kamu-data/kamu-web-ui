/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ChangeDetectionStrategy, Component, inject, Input, OnInit } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatDividerModule } from "@angular/material/divider";
import { ParamMap, Router } from "@angular/router";

import { ToastrService } from "ngx-toastr";

import { BaseComponent } from "@common/components/base.component";
import { ModalService } from "@common/components/modal/modal.service";
import { promiseWithCatch } from "@common/helpers/app.helpers";
import { isUrlWithin } from "@common/helpers/url-params.helpers";
import RoutingResolvers from "@common/resolvers/routing-resolvers";
import { FormValidationErrorsDirective } from "@common/validation/form-validation-errors.directive";
import { odfNameValidators } from "@common/validation/identifier.validators";
import { AccountWithEmailFragment } from "@api/kamu.graphql.interface";
import { MaybeNullOrUndefined, MaybeUndefined } from "@interface/app.types";

import { AccountTabs } from "src/app/account/account.constants";
import { AccountService } from "src/app/account/account.service";
import { ChangeAccountUsernameResult } from "src/app/account/settings/account-settings.constants";
import { ChangeUsernameFormType } from "src/app/account/settings/tabs/account-tab/account-tab.types";
import { AdminChangePasswordComponent } from "src/app/account/settings/tabs/password-and-authentication-tab/components/admin-change-password/admin-change-password.component";
import { LoggedUserService } from "src/app/auth/logged-user.service";
import ProjectLinks from "src/app/project-links";
import { NavigationService } from "src/app/services/navigation.service";

@Component({
    selector: "app-account-tab",
    templateUrl: "./account-tab.component.html",
    styleUrls: ["./account-tab.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        //-----//
        FormsModule,
        ReactiveFormsModule,
        //-----//
        MatDividerModule,
        //-----//
        FormValidationErrorsDirective,
        AdminChangePasswordComponent,
    ],
})
export class AccountTabComponent extends BaseComponent implements OnInit {
    @Input(RoutingResolvers.ACCOUNT_SETTINGS_ACCOUNT_KEY) public account: AccountWithEmailFragment;

    public changeUsernameForm: FormGroup<ChangeUsernameFormType>;

    private modalService = inject(ModalService);
    private loggedUserService = inject(LoggedUserService);
    private router = inject(Router);
    private accountService = inject(AccountService);
    private toastrService = inject(ToastrService);
    private navigationService = inject(NavigationService);
    private fb = inject(FormBuilder);

    public ngOnInit(): void {
        this.changeUsernameForm = this.fb.nonNullable.group({
            username: [this.editedAccountName, [Validators.required, ...odfNameValidators()]],
        });
    }

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
                        this.accountService
                            .deleteAccountByName(this.editedAccountName)
                            .pipe(takeUntilDestroyed(this.destroyRef))
                            .subscribe((success: boolean) => {
                                if (success) {
                                    this.toastrService.success("Account deleted.");
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

    public changeUsername(): void {
        const message = "Do you want to change username?";
        promiseWithCatch(
            this.modalService.error({
                title: "Change username",
                message: message,
                yesButtonText: "Ok",
                noButtonText: "Cancel",
                handler: (ok) => {
                    if (ok) {
                        this.accountService
                            .changeAccountUsername({
                                accountName: this.editedAccountName,
                                newName: this.changeUsernameForm.controls.username.value,
                            })
                            .pipe(takeUntilDestroyed(this.destroyRef))
                            .subscribe((result: ChangeAccountUsernameResult) => {
                                if (result.changed) {
                                    if (this.isOwnerPage && this.loggedUserService.currentlyLoggedInUser) {
                                        this.loggedUserService.changeUser({
                                            ...this.loggedUserService.currentlyLoggedInUser,
                                            accountName: result.name,
                                        });
                                    } else {
                                        this.navigationService.navigateToOwnerView(result.name, AccountTabs.SETTINGS);
                                    }
                                }
                            });
                    }
                },
            }),
        );
    }

    public get isOwnerPage(): boolean {
        return isUrlWithin(this.router.url, ProjectLinks.URL_SETTINGS);
    }

    public get accountName(): MaybeNullOrUndefined<string> {
        const paramMap: MaybeUndefined<ParamMap> = this.activatedRoute?.parent?.parent?.snapshot.paramMap;
        return paramMap?.get(ProjectLinks.URL_PARAM_ACCOUNT_NAME);
    }

    /** The account in the route, or the logged-in user's own account when the route names none. */
    private get editedAccountName(): string {
        return this.accountName ?? this.loggedUserService.currentlyLoggedInUser.accountName;
    }
}
