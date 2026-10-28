/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { Location } from "@angular/common";
import { ChangeDetectionStrategy, Component, inject, Input, OnInit } from "@angular/core";
import { FormGroup, NonNullableFormBuilder, Validators } from "@angular/forms";
import { RouterOutlet } from "@angular/router";

import { BaseComponent } from "@common/components/base.component";
import { eventTypesMapper } from "@common/helpers/data.helpers";
import RoutingResolvers from "@common/resolvers/routing-resolvers";
import { urlValidator } from "@common/validation/url.validators";

import { WebhookFormComponent } from "src/app/dataset-view/additional-components/dataset-settings-component/tabs/webhooks/components/common/webhook-form/webhook-form.component";
import { EditWebhooksType } from "src/app/dataset-view/additional-components/dataset-settings-component/tabs/webhooks/components/edit-webhook/edit-webhooks.types";
import {
    SubscribedEventType,
    WebhookSubscriptionFormType,
} from "src/app/dataset-view/additional-components/dataset-settings-component/tabs/webhooks/dataset-settings-webhooks-tab.component.types";
import { DatasetWebhooksService } from "src/app/dataset-view/additional-components/dataset-settings-component/tabs/webhooks/service/dataset-webhooks.service";
import { NavigationService } from "src/app/services/navigation.service";

@Component({
    selector: "app-edit-webhook",
    imports: [
        //-----//
        RouterOutlet,
        //-----//
        WebhookFormComponent,
    ],
    templateUrl: "./edit-webhook.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditWebhookComponent extends BaseComponent implements OnInit {
    @Input(RoutingResolvers.WEBHOOKS_EDIT_KEY) public editWebhooksData: EditWebhooksType;

    public dropdownList: SubscribedEventType[] = [];

    private fb = inject(NonNullableFormBuilder);
    private datasetWebhooksService = inject(DatasetWebhooksService);
    private navigationService = inject(NavigationService);
    private location = inject(Location);

    public createOrEditSubscriptionForm: FormGroup<WebhookSubscriptionFormType> = this.fb.group({
        targetUrl: this.fb.control("", [Validators.required, urlValidator(["https"])]),
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
                datasetId: this.editWebhooksData.datasetBasics.id,
                id: this.editWebhooksData.subscription.id,
                input: this.createOrEditSubscriptionForm.getRawValue(),
            })
            .subscribe((result: boolean) => {
                if (result) {
                    this.location.back();
                }
            });
    }

    public navigateToListWebhooks(): void {
        this.navigationService.navigateToWebhooks({
            accountName: this.editWebhooksData.datasetBasics.owner.accountName,
            datasetName: this.editWebhooksData.datasetBasics.name,
        });
    }

    public onCancel(): void {
        this.location.back();
    }
}
