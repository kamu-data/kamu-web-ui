/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { NgIf } from "@angular/common";
import { ChangeDetectionStrategy, Component, inject, Input, OnInit } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatDividerModule } from "@angular/material/divider";
import { ParamMap, Router } from "@angular/router";

import { ToastrService } from "ngx-toastr";

import { BaseComponent } from "@common/components/base.component";
import { ModalService } from "@common/components/modal/modal.service";
import { FormValidationErrorsDirective } from "@common/directives/form-validation-errors.directive";
import { promiseWithCatch } from "@common/helpers/app.helpers";
import RoutingResolvers from "@common/resolvers/routing-resolvers";
import AppValues from "@common/values/app.values";
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
        NgIf,
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
            username: [
                this.isOwnerPage && !this.accountName
                    ? this.loggedUserService.currentlyLoggedInUser.accountName
                    : (this.accountName as string),
                [Validators.required, Validators.pattern(AppValues.DATASET_NAME_PATTERN)],
            ],
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
                        const accountName =
                            this.isOwnerPage && !this.accountName
                                ? this.loggedUserService.currentlyLoggedInUser.accountName
                                : (this.accountName as string);
                        this.accountService
                            .deleteAccountByName(accountName)
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
                        const accountName =
                            this.isOwnerPage && !this.accountName
                                ? this.loggedUserService.currentlyLoggedInUser.accountName
                                : (this.accountName as string);
                        this.accountService
                            .changeAccountUsername({
                                accountName,
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

    public get usernameControl(): AbstractControl {
        return this.changeUsernameForm.controls.username;
    }

    public get isOwnerPage(): boolean {
        return this.router.url.includes(ProjectLinks.URL_SETTINGS);
    }

    public get accountName(): MaybeNullOrUndefined<string> {
        const paramMap: MaybeUndefined<ParamMap> = this.activatedRoute?.parent?.parent?.snapshot.paramMap;
        return paramMap?.get(ProjectLinks.URL_PARAM_ACCOUNT_NAME);
    }
}
