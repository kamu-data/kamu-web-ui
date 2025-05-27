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
import { NavigationService } from "src/app/services/navigation.service";
import { CreateSubscriptionModalComponent } from "./create-subscription-modal/create-subscription-modal.component";
import { MatTableDataSource } from "@angular/material/table";
import {
    DatasetBasicsFragment,
    PageBasedInfo,
    WebhookSubscription,
    WebhookSubscriptionInput,
    WebhookSubscriptionStatus,
} from "src/app/api/kamu.graphql.interface";
import { BaseComponent } from "src/app/common/components/base.component";
import { DatasetWebhooksService } from "./service/dataset-webhooks.service";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { filter, from, switchMap } from "rxjs";
import { CreateWebhookSubscriptionSucces } from "./create-subscription-modal/create-subscription-modal.model";
import { promiseWithCatch } from "src/app/common/helpers/app.helpers";
import { ModalService } from "src/app/common/components/modal/modal.service";

@Component({
    selector: "app-dataset-settings-webhooks-tab",
    templateUrl: "./dataset-settings-webhooks-tab.component.html",
    styleUrls: ["./dataset-settings-webhooks-tab.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DatasetSettingsWebhooksTabComponent extends BaseComponent implements OnInit {
    @Input(RoutingResolvers.DATASET_SETTINGS_WEBHOOKS_KEY) public webhooksViewData: DatasetViewData;
    public dataSource = new MatTableDataSource();
    public currentPage = 1;
    public pageBasedInfo: PageBasedInfo;
    public readonly PER_PAGE = 15;

    public readonly DISPLAY_COLUMNS: string[] = ["event", "status", "actions"];
    public readonly WebhookSubscriptionStatus: typeof WebhookSubscriptionStatus = WebhookSubscriptionStatus;

    private navigationService = inject(NavigationService);
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
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((data: WebhookSubscription[]) => {
                this.dataSource.data = data;
                this.cdr.detectChanges();
            });
    }

    public get datasetBasics(): DatasetBasicsFragment {
        return this.webhooksViewData.datasetBasics;
    }

    public createWebhook(): void {
        const modalRef = this.ngbModalService.open(CreateSubscriptionModalComponent);
        const modalRefInstance = modalRef.componentInstance as CreateSubscriptionModalComponent;
        modalRefInstance.datasetBasics = this.webhooksViewData.datasetBasics;

        from(modalRef.result)
            .pipe(
                filter((data) => !!data),
                switchMap((result: WebhookSubscriptionInput) =>
                    this.datasetWebhooksService.datasetWebhookCreateSubscription(this.datasetBasics.id, result),
                ),
                takeUntilDestroyed(this.destroyRef),
            )
            .subscribe((data: CreateWebhookSubscriptionSucces | null) => {
                if (data) {
                    const modalRef = this.ngbModalService.open(CreateSubscriptionModalComponent);
                    const modalRefInstance = modalRef.componentInstance as CreateSubscriptionModalComponent;
                    modalRefInstance.datasetBasics = this.webhooksViewData.datasetBasics;
                    modalRefInstance.subscriptionData = data;
                }
            });
    }

    public removeWebhook(subscriptionId: string): void {
        this.datasetWebhooksService
            .datasetWebhookRemoveSubscription(this.datasetBasics.id, subscriptionId)
            .subscribe((result: boolean) => {
                if (result) {
                    this.updateTable();
                }
            });
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

    public resumeWebhook(subscriptionId: string): void {
        this.datasetWebhooksService
            .datasetWebhookResumeSubscription(this.datasetBasics.id, subscriptionId)
            .subscribe((result: boolean) => {
                if (result) {
                    this.updateTable();
                }
            });
    }

    public viewWebhook(): void {
        promiseWithCatch(
            this.modalService.warning({
                message: "Feature coming soon",
                yesButtonText: "Ok",
            }),
        );
    }
}
