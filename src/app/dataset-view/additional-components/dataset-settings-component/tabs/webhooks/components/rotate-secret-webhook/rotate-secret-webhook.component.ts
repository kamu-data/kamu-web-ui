/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, Input, OnInit } from "@angular/core";
import { Location, NgIf } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { CopyToClipboardComponent } from "src/app/common/components/copy-to-clipboard/copy-to-clipboard.component";
import { DatasetBasicsFragment } from "src/app/api/kamu.graphql.interface";
import RoutingResolvers from "src/app/common/resolvers/routing-resolvers";
import { NavigationService } from "src/app/services/navigation.service";
import { DatasetWebhooksService } from "../../service/dataset-webhooks.service";
import ProjectLinks from "src/app/project-links";

@Component({
    selector: "app-rotate-secret-webhook",
    standalone: true,
    imports: [
        //-----//
        FormsModule,
        //-----//
        CopyToClipboardComponent,
        NgIf,
    ],
    templateUrl: "./rotate-secret-webhook.component.html",
    styleUrls: ["./rotate-secret-webhook.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RotateSecretWebhookComponent implements OnInit {
    @Input(RoutingResolvers.WEBHOOKS_ROTATE_SECRET) public datasetBasics: DatasetBasicsFragment;
    @Input(ProjectLinks.URL_PARAM_WEBHOOK_ID) public webhookId: string;

    private location = inject(Location);
    private navigationService = inject(NavigationService);
    private datasetWebhooksService = inject(DatasetWebhooksService);
    private cdr = inject(ChangeDetectorRef);

    public secret = "";

    public ngOnInit(): void {
        this.datasetWebhooksService
            .datasetWebhookRotateSecret(this.datasetBasics.id, this.webhookId)
            .subscribe((data) => {
                this.secret = data as string;
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
