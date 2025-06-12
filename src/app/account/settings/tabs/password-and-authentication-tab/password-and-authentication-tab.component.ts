/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ChangeDetectionStrategy, Component, inject, Input, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AccountWithEmailFragment } from "src/app/api/kamu.graphql.interface";
import RoutingResolvers from "src/app/common/resolvers/routing-resolvers";
import { ChangeAccountPasswordFormType } from "./password-and-authentication-tab.component.types";
import { matchFieldsValidator } from "src/app/common/helpers/data.helpers";
import { ErrorSets } from "src/app/common/directives/form-validation-errors.types";
import { AccountService } from "src/app/account/account.service";

@Component({
    selector: "app-password-and-authentication-tab",
    templateUrl: "./password-and-authentication-tab.component.html",
    styleUrls: ["./password-and-authentication-tab.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PasswordAndAuthenticationTabComponent implements OnInit {
    @Input(RoutingResolvers.ACCOUNT_SETTINGS_PASSWORD_AND_AUTHENTICATION_KEY) public account: AccountWithEmailFragment;
    private fb = inject(FormBuilder);
    private accountService = inject(AccountService);

    public showChangePasswordView = false;
    public changeAccountPasswordForm: FormGroup<ChangeAccountPasswordFormType>;
    public readonly ErrorSets: typeof ErrorSets = ErrorSets;

    public ngOnInit(): void {
        this.changeAccountPasswordForm = this.fb.nonNullable.group(
            {
                newPassword: ["", [Validators.required, Validators.minLength(8)]],
                confirmPassword: ["", [Validators.required, Validators.minLength(8)]],
            },
            {
                validators: matchFieldsValidator("newPassword", "confirmPassword"),
            },
        );
    }

    public updatePassword(): void {
        this.accountService
            .changeAccountPassword({
                accountName: this.account.accountName,
                password: this.changeAccountPasswordForm.controls.newPassword.value,
            })
            .subscribe((success: boolean) => {
                if (success) {
                    this.changeAccountPasswordForm.reset();
                }
            });
    }
}
