/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ChangeDetectionStrategy, Component, inject, Input, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ChangeAdminAccountPasswordFormType } from "../../password-and-authentication-tab.component.types";
import { AccountService } from "src/app/account/account.service";
import { matchFieldsValidator } from "src/app/common/helpers/data.helpers";
import { ErrorSets } from "src/app/common/directives/form-validation-errors.types";
import { AppConfigService } from "src/app/app-config.service";
import { FormValidationErrorsDirective } from "../../../../../../common/directives/form-validation-errors.directive";

@Component({
    selector: "app-admin-change-password",
    templateUrl: "./admin-change-password.component.html",
    styleUrls: ["./admin-change-password.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        FormsModule,
        ReactiveFormsModule,
        FormValidationErrorsDirective,
    ],
})
export class AdminChangePasswordComponent implements OnInit {
    @Input({ required: true }) public accountName: string;
    public changeAdminAccountPasswordForm: FormGroup<ChangeAdminAccountPasswordFormType>;

    private fb = inject(FormBuilder);
    private accountService = inject(AccountService);
    private appConfigService = inject(AppConfigService);
    public readonly ErrorSets: typeof ErrorSets = ErrorSets;

    public ngOnInit(): void {
        this.changeAdminAccountPasswordForm = this.fb.nonNullable.group(
            {
                newPassword: [
                    "",
                    [Validators.required, Validators.minLength(this.appConfigService.minNewPasswordLength)],
                ],
                confirmPassword: [
                    "",
                    [Validators.required, Validators.minLength(this.appConfigService.minNewPasswordLength)],
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
