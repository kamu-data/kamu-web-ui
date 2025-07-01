/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ChangeDetectionStrategy, Component, inject, Input, OnInit } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import RoutingResolvers from "src/app/common/resolvers/routing-resolvers";
import { CreateEditSubscriptionModalComponent } from "./create-edit-subscription-modal/create-edit-subscription-modal.component";
import {
    DatasetBasicsFragment,
    WebhookSubscription,
    WebhookSubscriptionStatus,
} from "src/app/api/kamu.graphql.interface";
import { BaseComponent } from "src/app/common/components/base.component";
import { DatasetWebhooksService } from "./service/dataset-webhooks.service";

import { BehaviorSubject, from, map, Observable, of, switchMap, take } from "rxjs";
import {
    CreateWebhookSubscriptionSuccess,
    UpdateWebhookSubscriptionType,
    WebhookSubscriptionModalAction,
    WebhookSubscriptionModalActionResult,
} from "./create-edit-subscription-modal/create-edit-subscription-modal.model";
import { promiseWithCatch } from "src/app/common/helpers/app.helpers";
import { ModalService } from "src/app/common/components/modal/modal.service";
import { WebhooksHelpers } from "./webhooks.helpers";
import { RotateSecretSubscriptionModalComponent } from "./rotate-secret-subscription-modal/rotate-secret-subscription-modal.component";
import { DatasetSettingsWebhookTabData } from "./dataset-settings-webhooks-tab.component.types";
import { FeatureFlagDirective } from "../../../../../common/directives/feature-flag.directive";
import { MatTableModule } from "@angular/material/table";
import { MatIconModule } from "@angular/material/icon";
import { NgIf, NgClass, AsyncPipe } from "@angular/common";
import { MatDividerModule } from "@angular/material/divider";

@Component({
    selector: "app-dataset-settings-webhooks-tab",
    templateUrl: "./dataset-settings-webhooks-tab.component.html",
    styleUrls: ["./dataset-settings-webhooks-tab.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [MatDividerModule, NgIf, MatIconModule, MatTableModule, NgClass, FeatureFlagDirective, AsyncPipe],
})
export class DatasetSettingsWebhooksTabComponent extends BaseComponent implements OnInit {
    @Input(RoutingResolvers.DATASET_SETTINGS_WEBHOOKS_KEY) public webhooksViewData: DatasetSettingsWebhookTabData;

    public readonly DISPLAY_COLUMNS: string[] = ["event", "status", "actions"];
    public readonly WebhookSubscriptionStatus: typeof WebhookSubscriptionStatus = WebhookSubscriptionStatus;

    private readonly _rowsSubject$ = new BehaviorSubject<WebhookSubscription[]>([]);
    public readonly rows$ = this._rowsSubject$.asObservable();
    public readonly dataSource$: Observable<WebhookSubscription[]> = this.rows$;

    private ngbModalService = inject(NgbModal);
    private datasetWebhooksService = inject(DatasetWebhooksService);
    private modalService = inject(ModalService);

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
                take(1),
            )
            .subscribe((data: CreateWebhookSubscriptionSuccess | null) => {
                this.openModalWindowWithVerification(data);
            });
    }

    private openModalWindowWithVerification(data: CreateWebhookSubscriptionSuccess | null): void {
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
                            const currentRows: WebhookSubscription[] = this._rowsSubject$.getValue();
                            const updatedRows: WebhookSubscription[] = [
                                ...currentRows,
                                {
                                    datasetId: this.datasetBasics.id,
                                    eventTypes: data.input.eventTypes,
                                    id: data.subscriptionId,
                                    label: data.input.label,
                                    status: data.status ?? WebhookSubscriptionStatus.Enabled,
                                    targetUrl: data.input.targetUrl,
                                },
                            ];
                            this._rowsSubject$.next(updatedRows);
                        }
                        return of();
                    }),
                    take(1),
                )
                .subscribe();
        }
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
                    const currentRows: WebhookSubscription[] = this._rowsSubject$.getValue();
                    const updatedRows: WebhookSubscription[] = currentRows.map((row) => {
                        return row.id === subscriptionId
                            ? {
                                  ...row,
                                  status: result ? WebhookSubscriptionStatus.Paused : WebhookSubscriptionStatus.Enabled,
                              }
                            : row;
                    });
                    this._rowsSubject$.next(updatedRows);
                }
            });
    }

    public openRotateSecretModal(): void {
        this.ngbModalService.open(RotateSecretSubscriptionModalComponent);
    }

    public resumeWebhook(subscriptionId: string): void {
        this.datasetWebhooksService
            .datasetWebhookResumeSubscription(this.datasetBasics.id, subscriptionId)
            .pipe(take(1))
            .subscribe((result: boolean) => {
                if (result) {
                    const currentRows: WebhookSubscription[] = this._rowsSubject$.getValue();
                    const updatedRows: WebhookSubscription[] = currentRows.map((row) => {
                        return row.id === subscriptionId
                            ? {
                                  ...row,
                                  status: result ? WebhookSubscriptionStatus.Enabled : WebhookSubscriptionStatus.Paused,
                              }
                            : row;
                    });
                    this._rowsSubject$.next(updatedRows);
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
                        ? this.datasetWebhooksService
                              .datasetWebhookUpdateSubscription({
                                  datasetId: this.datasetBasics.id,
                                  id: subscription.id,
                                  input: result.payload,
                              })
                              .pipe(map(() => ({ result: true, payload: result.payload })))
                        : of({ result: false, payload: undefined }),
                ),
                take(1),
            )
            .subscribe((data: UpdateWebhookSubscriptionType) => {
                if (data.result) {
                    const currentRows: WebhookSubscription[] = this._rowsSubject$.getValue();
                    const updatedRows: WebhookSubscription[] = currentRows.map((row) => {
                        return row.id === subscription.id
                            ? {
                                  ...row,
                                  eventTypes: data.payload?.eventTypes as string[],
                                  label: data.payload?.label as string,
                                  targetUrl: data.payload?.targetUrl as string,
                              }
                            : row;
                    });
                    this._rowsSubject$.next(updatedRows);
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
