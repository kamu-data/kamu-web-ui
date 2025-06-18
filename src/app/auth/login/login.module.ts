/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { LoginComponent } from "./login.component";
import { MatIconModule } from "@angular/material/icon";
import { ReactiveFormsModule } from "@angular/forms";
import { SpinnerModule } from "src/app/common/components/spinner/spinner.module";
import { GithubCallbackComponent } from "./github-callback/github.callback";
import { ReturnToCliComponent } from "./return-to-cli/return-to-cli.component";
import { FormValidationErrorsModule } from "src/app/common/directives/form-validation-errors.module";

@NgModule({
    declarations: [GithubCallbackComponent, LoginComponent, ReturnToCliComponent],
    exports: [GithubCallbackComponent, LoginComponent, ReturnToCliComponent],
    imports: [CommonModule, MatIconModule, ReactiveFormsModule, FormValidationErrorsModule, SpinnerModule],
})
export class LoginModule {}
