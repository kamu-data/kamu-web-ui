/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { FormGroup, FormsModule, ReactiveFormsModule } from "@angular/forms";
import {
    SubscribedEventType,
    WebhookSubscriptionFormType,
} from "../../../dataset-settings-webhooks-tab.component.types";
import { MatDividerModule } from "@angular/material/divider";
import { NgSelectModule } from "@ng-select/ng-select";
import { ErrorSets } from "src/app/common/directives/form-validation-errors.types";
import { FormValidationErrorsDirective } from "src/app/common/directives/form-validation-errors.directive";

@Component({
    selector: "app-create-edit-webhook-form",
    standalone: true,
    imports: [
        //-----//
        FormsModule,
        ReactiveFormsModule,

        //-----//
        MatDividerModule,
        NgSelectModule,

        //-----//
        FormValidationErrorsDirective,
    ],
    templateUrl: "./create-edit-webhook-form.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateEditWebhookFormComponent {
    @Input({ required: true }) public createOrEditSubscriptionForm: FormGroup<WebhookSubscriptionFormType>;
    @Input({ required: true }) public dropdownList: SubscribedEventType[] = [];
    @Input() public isSecretExist: boolean;

    public readonly ErrorSets: typeof ErrorSets = ErrorSets;
}
