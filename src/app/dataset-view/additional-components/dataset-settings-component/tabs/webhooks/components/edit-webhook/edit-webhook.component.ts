/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ChangeDetectionStrategy, Component, inject, Input, OnInit } from "@angular/core";
import { BaseComponent } from "src/app/common/components/base.component";
import {
    NonNullableFormBuilder,
    AbstractControl,
    FormGroup,
    Validators,
    FormsModule,
    ReactiveFormsModule,
} from "@angular/forms";
import { WebhookSubscriptionInput, WebhookSubscriptionStatus } from "src/app/api/kamu.graphql.interface";
import { ErrorSets } from "src/app/common/directives/form-validation-errors.types";
import AppValues from "src/app/common/values/app.values";
import { NavigationService } from "src/app/services/navigation.service";
import { WebhooksService } from "src/app/services/webhooks.service";
import { DatasetWebhooksService } from "../../service/dataset-webhooks.service";
import { MatDividerModule } from "@angular/material/divider";
import { NgSelectModule } from "@ng-select/ng-select";
import { FormValidationErrorsDirective } from "src/app/common/directives/form-validation-errors.directive";
import RoutingResolvers from "src/app/common/resolvers/routing-resolvers";
import { EditWebhooksType } from "./edit-webhooks.types";
import { eventTypesMapper } from "src/app/common/helpers/data.helpers";
import { SubscribedEventType, WebhookSubscriptionFormType } from "../../dataset-settings-webhooks-tab.component.types";

@Component({
    selector: "app-edit-webhook",
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
    templateUrl: "./edit-webhook.component.html",
    styleUrls: ["./edit-webhook.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditWebhookComponent extends BaseComponent implements OnInit {
    @Input(RoutingResolvers.WEBHOOKS_EDIT_KEY) public editWebhooksData: EditWebhooksType;

    public dropdownList: SubscribedEventType[] = [];
    public readonly WebhookSubscriptionStatus: typeof WebhookSubscriptionStatus = WebhookSubscriptionStatus;
    public readonly ErrorSets: typeof ErrorSets = ErrorSets;

    private fb = inject(NonNullableFormBuilder);
    private webhooksService = inject(WebhooksService);
    private datasetWebhooksService = inject(DatasetWebhooksService);
    private navigationService = inject(NavigationService);

    public get targetUrlControl(): AbstractControl {
        return this.createOrEditSubscriptionForm.controls.targetUrl;
    }

    public get eventTypesControl(): AbstractControl {
        return this.createOrEditSubscriptionForm.controls.eventTypes;
    }

    public createOrEditSubscriptionForm: FormGroup<WebhookSubscriptionFormType> = this.fb.group({
        targetUrl: this.fb.control("", [Validators.required, Validators.pattern(AppValues.URL_PATTERN_ONLY_HTTPS)]),
        eventTypes: this.fb.control<string[]>([], [Validators.required]),
        label: this.fb.control("", [Validators.maxLength(100)]),
    });

    public ngOnInit(): void {
        this.dropdownList = this.editWebhooksData.subscription.eventTypes.map((data) => eventTypesMapper(data));
        this.createOrEditSubscriptionForm.patchValue({
            targetUrl: this.editWebhooksData.subscription.targetUrl,
            eventTypes: this.editWebhooksData.subscription.eventTypes,
            label: this.editWebhooksData.subscription.label,
        });
    }

    public updateWebhook(): void {
        this.datasetWebhooksService
            .datasetWebhookUpdateSubscription({
                datasetId: this.editWebhooksData.subscription.datasetId as string,
                id: this.editWebhooksData.subscription.id,
                input: this.createOrEditSubscriptionForm.value as WebhookSubscriptionInput,
            })
            .subscribe((result) => {
                if (result) {
                    this.navigateToListWebhooks();
                }
            });
    }

    public cancel(): void {
        this.navigateToListWebhooks();
    }

    private navigateToListWebhooks(): void {
        this.navigationService.navigateToWebhooks({
            accountName: this.editWebhooksData.datasetBasics.owner.accountName,
            datasetName: this.editWebhooksData.datasetBasics.name,
        });
    }
}
