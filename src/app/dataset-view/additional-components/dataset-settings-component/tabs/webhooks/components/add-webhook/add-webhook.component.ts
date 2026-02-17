/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { AsyncPipe, NgIf } from "@angular/common";
import { ChangeDetectionStrategy, Component, inject, Input, OnInit } from "@angular/core";
import { FormGroup, FormsModule, NonNullableFormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatDividerModule } from "@angular/material/divider";

import { BehaviorSubject, map, Observable } from "rxjs";

import { DatasetBasicsFragment, WebhookSubscriptionInput } from "@api/kamu.graphql.interface";
import { BaseComponent } from "@common/components/base.component";
import { CopyToClipboardComponent } from "@common/components/copy-to-clipboard/copy-to-clipboard.component";
import RoutingResolvers from "@common/resolvers/routing-resolvers";
import AppValues from "@common/values/app.values";
import { NgSelectModule } from "@ng-select/ng-select";
import { MaybeNull, MaybeUndefined } from "src/app/interface/app.types";
import { NavigationService } from "src/app/services/navigation.service";
import { WebhooksService } from "src/app/services/webhooks.service";

import {
    CreateWebhookSubscriptionSuccess,
    SubscribedEventType,
    WebhookSubscriptionFormType,
} from "../../dataset-settings-webhooks-tab.component.types";
import { DatasetWebhooksService } from "../../service/dataset-webhooks.service";
import { WebhookFormComponent } from "../common/webhook-form/webhook-form.component";

@Component({
    selector: "app-add-webhook",
    imports: [
        //-----//
        AsyncPipe,
        NgIf,
        FormsModule,
        ReactiveFormsModule,
        //-----//
        MatDividerModule,
        NgSelectModule,
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
    private secret$ = new BehaviorSubject<string | undefined>(undefined);

    private fb = inject(NonNullableFormBuilder);
    private webhooksService = inject(WebhooksService);
    private datasetWebhooksService = inject(DatasetWebhooksService);
    private navigationService = inject(NavigationService);

    public createOrEditSubscriptionForm: FormGroup<WebhookSubscriptionFormType> = this.fb.group({
        targetUrl: this.fb.control("", [Validators.required, Validators.pattern(AppValues.URL_PATTERN_ONLY_HTTPS)]),
        eventTypes: this.fb.control<string[]>([], [Validators.required]),
        label: this.fb.control("", [Validators.maxLength(100)]),
    });

    public get secretChanges(): Observable<MaybeUndefined<string>> {
        return this.secret$.asObservable();
    }

    public secretChanged(value: string): void {
        this.secret$.next(value);
    }

    public get hasSecret$(): Observable<boolean> {
        return this.secret$.pipe(map((secret) => !!secret));
    }

    public ngOnInit(): void {
        this.dropdownList$ = this.webhooksService.eventTypes();
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
                    this.secretChanged(result.secret);
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
