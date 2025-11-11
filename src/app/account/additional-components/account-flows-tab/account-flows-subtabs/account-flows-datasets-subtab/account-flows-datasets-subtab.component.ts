/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, Input, NgZone, OnInit } from "@angular/core";
import { AsyncPipe, DatePipe, NgClass, NgFor, NgIf } from "@angular/common";
import { AccountService } from "src/app/account/account.service";
import { Observable, of, switchMap, take, tap, timer } from "rxjs";
import {
    AccountFlowProcessCardConnectionDataFragment,
    DatasetBasicsFragment,
    DatasetKind,
    FlowProcessEffectiveState,
    FlowProcessOrderField,
    FlowProcessSummary,
    OrderingDirection,
} from "src/app/api/kamu.graphql.interface";
import { environment } from "src/environments/environment";
import { RouterLink } from "@angular/router";
import ProjectLinks from "src/app/project-links";
import { requireValue } from "src/app/common/helpers/app.helpers";
import { MatIconModule } from "@angular/material/icon";
import { PaginationComponent } from "src/app/common/components/pagination-component/pagination.component";
import { NavigationService } from "src/app/services/navigation.service";
import { AccountTabs } from "src/app/account/account.constants";
import { AccountFlowsType } from "../../resolvers/account-flows.resolver";
import { BaseComponent } from "src/app/common/components/base.component";
import AppValues from "src/app/common/values/app.values";
import { DatasetFlowsService } from "src/app/dataset-view/additional-components/flows-component/services/dataset-flows.service";
import { DatasetViewTypeEnum } from "src/app/dataset-view/dataset-view.interface";
import {
    DatasetFlowsBadgeStyle,
    DatasetFlowBadgeHelpers,
    webhooksStateMapper,
    DatasetFlowsBadgeTexts,
} from "src/app/dataset-view/additional-components/flows-component/flows.helpers";
import { SettingsTabsEnum } from "src/app/dataset-view/additional-components/dataset-settings-component/dataset-settings.model";
import { DatasetWebhooksService } from "src/app/dataset-view/additional-components/dataset-settings-component/tabs/webhooks/service/dataset-webhooks.service";
import { DatasetFlowProcessCardComponent } from "src/app/common/components/dataset-flow-process-card/dataset-flow-process-card.component";

