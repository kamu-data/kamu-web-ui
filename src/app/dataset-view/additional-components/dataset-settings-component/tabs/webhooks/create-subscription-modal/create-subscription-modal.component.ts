/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ChangeDetectionStrategy, Component, inject, Input, OnInit } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import AppValues from "src/app/common/values/app.values";
import { DatasetBasicsFragment, WebhookSubscriptionInput } from "src/app/api/kamu.graphql.interface";
import { WebhooksService } from "src/app/services/webhooks.service";
import { BaseComponent } from "src/app/common/components/base.component";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { CreateWebhookSubscriptionSucces, SubscribedEventType } from "./create-subscription-modal.model";

@Component({
    selector: "app-create-subscription-modal",
    templateUrl: "./create-subscription-modal.component.html",
    styleUrls: ["./create-subscription-modal.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateSubscriptionModalComponent extends BaseComponent implements OnInit {
    @Input({ required: true }) public datasetBasics: DatasetBasicsFragment;
    @Input() public subscriptionData: CreateWebhookSubscriptionSucces;

    public DROPDOWN_LIST: SubscribedEventType[] = [];

    public activeModal = inject(NgbActiveModal);
    private fb = inject(FormBuilder);
    private webhooksService = inject(WebhooksService);

    public ngOnInit(): void {
        this.webhooksService
            .eventTypes()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((eventTypes: string[]) => {
                this.DROPDOWN_LIST = eventTypes.map((eventType) => {
                    return { name: this.eventTypesMapper(eventType), value: eventType };
                });
                if (this.subscriptionData) {
                    this.createSubscriptionForm.patchValue({
                        targetUrl: this.subscriptionData.input.targetUrl,
                        eventTypes: this.subscriptionData.input.eventTypes,
                        label: this.subscriptionData.input.label,
                    });
                }
            });
    }

    public createSubscriptionForm = this.fb.nonNullable.group({
        targetUrl: this.fb.control("", [Validators.required, Validators.pattern(AppValues.URL_PATTERN_ONLY_HTTPS)]),
        eventTypes: [[] as string[], Validators.required],
        label: this.fb.control("", []),
    });

    public createWebhook(): void {
        const result = this.createSubscriptionForm.value as WebhookSubscriptionInput;
        this.activeModal.close(result);
    }

    private eventTypesMapper(name: string): string {
        switch (name) {
            case "DATASET.REF.UPDATED":
                return "Dataset Updated";
            default:
                return "Unknown event type";
        }
    }
}
