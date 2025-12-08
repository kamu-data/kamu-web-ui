/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, Input, NgZone, OnInit } from "@angular/core";
import { AsyncPipe, NgFor, NgIf, NgSwitch, NgSwitchCase, NgTemplateOutlet } from "@angular/common";
import { AccountService } from "src/app/account/account.service";
import { Observable, switchMap, take, tap, timer } from "rxjs";
import {
    AccountFlowProcessCardConnectionDataFragment,
    DatasetBasicsFragment,
    FlowProcessEffectiveState,
    FlowProcessFilters,
    FlowProcessOrderField,
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
    DashboardFiltersOptions,
    ProcessCardFilterMode,
} from "../../account-flows-tab.types";
import { NgbNavModule } from "@ng-bootstrap/ng-bootstrap";
import { DateTimeAdapter, OWL_DATE_TIME_FORMATS, OwlDateTimeModule } from "@danielmoncada/angular-datetime-picker";
import { MomentDateTimeAdapter, OwlMomentDateTimeModule } from "@danielmoncada/angular-datetime-picker-moment-adapter";
import { MY_MOMENT_FORMATS } from "src/app/common/helpers/data.helpers";
import { NgSelectModule } from "@ng-select/ng-select";
import { ToastrService } from "ngx-toastr";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { RecentActivityFiltersViewComponent } from "./components/recent-activity-filters-view/recent-activity-filters-view.component";
import { TriageFiltersViewComponent } from "./components/triage-filters-view/triage-filters-view.component";
import { UpcomingScheduledFiltersViewComponent } from "./components/upcoming-scheduled-filters-view/upcoming-scheduled-filters-view.component";
import { CustomFiltersViewComponent } from "./components/custom-filters-view/custom-filters-view.component";
import { AccountFlowsFiltersService } from "src/app/account/services/account-flows-filters.service";

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
        NgbNavModule,
        NgSelectModule,
        OwlDateTimeModule,
        OwlMomentDateTimeModule,

        //-----//
        DatasetFlowProcessCardComponent,
        CustomFiltersViewComponent,
        PaginationComponent,
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
    private readonly ngZone = inject(NgZone);
    private readonly cdr = inject(ChangeDetectorRef);
    private readonly datasetWebhooksService = inject(DatasetWebhooksService);
    private readonly datasetCardService = inject(ProcessDatasetCardInteractionService);
    private readonly toastrService = inject(ToastrService);
    private readonly accountFlowsFiltersService = inject(AccountFlowsFiltersService);

    public accountFlowsCardsData$: Observable<AccountFlowProcessCardConnectionDataFragment>;
    public currentPage: number = 1;

    public readonly CARD_FILTERS_MODE_OPTIONS: CardFilterDescriptor[] = CARD_FILTERS_MODE_OPTIONS;

    public readonly DISPLAY_TIME_FORMAT = AppValues.DISPLAY_TIME_FORMAT;
    public readonly FlowProcessEffectiveState: typeof FlowProcessEffectiveState = FlowProcessEffectiveState;
    public readonly TIMEOUT_REFRESH_FLOW = AppValues.TIMEOUT_REFRESH_FLOW_MS;

    public readonly ProcessCardFilterMode: typeof ProcessCardFilterMode = ProcessCardFilterMode;
    public readonly DatasetViewTypeEnum: typeof DatasetViewTypeEnum = DatasetViewTypeEnum;
    private readonly CARDS_FLOW_PROCESSES_PER_PAGE: number = 9;

    public ngOnInit(): void {
        this.dashboardFiltersState.isFirstInitialization = true;
        this.fetchCardsData();
    }

    public get dashboardFiltersState(): DashboardFiltersOptions {
        return this.accountFlowsFiltersService.currentFiltersSnapshot;
    }

    public getPageFromUrl(): void {
        const pageParam = this.activatedRoute.snapshot.queryParamMap.get(ProjectLinks.URL_QUERY_PARAM_PAGE);
        if (pageParam) {
            this.currentPage = +requireValue(pageParam);
        }
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
                    filters: this.setFlowProcessFilters(this.accountFlowsData.datasetsFiltersMode),
                    ordering: {
                        field: this.dashboardFiltersState.selectedOrderField ?? FlowProcessOrderField.LastAttemptAt,
                        direction: this.accountFlowsFiltersService.orderDirection,
                    },
                }),
            ),
        );
    }

    private setFlowProcessFilters(mode: ProcessCardFilterMode): FlowProcessFilters {
        return this.accountFlowsFiltersService.setFlowProcessFilters(mode);
    }

    public resetFilters(): void {
        this.accountFlowsFiltersService.resetFilters(this.accountFlowsData.datasetsFiltersMode);
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
                    undefined,
                    this.accountFlowsData.datasetsFiltersMode,
                ),
            );
        } else {
            this.ngZone.run(() =>
                this.navigationService.navigateToOwnerView(
                    this.accountName,
                    AccountTabs.FLOWS,
                    page,
                    this.accountFlowsData.activeNav,
                    undefined,
                    this.accountFlowsData.datasetsFiltersMode,
                ),
            );
        }
        this.currentPage = page;
        this.fetchCardsData();
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
        this.currentPage = 1;
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
}
