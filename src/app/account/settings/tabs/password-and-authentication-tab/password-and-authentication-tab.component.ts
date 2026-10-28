/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ChangeDetectionStrategy, Component, inject, Input, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatDividerModule } from "@angular/material/divider";

import RoutingResolvers from "@common/resolvers/routing-resolvers";
import { FormValidationErrorsDirective } from "@common/validation/form-validation-errors.directive";
import { matchFieldsValidator, newPasswordValidators } from "@common/validation/password.validators";
import { AccountFragment } from "@api/kamu.graphql.interface";

import { AccountService } from "src/app/account/account.service";
import { AdminChangePasswordComponent } from "src/app/account/settings/tabs/password-and-authentication-tab/components/admin-change-password/admin-change-password.component";
import { ChangeUserAccountPasswordFormType } from "src/app/account/settings/tabs/password-and-authentication-tab/password-and-authentication-tab.component.types";
import { AppConfigService } from "src/app/app-config.service";

@Component({
    selector: "app-password-and-authentication-tab",
    templateUrl: "./password-and-authentication-tab.component.html",
    styleUrls: ["./password-and-authentication-tab.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        //-----//
        FormsModule,
        ReactiveFormsModule,
        //-----//
        MatDividerModule,
        //-----//
        AdminChangePasswordComponent,
        FormValidationErrorsDirective,
    ],
})
export class PasswordAndAuthenticationTabComponent implements OnInit {
    @Input(RoutingResolvers.ACCOUNT_SETTINGS_PASSWORD_AND_AUTHENTICATION_KEY) public account: AccountFragment;
    private fb = inject(FormBuilder);
    private accountService = inject(AccountService);
    private appConfigService = inject(AppConfigService);

    public showChangePasswordView = false;
    public changeUserAccountPasswordForm: FormGroup<ChangeUserAccountPasswordFormType>;

    public ngOnInit(): void {
        this.changeUserAccountPasswordForm = this.fb.nonNullable.group(
            {
                oldPassword: ["", [Validators.required]],
                newPassword: [
                    "",
                    [Validators.required, ...newPasswordValidators(this.appConfigService.minNewPasswordLength)],
                ],
                confirmPassword: [
                    "",
                    [Validators.required, ...newPasswordValidators(this.appConfigService.minNewPasswordLength)],
                ],
            },
            {
                validators: matchFieldsValidator("newPassword", "confirmPassword"),
            },
        );
    }

    public get isAdmin(): boolean {
        return this.account.isAdmin ?? false;
    }

    public updateUserPassword(): void {
        this.accountService
            .changeUserPassword({
                accountName: this.account.accountName,
                oldPassword: this.changeUserAccountPasswordForm.controls.oldPassword.value,
                newPassword: this.changeUserAccountPasswordForm.controls.newPassword.value,
            })
            .subscribe((success: boolean) => {
                if (success) {
                    this.changeUserAccountPasswordForm.reset();
                }
            });
    }
}
