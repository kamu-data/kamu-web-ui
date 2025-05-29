/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ChangeDetectionStrategy, Component, inject, Input, OnInit } from "@angular/core";
import { AbstractControl, FormBuilder, Validators } from "@angular/forms";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import AppValues from "src/app/common/values/app.values";
import {
    DatasetBasicsFragment,
    WebhookSubscriptionInput,
    WebhookSubscriptionStatus,
} from "src/app/api/kamu.graphql.interface";
import { WebhooksService } from "src/app/services/webhooks.service";
import { BaseComponent } from "src/app/common/components/base.component";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import {
    CreateWebhookSubscriptionSuccess,
    SubscribedEventType,
    WebhookSubscriptionModalAction,
} from "./create-edit-subscription-modal.model";
import { MaybeNull, MaybeUndefined } from "src/app/interface/app.types";
import { Clipboard } from "@angular/cdk/clipboard";
import { changeCopyIcon } from "src/app/common/helpers/app.helpers";

@Component({
    selector: "app-create-edit-subscription-modal",
    templateUrl: "./create-edit-subscription-modal.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateEditSubscriptionModalComponent extends BaseComponent implements OnInit {
    @Input({ required: true }) public datasetBasics: DatasetBasicsFragment;
    @Input() public subscriptionData: MaybeNull<CreateWebhookSubscriptionSuccess>;

    public dropdownList: SubscribedEventType[] = [];
    public secret: MaybeUndefined<string>;
    public secretRotate: MaybeUndefined<string>;
    public readonly WebhookSubscriptionStatus: typeof WebhookSubscriptionStatus = WebhookSubscriptionStatus;
    public readonly WebhookSubscriptionModalAction: typeof WebhookSubscriptionModalAction =
        WebhookSubscriptionModalAction;

    public activeModal = inject(NgbActiveModal);
    private fb = inject(FormBuilder);
    private webhooksService = inject(WebhooksService);
    private clipboard = inject(Clipboard);

    public ngOnInit(): void {
        this.webhooksService
            .eventTypes()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((eventTypes: string[]) => {
                this.dropdownList = eventTypes.map((eventType) => {
                    return { name: this.eventTypesMapper(eventType), value: eventType };
                });
                if (this.subscriptionData) {
                    this.createSubscriptionForm.patchValue({
                        targetUrl: this.subscriptionData.input.targetUrl,
                        eventTypes: this.subscriptionData.input.eventTypes,
                        label: this.subscriptionData.input.label,
                    });
                    this.secret = this.subscriptionData.secret;
                }
            });
    }

    public get targetUrlControl(): AbstractControl {
        return this.createSubscriptionForm.controls.targetUrl;
    }

    public get eventTypesControl(): AbstractControl {
        return this.createSubscriptionForm.controls.eventTypes;
    }

    public createSubscriptionForm = this.fb.nonNullable.group({
        targetUrl: this.fb.control("", [Validators.required, Validators.pattern(AppValues.URL_PATTERN_ONLY_HTTPS)]),
        eventTypes: [[] as string[], Validators.required],
        label: this.fb.control("", []),
    });

    public createWebhook(): void {
        const result = this.createSubscriptionForm.value as WebhookSubscriptionInput;
        this.activeModal.close({ action: WebhookSubscriptionModalAction.CREATE, payload: result });
    }

    public updateWebhook(): void {
        const result = this.createSubscriptionForm.value as WebhookSubscriptionInput;
        this.activeModal.close({ action: WebhookSubscriptionModalAction.UPDATE, payload: result });
    }

    public verifyNow(): void {
        this.activeModal.close({ action: WebhookSubscriptionModalAction.VERIFY });
    }

    public copyToClipboard(event: MouseEvent, text: string): void {
        this.clipboard.copy(text);
        changeCopyIcon(event);
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
