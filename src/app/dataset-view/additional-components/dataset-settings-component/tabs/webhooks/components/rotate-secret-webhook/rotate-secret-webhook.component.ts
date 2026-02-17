/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, Input, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";

import { DatasetBasicsFragment } from "@api/kamu.graphql.interface";
import { CopyToClipboardComponent } from "@common/components/copy-to-clipboard/copy-to-clipboard.component";
import RoutingResolvers from "@common/resolvers/routing-resolvers";
import ProjectLinks from "src/app/project-links";
import { NavigationService } from "src/app/services/navigation.service";

import { DatasetWebhooksService } from "../../service/dataset-webhooks.service";

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
    @Input(RoutingResolvers.WEBHOOKS_ROTATE_SECRET) public datasetBasics: DatasetBasicsFragment;
    @Input(ProjectLinks.URL_PARAM_WEBHOOK_ID) public webhookId: string;

    private navigationService = inject(NavigationService);
    private datasetWebhooksService = inject(DatasetWebhooksService);
    private cdr = inject(ChangeDetectorRef);

    public secret = "";

    public ngOnInit(): void {
        this.datasetWebhooksService
            .datasetWebhookRotateSecret(this.datasetBasics.id, this.webhookId)
            .subscribe((data) => {
                this.secret = data;
                this.cdr.detectChanges();
            });
    }

    public navigateToListWebhooks(): void {
        this.navigationService.navigateToWebhooks({
            accountName: this.datasetBasics.owner.accountName,
            datasetName: this.datasetBasics.name,
        });
    }
}
