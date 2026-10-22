/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestbedHarnessEnvironment } from "@angular/cdk/testing/testbed";
import { provideHttpClient } from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { ComponentFixture, discardPeriodicTasks, fakeAsync, TestBed, tick } from "@angular/core/testing";
import { MatButtonToggleChange } from "@angular/material/button-toggle";
import { ActivatedRoute } from "@angular/router";

import { of, Subject, throwError } from "rxjs";

import { Apollo } from "apollo-angular";
import { provideToastr, ToastrService } from "ngx-toastr";

import { ModalService } from "@common/components/modal/modal.service";
import { registerMatSvgIcons } from "@common/helpers/base-test.helpers.spec";
import { SharedTestModule } from "@common/modules/shared-test.module";
import AppValues from "@common/values/app.values";
import {
    AccountFlowProcessCardConnectionDataFragment,
    FlowProcessEffectiveState,
    FlowProcessGroupRollupDataFragment,
    FlowStatus,
} from "@api/kamu.graphql.interface";
import {
    mockAccountFlowsAsCardsQuery,
    mockAccountFlowsAsCardsQueryEmpty,
    mockAccountFlowsAsCardsQueryWithWebhook,
    mockAccountFlowsPrimaryCardsQuery,
    mockAccountFlowsWebhookCardsQuery,
} from "@api/mock/account.mock";
import { ModalArgumentsInterface } from "@interface/modal.interface";

import { AccountService } from "src/app/account/account.service";
import { AccountFlowsProcessesSubtabComponent } from "src/app/account/additional-components/account-flows-tab/account-flows-subtabs/account-flows-processes-subtab/account-flows-processes-subtab.component";
import { AccountFlowsProcessesSubtabHarness } from "src/app/account/additional-components/account-flows-tab/account-flows-subtabs/account-flows-processes-subtab/account-flows-processes-subtab.harness";
import {
    AccountFlowsNav,
    ProcessCardFilterMode,
    ProcessCardGroup,
} from "src/app/account/additional-components/account-flows-tab/account-flows-tab.types";
import { AccountFlowsFiltersService } from "src/app/account/services/account-flows-filters.service";
import { DatasetWebhooksService } from "src/app/dataset-view/additional-components/dataset-settings-component/tabs/webhooks/service/dataset-webhooks.service";
import { DatasetFlowsService } from "src/app/dataset-view/additional-components/flows-component/services/dataset-flows.service";
import { DatasetFlowProcessCardComponent } from "src/app/flow-cards/dataset-flow-process-card/dataset-flow-process-card.component";
import { DatasetFlowProcessCardHarness } from "src/app/flow-cards/dataset-flow-process-card/dataset-flow-process-card.harness";
import { WebhookFlowProcessCardComponent } from "src/app/flow-cards/webhook-flow-process-card/webhook-flow-process-card.component";
import { mockDatasetBasicsDerivedFragment, mockDatasetBasicsRootFragment } from "src/app/search/mock.data";
import { NavigationService } from "src/app/services/navigation.service";

