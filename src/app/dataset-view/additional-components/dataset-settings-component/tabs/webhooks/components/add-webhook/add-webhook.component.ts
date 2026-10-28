/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { AsyncPipe } from "@angular/common";
import { ChangeDetectionStrategy, Component, inject, Input, OnInit } from "@angular/core";
import { FormGroup, FormsModule, NonNullableFormBuilder, Validators } from "@angular/forms";

import { BehaviorSubject, map, Observable } from "rxjs";

import { BaseComponent } from "@common/components/base.component";
import { CopyToClipboardComponent } from "@common/components/copy-to-clipboard/copy-to-clipboard.component";
import { trackBusy } from "@common/helpers/app.helpers";
import RoutingResolvers from "@common/resolvers/routing-resolvers";
import { setServerError } from "@common/validation/server-errors.helpers";
import { urlValidator } from "@common/validation/url.validators";
import { DatasetBasicsFragment } from "@api/kamu.graphql.interface";
import { MaybeUndefined } from "@interface/app.types";

import { WebhookFormComponent } from "src/app/dataset-view/additional-components/dataset-settings-component/tabs/webhooks/components/common/webhook-form/webhook-form.component";
import {
    CreateWebhookSubscriptionSuccess,
    SubscribedEventType,
    WebhookSubscriptionFormType,
} from "src/app/dataset-view/additional-components/dataset-settings-component/tabs/webhooks/dataset-settings-webhooks-tab.component.types";
import {
    DatasetWebhooksService,
    WebhookMutationResult,
} from "src/app/dataset-view/additional-components/dataset-settings-component/tabs/webhooks/service/dataset-webhooks.service";
import { NavigationService } from "src/app/services/navigation.service";
import { WebhooksService } from "src/app/services/webhooks.service";

@Component({
    selector: "app-add-webhook",
    imports: [
        //-----//
        AsyncPipe,
        FormsModule,
        //-----//
        CopyToClipboardComponent,
        WebhookFormComponent,
    ],
    templateUrl: "./add-webhook.component.html",
    styleUrls: ["./add-webhook.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddWebhookComponent extends BaseComponent implements OnInit {
    @Input(RoutingResolvers.WEBHOOKS_ADD_NEW_KEY) public datasetBasics: DatasetBasicsFragment;

    public dropdownList$: Observable<SubscribedEventType[]>;
    public readonly busy$ = new BehaviorSubject<boolean>(false);
    private secret$ = new BehaviorSubject<MaybeUndefined<string>>(undefined);

    private fb = inject(NonNullableFormBuilder);
    private webhooksService = inject(WebhooksService);
    private datasetWebhooksService = inject(DatasetWebhooksService);
    private navigationService = inject(NavigationService);

    public createOrEditSubscriptionForm: FormGroup<WebhookSubscriptionFormType> = this.fb.group({
        targetUrl: this.fb.control("", [Validators.required, urlValidator(["https"])]),
        eventTypes: this.fb.control<string[]>([], [Validators.required]),
        label: this.fb.control("", [Validators.maxLength(100)]),
    });

    public readonly secretChanges: Observable<MaybeUndefined<string>> = this.secret$.asObservable();

    public secretChanged(value: string): void {
        this.secret$.next(value);
    }

    public readonly hasSecret$: Observable<boolean> = this.secret$.pipe(map((secret) => !!secret));

    public ngOnInit(): void {
        this.dropdownList$ = this.webhooksService.eventTypes();
    }

    public addWebhook(): void {
        this.datasetWebhooksService
            .datasetWebhookCreateSubscription(this.datasetBasics.id, this.createOrEditSubscriptionForm.getRawValue())
            .pipe(trackBusy(this.busy$))
            .subscribe((result: WebhookMutationResult<CreateWebhookSubscriptionSuccess>) => {
                if (result.ok) {
                    this.createOrEditSubscriptionForm.patchValue({
                        targetUrl: result.value.input.targetUrl,
                        eventTypes: result.value.input.eventTypes,
                        label: result.value.input.label,
                    });
                    this.secretChanged(result.value.secret);
                } else if (result.fieldError) {
                    const { field, message } = result.fieldError;
                    setServerError(this.createOrEditSubscriptionForm.controls[field], message);
                }
            });
    }

    public navigateToListWebhooks(): void {
        this.navigationService.navigateToWebhooks({
            accountName: this.datasetBasics.owner.accountName,
            datasetName: this.datasetBasics.name,
        });
    }
}
