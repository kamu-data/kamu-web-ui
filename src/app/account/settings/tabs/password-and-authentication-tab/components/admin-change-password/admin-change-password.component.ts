/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ChangeDetectionStrategy, Component, inject, Input, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";

import { FormValidationErrorsDirective } from "@common/validation/form-validation-errors.directive";
import { matchFieldsValidator, newPasswordValidators } from "@common/validation/password.validators";

import { AccountService } from "src/app/account/account.service";
import { ChangeAdminAccountPasswordFormType } from "src/app/account/settings/tabs/password-and-authentication-tab/password-and-authentication-tab.component.types";
import { AppConfigService } from "src/app/app-config.service";

@Component({
    selector: "app-admin-change-password",
    templateUrl: "./admin-change-password.component.html",
    styleUrls: ["./admin-change-password.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        //-----//
        FormsModule,
        ReactiveFormsModule,
        //-----//
        FormValidationErrorsDirective,
    ],
})
export class AdminChangePasswordComponent implements OnInit {
    @Input({ required: true }) public accountName: string;
    public changeAdminAccountPasswordForm: FormGroup<ChangeAdminAccountPasswordFormType>;

    private fb = inject(FormBuilder);
    private accountService = inject(AccountService);
    private appConfigService = inject(AppConfigService);

    public ngOnInit(): void {
        this.changeAdminAccountPasswordForm = this.fb.nonNullable.group(
            {
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

    public updateAdminPassword(): void {
        this.accountService
            .changeAdminPassword({
                accountName: this.accountName,
                password: this.changeAdminAccountPasswordForm.controls.newPassword.value,
            })
            .subscribe((success: boolean) => {
                if (success) {
                    this.changeAdminAccountPasswordForm.reset();
                }
            });
    }
}
