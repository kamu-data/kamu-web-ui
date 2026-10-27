/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { AsyncPipe } from "@angular/common";
import { ChangeDetectionStrategy, Component, inject, Input, OnInit } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { FormsModule } from "@angular/forms";
import { MatButtonToggleChange, MatButtonToggleModule } from "@angular/material/button-toggle";
import { MatChipListboxChange, MatChipsModule } from "@angular/material/chips";
import { MatIconModule } from "@angular/material/icon";
import { MatProgressBarModule } from "@angular/material/progress-bar";

import {
    BehaviorSubject,
    debounceTime,
    filter,
    map,
    Observable,
    startWith,
    Subject,
    switchMap,
    take,
    tap,
    timer,
} from "rxjs";

import { DateTimeAdapter, OWL_DATE_TIME_FORMATS } from "@danielmoncada/angular-datetime-picker";
import { MomentDateTimeAdapter } from "@danielmoncada/angular-datetime-picker-moment-adapter";
import { InfiniteScrollDirective } from "ngx-infinite-scroll";
import { ToastrService } from "ngx-toastr";

import { environment } from "@env/environment";
import { BaseComponent } from "@common/components/base.component";
import { enumValueOf, requireValue, trackBusyKey, unexpectedValueError } from "@common/helpers/app.helpers";
import { MY_MOMENT_FORMATS } from "@common/helpers/data.helpers";
import AppValues from "@common/values/app.values";
import {
    AccountFlowProcessCardDataFragment,
    DatasetBasicsFragment,
    FlowProcessEffectiveState,
    FlowProcessFilters,
    FlowProcessGroupRollupDataFragment,
    FlowProcessOrderField,
} from "@api/kamu.graphql.interface";
import { MaybeUndefined } from "@interface/app.types";

import { AccountTabs } from "src/app/account/account.constants";
import { AccountService } from "src/app/account/account.service";
import { CustomFiltersViewComponent } from "src/app/account/additional-components/account-flows-tab/account-flows-subtabs/account-flows-processes-subtab/components/custom-filters-view/custom-filters-view.component";
import { RecentActivityFiltersViewComponent } from "src/app/account/additional-components/account-flows-tab/account-flows-subtabs/account-flows-processes-subtab/components/recent-activity-filters-view/recent-activity-filters-view.component";
import { TriageFiltersViewComponent } from "src/app/account/additional-components/account-flows-tab/account-flows-subtabs/account-flows-processes-subtab/components/triage-filters-view/triage-filters-view.component";
import { UpcomingScheduledFiltersViewComponent } from "src/app/account/additional-components/account-flows-tab/account-flows-subtabs/account-flows-processes-subtab/components/upcoming-scheduled-filters-view/upcoming-scheduled-filters-view.component";
import {
    AccountFlowsNav,
    CARD_FILTERS_MODE_OPTIONS,
    CardFilterDescriptor,
    CardsStrategyResult,
    DashboardFiltersOptions,
    FlowProcessCardListing,
    ProcessCardFilterMode,
    ProcessCardGroup,
} from "src/app/account/additional-components/account-flows-tab/account-flows-tab.types";
import { AccountFlowsType } from "src/app/account/additional-components/account-flows-tab/resolvers/account-flows.resolver";
import { AccountFlowsFiltersService } from "src/app/account/services/account-flows-filters.service";
import { DatasetWebhooksService } from "src/app/dataset-view/additional-components/dataset-settings-component/tabs/webhooks/service/dataset-webhooks.service";
import {
    rollupAvailabilityMapper,
    RollupFiltersOptions,
} from "src/app/dataset-view/additional-components/flows-component/flows.helpers";
import { DatasetViewTypeEnum } from "src/app/dataset-view/dataset-view.interface";
import { DatasetFlowProcessCardComponent } from "src/app/flow-cards/dataset-flow-process-card/dataset-flow-process-card.component";
import { WebhookFlowProcessCardComponent } from "src/app/flow-cards/webhook-flow-process-card/webhook-flow-process-card.component";
import { NavigationService } from "src/app/services/navigation.service";
import { ProcessDatasetCardInteractionService } from "src/app/services/process-dataset-card-interaction.service";

