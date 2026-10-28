/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, Input, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";

import { CopyToClipboardComponent } from "@common/components/copy-to-clipboard/copy-to-clipboard.component";
import RoutingResolvers from "@common/resolvers/routing-resolvers";

import { EditWebhooksType } from "src/app/dataset-view/additional-components/dataset-settings-component/tabs/webhooks/components/edit-webhook/edit-webhooks.types";
import { DatasetWebhooksService } from "src/app/dataset-view/additional-components/dataset-settings-component/tabs/webhooks/service/dataset-webhooks.service";
import { NavigationService } from "src/app/services/navigation.service";

@Component({
    selector: "app-rotate-secret-webhook",
    imports: [
        //-----//
        FormsModule,
        //-----//
        CopyToClipboardComponent,
    ],
    templateUrl: "./rotate-secret-webhook.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RotateSecretWebhookComponent implements OnInit {
    @Input(RoutingResolvers.WEBHOOKS_ROTATE_SECRET) public webhookData: EditWebhooksType;

    private navigationService = inject(NavigationService);
    private datasetWebhooksService = inject(DatasetWebhooksService);
    private cdr = inject(ChangeDetectorRef);

    public secret = "";

    public ngOnInit(): void {
        this.datasetWebhooksService
            .datasetWebhookRotateSecret(this.webhookData.datasetBasics.id, this.webhookData.subscription.id)
            .subscribe((data) => {
                this.secret = data;
                this.cdr.detectChanges();
            });
    }

    public navigateToListWebhooks(): void {
        this.navigationService.navigateToWebhooks({
            accountName: this.webhookData.datasetBasics.owner.accountName,
            datasetName: this.webhookData.datasetBasics.name,
        });
    }
}
