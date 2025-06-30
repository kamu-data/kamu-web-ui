/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ChangeDetectionStrategy, Component, inject, Input, OnInit } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { AbstractControl, FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ParamMap, Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { AccountService } from "src/app/account/account.service";
import { AccountWithEmailFragment } from "src/app/api/kamu.graphql.interface";
import { LoggedUserService } from "src/app/auth/logged-user.service";
import { BaseComponent } from "src/app/common/components/base.component";
import { ModalService } from "src/app/common/components/modal/modal.service";
import { promiseWithCatch } from "src/app/common/helpers/app.helpers";
import RoutingResolvers from "src/app/common/resolvers/routing-resolvers";
import { MaybeNullOrUndefined, MaybeUndefined } from "src/app/interface/app.types";
import ProjectLinks from "src/app/project-links";
import { NavigationService } from "src/app/services/navigation.service";
import { ChangeUsernameFormType } from "./account-tab.types";
import { ChangeAccountUsernameResult } from "../../account-settings.constants";
import { AccountTabs } from "src/app/account/account.constants";
import AppValues from "src/app/common/values/app.values";
import { AdminChangePasswordComponent } from "../password-and-authentication-tab/components/admin-change-password/admin-change-password.component";
import { NgIf } from "@angular/common";
import { FormValidationErrorsDirective } from "../../../../common/directives/form-validation-errors.directive";
import { MatDividerModule } from "@angular/material/divider";

@Component({
    selector: "app-account-tab",
    templateUrl: "./account-tab.component.html",
    styleUrls: ["./account-tab.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        MatDividerModule,
        FormsModule,
        ReactiveFormsModule,
        FormValidationErrorsDirective,
        NgIf,
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
        const message = "Do you want to change username";
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