@Component({
    selector: "app-account-flows-processes-subtab",

    providers: [
        { provide: DateTimeAdapter, useClass: MomentDateTimeAdapter },
        { provide: OWL_DATE_TIME_FORMATS, useValue: MY_MOMENT_FORMATS },
    ],
    imports: [
        //-----//
        AsyncPipe,
        FormsModule,
        //-----//
        MatIconModule,
        MatButtonToggleModule,
        MatChipsModule,
        MatProgressBarModule,
        InfiniteScrollDirective,
        //-----//
        DatasetFlowProcessCardComponent,
        CustomFiltersViewComponent,
        RecentActivityFiltersViewComponent,
        TriageFiltersViewComponent,
        UpcomingScheduledFiltersViewComponent,
        WebhookFlowProcessCardComponent,
    ],
    templateUrl: "./account-flows-processes-subtab.component.html",
    styleUrls: ["./account-flows-processes-subtab.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountFlowsProcessesSubtabComponent extends BaseComponent implements OnInit {
    @Input({ required: true }) public accountName: string;
    @Input({ required: true }) public set accountFlowsData(value: AccountFlowsType) {
        this.accountFlowsDataValue = value;
        // Also reached by back/forward navigation between modes, which reuses this component
        if (value.datasetsFiltersMode !== this.defaultsAppliedForMode) {
            this.applyModeDefaults(value.datasetsFiltersMode);
        }
    }
    public get accountFlowsData(): AccountFlowsType {
        return this.accountFlowsDataValue;
    }
    private accountFlowsDataValue: AccountFlowsType;
    private defaultsAppliedForMode: MaybeUndefined<ProcessCardFilterMode>;

    private readonly accountService = inject(AccountService);
    private readonly navigationService = inject(NavigationService);
    private readonly datasetWebhooksService = inject(DatasetWebhooksService);
    private readonly datasetCardService = inject(ProcessDatasetCardInteractionService);
    private readonly toastrService = inject(ToastrService);
    private readonly accountFlowsFiltersService = inject(AccountFlowsFiltersService);

    public accountFlowsCardsData$: Observable<FlowProcessCardListing>;
    public hasNextPage = false;
    public processesCards: AccountFlowProcessCardDataFragment[] = [];
    public processesPerPage: number = AppValues.UPLOAD_FLOW_PROCESSES_PER_PAGE;
    public flowsMode: ProcessCardGroup = ProcessCardGroup.ALL;
    public activeRollup: FlowProcessGroupRollupDataFragment;
    private readonly loadingCardsSubject$ = new BehaviorSubject<boolean>(false);
    public readonly loadingCards$: Observable<boolean> = this.loadingCardsSubject$.asObservable();
    /** IDs of the cards whose action has not shown its result yet, as `trackByCardId` gives them */
    public readonly busyCardIds$ = new BehaviorSubject<ReadonlySet<string>>(new Set());
    private readonly cardsLoadStarted$ = new Subject<void>();
    private readonly cardsLoaded$ = new Subject<void>();
    public readonly fetchTrigger$ = new Subject<void>();
    public readonly ROLLUP_OPTIONS = RollupFiltersOptions;

    public readonly CARD_FILTERS_MODE_OPTIONS: CardFilterDescriptor[] = CARD_FILTERS_MODE_OPTIONS;

    public readonly DISPLAY_TIME_FORMAT = AppValues.DISPLAY_TIME_FORMAT;
    public readonly FlowProcessEffectiveState: typeof FlowProcessEffectiveState = FlowProcessEffectiveState;
    public readonly TIMEOUT_REFRESH_FLOW = AppValues.TIMEOUT_REFRESH_FLOW_MS;

    public readonly ProcessCardFilterMode: typeof ProcessCardFilterMode = ProcessCardFilterMode;
    public readonly DatasetViewTypeEnum: typeof DatasetViewTypeEnum = DatasetViewTypeEnum;
    public readonly ProcessCardGroup: typeof ProcessCardGroup = ProcessCardGroup;

    public ngOnInit(): void {
        this.loadingCardsSubject$.next(true);
        this.fetchCardsData();
    }

    public get dashboardFiltersState(): DashboardFiltersOptions {
        return this.accountFlowsFiltersService.currentFiltersSnapshot;
    }

    public fetchCardsData(): void {
        const polling$ = timer(0, environment.delay_polling_ms);
        const triggerWithInitial$ = this.fetchTrigger$.pipe(debounceTime(300), startWith(undefined));

        this.accountFlowsCardsData$ = triggerWithInitial$.pipe(
            switchMap(() => polling$),
            tap(() => this.cardsLoadStarted$.next()),
            switchMap(() => this.setCardsStrategy(this.flowsMode)),

            tap((data: CardsStrategyResult) => {
                this.activeRollup = data.rollup;
                const newChunkCards = data.cards.nodes;
                this.hasNextPage = data.cards.pageInfo.hasNextPage;
                this.processesCards = [...newChunkCards];

                this.loadingCardsSubject$.next(false);
                this.cardsLoaded$.next();
            }),
            map((data: CardsStrategyResult) => {
                return {
                    totalCount: data.cards.totalCount,
                    nodes: this.processesCards,
                };
            }),
        );
    }

    public onScroll(): void {
        if (this.loadingCardsSubject$.getValue() || !this.hasNextPage) {
            return;
        }
        this.processesPerPage = this.processesCards.length + AppValues.UPLOAD_FLOW_PROCESSES_PER_PAGE;
        this.refreshNow();
    }

    private setFlowProcessFilters(mode: ProcessCardFilterMode): FlowProcessFilters {
        return this.accountFlowsFiltersService.setFlowProcessFilters(mode);
    }

    public rollupAvailabilityMapper(mode: ProcessCardFilterMode, state: FlowProcessEffectiveState): boolean {
        return rollupAvailabilityMapper(mode, state);
    }

    public totalProcessesCountByMode(mode: ProcessCardFilterMode, rollup: FlowProcessGroupRollupDataFragment): number {
        switch (mode) {
            case ProcessCardFilterMode.RECENT_ACTIVITY:
                return rollup.active + rollup.failing + rollup.paused + rollup.stopped;
            case ProcessCardFilterMode.TRIAGE:
                return rollup.failing + rollup.stopped;
            case ProcessCardFilterMode.PAUSED:
                return rollup.paused;
            case ProcessCardFilterMode.UPCOMING_SCHEDULED:
                return rollup.active + rollup.failing;
            case ProcessCardFilterMode.CUSTOM:
                return rollup.active + rollup.failing + rollup.paused + rollup.stopped;
            /* istanbul ignore next */
            default:
                throw unexpectedValueError(mode, "process card filter mode");
        }
    }

    public resetFilters(): void {
        this.resetRequestParams();
        this.processesPerPage = AppValues.UPLOAD_FLOW_PROCESSES_PER_PAGE;
        this.accountFlowsFiltersService.resetFilters(this.accountFlowsData.datasetsFiltersMode);
        this.refreshNow();
    }

    public updateNow(datasetBasics: DatasetBasicsFragment): void {
        this.datasetCardService
            .handleTrigger(datasetBasics)
            .pipe(
                filter(Boolean),
                tap(() => this.toastrService.success("Flow scheduled")),
                switchMap(() => this.refreshCardsAfterDelay()),
                trackBusyKey(this.busyCardIds$, datasetBasics.id),
            )
            .subscribe();
    }

    public onToggleRollup(): void {
        this.applyFilters();
    }

    public toggleStateDatasetCard(params: {
        state: FlowProcessEffectiveState;
        datasetBasics: DatasetBasicsFragment;
    }): void {
        this.processesPerPage = this.processesCards.length;
        this.datasetCardService
            .confirmToggleState(params.state)
            .pipe(
                switchMap(() =>
                    this.datasetCardService
                        .handleToggleState({
                            state: params.state,
                            datasetBasics: params.datasetBasics,
                        })
                        .pipe(
                            switchMap(() => this.refreshCardsAfterDelay()),
                            trackBusyKey(this.busyCardIds$, params.datasetBasics.id),
                        ),
                ),
            )
            .subscribe();
    }

    public toggleWebhookCardState(params: {
        datasetBasics: DatasetBasicsFragment;
        subscriptionId: string;
        state: FlowProcessEffectiveState;
    }): void {
        this.processesPerPage = this.processesCards.length;
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
        result$
            .pipe(
                take(1),
                filter(Boolean),
                switchMap(() => this.refreshCardsAfterDelay()),
                trackBusyKey(this.busyCardIds$, params.subscriptionId),
            )
            .subscribe();
    }

    /**
     * Completes once cards requested after the delay arrive; a load that was under way already is not enough.
     * Only this part is tied to the page: the mutation before it still reports its result after leaving.
     */
    private refreshCardsAfterDelay(): Observable<void> {
        return timer(this.TIMEOUT_REFRESH_FLOW).pipe(
            switchMap(() => {
                this.refreshNow();
                // A new load cancels the one under way, so the cards arriving after a start come from that load
                return this.cardsLoadStarted$.pipe(
                    take(1),
                    switchMap(() => this.cardsLoaded$.pipe(take(1))),
                );
            }),
            takeUntilDestroyed(this.destroyRef),
        );
    }

    public refreshNow(): void {
        this.loadingCardsSubject$.next(true);
        this.fetchTrigger$.next();
    }

    public refreshPage(): void {
        this.fetchCardsData();
    }

    private resetRequestParams(): void {
        this.processesCards = [];
    }

    public applyFilters(): void {
        this.resetRequestParams();
        this.refreshNow();
    }

    public onChangeFiltersMode(event: MatButtonToggleChange): void {
        const nextNav = requireValue(enumValueOf(ProcessCardFilterMode, event.value), "Unknown filters mode");
        this.resetRequestParams();
        this.accountFlowsFiltersService.resetFilters(nextNav);
        this.applyModeDefaults(nextNav);
        this.navigationService.navigateToOwnerView(
            this.accountName,
            AccountTabs.FLOWS,
            undefined,
            AccountFlowsNav.PROCESSES,
            undefined,
            nextNav,
        );
        this.refreshNow();
    }

    private applyModeDefaults(mode: ProcessCardFilterMode): void {
        this.accountFlowsFiltersService.applyModeDefaults(mode);
        this.defaultsAppliedForMode = mode;
    }

    public trackByCardId(item: AccountFlowProcessCardDataFragment): string {
        if ("dataset" in item) {
            return item.dataset.id;
        } else {
            return item.id;
        }
    }

    public onFlowsModeChange(event: MatChipListboxChange): void {
        const flowsMode = enumValueOf(ProcessCardGroup, event.value);
        // Clicking the selected chip deselects it; one mode is always shown, so it stays selected
        if (!flowsMode) {
            event.source.value = this.flowsMode;
            return;
        }
        this.flowsMode = flowsMode;
        this.processesPerPage = AppValues.UPLOAD_FLOW_PROCESSES_PER_PAGE;
        this.processesCards = [];
        this.refreshNow();
    }

    private setCardsStrategy(group: ProcessCardGroup): Observable<CardsStrategyResult> {
        const params = {
            accountName: this.accountName,
            page: 0,
            perPage: this.processesPerPage,
            filters: this.setFlowProcessFilters(this.accountFlowsData.datasetsFiltersMode),
            ordering: {
                field: this.dashboardFiltersState.selectedOrderField ?? FlowProcessOrderField.LastAttemptAt,
                direction: this.accountFlowsFiltersService.orderDirection,
            },
        };
        switch (group) {
            case ProcessCardGroup.ALL:
                return this.accountService.getAccountAllCards(params);
            case ProcessCardGroup.DATASETS:
                return this.accountService.getAccountPrimaryCards(params);
            case ProcessCardGroup.WEBHOOKS:
                return this.accountService.getAccountWebhookCards(params);
            /* istanbul ignore next */
            default:
                throw new Error("Unsupported flow process group");
        }
    }
}