@Component({
    selector: "app-account-flows-datasets-subtab",
    standalone: true,
    imports: [
        //-----//
        AsyncPipe,
        DatePipe,
        NgIf,
        NgFor,
        NgClass,
        RouterLink,

        //-----//
        MatIconModule,

        //-----//
        DatasetFlowProcessCardComponent,
        PaginationComponent,
    ],
    templateUrl: "./account-flows-datasets-subtab.component.html",
    styleUrls: ["./account-flows-datasets-subtab.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountFlowsDatasetsSubtabComponent extends BaseComponent implements OnInit {
    @Input({ required: true }) public accountName: string;
    @Input({ required: true }) public accountFlowsData: AccountFlowsType;

    private readonly accountService = inject(AccountService);
    private readonly navigationService = inject(NavigationService);
    private readonly ngZone = inject(NgZone);
    private readonly flowsService = inject(DatasetFlowsService);
    private readonly cdr = inject(ChangeDetectorRef);
    private readonly datasetWebhooksService = inject(DatasetWebhooksService);

    public accountFlowsCardsData$: Observable<AccountFlowProcessCardConnectionDataFragment>;
    public currentPage: number = 1;
    public readonly DISPLAY_TIME_FORMAT = AppValues.DISPLAY_TIME_FORMAT;
    public readonly FlowProcessEffectiveState: typeof FlowProcessEffectiveState = FlowProcessEffectiveState;
    private readonly CARDS_FLOW_PROCESSES_PER_PAGE: number = 9;
    private readonly TIMEOUT_REFRESH_FLOW = AppValues.TIMEOUT_REFRESH_FLOW_MS;
    public readonly DatasetViewTypeEnum: typeof DatasetViewTypeEnum = DatasetViewTypeEnum;

    public ngOnInit(): void {
        this.fetchCardsData();
    }

    public getPageFromUrl(): void {
        const pageParam = this.activatedRoute.snapshot.queryParamMap.get(ProjectLinks.URL_QUERY_PARAM_PAGE);
        if (pageParam) {
            this.currentPage = +requireValue(pageParam);
        }
    }

    public redirectSection(dataset: DatasetBasicsFragment): SettingsTabsEnum {
        return dataset.kind === DatasetKind.Root ? SettingsTabsEnum.SCHEDULING : SettingsTabsEnum.TRANSFORM_SETTINGS;
    }

    public badgeStyles(effectiveState: FlowProcessEffectiveState): DatasetFlowsBadgeStyle {
        return DatasetFlowBadgeHelpers.badgeStyles(effectiveState);
    }

    public badgeMessages(dataset: DatasetBasicsFragment, summary: FlowProcessSummary): DatasetFlowsBadgeTexts {
        const isRoot = dataset.kind === DatasetKind.Root;
        return DatasetFlowBadgeHelpers.badgeMessages(summary, isRoot);
    }

    public editWebhookCard(dataset: DatasetBasicsFragment, subscriptionId: string): void {
        this.navigationService.navigateToWebhooks({
            accountName: dataset.owner.accountName,
            datasetName: dataset.name,
            tab: subscriptionId,
        });
    }

    public toggleWebhookCardState(
        dataset: DatasetBasicsFragment,
        subscriptionId: string,
        effectiveState: FlowProcessEffectiveState,
    ): void {
        const result$: Observable<boolean> =
            effectiveState === FlowProcessEffectiveState.Active
                ? this.datasetWebhooksService.datasetWebhookPauseSubscription(dataset.id, subscriptionId)
                : this.datasetWebhooksService.datasetWebhookResumeSubscription(dataset.id, subscriptionId);
        result$.pipe(take(1)).subscribe((result: boolean) => {
            if (result) {
                setTimeout(() => {
                    this.fetchCardsData();
                    this.cdr.detectChanges();
                }, this.TIMEOUT_REFRESH_FLOW);
            }
        });
    }

    public fetchCardsData(): void {
        this.accountFlowsCardsData$ = timer(0, environment.delay_polling_ms).pipe(
            tap(() => {
                this.getPageFromUrl();
            }),
            switchMap(() =>
                this.accountService.getAccountFlowsAsCards({
                    accountName: this.accountName,
                    page: this.currentPage - 1,
                    perPage: this.CARDS_FLOW_PROCESSES_PER_PAGE,
                    filters: { effectiveStateIn: [] },
                    ordering: { field: FlowProcessOrderField.EffectiveState, direction: OrderingDirection.Asc },
                }),
            ),
        );
    }

    public onPageChange(page: number): void {
        if (page === 1) {
            this.ngZone.run(() =>
                this.navigationService.navigateToOwnerView(
                    this.accountName,
                    AccountTabs.FLOWS,
                    undefined,
                    this.accountFlowsData.activeNav,
                ),
            );
        } else {
            this.ngZone.run(() =>
                this.navigationService.navigateToOwnerView(
                    this.accountName,
                    AccountTabs.FLOWS,
                    page,
                    this.accountFlowsData.activeNav,
                ),
            );
        }
        this.fetchCardsData();
    }

    public get pauseableStates(): FlowProcessEffectiveState[] {
        return [FlowProcessEffectiveState.Active, FlowProcessEffectiveState.Failing];
    }

    public updateNow(datasetBasics: DatasetBasicsFragment): void {
        const datasetTrigger$: Observable<boolean> =
            datasetBasics.kind === DatasetKind.Root
                ? this.flowsService.datasetTriggerIngestFlow({
                      datasetId: datasetBasics.id,
                  })
                : this.flowsService.datasetTriggerTransformFlow({
                      datasetId: datasetBasics.id,
                  });

        datasetTrigger$.pipe(take(1)).subscribe((success: boolean) => {
            if (success) {
                setTimeout(() => {
                    this.navigationService.navigateToDatasetView({
                        accountName: datasetBasics.owner.accountName,
                        datasetName: datasetBasics.name,
                        tab: DatasetViewTypeEnum.Flows,
                    });
                }, this.TIMEOUT_REFRESH_FLOW);
            }
        });
    }

    public toggleStateDatasetCard(params: {
        state: FlowProcessEffectiveState;
        datasetBasics: DatasetBasicsFragment;
    }): void {
        let operation$: Observable<void> = of();
        if (params.state === FlowProcessEffectiveState.Active) {
            operation$ = this.flowsService.datasetPauseFlows({
                datasetId: params.datasetBasics.id,
            });
        } else {
            operation$ = this.flowsService.datasetResumeFlows({
                datasetId: params.datasetBasics.id,
            });
        }

        operation$.pipe(take(1)).subscribe(() => {
            setTimeout(() => {
                this.fetchCardsData();
                this.cdr.detectChanges();
            }, this.TIMEOUT_REFRESH_FLOW);
        });
    }

    public flowProcessEffectiveStateMapper(state: FlowProcessEffectiveState): string {
        return webhooksStateMapper[state];
    }

    public refreshNow(): void {
        this.fetchCardsData();
        this.cdr.detectChanges();
    }
}
