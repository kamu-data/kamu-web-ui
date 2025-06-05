/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, Input, OnInit } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import RoutingResolvers from "src/app/common/resolvers/routing-resolvers";
import { DatasetViewData } from "src/app/dataset-view/dataset-view.interface";
import { CreateEditSubscriptionModalComponent } from "./create-edit-subscription-modal/create-edit-subscription-modal.component";
import { MatTableDataSource } from "@angular/material/table";
import {
    DatasetBasicsFragment,
    WebhookSubscription,
    WebhookSubscriptionStatus,
} from "src/app/api/kamu.graphql.interface";
import { BaseComponent } from "src/app/common/components/base.component";
import { DatasetWebhooksService } from "./service/dataset-webhooks.service";

import { finalize, first, from, of, switchMap } from "rxjs";
import {
    CreateWebhookSubscriptionSuccess,
    WebhookSubscriptionModalAction,
    WebhookSubscriptionModalActionResult,
} from "./create-edit-subscription-modal/create-edit-subscription-modal.model";
import { promiseWithCatch } from "src/app/common/helpers/app.helpers";
import { ModalService } from "src/app/common/components/modal/modal.service";
import { WebhooksHelpers } from "./webhooks.helpers";
import { RotateSecretSubscriptionModalComponent } from "./rotate-secret-subscription-modal/rotate-secret-subscription-modal.component";

@Component({
    selector: "app-dataset-settings-webhooks-tab",
    templateUrl: "./dataset-settings-webhooks-tab.component.html",
    styleUrls: ["./dataset-settings-webhooks-tab.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DatasetSettingsWebhooksTabComponent extends BaseComponent implements OnInit {
    @Input(RoutingResolvers.DATASET_SETTINGS_WEBHOOKS_KEY) public webhooksViewData: DatasetViewData;
    public dataSource = new MatTableDataSource();

    public isLoaded: boolean = false;
    public readonly DISPLAY_COLUMNS: string[] = ["event", "status", "actions"];
    public readonly WebhookSubscriptionStatus: typeof WebhookSubscriptionStatus = WebhookSubscriptionStatus;

    private ngbModalService = inject(NgbModal);
    private datasetWebhooksService = inject(DatasetWebhooksService);
    private cdr = inject(ChangeDetectorRef);
    private modalService = inject(ModalService);

    public ngOnInit(): void {
        this.updateTable();
    }

    private updateTable(): void {
        this.datasetWebhooksService
            .datasetWebhookSubscriptions(this.datasetBasics.id)
            .pipe(
                first(),
                finalize(() => {
                    this.isLoaded = true;
                    this.cdr.detectChanges();
                }),
            )

            .subscribe((data: WebhookSubscription[]) => {
                this.dataSource.data = data;
                this.cdr.detectChanges();
            });
    }

    public get datasetBasics(): DatasetBasicsFragment {
        return this.webhooksViewData.datasetBasics;
    }

    public createWebhook(): void {
        const modalRef = this.ngbModalService.open(CreateEditSubscriptionModalComponent);
        const modalRefInstance = modalRef.componentInstance as CreateEditSubscriptionModalComponent;
        modalRefInstance.datasetBasics = this.webhooksViewData.datasetBasics;

        from(modalRef.result)
            .pipe(
                switchMap((result: WebhookSubscriptionModalActionResult) =>
                    result.payload
                        ? this.datasetWebhooksService.datasetWebhookCreateSubscription(
                              this.datasetBasics.id,
                              result.payload,
                          )
                        : of(),
                ),
            )
            .subscribe((data: CreateWebhookSubscriptionSuccess | null) => {
                if (data) {
                    const modalRef = this.ngbModalService.open(CreateEditSubscriptionModalComponent, {
                        backdrop: "static",
                        keyboard: false,
                        windowClass: "custom-modal-width",
                    });
                    const modalRefInstance = modalRef.componentInstance as CreateEditSubscriptionModalComponent;
                    modalRefInstance.datasetBasics = this.webhooksViewData.datasetBasics;
                    modalRefInstance.subscriptionData = data;

                    from(modalRef.result)
                        .pipe(
                            switchMap((result: WebhookSubscriptionModalActionResult) => {
                                if (result.action === WebhookSubscriptionModalAction.CLOSE) {
                                    this.updateTable();
                                }
                                return of();
                            }),
                        )
                        .subscribe();
                }
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
                            .subscribe((result: boolean) => {
                                if (result) {
                                    this.updateTable();
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
            .subscribe((result: boolean) => {
                if (result) {
                    this.updateTable();
                }
            });
    }

    public openRotateSecretModal(): void {
        this.ngbModalService.open(RotateSecretSubscriptionModalComponent);
    }

    public resumeWebhook(subscriptionId: string): void {
        this.datasetWebhooksService
            .datasetWebhookResumeSubscription(this.datasetBasics.id, subscriptionId)
            .subscribe((result: boolean) => {
                if (result) {
                    this.updateTable();
                }
            });
    }

    /* istanbul ignore next */
    public viewDeliveryReport(): void {
        promiseWithCatch(
            this.modalService.warning({
                message: "Feature coming soon",
                yesButtonText: "Ok",
            }),
        );
    }

    public editWebhook(subscription: WebhookSubscription): void {
        const modalRef = this.ngbModalService.open(CreateEditSubscriptionModalComponent);
        const modalRefInstance = modalRef.componentInstance as CreateEditSubscriptionModalComponent;
        modalRefInstance.datasetBasics = this.webhooksViewData.datasetBasics;
        modalRefInstance.subscriptionData = {
            input: {
                targetUrl: subscription.targetUrl,
                label: subscription.label,
                eventTypes: subscription.eventTypes,
            },
            subscriptionId: subscription.id,
            status: subscription.status,
        };

        from(modalRef.result)
            .pipe(
                switchMap((result: WebhookSubscriptionModalActionResult) =>
                    result.payload
                        ? this.datasetWebhooksService.datasetWebhookUpdateSubscription({
                              datasetId: this.datasetBasics.id,
                              id: subscription.id,
                              input: result.payload,
                          })
                        : of(false),
                ),
            )
            .subscribe((result: boolean) => {
                if (result) {
                    this.updateTable();
                }
            });
    }

    public webhookStatusBadgeOptions(status: WebhookSubscriptionStatus): {
        iconName: string;
        className: string;
    } {
        return WebhooksHelpers.webhookStatusBadgeOptions(status);
    }
}
