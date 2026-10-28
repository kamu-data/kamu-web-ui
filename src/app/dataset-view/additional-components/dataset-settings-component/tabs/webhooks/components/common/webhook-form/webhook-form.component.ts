/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { FormGroup, FormsModule, ReactiveFormsModule } from "@angular/forms";

import { NgSelectModule } from "@ng-select/ng-select";
import { NgxTrimDirectiveModule } from "ngx-trim-directive";

import { FormValidationErrorsDirective } from "@common/validation/form-validation-errors.directive";

import {
    SubscribedEventType,
    WebhookSubscriptionFormType,
} from "src/app/dataset-view/additional-components/dataset-settings-component/tabs/webhooks/dataset-settings-webhooks-tab.component.types";

@Component({
    selector: "app-webhook-form",
    imports: [
        //-----//
        FormsModule,
        ReactiveFormsModule,
        //-----//
        NgSelectModule,
        NgxTrimDirectiveModule,
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
}
