/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { FormGroup, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatDividerModule } from "@angular/material/divider";

import { NgSelectModule } from "@ng-select/ng-select";
import {
    SubscribedEventType,
    WebhookSubscriptionFormType,
} from "src/app/dataset-view/additional-components/dataset-settings-component/tabs/webhooks/dataset-settings-webhooks-tab.component.types";

import { FormValidationErrorsDirective } from "@common/directives/form-validation-errors.directive";
import { ErrorSets } from "@common/directives/form-validation-errors.types";

@Component({
    selector: "app-webhook-form",
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
    templateUrl: "./webhook-form.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WebhookFormComponent {
    @Input({ required: true }) public createOrEditSubscriptionForm: FormGroup<WebhookSubscriptionFormType>;
    @Input({ required: true }) public dropdownList: SubscribedEventType[] = [];
    @Input() public disabled: boolean;

    public readonly ErrorSets: typeof ErrorSets = ErrorSets;
}