describe("AccountFlowsProcessesSubtabComponent", () => {
    let component: AccountFlowsProcessesSubtabComponent;
    let fixture: ComponentFixture<AccountFlowsProcessesSubtabComponent>;
    let accountService: AccountService;
    let navigationService: NavigationService;
    let datasetWebhooksService: DatasetWebhooksService;
    let datasetFlowsService: DatasetFlowsService;
    let toastrService: ToastrService;
    const MOCK_ACCOUNT_NAME = "kamu";
    const MOCK_SUBSCRIPTION_ID = "121223-21212-567788";

    let getAccountAllCardsSpy: jasmine.Spy;

    function answerConfirmModal(ok: boolean): jasmine.Spy {
        return spyOn(TestBed.inject(ModalService), "error").and.callFake((options: ModalArgumentsInterface) => {
            options.handler?.call(undefined, ok);
            return Promise.resolve("");
        });
    }

    // Tick before loading: the first poll runs on an interval, which the harness's own flush skips
    function loadHarness(): Promise<AccountFlowsProcessesSubtabHarness> {
        return TestbedHarnessEnvironment.harnessForFixture(fixture, AccountFlowsProcessesSubtabHarness);
    }

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                AccountFlowsProcessesSubtabComponent,
                SharedTestModule,
                WebhookFlowProcessCardComponent,
                DatasetFlowProcessCardComponent,
            ],
            providers: [
                Apollo,
                provideToastr(),
                {
                    provide: ActivatedRoute,
                    useValue: {
                        snapshot: {
                            queryParamMap: {
                                get: (key: string) => {
                                    switch (key) {
                                        case "page":
                                            return "1";
                                    }
                                },
                            },
                        },
                    },
                },
                provideHttpClient(),
                provideHttpClientTesting(),
            ],
        });

        registerMatSvgIcons();

        fixture = TestBed.createComponent(AccountFlowsProcessesSubtabComponent);
        accountService = TestBed.inject(AccountService);
        navigationService = TestBed.inject(NavigationService);
        datasetWebhooksService = TestBed.inject(DatasetWebhooksService);
        datasetFlowsService = TestBed.inject(DatasetFlowsService);
        toastrService = TestBed.inject(ToastrService);
        component = fixture.componentInstance;
        component.accountName = MOCK_ACCOUNT_NAME;
        component.accountFlowsData = {
            activeNav: AccountFlowsNav.PROCESSES,
            flowGroup: [FlowStatus.Finished],
            datasetsFiltersMode: ProcessCardFilterMode.CUSTOM,
        };
        getAccountAllCardsSpy = spyOn(accountService, "getAccountAllCards").and.returnValue(
            of({
                cards: mockAccountFlowsAsCardsQuery.accounts.byName?.flows.processes
                    .allCards as AccountFlowProcessCardConnectionDataFragment,
                rollup: mockAccountFlowsAsCardsQuery.accounts.byName?.flows.processes
                    .fullRollup as FlowProcessGroupRollupDataFragment,
            }),
        );
    });

    it("should create", () => {
        fixture.detectChanges();
        expect(component).toBeTruthy();
    });

    it("should empty block is visible", fakeAsync(async () => {
        fixture.detectChanges();
        getAccountAllCardsSpy.and.returnValue(
            of({
                cards: mockAccountFlowsAsCardsQueryEmpty.accounts.byName?.flows.processes
                    .allCards as AccountFlowProcessCardConnectionDataFragment,
                rollup: mockAccountFlowsAsCardsQueryEmpty.accounts.byName?.flows.processes
                    .fullRollup as FlowProcessGroupRollupDataFragment,
            }),
        );
        tick(0);
        const processesSubtab = await loadHarness();

        expect(await processesSubtab.isEmptyCardsBlockVisible()).toBeTrue();
        expect(await processesSubtab.isCardsBlockVisible()).toBeFalse();
        discardPeriodicTasks();
    }));

    it("should check cards is visible", fakeAsync(async () => {
        fixture.detectChanges();
        getAccountAllCardsSpy.and.returnValue(
            of({
                cards: mockAccountFlowsAsCardsQueryWithWebhook.accounts.byName?.flows.processes
                    .allCards as AccountFlowProcessCardConnectionDataFragment,
                rollup: mockAccountFlowsAsCardsQueryWithWebhook.accounts.byName?.flows.processes
                    .fullRollup as FlowProcessGroupRollupDataFragment,
            }),
        );
        tick(0);
        const processesSubtab = await loadHarness();

        expect(await processesSubtab.isCardsBlockVisible()).toBeTrue();
        expect(await processesSubtab.isEmptyCardsBlockVisible()).toBeFalse();
        discardPeriodicTasks();
    }));

    it("should check to refresh page", () => {
        const fetchCardsDataSpy = spyOn(component, "fetchCardsData");
        component.refreshPage();
        expect(fetchCardsDataSpy).toHaveBeenCalledTimes(1);
    });

    it("should check to toggle webhook card with active state", fakeAsync(() => {
        const datasetWebhookPauseSubscriptionSpy = spyOn(
            datasetWebhooksService,
            "datasetWebhookPauseSubscription",
        ).and.returnValue(of(true));
        component.toggleWebhookCardState({
            state: FlowProcessEffectiveState.Active,
            datasetBasics: mockDatasetBasicsRootFragment,
            subscriptionId: MOCK_SUBSCRIPTION_ID,
        });
        tick(component.TIMEOUT_REFRESH_FLOW);
        expect(datasetWebhookPauseSubscriptionSpy).toHaveBeenCalledTimes(1);
        discardPeriodicTasks();
    }));

    it("should check to toggle webhook card with stopped state", fakeAsync(() => {
        const datasetWebhookResumeSubscriptionSpy = spyOn(
            datasetWebhooksService,
            "datasetWebhookResumeSubscription",
        ).and.returnValue(of(true));
        component.toggleWebhookCardState({
            state: FlowProcessEffectiveState.StoppedAuto,
            datasetBasics: mockDatasetBasicsRootFragment,
            subscriptionId: MOCK_SUBSCRIPTION_ID,
        });
        tick(component.TIMEOUT_REFRESH_FLOW);
        expect(datasetWebhookResumeSubscriptionSpy).toHaveBeenCalledTimes(1);
        discardPeriodicTasks();
    }));

    it("should check to toggle dataset card with active state", fakeAsync(() => {
        const datasetPauseFlowsSpy = spyOn(datasetFlowsService, "datasetPauseFlows").and.returnValue(of(void 0));
        component.toggleStateDatasetCard({
            state: FlowProcessEffectiveState.Active,
            datasetBasics: mockDatasetBasicsRootFragment,
        });
        tick(component.TIMEOUT_REFRESH_FLOW);
        expect(datasetPauseFlowsSpy).toHaveBeenCalledTimes(1);
        discardPeriodicTasks();
    }));

    it("should check to toggle dataset card with stopped state", fakeAsync(() => {
        answerConfirmModal(true);
        const datasetResumeFlowsSpy = spyOn(datasetFlowsService, "datasetResumeFlows").and.returnValue(of(void 0));
        component.toggleStateDatasetCard({
            state: FlowProcessEffectiveState.StoppedAuto,
            datasetBasics: mockDatasetBasicsRootFragment,
        });
        tick(component.TIMEOUT_REFRESH_FLOW);
        expect(datasetResumeFlowsSpy).toHaveBeenCalledTimes(1);
        discardPeriodicTasks();
    }));

    it("should check to update process for card belongs the root dataset", fakeAsync(() => {
        const toastrSuccessSpy = spyOn(toastrService, "success");
        const datasetTriggerIngestFlowSpy = spyOn(datasetFlowsService, "datasetTriggerIngestFlow").and.returnValue(
            of(true),
        );
        component.updateNow(mockDatasetBasicsRootFragment);
        tick(component.TIMEOUT_REFRESH_FLOW);
        expect(toastrSuccessSpy).toHaveBeenCalledTimes(1);
        expect(datasetTriggerIngestFlowSpy).toHaveBeenCalledTimes(1);
        discardPeriodicTasks();
    }));

    it("should check to update process for card belongs the derivative dataset", fakeAsync(() => {
        const toastrSuccessSpy = spyOn(toastrService, "success");
        const datasetTriggerTransformFlowSpy = spyOn(
            datasetFlowsService,
            "datasetTriggerTransformFlow",
        ).and.returnValue(of(true));
        component.updateNow(mockDatasetBasicsDerivedFragment);
        tick(component.TIMEOUT_REFRESH_FLOW);
        expect(toastrSuccessSpy).toHaveBeenCalledTimes(1);
        expect(datasetTriggerTransformFlowSpy).toHaveBeenCalledTimes(1);
        discardPeriodicTasks();
    }));

    it("should check to change filters mode", () => {
        const mockChangeEvent = {
            value: ProcessCardFilterMode.RECENT_ACTIVITY,
        };

        const navigateToOwnerViewSpy = spyOn(navigationService, "navigateToOwnerView");
        component.onChangeFiltersMode(mockChangeEvent as MatButtonToggleChange);
        expect(navigateToOwnerViewSpy).toHaveBeenCalledTimes(1);
    });

    it("should check to get cards for ProcessCardFilterMode.CUSTOM mode", fakeAsync(async () => {
        spyOnProperty(component, "dashboardFiltersState", "get").and.returnValue({
            fromFilterDate: new Date(),
            toFilterDate: new Date(),
            lastFailureDate: undefined,
            nextPlannedBeforeDate: undefined,
            nextPlannedAfterDate: undefined,
            selectedOrderDirection: true,
            selectedOrderField: undefined,
            selectedQuickRangeLastAttempt: undefined,
            selectedQuickRangeLastFailure: undefined,
            selectedQuickRangeNextAttempt: undefined,
            selectedFlowProcessStates: [FlowProcessEffectiveState.Active],
            minConsecutiveFailures: 0,
            isFirstInitialization: false,
        });

        fixture.detectChanges();
        tick(0);
        const processesSubtab = await loadHarness();

        expect(await processesSubtab.isCardsBlockVisible()).toBeTrue();
        expect(getAccountAllCardsSpy).toHaveBeenCalledTimes(1);
        discardPeriodicTasks();
    }));

    it("should check to get cards for ProcessCardFilterMode.PAUSED mode", fakeAsync(async () => {
        component.accountFlowsData.datasetsFiltersMode = ProcessCardFilterMode.PAUSED;

        fixture.detectChanges();
        tick(0);
        const processesSubtab = await loadHarness();

        expect(await processesSubtab.isCardsBlockVisible()).toBeTrue();
        expect(getAccountAllCardsSpy).toHaveBeenCalledTimes(1);
        discardPeriodicTasks();
    }));

    it("should check to get cards for ProcessCardFilterMode.UPCOMING_SCHEDULED mode without selectedFlowProcessStates", fakeAsync(async () => {
        component.accountFlowsData.datasetsFiltersMode = ProcessCardFilterMode.UPCOMING_SCHEDULED;

        fixture.detectChanges();
        tick(0);
        const processesSubtab = await loadHarness();

        expect(await processesSubtab.isCardsBlockVisible()).toBeTrue();
        expect(getAccountAllCardsSpy).toHaveBeenCalledTimes(1);
        discardPeriodicTasks();
    }));

    it("should check to get cards for ProcessCardFilterMode.UPCOMING_SCHEDULED mode with selectedFlowProcessStates", fakeAsync(async () => {
        component.accountFlowsData.datasetsFiltersMode = ProcessCardFilterMode.UPCOMING_SCHEDULED;
        spyOnProperty(component, "dashboardFiltersState", "get").and.returnValue({
            fromFilterDate: undefined,
            toFilterDate: undefined,
            lastFailureDate: undefined,
            nextPlannedBeforeDate: new Date(),
            nextPlannedAfterDate: new Date(),
            selectedOrderDirection: true,
            selectedOrderField: undefined,
            selectedQuickRangeLastAttempt: undefined,
            selectedQuickRangeLastFailure: undefined,
            selectedQuickRangeNextAttempt: undefined,
            selectedFlowProcessStates: [FlowProcessEffectiveState.Active],
            minConsecutiveFailures: 0,
            isFirstInitialization: false,
        });

        fixture.detectChanges();
        tick(0);
        const processesSubtab = await loadHarness();

        expect(await processesSubtab.isCardsBlockVisible()).toBeTrue();
        expect(getAccountAllCardsSpy).toHaveBeenCalledTimes(1);
        discardPeriodicTasks();
    }));

    it("should check to get cards for ProcessCardFilterMode.TRIAGE mode with minConsecutiveFailures=0 ", fakeAsync(async () => {
        component.accountFlowsData.datasetsFiltersMode = ProcessCardFilterMode.TRIAGE;
        spyOnProperty(component, "dashboardFiltersState", "get").and.returnValue({
            fromFilterDate: undefined,
            toFilterDate: undefined,
            lastFailureDate: undefined,
            nextPlannedBeforeDate: new Date(),
            nextPlannedAfterDate: new Date(),
            selectedOrderDirection: true,
            selectedOrderField: undefined,
            selectedQuickRangeLastAttempt: undefined,
            selectedQuickRangeLastFailure: undefined,
            selectedQuickRangeNextAttempt: undefined,
            selectedFlowProcessStates: [],
            minConsecutiveFailures: 0,
            isFirstInitialization: false,
        });

        fixture.detectChanges();
        tick(0);
        const processesSubtab = await loadHarness();

        expect(await processesSubtab.isCardsBlockVisible()).toBeTrue();
        expect(getAccountAllCardsSpy).toHaveBeenCalledTimes(1);
        discardPeriodicTasks();
    }));

    it("should check to get cards for ProcessCardFilterMode.TRIAGE mode with minConsecutiveFailures>1 ", fakeAsync(async () => {
        component.accountFlowsData.datasetsFiltersMode = ProcessCardFilterMode.TRIAGE;
        spyOnProperty(component, "dashboardFiltersState", "get").and.returnValue({
            fromFilterDate: undefined,
            toFilterDate: undefined,
            lastFailureDate: undefined,
            nextPlannedBeforeDate: new Date(),
            nextPlannedAfterDate: new Date(),
            selectedOrderDirection: true,
            selectedOrderField: undefined,
            selectedQuickRangeLastAttempt: undefined,
            selectedQuickRangeLastFailure: undefined,
            selectedQuickRangeNextAttempt: undefined,
            selectedFlowProcessStates: [FlowProcessEffectiveState.Failing],
            minConsecutiveFailures: 2,
            isFirstInitialization: false,
        });

        fixture.detectChanges();
        tick(0);
        const processesSubtab = await loadHarness();

        expect(await processesSubtab.isCardsBlockVisible()).toBeTrue();
        expect(getAccountAllCardsSpy).toHaveBeenCalledTimes(1);
        discardPeriodicTasks();
    }));

    it("should check to get cards for ProcessCardFilterMode.RECENT_ACTIVITY mode with selectedFlowProcessStates", fakeAsync(async () => {
        component.accountFlowsData.datasetsFiltersMode = ProcessCardFilterMode.RECENT_ACTIVITY;
        spyOnProperty(component, "dashboardFiltersState", "get").and.returnValue({
            fromFilterDate: undefined,
            toFilterDate: undefined,
            lastFailureDate: undefined,
            nextPlannedBeforeDate: new Date(),
            nextPlannedAfterDate: new Date(),
            selectedOrderDirection: true,
            selectedOrderField: undefined,
            selectedQuickRangeLastAttempt: undefined,
            selectedQuickRangeLastFailure: undefined,
            selectedQuickRangeNextAttempt: undefined,
            selectedFlowProcessStates: [FlowProcessEffectiveState.Active],
            minConsecutiveFailures: 0,
            isFirstInitialization: false,
        });

        fixture.detectChanges();
        tick(0);
        const processesSubtab = await loadHarness();

        expect(await processesSubtab.isCardsBlockVisible()).toBeTrue();
        expect(getAccountAllCardsSpy).toHaveBeenCalledTimes(1);
        discardPeriodicTasks();
    }));

    it("should check to get cards for ProcessCardFilterMode.RECENT_ACTIVITY mode witout selectedFlowProcessStates", fakeAsync(async () => {
        component.accountFlowsData.datasetsFiltersMode = ProcessCardFilterMode.RECENT_ACTIVITY;
        spyOnProperty(component, "dashboardFiltersState", "get").and.returnValue({
            fromFilterDate: undefined,
            toFilterDate: undefined,
            lastFailureDate: undefined,
            nextPlannedBeforeDate: undefined,
            nextPlannedAfterDate: undefined,
            selectedOrderDirection: false,
            selectedOrderField: undefined,
            selectedQuickRangeLastAttempt: undefined,
            selectedQuickRangeLastFailure: undefined,
            selectedQuickRangeNextAttempt: undefined,
            selectedFlowProcessStates: [],
            minConsecutiveFailures: 0,
            isFirstInitialization: false,
        });

        fixture.detectChanges();
        tick(0);
        const processesSubtab = await loadHarness();

        expect(await processesSubtab.isCardsBlockVisible()).toBeTrue();
        expect(getAccountAllCardsSpy).toHaveBeenCalledTimes(1);
        discardPeriodicTasks();
    }));

    it("should be checked that scrolling is not working", () => {
        component.processesPerPage = 10;
        component.hasNextPage = false;
        component.onScroll();
        expect(component.processesPerPage).toEqual(10);
    });

    it("should check that scrolling is working", () => {
        component.processesPerPage = 10;
        component.hasNextPage = true;
        component.onScroll();
        expect(component.processesPerPage).toEqual(AppValues.UPLOAD_FLOW_PROCESSES_PER_PAGE);
    });

    it("should check toggle rollup", () => {
        const refreshNowSpy = spyOn(component, "refreshNow");
        component.onToggleRollup();
        expect(refreshNowSpy).toHaveBeenCalledTimes(1);
    });

    it("should check toggle rollup on 'datasets' chip", fakeAsync(() => {
        component.flowsMode = ProcessCardGroup.DATASETS;

        const getAccountPrimaryCardsSpy = spyOn(accountService, "getAccountPrimaryCards").and.returnValue(
            of({
                cards: mockAccountFlowsPrimaryCardsQuery.accounts.byName?.flows.processes
                    .primaryCards as AccountFlowProcessCardConnectionDataFragment,
                rollup: mockAccountFlowsPrimaryCardsQuery.accounts.byName?.flows.processes
                    .primaryRollup as FlowProcessGroupRollupDataFragment,
            }),
        );
        fixture.detectChanges();
        tick(0);
        expect(getAccountPrimaryCardsSpy).toHaveBeenCalledTimes(1);
        discardPeriodicTasks();
    }));

    it("should check toggle rollup on 'webhooks' chip", fakeAsync(() => {
        component.flowsMode = ProcessCardGroup.WEBHOOKS;

        const getAccountWebhookCardsSpy = spyOn(accountService, "getAccountWebhookCards").and.returnValue(
            of({
                cards: mockAccountFlowsWebhookCardsQuery.accounts.byName?.flows.processes
                    .webhookCards as AccountFlowProcessCardConnectionDataFragment,
                rollup: mockAccountFlowsWebhookCardsQuery.accounts.byName?.flows.processes
                    .webhookRollup as FlowProcessGroupRollupDataFragment,
            }),
        );
        fixture.detectChanges();
        tick(0);
        expect(getAccountWebhookCardsSpy).toHaveBeenCalledTimes(1);
        discardPeriodicTasks();
    }));

    it("should refresh cards once the delay after a webhook toggle passes", fakeAsync(() => {
        spyOn(datasetWebhooksService, "datasetWebhookPauseSubscription").and.returnValue(of(true));
        const refreshNowSpy = spyOn(component, "refreshNow");
        component.toggleWebhookCardState({
            state: FlowProcessEffectiveState.Active,
            datasetBasics: mockDatasetBasicsRootFragment,
            subscriptionId: MOCK_SUBSCRIPTION_ID,
        });

        tick(component.TIMEOUT_REFRESH_FLOW - 1);
        expect(refreshNowSpy).not.toHaveBeenCalled();

        tick(1);
        expect(refreshNowSpy).toHaveBeenCalledTimes(1);
        discardPeriodicTasks();
    }));

    it("should not refresh cards after a webhook toggle once destroyed", fakeAsync(() => {
        spyOn(datasetWebhooksService, "datasetWebhookPauseSubscription").and.returnValue(of(true));
        const refreshNowSpy = spyOn(component, "refreshNow");
        component.toggleWebhookCardState({
            state: FlowProcessEffectiveState.Active,
            datasetBasics: mockDatasetBasicsRootFragment,
            subscriptionId: MOCK_SUBSCRIPTION_ID,
        });

        fixture.destroy();
        tick(component.TIMEOUT_REFRESH_FLOW);
        expect(refreshNowSpy).not.toHaveBeenCalled();
        discardPeriodicTasks();
    }));

    it("should count only the paused processes in the paused mode", () => {
        const rollup = mockAccountFlowsAsCardsQuery.accounts.byName?.flows.processes
            .fullRollup as FlowProcessGroupRollupDataFragment;
        expect(component.totalProcessesCountByMode(ProcessCardFilterMode.PAUSED, rollup)).toEqual(rollup.paused);
    });

    it("should reject an unsupported filters mode when counting processes", () => {
        const rollup = mockAccountFlowsAsCardsQuery.accounts.byName?.flows.processes
            .fullRollup as FlowProcessGroupRollupDataFragment;
        expect(() => component.totalProcessesCountByMode("unsupported" as ProcessCardFilterMode, rollup)).toThrowError(
            "Unsupported process card view mode",
        );
    });

    it("should reset the custom filters and reload the cards from the first page", fakeAsync(async () => {
        const accountFlowsFiltersService = TestBed.inject(AccountFlowsFiltersService);
        const resetFiltersSpy = spyOn(accountFlowsFiltersService, "resetFilters").and.callThrough();
        fixture.detectChanges();
        tick(0);
        const processesSubtab = await loadHarness();
        component.processesPerPage = AppValues.UPLOAD_FLOW_PROCESSES_PER_PAGE * 3;
        const refreshNowSpy = spyOn(component, "refreshNow");

        await processesSubtab.clickResetFilters();

        expect(resetFiltersSpy).toHaveBeenCalledOnceWith(ProcessCardFilterMode.CUSTOM);
        expect(component.processesPerPage).toEqual(AppValues.UPLOAD_FLOW_PROCESSES_PER_PAGE);
        expect(refreshNowSpy).toHaveBeenCalledTimes(1);
        discardPeriodicTasks();
    }));

    it("should load the dataset cards only once the 'Datasets' chip is selected", fakeAsync(async () => {
        const getAccountPrimaryCardsSpy = spyOn(accountService, "getAccountPrimaryCards").and.returnValue(
            of({
                cards: mockAccountFlowsPrimaryCardsQuery.accounts.byName?.flows.processes
                    .primaryCards as AccountFlowProcessCardConnectionDataFragment,
                rollup: mockAccountFlowsPrimaryCardsQuery.accounts.byName?.flows.processes
                    .primaryRollup as FlowProcessGroupRollupDataFragment,
            }),
        );
        fixture.detectChanges();
        tick(0);
        const processesSubtab = await loadHarness();
        expect(getAccountPrimaryCardsSpy).not.toHaveBeenCalled();

        await processesSubtab.selectFlowsMode("Datasets");
        tick(300);

        expect(component.flowsMode).toEqual(ProcessCardGroup.DATASETS);
        expect(getAccountPrimaryCardsSpy).toHaveBeenCalledTimes(1);
        discardPeriodicTasks();
    }));

    it("should reload the cards from 'Refresh now'", fakeAsync(async () => {
        fixture.detectChanges();
        tick(0);
        const processesSubtab = await loadHarness();
        const fetchCardsDataSpy = spyOn(component, "fetchCardsData");

        await processesSubtab.clickRefreshNow();

        expect(fetchCardsDataSpy).toHaveBeenCalledTimes(1);
        discardPeriodicTasks();
    }));

    describe("dataset process card", () => {
        async function loadFirstDatasetCard(): Promise<DatasetFlowProcessCardHarness> {
            fixture.detectChanges();
            tick(0);
            const processesSubtab = await loadHarness();
            const cards = await processesSubtab.getDatasetProcessCards();
            return cards[0];
        }

        it("should trigger the flow from the card's 'Update now' and report it", fakeAsync(async () => {
            const toastrSuccessSpy = spyOn(toastrService, "success");
            const triggerIngestSpy = spyOn(datasetFlowsService, "datasetTriggerIngestFlow").and.returnValue(of(true));
            const card = await loadFirstDatasetCard();

            await card.clickUpdateNow();

            expect(triggerIngestSpy).toHaveBeenCalledTimes(1);
            expect(toastrSuccessSpy).toHaveBeenCalledOnceWith("Flow scheduled");
            discardPeriodicTasks();
        }));

        it("should not report a flow that failed to trigger", fakeAsync(async () => {
            const toastrSuccessSpy = spyOn(toastrService, "success");
            spyOn(datasetFlowsService, "datasetTriggerIngestFlow").and.returnValue(of(false));
            const card = await loadFirstDatasetCard();

            await card.clickUpdateNow();

            expect(toastrSuccessSpy).not.toHaveBeenCalled();
            discardPeriodicTasks();
        }));

        it("should resume an auto-stopped process from the card after confirmation and refresh the cards", fakeAsync(async () => {
            const modalSpy = answerConfirmModal(true);
            const resumeSpy = spyOn(datasetFlowsService, "datasetResumeFlows").and.returnValue(of(void 0));
            const card = await loadFirstDatasetCard();
            const refreshNowSpy = spyOn(component, "refreshNow");

            expect(await card.getToggleStateLabel()).toEqual("Resume updates");
            await card.clickToggleState();

            expect(modalSpy).toHaveBeenCalledTimes(1);
            expect(resumeSpy).toHaveBeenCalledTimes(1);
            expect(await card.isToggleStateDisabled()).toBeTrue();
            expect(await card.isUpdateNowDisabled()).toBeTrue();
            tick(component.TIMEOUT_REFRESH_FLOW);
            expect(refreshNowSpy).toHaveBeenCalledTimes(1);
            discardPeriodicTasks();
        }));
    });

    it("should report a scheduled flow as soon as the trigger succeeds", () => {
        const toastrSuccessSpy = spyOn(toastrService, "success");
        spyOn(datasetFlowsService, "datasetTriggerIngestFlow").and.returnValue(of(true));

        component.updateNow(mockDatasetBasicsRootFragment);

        expect(toastrSuccessSpy).toHaveBeenCalledOnceWith("Flow scheduled");
    });

    it("should refresh cards once the delay after a dataset card toggle passes", fakeAsync(() => {
        spyOn(datasetFlowsService, "datasetPauseFlows").and.returnValue(of(void 0));
        const refreshNowSpy = spyOn(component, "refreshNow");
        component.toggleStateDatasetCard({
            state: FlowProcessEffectiveState.Active,
            datasetBasics: mockDatasetBasicsRootFragment,
        });

        tick(component.TIMEOUT_REFRESH_FLOW - 1);
        expect(refreshNowSpy).not.toHaveBeenCalled();

        tick(1);
        expect(refreshNowSpy).toHaveBeenCalledTimes(1);
    }));

    it("should not refresh cards after a dataset card toggle once destroyed", fakeAsync(() => {
        spyOn(datasetFlowsService, "datasetPauseFlows").and.returnValue(of(void 0));
        const refreshNowSpy = spyOn(component, "refreshNow");
        component.toggleStateDatasetCard({
            state: FlowProcessEffectiveState.Active,
            datasetBasics: mockDatasetBasicsRootFragment,
        });

        fixture.destroy();
        tick(component.TIMEOUT_REFRESH_FLOW);
        expect(refreshNowSpy).not.toHaveBeenCalled();
    }));

    it("should still report a scheduled flow when the trigger responds after the page is left", () => {
        const toastrSuccessSpy = spyOn(toastrService, "success");
        const trigger$ = new Subject<boolean>();
        spyOn(datasetFlowsService, "datasetTriggerIngestFlow").and.returnValue(trigger$);
        component.updateNow(mockDatasetBasicsRootFragment);

        fixture.destroy();
        trigger$.next(true);
        expect(toastrSuccessSpy).toHaveBeenCalledOnceWith("Flow scheduled");
    });

    it("should not refresh cards when a dataset card toggle responds after the page is left", fakeAsync(() => {
        const pause$ = new Subject<void>();
        spyOn(datasetFlowsService, "datasetPauseFlows").and.returnValue(pause$);
        const refreshNowSpy = spyOn(component, "refreshNow");
        component.toggleStateDatasetCard({
            state: FlowProcessEffectiveState.Active,
            datasetBasics: mockDatasetBasicsRootFragment,
        });

        fixture.destroy();
        pause$.next();
        tick(component.TIMEOUT_REFRESH_FLOW);
        expect(refreshNowSpy).not.toHaveBeenCalled();
    }));

    describe("dataset card action in progress", () => {
        const datasetId = mockDatasetBasicsRootFragment.id;

        it("should last from a toggle until the cards refreshed after the delay arrive", fakeAsync(() => {
            spyOn(datasetFlowsService, "datasetPauseFlows").and.returnValue(of(void 0));
            fixture.detectChanges();
            tick(0);
            component.toggleStateDatasetCard({
                state: FlowProcessEffectiveState.Active,
                datasetBasics: mockDatasetBasicsRootFragment,
            });
            expect(component.datasetCardsBusy$.value.has(datasetId)).toBeTrue();

            tick(component.TIMEOUT_REFRESH_FLOW);
            expect(component.datasetCardsBusy$.value.has(datasetId)).toBeTrue();

            // The refresh request is debounced
            tick(300);
            expect(component.datasetCardsBusy$.value.has(datasetId)).toBeFalse();
            discardPeriodicTasks();
        }));

        it("should track each dataset's card on its own", () => {
            const rootTrigger$ = new Subject<boolean>();
            const derivedTrigger$ = new Subject<boolean>();
            spyOn(datasetFlowsService, "datasetTriggerIngestFlow").and.returnValue(rootTrigger$);
            spyOn(datasetFlowsService, "datasetTriggerTransformFlow").and.returnValue(derivedTrigger$);
            const derivedDataset = { ...mockDatasetBasicsDerivedFragment, id: "derived-dataset-id" };
            component.updateNow(mockDatasetBasicsRootFragment);
            component.updateNow(derivedDataset);
            expect([...component.datasetCardsBusy$.value]).toEqual([datasetId, derivedDataset.id]);

            rootTrigger$.next(false);
            expect([...component.datasetCardsBusy$.value]).toEqual([derivedDataset.id]);
        });

        it("should last while 'Update now' is waiting for the trigger", () => {
            const trigger$ = new Subject<boolean>();
            spyOn(datasetFlowsService, "datasetTriggerIngestFlow").and.returnValue(trigger$);
            component.updateNow(mockDatasetBasicsRootFragment);
            expect(component.datasetCardsBusy$.value.has(datasetId)).toBeTrue();

            trigger$.next(false);
            expect(component.datasetCardsBusy$.value.has(datasetId)).toBeFalse();
        });

        it("should end when the toggle request fails, and leave the error to the global handler", fakeAsync(() => {
            spyOn(datasetFlowsService, "datasetPauseFlows").and.returnValue(
                throwError(() => new Error("Network failure")),
            );
            component.toggleStateDatasetCard({
                state: FlowProcessEffectiveState.Active,
                datasetBasics: mockDatasetBasicsRootFragment,
            });

            expect(component.datasetCardsBusy$.value.has(datasetId)).toBeFalse();
            expect(() => tick()).toThrowError("Network failure");
        }));
    });

    it("should refresh the cards after 'Update now' only once the delay passes", fakeAsync(() => {
        spyOn(datasetFlowsService, "datasetTriggerIngestFlow").and.returnValue(of(true));
        const refreshNowSpy = spyOn(component, "refreshNow");
        component.updateNow(mockDatasetBasicsRootFragment);

        tick(component.TIMEOUT_REFRESH_FLOW - 1);
        expect(refreshNowSpy).not.toHaveBeenCalled();

        tick(1);
        expect(refreshNowSpy).toHaveBeenCalledTimes(1);
    }));

    it("should not refresh the cards after 'Update now' once destroyed", fakeAsync(() => {
        spyOn(datasetFlowsService, "datasetTriggerIngestFlow").and.returnValue(of(true));
        const refreshNowSpy = spyOn(component, "refreshNow");
        component.updateNow(mockDatasetBasicsRootFragment);

        fixture.destroy();
        tick(component.TIMEOUT_REFRESH_FLOW);
        expect(refreshNowSpy).not.toHaveBeenCalled();
    }));

    it("should leave an auto-stopped process alone when the resume confirmation is cancelled", () => {
        answerConfirmModal(false);
        const resumeSpy = spyOn(datasetFlowsService, "datasetResumeFlows");
        component.toggleStateDatasetCard({
            state: FlowProcessEffectiveState.StoppedAuto,
            datasetBasics: mockDatasetBasicsRootFragment,
        });

        expect(resumeSpy).not.toHaveBeenCalled();
        expect(component.datasetCardsBusy$.value.size).toEqual(0);
    });
});
