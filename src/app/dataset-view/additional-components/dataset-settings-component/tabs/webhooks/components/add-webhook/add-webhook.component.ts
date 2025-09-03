/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ChangeDetectionStrategy, Component, inject, Input, OnInit } from "@angular/core";
import {
    AbstractControl,
    FormGroup,
    FormsModule,
    NonNullableFormBuilder,
    ReactiveFormsModule,
    Validators,
} from "@angular/forms";
import {
    DatasetBasicsFragment,
    WebhookSubscriptionInput,
    WebhookSubscriptionStatus,
} from "src/app/api/kamu.graphql.interface";
import { ErrorSets } from "src/app/common/directives/form-validation-errors.types";
import { WebhooksService } from "src/app/services/webhooks.service";
import { MatDividerModule } from "@angular/material/divider";
import { NgSelectModule } from "@ng-select/ng-select";
import { FormValidationErrorsDirective } from "src/app/common/directives/form-validation-errors.directive";
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
        FormValidationErrorsDirective,
    ],
    templateUrl: "./add-webhook.component.html",
    styleUrls: ["./add-webhook.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddWebhookComponent extends BaseComponent implements OnInit {
    @Input(RoutingResolvers.WEBHOOKS_ADD_NEW_KEY) public datasetBasics: DatasetBasicsFragment;

    public dropdownList: SubscribedEventType[] = [];
    public secret: MaybeUndefined<string>;
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

    public cancel(): void {
        this.navigateToListWebhooks();
    }

    public navigateToListWebhooks(): void {
        this.navigationService.navigateToWebhooks({
            accountName: this.datasetBasics.owner.accountName,
            datasetName: this.datasetBasics.name,
        });
    }
}
