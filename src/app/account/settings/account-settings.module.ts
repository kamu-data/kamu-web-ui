/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AccountSettingsComponent } from "./account-settings.component";
import { EmailsTabComponent } from "./tabs/emails-tab/emails-tab.component";
import { AccessTokensTabComponent } from "./tabs/access-tokens-tab/access-tokens-tab.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatIconModule } from "@angular/material/icon";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { PaginationModule } from "src/app/common/components/pagination-component/pagination.module";
import { MatDividerModule } from "@angular/material/divider";
import { MatTableModule } from "@angular/material/table";
import { RouterModule } from "@angular/router";
import { FeatureFlagModule } from "src/app/common/directives/feature-flag.module";
import { AccountTabComponent } from "./tabs/account-tab/account-tab.component";
import { CopyToClipboardModule } from "src/app/common/components/copy-to-clipboard/copy-to-clipboard.module";
import { PasswordAndAuthenticationTabComponent } from "./tabs/password-and-authentication-tab/password-and-authentication-tab.component";
import { FormValidationErrorsModule } from "src/app/common/directives/form-validation-errors.module";
import { AdminChangePasswordComponent } from "./tabs/password-and-authentication-tab/components/admin-change-password/admin-change-password.component";

@NgModule({
    declarations: [
        AccessTokensTabComponent,
        AccountSettingsComponent,
        EmailsTabComponent,
        AccountTabComponent,
        PasswordAndAuthenticationTabComponent,
        AdminChangePasswordComponent,
    ],
    exports: [AccountSettingsComponent, AccountTabComponent],
    imports: [
        CommonModule,
        FormsModule,
        MatDividerModule,
        MatIconModule,
        MatSlideToggleModule,
        MatTableModule,
        ReactiveFormsModule,
        RouterModule,

        CopyToClipboardModule,
        FeatureFlagModule,
        FormValidationErrorsModule,
        PaginationModule,
    ],
})
export class AccountSettingsModule {}
