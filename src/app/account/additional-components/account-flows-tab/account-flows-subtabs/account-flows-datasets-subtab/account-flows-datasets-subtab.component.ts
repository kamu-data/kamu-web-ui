/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, Input, NgZone, OnInit } from "@angular/core";
import { AsyncPipe, NgFor, NgIf } from "@angular/common";
import { AccountService } from "src/app/account/account.service";
import { Observable, switchMap, take, tap, timer } from "rxjs";
import {
    AccountFlowProcessCardConnectionDataFragment,
    DatasetBasicsFragment,
    FlowProcessEffectiveState,
    FlowProcessFilters,
    FlowProcessOrderField,
    OrderingDirection,
} from "src/app/api/kamu.graphql.interface";
import { environment } from "src/environments/environment";
import ProjectLinks from "src/app/project-links";
import { requireValue } from "src/app/common/helpers/app.helpers";
import { MatIconModule } from "@angular/material/icon";
import { PaginationComponent } from "src/app/common/components/pagination-component/pagination.component";
import { NavigationService } from "src/app/services/navigation.service";
import { AccountTabs } from "src/app/account/account.constants";
import { AccountFlowsType } from "../../resolvers/account-flows.resolver";
import { BaseComponent } from "src/app/common/components/base.component";
import AppValues from "src/app/common/values/app.values";
import { DatasetViewTypeEnum } from "src/app/dataset-view/dataset-view.interface";
import { DatasetWebhooksService } from "src/app/dataset-view/additional-components/dataset-settings-component/tabs/webhooks/service/dataset-webhooks.service";
import { DatasetFlowProcessCardComponent } from "src/app/common/components/dataset-flow-process-card/dataset-flow-process-card.component";
import { WebhookFlowProcessCardComponent } from "./components/webhook-flow-process-card/webhook-flow-process-card.component";
import { ProcessDatasetCardInteractionService } from "src/app/services/process-dataset-card-interaction.service";
import { MatChipsModule } from "@angular/material/chips";
import { MatButtonToggleChange, MatButtonToggleModule } from "@angular/material/button-toggle";
import { FormsModule } from "@angular/forms";
import {
    AccountFlowsNav,
    CARD_FILTERS_MODE_OPTIONS,
    CardFilterDescriptor,
    ORDER_BY_FIELD_LIST,
    ORDER_DIRECTION_LIST,
    ProcessCardFilterMode,
} from "../../account-flows-tab.types";
import { MaybeNull } from "src/app/interface/app.types";
import { NgbNavModule } from "@ng-bootstrap/ng-bootstrap";
import { DateTimeAdapter, OWL_DATE_TIME_FORMATS, OwlDateTimeModule } from "@danielmoncada/angular-datetime-picker";
import { MomentDateTimeAdapter, OwlMomentDateTimeModule } from "@danielmoncada/angular-datetime-picker-moment-adapter";
import { MY_MOMENT_FORMATS } from "src/app/common/helpers/data.helpers";
import { NgSelectModule } from "@ng-select/ng-select";

