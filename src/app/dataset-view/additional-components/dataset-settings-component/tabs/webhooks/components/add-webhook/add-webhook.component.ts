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
import { BaseComponent } from "src/app/common/components/base.component";
import { DatasetWebhooksService } from "../../service/dataset-webhooks.service";
import RoutingResolvers from "src/app/common/resolvers/routing-resolvers";
import { NavigationService } from "src/app/services/navigation.service";
import { MaybeNull, MaybeUndefined } from "src/app/interface/app.types";
import { AsyncPipe, NgIf } from "@angular/common";
import { CopyToClipboardComponent } from "src/app/common/components/copy-to-clipboard/copy-to-clipboard.component";
import {
    SubscribedEventType,
    WebhookSubscriptionFormType,
    CreateWebhookSubscriptionSuccess,
} from "../../dataset-settings-webhooks-tab.component.types";
import { WebhookFormComponent } from "../common/webhook-form/webhook-form.component";
import { BehaviorSubject, map, Observable } from "rxjs";

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
    changeDetection: ChangeDetectionStrategy.OnPush
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
