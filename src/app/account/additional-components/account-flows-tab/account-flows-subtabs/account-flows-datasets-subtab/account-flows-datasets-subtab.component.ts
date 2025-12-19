/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ChangeDetectionStrategy, Component, inject, Input, OnInit } from "@angular/core";
import { AsyncPipe, NgFor, NgIf, NgSwitch, NgSwitchCase, NgTemplateOutlet } from "@angular/common";
import { AccountService } from "src/app/account/account.service";
import { BehaviorSubject, combineLatest, map, Observable, startWith, Subject, switchMap, take, timer } from "rxjs";
import {
    AccountFlowProcessCard,
    AccountFlowProcessCardConnectionDataFragment,
    Dataset,
    DatasetBasicsFragment,
    FlowProcessEffectiveState,
    FlowProcessFilters,
    FlowProcessOrderField,
} from "src/app/api/kamu.graphql.interface";
import { environment } from "src/environments/environment";
import { MatIconModule } from "@angular/material/icon";
import { NavigationService } from "src/app/services/navigation.service";
import { AccountTabs } from "src/app/account/account.constants";
import { AccountFlowsType } from "../../resolvers/account-flows.resolver";
import { BaseComponent } from "src/app/common/components/base.component";
import AppValues from "src/app/common/values/app.values";
import { DatasetViewTypeEnum } from "src/app/dataset-view/dataset-view.interface";
import { DatasetWebhooksService } from "src/app/dataset-view/additional-components/dataset-settings-component/tabs/webhooks/service/dataset-webhooks.service";
import { DatasetFlowProcessCardComponent } from "src/app/flow-cards/dataset-flow-process-card/dataset-flow-process-card.component";
import { WebhookFlowProcessCardComponent } from "../../../../../flow-cards/webhook-flow-process-card/webhook-flow-process-card.component";
import { ProcessDatasetCardInteractionService } from "src/app/services/process-dataset-card-interaction.service";
import { MatChipsModule } from "@angular/material/chips";
import { MatButtonToggleChange, MatButtonToggleModule } from "@angular/material/button-toggle";
import { FormsModule } from "@angular/forms";
import {
    AccountFlowsNav,
    CARD_FILTERS_MODE_OPTIONS,
    CardFilterDescriptor,
    DashboardFiltersOptions,
    ProcessCardFilterMode,
    FlowProcessCardListing,
} from "../../account-flows-tab.types";
import { NgbNavModule } from "@ng-bootstrap/ng-bootstrap";
import { DateTimeAdapter, OWL_DATE_TIME_FORMATS, OwlDateTimeModule } from "@danielmoncada/angular-datetime-picker";
import { MomentDateTimeAdapter, OwlMomentDateTimeModule } from "@danielmoncada/angular-datetime-picker-moment-adapter";
import { MY_MOMENT_FORMATS } from "src/app/common/helpers/data.helpers";
import { NgSelectModule } from "@ng-select/ng-select";
import { ToastrService } from "ngx-toastr";
import { InfiniteScrollModule } from "ngx-infinite-scroll";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { RecentActivityFiltersViewComponent } from "./components/recent-activity-filters-view/recent-activity-filters-view.component";
import { TriageFiltersViewComponent } from "./components/triage-filters-view/triage-filters-view.component";
import { UpcomingScheduledFiltersViewComponent } from "./components/upcoming-scheduled-filters-view/upcoming-scheduled-filters-view.component";
import { CustomFiltersViewComponent } from "./components/custom-filters-view/custom-filters-view.component";
import { AccountFlowsFiltersService } from "src/app/account/services/account-flows-filters.service";
import { MatProgressBarModule } from "@angular/material/progress-bar";

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
        NgSwitch,
        NgSwitchCase,
        NgTemplateOutlet,

        //-----//
        MatIconModule,
        MatButtonToggleModule,
        MatChipsModule,
        MatSlideToggleModule,
        MatProgressBarModule,
        NgbNavModule,
        NgSelectModule,
        OwlDateTimeModule,
        OwlMomentDateTimeModule,
        InfiniteScrollModule,

        //-----//
        DatasetFlowProcessCardComponent,
        CustomFiltersViewComponent,
        RecentActivityFiltersViewComponent,
        TriageFiltersViewComponent,
        UpcomingScheduledFiltersViewComponent,
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
    private readonly datasetWebhooksService = inject(DatasetWebhooksService);
    private readonly datasetCardService = inject(ProcessDatasetCardInteractionService);
    private readonly toastrService = inject(ToastrService);
    private readonly accountFlowsFiltersService = inject(AccountFlowsFiltersService);

    public accountFlowsCardsData$: Observable<FlowProcessCardListing>;
    public hasNextPage = false;
    public processesCards: AccountFlowProcessCard[] = [];
    public processesPerPage: number = AppValues.UPLOAD_FLOW_PROCESSES_PER_PAGE;
    private readonly loadingCardsSubject$ = new BehaviorSubject<boolean>(false);
    private readonly toggleCardStateSubject$ = new BehaviorSubject<boolean>(false);
    private readonly fetchTrigger$ = new Subject<void>();

    public readonly CARD_FILTERS_MODE_OPTIONS: CardFilterDescriptor[] = CARD_FILTERS_MODE_OPTIONS;

    public readonly DISPLAY_TIME_FORMAT = AppValues.DISPLAY_TIME_FORMAT;
    public readonly FlowProcessEffectiveState: typeof FlowProcessEffectiveState = FlowProcessEffectiveState;
    public readonly TIMEOUT_REFRESH_FLOW = AppValues.TIMEOUT_REFRESH_FLOW_MS;

    public readonly ProcessCardFilterMode: typeof ProcessCardFilterMode = ProcessCardFilterMode;
    public readonly DatasetViewTypeEnum: typeof DatasetViewTypeEnum = DatasetViewTypeEnum;

    public ngOnInit(): void {
        this.loadingCardsSubject$.next(true);
        this.fetchCardsData();
    }

    public get dashboardFiltersState(): DashboardFiltersOptions {
        return this.accountFlowsFiltersService.currentFiltersSnapshot;
    }

    public get loadingCards$(): Observable<boolean> {
        return this.loadingCardsSubject$.asObservable();
    }

    public fetchCardsData(): void {
        const polling$ = timer(0, environment.delay_polling_ms);
        const triggerWithInitial$ = this.fetchTrigger$.pipe(startWith(undefined));

        this.accountFlowsCardsData$ = combineLatest([polling$, triggerWithInitial$]).pipe(
            switchMap(() =>
                this.accountService.getAccountFlowsAsCards({
                    accountName: this.accountName,
                    page: this.toggleCardStateSubject$.getValue()
                        ? 0
                        : Math.ceil(this.processesCards.length / AppValues.UPLOAD_FLOW_PROCESSES_PER_PAGE),
                    perPage: this.processesPerPage,
                    filters: this.setFlowProcessFilters(this.accountFlowsData.datasetsFiltersMode),
                    ordering: {
                        field: this.dashboardFiltersState.selectedOrderField ?? FlowProcessOrderField.LastAttemptAt,
                        direction: this.accountFlowsFiltersService.orderDirection,
                    },
                }),
            ),

            map((result: AccountFlowProcessCardConnectionDataFragment) => {
                const newChunkCards = result.nodes as AccountFlowProcessCard[];
                this.hasNextPage = result.pageInfo.hasNextPage;

                if (this.loadingCardsSubject$.getValue()) {
                    this.processesCards = [...this.processesCards, ...newChunkCards];
                }
                if (this.toggleCardStateSubject$.getValue()) {
                    this.processesCards = newChunkCards;
                }
                this.loadingCardsSubject$.next(false);
                this.toggleCardStateSubject$.next(false);

                return {
                    totalCount: result.totalCount,
                    nodes: this.processesCards,
                };
            }),
        );
    }

    public onScroll(): void {
        if (this.loadingCardsSubject$.getValue() || !this.hasNextPage) {
            return;
        }
        this.processesPerPage = AppValues.UPLOAD_FLOW_PROCESSES_PER_PAGE;
        this.refreshNow();
    }

    private setFlowProcessFilters(mode: ProcessCardFilterMode): FlowProcessFilters {
        return this.accountFlowsFiltersService.setFlowProcessFilters(mode);
    }

    public itemToBasics(value: Dataset): DatasetBasicsFragment {
        return value as DatasetBasicsFragment;
    }

    public resetFilters(): void {
        this.resetRequestParams();
        this.processesPerPage = AppValues.UPLOAD_FLOW_PROCESSES_PER_PAGE;
        this.accountFlowsFiltersService.resetFilters(this.accountFlowsData.datasetsFiltersMode);
        this.refreshNow();
    }

    public updateNow(datasetBasics: DatasetBasicsFragment): void {
        this.datasetCardService.handleTrigger(datasetBasics, () => {
            this.toastrService.success("Flow scheduled");
        });
    }

    public toggleStateDatasetCard(params: {
        state: FlowProcessEffectiveState;
        datasetBasics: DatasetBasicsFragment;
    }): void {
        this.processesPerPage = this.processesCards.length;
        this.toggleCardStateSubject$.next(true);
        this.datasetCardService.handleToggleState({
            state: params.state,
            datasetBasics: params.datasetBasics,
            onSuccess: () => {
                this.refreshNow();
            },
        });
    }

    public toggleWebhookCardState(params: {
        datasetBasics: DatasetBasicsFragment;
        subscriptionId: string;
        state: FlowProcessEffectiveState;
    }): void {
        this.processesPerPage = this.processesCards.length;
        this.toggleCardStateSubject$.next(true);
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
        const nextNav = event.value as ProcessCardFilterMode;
        this.resetRequestParams();
        this.accountFlowsFiltersService.resetFilters(nextNav);
        this.navigationService.navigateToOwnerView(
            this.accountName,
            AccountTabs.FLOWS,
            undefined,
            AccountFlowsNav.DATASETS,
            undefined,
            nextNav,
        );
        this.refreshNow();
    }

    public trackByCardId(index: number, item: AccountFlowProcessCard): string {
        if ("dataset" in item) {
            return item.dataset.id;
        } else {
            return item.id;
        }
    }
}
