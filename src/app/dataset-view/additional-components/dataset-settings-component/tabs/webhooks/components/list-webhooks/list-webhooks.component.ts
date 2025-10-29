/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ChangeDetectionStrategy, Component, inject, Input, OnInit } from "@angular/core";
import { AsyncPipe, NgClass, NgIf } from "@angular/common";
import { BehaviorSubject, Observable, take } from "rxjs";
import {
    WebhookSubscriptionStatus,
    WebhookSubscription,
    DatasetBasicsFragment,
} from "src/app/api/kamu.graphql.interface";
import { ModalService } from "src/app/common/components/modal/modal.service";
import { promiseWithCatch } from "src/app/common/helpers/app.helpers";
import RoutingResolvers from "src/app/common/resolvers/routing-resolvers";
import { DatasetSettingsWebhookTabData } from "../../dataset-settings-webhooks-tab.component.types";
import { DatasetWebhooksService } from "../../service/dataset-webhooks.service";
import { WebhooksHelpers } from "../../webhooks.helpers";
import { MatDividerModule } from "@angular/material/divider";
import { MatIconModule } from "@angular/material/icon";
import { MatTableModule } from "@angular/material/table";
import { FeatureFlagDirective } from "src/app/common/directives/feature-flag.directive";
import { NavigationService } from "src/app/services/navigation.service";
import ProjectLinks from "src/app/project-links";
import { DatasetViewTypeEnum } from "src/app/dataset-view/dataset-view.interface";

