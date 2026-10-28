/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, Input, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatDividerModule } from "@angular/material/divider";

import { NgxTrimDirectiveModule } from "ngx-trim-directive";

import RoutingResolvers from "@common/resolvers/routing-resolvers";
import { FormValidationErrorsDirective } from "@common/validation/form-validation-errors.directive";
import { FieldMutationResult, setServerError } from "@common/validation/server-errors.helpers";
import { AccountWithEmailFragment } from "@api/kamu.graphql.interface";

import { AccountSettingsTabs } from "src/app/account/settings/account-settings.constants";
import { AccountEmailService } from "src/app/account/settings/tabs/emails-tab/account-email.service";
import { ChangeEmailFormType } from "src/app/account/settings/tabs/emails-tab/email-tabs.types";
import { NavigationService } from "src/app/services/navigation.service";

@Component({
    selector: "app-emails-tab",
    templateUrl: "./emails-tab.component.html",
    styleUrls: ["./emails-tab.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        //-----//
        FormsModule,
        ReactiveFormsModule,
        //-----//
        MatDividerModule,
        NgxTrimDirectiveModule,
        //-----//
        FormValidationErrorsDirective,
    ],
})
export class EmailsTabComponent implements OnInit {
    @Input(RoutingResolvers.ACCOUNT_SETTINGS_EMAIL_KEY) public account: AccountWithEmailFragment;

    public changeEmailForm: FormGroup<ChangeEmailFormType>;
    private fb = inject(FormBuilder);
    private accountEmailService = inject(AccountEmailService);
    private navigationService = inject(NavigationService);
    private readonly cdr = inject(ChangeDetectorRef);

    public get emailAddress(): FormControl<string> {
        return this.changeEmailForm.controls.emailAddress;
    }

    public ngOnInit(): void {
        this.changeEmailForm = this.fb.nonNullable.group({
            emailAddress: [this.account.email, [Validators.required, Validators.email]],
        });
    }

    public changeEmailAddress(): void {
        this.accountEmailService
            .changeEmailAddress({
                accountName: this.account.accountName,
                newEmail: this.emailAddress.value,
            })
            .subscribe((result: FieldMutationResult<true>) => {
                if (result.ok) {
                    this.navigationService.navigateToSettings(AccountSettingsTabs.EMAILS);
                } else {
                    setServerError(this.emailAddress, result.fieldError);
                    this.cdr.markForCheck();
                }
            });
    }
}
