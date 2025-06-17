/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ChangeDetectionStrategy, Component, inject, Input, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AccountFragment } from "src/app/api/kamu.graphql.interface";
import RoutingResolvers from "src/app/common/resolvers/routing-resolvers";
import { ChangeUserAccountPasswordFormType } from "./password-and-authentication-tab.component.types";
import { matchFieldsValidator } from "src/app/common/helpers/data.helpers";
import { ErrorSets } from "src/app/common/directives/form-validation-errors.types";
import { AccountService } from "src/app/account/account.service";
import { AppConfigService } from "src/app/app-config.service";

@Component({
    selector: "app-password-and-authentication-tab",
    templateUrl: "./password-and-authentication-tab.component.html",
    styleUrls: ["./password-and-authentication-tab.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PasswordAndAuthenticationTabComponent implements OnInit {
    @Input(RoutingResolvers.ACCOUNT_SETTINGS_PASSWORD_AND_AUTHENTICATION_KEY) public account: AccountFragment;
    private fb = inject(FormBuilder);
    private accountService = inject(AccountService);
    private appConfigService = inject(AppConfigService);

    public showChangePasswordView = false;
    public changeUserAccountPasswordForm: FormGroup<ChangeUserAccountPasswordFormType>;
    public readonly ErrorSets: typeof ErrorSets = ErrorSets;

    public ngOnInit(): void {
        this.changeUserAccountPasswordForm = this.fb.nonNullable.group(
            {
                oldPassword: ["", [Validators.required]],
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

    public get isAdmin(): boolean {
        return this.account.isAdmin;
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
