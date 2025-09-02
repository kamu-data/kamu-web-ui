/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ChangeDetectionStrategy, Component, inject, Input, OnInit } from "@angular/core";
import { NgIf } from "@angular/common";
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
import {
    CreateWebhookSubscriptionSuccess,
    SubscribedEventType,
    WebhookSubscriptionFormType,
} from "../../create-edit-subscription-modal/create-edit-subscription-modal.model";
import { MatDividerModule } from "@angular/material/divider";
import { NgSelectModule } from "@ng-select/ng-select";
import { CopyToClipboardComponent } from "src/app/common/components/copy-to-clipboard/copy-to-clipboard.component";
import { FeatureFlagDirective } from "src/app/common/directives/feature-flag.directive";
import { FormValidationErrorsDirective } from "src/app/common/directives/form-validation-errors.directive";
import AppValues from "src/app/common/values/app.values";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { BaseComponent } from "src/app/common/components/base.component";
import { DatasetWebhooksService } from "../../service/dataset-webhooks.service";
import RoutingResolvers from "src/app/common/resolvers/routing-resolvers";
import { DatasetSettingsWebhookTabData } from "../../dataset-settings-webhooks-tab.component.types";
import { NavigationService } from "src/app/services/navigation.service";
import { MaybeNull } from "src/app/interface/app.types";

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
        FeatureFlagDirective,
    ],
    templateUrl: "./add-webhook.component.html",
    styleUrls: ["./add-webhook.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddWebhookComponent extends BaseComponent implements OnInit {
    @Input(RoutingResolvers.WEBHOOKS_ADD_NEW_KEY) public datasetBasics: DatasetBasicsFragment;

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
                    console.log("==>", result.secret);
                    this.navigateToListWebhooks();
                }
            });
    }

    public cancel(): void {
        this.navigateToListWebhooks();
    }

    private navigateToListWebhooks(): void {
        this.navigationService.navigateToWebhooks({
            accountName: this.datasetBasics.owner.accountName,
            datasetName: this.datasetBasics.name,
        });
    }
}
