/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ChangeDetectionStrategy, Component, inject, Input, OnInit } from "@angular/core";
import { FormGroup, FormsModule, NonNullableFormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { DatasetBasicsFragment, WebhookSubscriptionInput } from "src/app/api/kamu.graphql.interface";
import { WebhooksService } from "src/app/services/webhooks.service";
import { MatDividerModule } from "@angular/material/divider";
import { NgSelectModule } from "@ng-select/ng-select";
import AppValues from "src/app/common/values/app.values";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { BaseComponent } from "src/app/common/components/base.component";
import { DatasetWebhooksService } from "../../service/dataset-webhooks.service";
import RoutingResolvers from "src/app/common/resolvers/routing-resolvers";
import { NavigationService } from "src/app/services/navigation.service";
import { MaybeNull, MaybeUndefined } from "src/app/interface/app.types";
import { NgIf } from "@angular/common";
import { CopyToClipboardComponent } from "src/app/common/components/copy-to-clipboard/copy-to-clipboard.component";
import {
    SubscribedEventType,
    WebhookSubscriptionFormType,
    CreateWebhookSubscriptionSuccess,
} from "../../dataset-settings-webhooks-tab.component.types";
import { CreateEditWebhookFormComponent } from "../common/create-edit-webhook-form/create-edit-webhook-form.component";

@Component({
    selector: "app-add-webhook",
    standalone: true,
    imports: [
        //-----//
        NgIf,
        FormsModule,
        ReactiveFormsModule,

        //-----//
        MatDividerModule,
        NgSelectModule,

        //-----//
        CopyToClipboardComponent,
        CreateEditWebhookFormComponent,
    ],
    templateUrl: "./add-webhook.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddWebhookComponent extends BaseComponent implements OnInit {
    @Input(RoutingResolvers.WEBHOOKS_ADD_NEW_KEY) public datasetBasics: DatasetBasicsFragment;

    public dropdownList: SubscribedEventType[] = [];
    public secret: MaybeUndefined<string>;

    private fb = inject(NonNullableFormBuilder);
    private webhooksService = inject(WebhooksService);
    private datasetWebhooksService = inject(DatasetWebhooksService);
    private navigationService = inject(NavigationService);

    public createOrEditSubscriptionForm: FormGroup<WebhookSubscriptionFormType> = this.fb.group({
        targetUrl: this.fb.control("", [Validators.required, Validators.pattern(AppValues.URL_PATTERN_ONLY_HTTPS)]),
        eventTypes: this.fb.control<string[]>([], [Validators.required]),
        label: this.fb.control("", [Validators.maxLength(100)]),
    });

    public get isSecretExist(): boolean {
        return Boolean(this.secret);
    }

    public ngOnInit(): void {
        this.webhooksService
            .eventTypes()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((eventTypes: SubscribedEventType[]) => {
                this.dropdownList = eventTypes;
            });
    }

    public addWebhook(): void {
        this.datasetWebhooksService
            .datasetWebhookCreateSubscription(
                this.datasetBasics.id,
                this.createOrEditSubscriptionForm.value as WebhookSubscriptionInput,
            )
            .subscribe((result: MaybeNull<CreateWebhookSubscriptionSuccess>) => {
                if (result) {
                    this.createOrEditSubscriptionForm.patchValue({
                        targetUrl: result.input.targetUrl,
                        eventTypes: result.input.eventTypes,
                        label: result.input.label,
                    });
                    this.secret = result.secret;
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
