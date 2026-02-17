/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { AsyncPipe, NgIf } from "@angular/common";
import { ChangeDetectionStrategy, Component, inject, Input, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatDividerModule } from "@angular/material/divider";

import { Observable } from "rxjs";

import { AccountEmailService } from "src/app/account/settings/tabs/emails-tab/account-email.service";
import { AccountWithEmailFragment } from "src/app/api/kamu.graphql.interface";
import RoutingResolvers from "src/app/common/resolvers/routing-resolvers";
import { NavigationService } from "src/app/services/navigation.service";

import { FormValidationErrorsDirective } from "../../../../common/directives/form-validation-errors.directive";
import { AccountSettingsTabs } from "../../account-settings.constants";
import { ChangeEmailFormType } from "./email-tabs.types";

@Component({
    selector: "app-emails-tab",
    templateUrl: "./emails-tab.component.html",
    styleUrls: ["./emails-tab.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        //-----//
        AsyncPipe,
        FormsModule,
        NgIf,
        ReactiveFormsModule,
        //-----//
        MatDividerModule,
        //-----//
        FormValidationErrorsDirective,
    ],
})
export class EmailsTabComponent implements OnInit {
    @Input(RoutingResolvers.ACCOUNT_SETTINGS_EMAIL_KEY) public account: AccountWithEmailFragment;

    public changeEmailForm: FormGroup<ChangeEmailFormType>;
    public changeEmailError$: Observable<string>;
    private fb = inject(FormBuilder);
    private accountEmailService = inject(AccountEmailService);
    private navigationService = inject(NavigationService);

    public get emailAddress(): FormControl<string> {
        return this.changeEmailForm.get("emailAddress") as FormControl<string>;
    }

    public ngOnInit(): void {
        this.changeEmailForm = this.fb.nonNullable.group({
            emailAddress: [this.account.email, [Validators.required, Validators.email]],
        });
        this.changeEmailError$ = this.accountEmailService.renameAccountEmailErrorOccurrences;
    }

    public changeEmail(): void {
        this.accountEmailService.resetChangeEmailError();
    }

    public changeEmailAddress(): void {
        this.accountEmailService
            .changeEmailAddress({
                accountName: this.account.accountName,
                newEmail: this.emailAddress.value,
            })
            .subscribe((result: boolean) => {
                if (result) {
                    this.navigationService.navigateToSettings(AccountSettingsTabs.EMAILS);
                }
            });
    }
}