@Component({
    selector: "app-account-flows-datasets-subtab",
    standalone: true,
    providers: [
        { provide: DateTimeAdapter, useClass: MomentDateTimeAdapter },
        { provide: OWL_DATE_TIME_FORMATS, useValue: MY_MOMENT_FORMATS },
    ],
    imports: [
        //-----//
        AsyncPipe,
        FormsModule,
        NgIf,
        NgFor,

        //-----//
        MatIconModule,
        MatButtonToggleModule,
        MatChipsModule,
        NgbNavModule,
        NgSelectModule,
        OwlDateTimeModule,
        OwlMomentDateTimeModule,

        //-----//
        DatasetFlowProcessCardComponent,
        PaginationComponent,
        WebhookFlowProcessCardComponent,
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
    private readonly cdr = inject(ChangeDetectorRef);
    private readonly datasetWebhooksService = inject(DatasetWebhooksService);
    private readonly datasetCardService = inject(ProcessDatasetCardInteractionService);

    public accountFlowsCardsData$: Observable<AccountFlowProcessCardConnectionDataFragment>;
    public currentPage: number = 1;
    public fromFilterDate: MaybeNull<Date> = null;
    public toFilterDate: MaybeNull<Date> = null;
    public lastFailureDate: MaybeNull<Date> = null;
    public nextPlannedBeforeDate: MaybeNull<Date> = null;
    public nextPlannedAfterDate: MaybeNull<Date> = null;
    public selectedOrderDirection = OrderingDirection.Desc;
    public selectedOrderField: MaybeNull<FlowProcessOrderField> = null;
    public minConsecutiveFailures = 0;
    public selectedMode: MaybeNull<ProcessCardFilterMode> = ProcessCardFilterMode.TRIAGE;
    public readonly CARD_FILTERS_MODE_OPTIONS: CardFilterDescriptor[] = CARD_FILTERS_MODE_OPTIONS;

    public readonly DISPLAY_TIME_FORMAT = AppValues.DISPLAY_TIME_FORMAT;
    public readonly FlowProcessEffectiveState: typeof FlowProcessEffectiveState = FlowProcessEffectiveState;
    public readonly TIMEOUT_REFRESH_FLOW = AppValues.TIMEOUT_REFRESH_FLOW_MS;
    public readonly ORDER_DIRECTION_LIST = ORDER_DIRECTION_LIST;
    public readonly ORDER_BY_FIELD_LIST = ORDER_BY_FIELD_LIST;
    public readonly ProcessCardFilterMode: typeof ProcessCardFilterMode = ProcessCardFilterMode;
    public readonly DatasetViewTypeEnum: typeof DatasetViewTypeEnum = DatasetViewTypeEnum;
    private readonly CARDS_FLOW_PROCESSES_PER_PAGE: number = 9;

    public ngOnInit(): void {
        this.fetchCardsData();
    }

    public getPageFromUrl(): void {
        const pageParam = this.activatedRoute.snapshot.queryParamMap.get(ProjectLinks.URL_QUERY_PARAM_PAGE);
        if (pageParam) {
            this.currentPage = +requireValue(pageParam);
        }
    }

    public editWebhookCard(params: { datasetBasics: DatasetBasicsFragment; subscriptionId: string }): void {
        this.navigationService.navigateToWebhooks({
            accountName: params.datasetBasics.owner.accountName,
            datasetName: params.datasetBasics.name,
            tab: params.subscriptionId,
        });
    }

    public toggleWebhookCardState(params: {
        datasetBasics: DatasetBasicsFragment;
        subscriptionId: string;
        state: FlowProcessEffectiveState;
    }): void {
        const result$: Observable<boolean> =
            params.state === FlowProcessEffectiveState.Active
                ? this.datasetWebhooksService.datasetWebhookPauseSubscription(
                      params.datasetBasics.id,
                      params.subscriptionId,
                  )
                : this.datasetWebhooksService.datasetWebhookResumeSubscription(
                      params.datasetBasics.id,
                      params.subscriptionId,
                  );
        result$.pipe(take(1)).subscribe((result: boolean) => {
            if (result) {
                setTimeout(() => {
                    this.refreshNow();
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
                    filters: this.setFlowProcessFilters(),
                    ordering: {
                        field: this.selectedOrderField ?? FlowProcessOrderField.LastAttemptAt,
                        direction: this.selectedOrderDirection,
                    },
                }),
            ),
        );
    }

    public get isAdvancedFiltersMode(): boolean {
        return this.accountFlowsData.datasetsFiltersMode === ProcessCardFilterMode.ADVANCED;
    }

    private get initialProcessFilters(): FlowProcessEffectiveState[] {
        return [
            FlowProcessEffectiveState.Active,
            FlowProcessEffectiveState.Failing,
            FlowProcessEffectiveState.PausedManual,
            FlowProcessEffectiveState.StoppedAuto,
        ];
    }

    private setFlowProcessFilters(): FlowProcessFilters {
        switch (this.accountFlowsData.datasetsFiltersMode) {
            case ProcessCardFilterMode.RECENT_ACTIVITY: {
                this.selectedOrderField = FlowProcessOrderField.LastAttemptAt;
                return {
                    effectiveStateIn: this.initialProcessFilters,
                };
            }
            case ProcessCardFilterMode.TRIAGE: {
                this.selectedOrderDirection = OrderingDirection.Desc;
                this.selectedOrderField = FlowProcessOrderField.ConsecutiveFailures;
                return {
                    effectiveStateIn: [FlowProcessEffectiveState.StoppedAuto, FlowProcessEffectiveState.Failing],
                };
            }
            case ProcessCardFilterMode.UPCOMING_SCHEDULED: {
                this.selectedOrderDirection = OrderingDirection.Desc;
                this.nextPlannedAfterDate = new Date();
                return {
                    effectiveStateIn: [FlowProcessEffectiveState.Active, FlowProcessEffectiveState.Failing],
                };
            }
            case ProcessCardFilterMode.ADVANCED: {
                return {
                    effectiveStateIn: this.initialProcessFilters,
                    lastAttemptBetween:
                        this.fromFilterDate && this.toFilterDate
                            ? { start: this.fromFilterDate.toISOString(), end: this.toFilterDate.toISOString() }
                            : undefined,
                    minConsecutiveFailures: this.minConsecutiveFailures,
                    lastFailureSince: this.lastFailureDate?.toISOString() ?? undefined,
                    nextPlannedBefore: this.nextPlannedBeforeDate?.toISOString() ?? undefined,
                    nextPlannedAfter: this.nextPlannedAfterDate?.toISOString() ?? undefined,
                };
            }
            default:
                throw new Error("Unknown filters mode");
        }
    }

    public resetFilters(): void {
        this.fromFilterDate = null;
        this.toFilterDate = null;
        this.lastFailureDate = null;
        this.nextPlannedBeforeDate = null;
        this.nextPlannedAfterDate = null;
        this.selectedOrderDirection = OrderingDirection.Desc;
        this.selectedOrderField = null;
        this.minConsecutiveFailures = 0;
        this.refreshNow();
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
        this.currentPage = page;
        this.fetchCardsData();
    }

    public updateNow(datasetBasics: DatasetBasicsFragment): void {
        this.datasetCardService.handleTrigger(datasetBasics, () => {
            this.navigationService.navigateToDatasetView({
                accountName: datasetBasics.owner.accountName,
                datasetName: datasetBasics.name,
                tab: DatasetViewTypeEnum.Flows,
            });
        });
    }

    public toggleStateDatasetCard(params: {
        state: FlowProcessEffectiveState;
        datasetBasics: DatasetBasicsFragment;
    }): void {
        this.datasetCardService.handleToggleState({
            state: params.state,
            datasetBasics: params.datasetBasics,
            onSuccess: () => {
                this.refreshNow();
            },
        });
    }

    public refreshNow(): void {
        this.fetchCardsData();
        this.cdr.detectChanges();
    }

    public onChangeFiltersMode(event: MatButtonToggleChange): void {
        const nextNav = event.value as ProcessCardFilterMode;
        this.resetFilters();
        this.navigationService.navigateToOwnerView(
            this.accountName,
            AccountTabs.FLOWS,
            undefined,
            AccountFlowsNav.DATASETS,
            undefined,
            nextNav,
        );
    }
}