@Component({
    selector: "app-list-webhooks",
    standalone: true,
    imports: [
        //-----//
        AsyncPipe,
        NgClass,
        NgIf,

        //-----//
        MatDividerModule,
        MatIconModule,
        MatTableModule,

        //-----//
        FeatureFlagDirective,
    ],
    templateUrl: "./list-webhooks.component.html",
    styleUrls: ["./list-webhooks.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListWebhooksComponent implements OnInit {
    @Input(RoutingResolvers.DATASET_SETTINGS_WEBHOOKS_KEY) public webhooksViewData: DatasetSettingsWebhookTabData;

    public readonly DISPLAY_COLUMNS: string[] = ["event", "status", "actions"];
    public readonly WebhookSubscriptionStatus: typeof WebhookSubscriptionStatus = WebhookSubscriptionStatus;
    private readonly _rowsSubject$ = new BehaviorSubject<WebhookSubscription[]>([]);
    public readonly rows$ = this._rowsSubject$.asObservable();
    public readonly dataSource$: Observable<WebhookSubscription[]> = this.rows$;

    private datasetWebhooksService = inject(DatasetWebhooksService);
    private modalService = inject(ModalService);
    private navigationService = inject(NavigationService);

    public ngOnInit(): void {
        this.fetchTableData();
    }

    private fetchTableData(): void {
        this._rowsSubject$.next(this.webhooksViewData.subscriptions);
    }

    public get datasetBasics(): DatasetBasicsFragment {
        return this.webhooksViewData.datasetBasics;
    }

    public createWebhook(): void {
        this.navigationService.navigateToWebhooks({
            accountName: this.datasetBasics.owner.accountName,
            datasetName: this.datasetBasics.name,
            tab: ProjectLinks.URL_WEBHOOK_NEW,
        });
    }

    public removeWebhook(subscriptionId: string): void {
        promiseWithCatch(
            this.modalService.error({
                title: "Remove webhook subscription",
                message: `Do you want to remove webhook subscription?`,
                bigTextBlock: "Ok",
                noButtonText: "Cancel",
                yesButtonText: "Ok",
                handler: (ok) => {
                    if (ok) {
                        this.datasetWebhooksService
                            .datasetWebhookRemoveSubscription(this.datasetBasics.id, subscriptionId)
                            .pipe(take(1))
                            .subscribe((result: boolean) => {
                                if (result) {
                                    const currentRows: WebhookSubscription[] = this._rowsSubject$.getValue();
                                    const updatedRows: WebhookSubscription[] = currentRows.filter(
                                        (row) => row.id !== subscriptionId,
                                    );
                                    this._rowsSubject$.next(updatedRows);
                                }
                            });
                    }
                },
            }),
        );
    }

    public pauseWebhook(subscriptionId: string): void {
        this.datasetWebhooksService
            .datasetWebhookPauseSubscription(this.datasetBasics.id, subscriptionId)
            .pipe(take(1))
            .subscribe((result: boolean) => {
                if (result) {
                    this.updateRowStatus(
                        (row) => row.id === subscriptionId,
                        result ? WebhookSubscriptionStatus.Paused : WebhookSubscriptionStatus.Enabled,
                    );
                }
            });
    }

    public reactivateWebhook(subscriptionId: string): void {
        promiseWithCatch(
            this.modalService.warning({
                title: "Reactivate webhook subscription",
                message: `Do you want to reactivate this webhook subscription? Make sure it is reachable before proceeding.`,
                bigTextBlock: "Ok",
                noButtonText: "Cancel",
                yesButtonText: "Ok",
                handler: (ok) => {
                    if (ok) {
                        this.datasetWebhooksService
                            .datasetWebhookReactivateSubscription(this.datasetBasics.id, subscriptionId)
                            .pipe(take(1))
                            .subscribe((result: boolean) => {
                                if (result) {
                                    this.updateRowStatus(
                                        (row) => row.id === subscriptionId,
                                        result
                                            ? WebhookSubscriptionStatus.Enabled
                                            : WebhookSubscriptionStatus.Unreachable,
                                    );
                                }
                            });
                    }
                },
            }),
        );
    }

    public rotateSecret(subscriptionId: string): void {
        promiseWithCatch(
            this.modalService.error({
                title: "Rotate webhook secret",
                message: `Are you sure you want to rotate the secret associated with this webhook? This would affect the generated signature headers starting from the next notification.`,

                yesButtonText: "Ok",
                noButtonText: "Cancel",
                handler: (ok) => {
                    if (ok) {
                        this.navigationService.navigateToWebhooks({
                            accountName: this.datasetBasics.owner.accountName,
                            datasetName: this.datasetBasics.name,
                            tab: ProjectLinks.URL_WEBHOOK_ROTATE_SECRET,
                            webhookId: subscriptionId,
                        });
                    }
                },
            }),
        );
    }

    public resumeWebhook(subscriptionId: string): void {
        this.datasetWebhooksService
            .datasetWebhookResumeSubscription(this.datasetBasics.id, subscriptionId)
            .pipe(take(1))
            .subscribe((result: boolean) => {
                if (result) {
                    this.updateRowStatus(
                        (row) => row.id === subscriptionId,
                        result ? WebhookSubscriptionStatus.Enabled : WebhookSubscriptionStatus.Paused,
                    );
                }
            });
    }

    public viewDeliveryReport(subscription: WebhookSubscription): void {
        this.navigationService.navigateToDatasetView({
            accountName: this.datasetBasics.owner.accountName,
            datasetName: this.datasetBasics.name,
            tab: DatasetViewTypeEnum.Flows,
            webhookId: [subscription.id],
        });
    }

    public editWebhook(subscription: WebhookSubscription): void {
        this.navigationService.navigateToWebhooks({
            accountName: this.datasetBasics.owner.accountName,
            datasetName: this.datasetBasics.name,
            tab: subscription.id,
        });
    }

    public webhookStatusBadgeOptions(status: WebhookSubscriptionStatus): {
        iconName: string;
        className: string;
    } {
        return WebhooksHelpers.webhookStatusBadgeOptions(status);
    }

    public trackByWebhookId(index: number, item: WebhookSubscription): string {
        return item.id;
    }

    private updateRowStatus(predicate: (row: WebhookSubscription) => boolean, status: WebhookSubscriptionStatus): void {
        const current = this._rowsSubject$.getValue();
        const updated = current.map((row) => (predicate(row) ? { ...row, status } : row));
        this._rowsSubject$.next(updated);
    }
}
