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
import { ActivatedRoute } from "@angular/router";

import { of, Subject, throwError } from "rxjs";

import { Apollo } from "apollo-angular";
import { provideToastr, ToastrService } from "ngx-toastr";
import type { Mock } from "vitest";

import { environment } from "@env/environment";
import { ModalService } from "@common/components/modal/modal.service";
import { requireValue } from "@common/helpers/app.helpers";
import { registerMatSvgIcons, setComponentInput, stubMethod } from "@common/helpers/base-test.helpers.spec";
import { SharedTestModule } from "@common/modules/shared-test.module";
import AppValues from "@common/values/app.values";
import { FlowProcessEffectiveState, FlowStatus } from "@api/kamu.graphql.interface";
import {
    mockAccountAllCards,
    mockAccountAllCardsEmpty,
    mockAccountAllCardsWithWebhook,
    mockAccountFullRollup,
    mockAccountPrimaryCards,
    mockAccountPrimaryRollup,
    mockAccountWebhookCards,
    mockAccountWebhookRollup,
} from "@api/mock/account.mock";
import { ModalArgumentsInterface } from "@interface/modal.interface";

import { AccountTabs } from "src/app/account/account.constants";
import { AccountService } from "src/app/account/account.service";
import { AccountFlowsProcessesSubtabComponent } from "src/app/account/additional-components/account-flows-tab/account-flows-subtabs/account-flows-processes-subtab/account-flows-processes-subtab.component";
import { AccountFlowsProcessesSubtabHarness } from "src/app/account/additional-components/account-flows-tab/account-flows-subtabs/account-flows-processes-subtab/account-flows-processes-subtab.harness";
import { mockDashboardFilters } from "src/app/account/additional-components/account-flows-tab/account-flows-tab.mock";
import {
    AccountFlowsNav,
    ProcessCardFilterMode,
    ProcessCardGroup,
} from "src/app/account/additional-components/account-flows-tab/account-flows-tab.types";
import { AccountFlowsType } from "src/app/account/additional-components/account-flows-tab/resolvers/account-flows.resolver";
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

    let getAccountAllCardsSpy: Mock<AccountService["getAccountAllCards"]>;

    // A new object each time: the "View:" toggle writes the selected mode into it
    function accountFlowsData(datasetsFiltersMode: ProcessCardFilterMode): AccountFlowsType {
        return { activeNav: AccountFlowsNav.PROCESSES, flowGroup: [FlowStatus.Finished], datasetsFiltersMode };
    }

    function answerConfirmModal(ok: boolean): Mock {
        return vi
            .spyOn(TestBed.inject(ModalService), "error")
            .mockImplementation((options: ModalArgumentsInterface) => {
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
        setComponentInput(fixture, "accountName", MOCK_ACCOUNT_NAME);
        setComponentInput(fixture, "accountFlowsData", accountFlowsData(ProcessCardFilterMode.CUSTOM));
        getAccountAllCardsSpy = vi.spyOn(accountService, "getAccountAllCards").mockReturnValue(
            of({
                cards: mockAccountAllCards,
                rollup: mockAccountFullRollup,
            }),
        );
    });

    it("should create", () => {
        fixture.detectChanges();
        expect(component).toBeTruthy();
    });

    it("should empty block is visible", fakeAsync(async () => {
        fixture.detectChanges();
        getAccountAllCardsSpy.mockReturnValue(
            of({
                cards: mockAccountAllCardsEmpty,
                rollup: mockAccountFullRollup,
            }),
        );
        tick(0);
        const processesSubtab = await loadHarness();

        expect(await processesSubtab.isEmptyCardsBlockVisible()).toBe(true);
        expect(await processesSubtab.isCardsBlockVisible()).toBe(false);
        discardPeriodicTasks();
    }));

    it("should check cards is visible", fakeAsync(async () => {
        fixture.detectChanges();
        getAccountAllCardsSpy.mockReturnValue(
            of({
                cards: mockAccountAllCardsWithWebhook,
                rollup: mockAccountFullRollup,
            }),
        );
        tick(0);
        const processesSubtab = await loadHarness();

        expect(await processesSubtab.isCardsBlockVisible()).toBe(true);
        expect(await processesSubtab.isEmptyCardsBlockVisible()).toBe(false);
        discardPeriodicTasks();
    }));

    it("should check to refresh page", () => {
        const fetchCardsDataSpy = vi.spyOn(component, "fetchCardsData").mockImplementation(() => {});
        component.refreshPage();
        expect(fetchCardsDataSpy).toHaveBeenCalledTimes(1);
    });

    it("should check to toggle webhook card with active state", fakeAsync(() => {
        const datasetWebhookPauseSubscriptionSpy = vi
            .spyOn(datasetWebhooksService, "datasetWebhookPauseSubscription")
            .mockReturnValue(of(true));
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
        const datasetWebhookResumeSubscriptionSpy = vi
            .spyOn(datasetWebhooksService, "datasetWebhookResumeSubscription")
            .mockReturnValue(of(true));
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
        const datasetPauseFlowsSpy = vi.spyOn(datasetFlowsService, "datasetPauseFlows").mockReturnValue(of(void 0));
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
        const datasetResumeFlowsSpy = vi.spyOn(datasetFlowsService, "datasetResumeFlows").mockReturnValue(of(void 0));
        component.toggleStateDatasetCard({
            state: FlowProcessEffectiveState.StoppedAuto,
            datasetBasics: mockDatasetBasicsRootFragment,
        });
        tick(component.TIMEOUT_REFRESH_FLOW);
        expect(datasetResumeFlowsSpy).toHaveBeenCalledTimes(1);
        discardPeriodicTasks();
    }));

    it("should check to update process for card belongs the root dataset", fakeAsync(() => {
        const toastrSuccessSpy = stubMethod(toastrService, "success");
        const datasetTriggerIngestFlowSpy = vi
            .spyOn(datasetFlowsService, "datasetTriggerIngestFlow")
            .mockReturnValue(of(true));
        component.updateNow(mockDatasetBasicsRootFragment);
        tick(component.TIMEOUT_REFRESH_FLOW);
        expect(toastrSuccessSpy).toHaveBeenCalledTimes(1);
        expect(datasetTriggerIngestFlowSpy).toHaveBeenCalledTimes(1);
        discardPeriodicTasks();
    }));

    it("should check to update process for card belongs the derivative dataset", fakeAsync(() => {
        const toastrSuccessSpy = stubMethod(toastrService, "success");
        const datasetTriggerTransformFlowSpy = vi
            .spyOn(datasetFlowsService, "datasetTriggerTransformFlow")
            .mockReturnValue(of(true));
        component.updateNow(mockDatasetBasicsDerivedFragment);
        tick(component.TIMEOUT_REFRESH_FLOW);
        expect(toastrSuccessSpy).toHaveBeenCalledTimes(1);
        expect(datasetTriggerTransformFlowSpy).toHaveBeenCalledTimes(1);
        discardPeriodicTasks();
    }));

    it("should select the default states of the initial mode before the first render", fakeAsync(async () => {
        fixture.detectChanges();
        tick(0);
        const processesSubtab = await loadHarness();

        expect(await processesSubtab.isFiltersModeSelected(ProcessCardFilterMode.CUSTOM)).toBe(true);
        expect(await processesSubtab.getSelectedRollupStates()).toEqual([
            FlowProcessEffectiveState.Active,
            FlowProcessEffectiveState.Failing,
            FlowProcessEffectiveState.PausedManual,
            FlowProcessEffectiveState.StoppedAuto,
        ]);
        discardPeriodicTasks();
    }));

    describe("'View:' mode toggle", () => {
        const cases: {
            mode: ProcessCardFilterMode;
            shownStates: FlowProcessEffectiveState[];
        }[] = [
            {
                mode: ProcessCardFilterMode.RECENT_ACTIVITY,
                shownStates: [
                    FlowProcessEffectiveState.Active,
                    FlowProcessEffectiveState.Failing,
                    FlowProcessEffectiveState.PausedManual,
                    FlowProcessEffectiveState.StoppedAuto,
                ],
            },
            {
                mode: ProcessCardFilterMode.TRIAGE,
                shownStates: [FlowProcessEffectiveState.Failing, FlowProcessEffectiveState.StoppedAuto],
            },
            {
                mode: ProcessCardFilterMode.UPCOMING_SCHEDULED,
                shownStates: [FlowProcessEffectiveState.Active, FlowProcessEffectiveState.Failing],
            },
            // The paused mode shows no state toggles
            { mode: ProcessCardFilterMode.PAUSED, shownStates: [] },
        ];

        cases.forEach(({ mode, shownStates }) => {
            it(`should navigate to the ${mode} mode and show its default states`, fakeAsync(async () => {
                fixture.detectChanges();
                tick(0);
                const processesSubtab = await loadHarness();
                const navigateToOwnerViewSpy = vi
                    .spyOn(navigationService, "navigateToOwnerView")
                    .mockImplementation(() => {});

                await processesSubtab.selectFiltersMode(mode);

                expect(navigateToOwnerViewSpy).toHaveBeenCalledTimes(1);

                expect(navigateToOwnerViewSpy).toHaveBeenCalledWith(
                    MOCK_ACCOUNT_NAME,
                    AccountTabs.FLOWS,
                    undefined,
                    AccountFlowsNav.PROCESSES,
                    undefined,
                    mode,
                );
                expect(await processesSubtab.isFiltersModeSelected(mode)).toBe(true);
                expect(await processesSubtab.getSelectedRollupStates()).toEqual(shownStates);
                discardPeriodicTasks();
            }));
        });

        it("should select the mode's default states only once when the navigation after a click arrives", fakeAsync(async () => {
            fixture.detectChanges();
            tick(0);
            const processesSubtab = await loadHarness();
            vi.spyOn(navigationService, "navigateToOwnerView").mockImplementation(() => {});
            const applyModeDefaultsSpy = vi.spyOn(TestBed.inject(AccountFlowsFiltersService), "applyModeDefaults");

            await processesSubtab.selectFiltersMode(ProcessCardFilterMode.TRIAGE);
            setComponentInput(fixture, "accountFlowsData", accountFlowsData(ProcessCardFilterMode.TRIAGE));

            expect(applyModeDefaultsSpy).toHaveBeenCalledTimes(1);

            expect(applyModeDefaultsSpy).toHaveBeenCalledWith(ProcessCardFilterMode.TRIAGE);
            expect(await processesSubtab.getSelectedRollupStates()).toEqual([
                FlowProcessEffectiveState.Failing,
                FlowProcessEffectiveState.StoppedAuto,
            ]);
            discardPeriodicTasks();
        }));
    });

    describe("mode reached by navigation, such as back and forward", () => {
        it("should select the default states of the new mode", fakeAsync(async () => {
            fixture.detectChanges();
            tick(0);
            const processesSubtab = await loadHarness();
            vi.spyOn(navigationService, "navigateToOwnerView").mockImplementation(() => {});
            await processesSubtab.selectFiltersMode(ProcessCardFilterMode.TRIAGE);
            setComponentInput(fixture, "accountFlowsData", accountFlowsData(ProcessCardFilterMode.TRIAGE));

            setComponentInput(fixture, "accountFlowsData", accountFlowsData(ProcessCardFilterMode.UPCOMING_SCHEDULED));

            expect(await processesSubtab.isFiltersModeSelected(ProcessCardFilterMode.UPCOMING_SCHEDULED)).toBe(true);
            expect(await processesSubtab.getSelectedRollupStates()).toEqual([
                FlowProcessEffectiveState.Active,
                FlowProcessEffectiveState.Failing,
            ]);
            discardPeriodicTasks();
        }));

        it("should request the recent activity of the default time window", fakeAsync(async () => {
            fixture.detectChanges();
            tick(0);
            const processesSubtab = await loadHarness();

            setComponentInput(fixture, "accountFlowsData", accountFlowsData(ProcessCardFilterMode.RECENT_ACTIVITY));
            tick(environment.delay_polling_ms);

            expect(await processesSubtab.getSelectedRollupStates()).toEqual([
                FlowProcessEffectiveState.Active,
                FlowProcessEffectiveState.Failing,
                FlowProcessEffectiveState.PausedManual,
                FlowProcessEffectiveState.StoppedAuto,
            ]);
            expect(
                requireValue(getAccountAllCardsSpy.mock.lastCall ?? null)[0].filters.lastAttemptBetween,
            ).toBeDefined();
            discardPeriodicTasks();
        }));
    });

    it("should check to get cards for ProcessCardFilterMode.CUSTOM mode", fakeAsync(async () => {
        vi.spyOn(component, "dashboardFiltersState", "get").mockReturnValue(
            mockDashboardFilters({
                fromFilterDate: new Date(),
                toFilterDate: new Date(),
                selectedFlowProcessStates: [FlowProcessEffectiveState.Active],
            }),
        );

        fixture.detectChanges();
        tick(0);
        const processesSubtab = await loadHarness();

        expect(await processesSubtab.isCardsBlockVisible()).toBe(true);
        expect(getAccountAllCardsSpy).toHaveBeenCalledTimes(1);
        discardPeriodicTasks();
    }));

    it("should check to get cards for ProcessCardFilterMode.PAUSED mode", fakeAsync(async () => {
        setComponentInput(fixture, "accountFlowsData", accountFlowsData(ProcessCardFilterMode.PAUSED));

        fixture.detectChanges();
        tick(0);
        const processesSubtab = await loadHarness();

        expect(await processesSubtab.isCardsBlockVisible()).toBe(true);
        expect(getAccountAllCardsSpy).toHaveBeenCalledTimes(1);
        discardPeriodicTasks();
    }));

    it("should check to get cards for ProcessCardFilterMode.UPCOMING_SCHEDULED mode without selectedFlowProcessStates", fakeAsync(async () => {
        setComponentInput(fixture, "accountFlowsData", accountFlowsData(ProcessCardFilterMode.UPCOMING_SCHEDULED));

        fixture.detectChanges();
        tick(0);
        const processesSubtab = await loadHarness();

        expect(await processesSubtab.isCardsBlockVisible()).toBe(true);
        expect(getAccountAllCardsSpy).toHaveBeenCalledTimes(1);
        discardPeriodicTasks();
    }));

    it("should check to get cards for ProcessCardFilterMode.UPCOMING_SCHEDULED mode with selectedFlowProcessStates", fakeAsync(async () => {
        setComponentInput(fixture, "accountFlowsData", accountFlowsData(ProcessCardFilterMode.UPCOMING_SCHEDULED));
        vi.spyOn(component, "dashboardFiltersState", "get").mockReturnValue(
            mockDashboardFilters({
                nextPlannedBeforeDate: new Date(),
                nextPlannedAfterDate: new Date(),
                selectedFlowProcessStates: [FlowProcessEffectiveState.Active],
            }),
        );

        fixture.detectChanges();
        tick(0);
        const processesSubtab = await loadHarness();

        expect(await processesSubtab.isCardsBlockVisible()).toBe(true);
        expect(getAccountAllCardsSpy).toHaveBeenCalledTimes(1);
        discardPeriodicTasks();
    }));

    it("should check to get cards for ProcessCardFilterMode.TRIAGE mode with minConsecutiveFailures=0 ", fakeAsync(async () => {
        setComponentInput(fixture, "accountFlowsData", accountFlowsData(ProcessCardFilterMode.TRIAGE));
        vi.spyOn(component, "dashboardFiltersState", "get").mockReturnValue(
            mockDashboardFilters({
                nextPlannedBeforeDate: new Date(),
                nextPlannedAfterDate: new Date(),
            }),
        );

        fixture.detectChanges();
        tick(0);
        const processesSubtab = await loadHarness();

        expect(await processesSubtab.isCardsBlockVisible()).toBe(true);
        expect(getAccountAllCardsSpy).toHaveBeenCalledTimes(1);
        discardPeriodicTasks();
    }));

    it("should check to get cards for ProcessCardFilterMode.TRIAGE mode with minConsecutiveFailures>1 ", fakeAsync(async () => {
        setComponentInput(fixture, "accountFlowsData", accountFlowsData(ProcessCardFilterMode.TRIAGE));
        vi.spyOn(component, "dashboardFiltersState", "get").mockReturnValue(
            mockDashboardFilters({
                nextPlannedBeforeDate: new Date(),
                nextPlannedAfterDate: new Date(),
                selectedFlowProcessStates: [FlowProcessEffectiveState.Failing],
                minConsecutiveFailures: 2,
            }),
        );

        fixture.detectChanges();
        tick(0);
        const processesSubtab = await loadHarness();

        expect(await processesSubtab.isCardsBlockVisible()).toBe(true);
        expect(getAccountAllCardsSpy).toHaveBeenCalledTimes(1);
        discardPeriodicTasks();
    }));

    it("should check to get cards for ProcessCardFilterMode.RECENT_ACTIVITY mode with selectedFlowProcessStates", fakeAsync(async () => {
        setComponentInput(fixture, "accountFlowsData", accountFlowsData(ProcessCardFilterMode.RECENT_ACTIVITY));
        vi.spyOn(component, "dashboardFiltersState", "get").mockReturnValue(
            mockDashboardFilters({
                nextPlannedBeforeDate: new Date(),
                nextPlannedAfterDate: new Date(),
                selectedFlowProcessStates: [FlowProcessEffectiveState.Active],
            }),
        );

        fixture.detectChanges();
        tick(0);
        const processesSubtab = await loadHarness();

        expect(await processesSubtab.isCardsBlockVisible()).toBe(true);
        expect(getAccountAllCardsSpy).toHaveBeenCalledTimes(1);
        discardPeriodicTasks();
    }));

    it("should check to get cards for ProcessCardFilterMode.RECENT_ACTIVITY mode witout selectedFlowProcessStates", fakeAsync(async () => {
        setComponentInput(fixture, "accountFlowsData", accountFlowsData(ProcessCardFilterMode.RECENT_ACTIVITY));
        vi.spyOn(component, "dashboardFiltersState", "get").mockReturnValue(
            mockDashboardFilters({
                selectedOrderDirection: false,
            }),
        );

        fixture.detectChanges();
        tick(0);
        const processesSubtab = await loadHarness();

        expect(await processesSubtab.isCardsBlockVisible()).toBe(true);
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
        const refreshNowSpy = vi.spyOn(component, "refreshNow").mockImplementation(() => {});
        component.onToggleRollup();
        expect(refreshNowSpy).toHaveBeenCalledTimes(1);
    });

    it("should check toggle rollup on 'datasets' chip", fakeAsync(() => {
        component.flowsMode = ProcessCardGroup.DATASETS;

        const getAccountPrimaryCardsSpy = vi.spyOn(accountService, "getAccountPrimaryCards").mockReturnValue(
            of({
                cards: mockAccountPrimaryCards,
                rollup: mockAccountPrimaryRollup,
            }),
        );
        fixture.detectChanges();
        tick(0);
        expect(getAccountPrimaryCardsSpy).toHaveBeenCalledTimes(1);
        discardPeriodicTasks();
    }));

    it("should check toggle rollup on 'webhooks' chip", fakeAsync(() => {
        component.flowsMode = ProcessCardGroup.WEBHOOKS;

        const getAccountWebhookCardsSpy = vi.spyOn(accountService, "getAccountWebhookCards").mockReturnValue(
            of({
                cards: mockAccountWebhookCards,
                rollup: mockAccountWebhookRollup,
            }),
        );
        fixture.detectChanges();
        tick(0);
        expect(getAccountWebhookCardsSpy).toHaveBeenCalledTimes(1);
        discardPeriodicTasks();
    }));

    it("should refresh cards once the delay after a webhook toggle passes", fakeAsync(() => {
        vi.spyOn(datasetWebhooksService, "datasetWebhookPauseSubscription").mockReturnValue(of(true));
        const refreshNowSpy = vi.spyOn(component, "refreshNow").mockImplementation(() => {});
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
        vi.spyOn(datasetWebhooksService, "datasetWebhookPauseSubscription").mockReturnValue(of(true));
        const refreshNowSpy = vi.spyOn(component, "refreshNow").mockImplementation(() => {});
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
        const rollup = mockAccountFullRollup;
        expect(component.totalProcessesCountByMode(ProcessCardFilterMode.PAUSED, rollup)).toEqual(rollup.paused);
    });

    it("should reset the custom filters and reload the cards from the first page", fakeAsync(async () => {
        const accountFlowsFiltersService = TestBed.inject(AccountFlowsFiltersService);
        const resetFiltersSpy = vi.spyOn(accountFlowsFiltersService, "resetFilters");
        fixture.detectChanges();
        tick(0);
        const processesSubtab = await loadHarness();
        component.processesPerPage = AppValues.UPLOAD_FLOW_PROCESSES_PER_PAGE * 3;
        const refreshNowSpy = vi.spyOn(component, "refreshNow").mockImplementation(() => {});

        await processesSubtab.clickResetFilters();

        expect(resetFiltersSpy).toHaveBeenCalledTimes(1);

        expect(resetFiltersSpy).toHaveBeenCalledWith(ProcessCardFilterMode.CUSTOM);
        expect(component.processesPerPage).toEqual(AppValues.UPLOAD_FLOW_PROCESSES_PER_PAGE);
        expect(refreshNowSpy).toHaveBeenCalledTimes(1);
        discardPeriodicTasks();
    }));

    it("should load the dataset cards only once the 'Datasets' chip is selected", fakeAsync(async () => {
        const getAccountPrimaryCardsSpy = vi.spyOn(accountService, "getAccountPrimaryCards").mockReturnValue(
            of({
                cards: mockAccountPrimaryCards,
                rollup: mockAccountPrimaryRollup,
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
        const fetchCardsDataSpy = vi.spyOn(component, "fetchCardsData").mockImplementation(() => {});

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
            const toastrSuccessSpy = stubMethod(toastrService, "success");
            const triggerIngestSpy = vi
                .spyOn(datasetFlowsService, "datasetTriggerIngestFlow")
                .mockReturnValue(of(true));
            const card = await loadFirstDatasetCard();

            await card.clickUpdateNow();

            expect(triggerIngestSpy).toHaveBeenCalledTimes(1);
            expect(toastrSuccessSpy).toHaveBeenCalledTimes(1);
            expect(toastrSuccessSpy).toHaveBeenCalledWith("Flow scheduled");
            discardPeriodicTasks();
        }));

        it("should not report a flow that failed to trigger", fakeAsync(async () => {
            const toastrSuccessSpy = stubMethod(toastrService, "success");
            vi.spyOn(datasetFlowsService, "datasetTriggerIngestFlow").mockReturnValue(of(false));
            const card = await loadFirstDatasetCard();

            await card.clickUpdateNow();

            expect(toastrSuccessSpy).not.toHaveBeenCalled();
            discardPeriodicTasks();
        }));

        it("should resume an auto-stopped process from the card after confirmation and refresh the cards", fakeAsync(async () => {
            const modalSpy = answerConfirmModal(true);
            const resumeSpy = vi.spyOn(datasetFlowsService, "datasetResumeFlows").mockReturnValue(of(void 0));
            const card = await loadFirstDatasetCard();
            const refreshNowSpy = vi.spyOn(component, "refreshNow").mockImplementation(() => {});

            expect(await card.getToggleStateLabel()).toEqual("Resume updates");
            await card.clickToggleState();

            expect(modalSpy).toHaveBeenCalledTimes(1);
            expect(resumeSpy).toHaveBeenCalledTimes(1);
            expect(await card.isToggleStateDisabled()).toBe(true);
            expect(await card.isUpdateNowDisabled()).toBe(true);
            tick(component.TIMEOUT_REFRESH_FLOW);
            expect(refreshNowSpy).toHaveBeenCalledTimes(1);
            discardPeriodicTasks();
        }));
    });

    it("should report a scheduled flow as soon as the trigger succeeds", () => {
        const toastrSuccessSpy = stubMethod(toastrService, "success");
        vi.spyOn(datasetFlowsService, "datasetTriggerIngestFlow").mockReturnValue(of(true));

        component.updateNow(mockDatasetBasicsRootFragment);

        expect(toastrSuccessSpy).toHaveBeenCalledTimes(1);

        expect(toastrSuccessSpy).toHaveBeenCalledWith("Flow scheduled");
    });

    it("should refresh cards once the delay after a dataset card toggle passes", fakeAsync(() => {
        vi.spyOn(datasetFlowsService, "datasetPauseFlows").mockReturnValue(of(void 0));
        const refreshNowSpy = vi.spyOn(component, "refreshNow").mockImplementation(() => {});
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
        vi.spyOn(datasetFlowsService, "datasetPauseFlows").mockReturnValue(of(void 0));
        const refreshNowSpy = vi.spyOn(component, "refreshNow").mockImplementation(() => {});
        component.toggleStateDatasetCard({
            state: FlowProcessEffectiveState.Active,
            datasetBasics: mockDatasetBasicsRootFragment,
        });

        fixture.destroy();
        tick(component.TIMEOUT_REFRESH_FLOW);
        expect(refreshNowSpy).not.toHaveBeenCalled();
    }));

    it("should still report a scheduled flow when the trigger responds after the page is left", () => {
        const toastrSuccessSpy = stubMethod(toastrService, "success");
        const trigger$ = new Subject<boolean>();
        vi.spyOn(datasetFlowsService, "datasetTriggerIngestFlow").mockReturnValue(trigger$);
        component.updateNow(mockDatasetBasicsRootFragment);

        fixture.destroy();
        trigger$.next(true);
        expect(toastrSuccessSpy).toHaveBeenCalledTimes(1);
        expect(toastrSuccessSpy).toHaveBeenCalledWith("Flow scheduled");
    });

    it("should not refresh cards when a dataset card toggle responds after the page is left", fakeAsync(() => {
        const pause$ = new Subject<void>();
        vi.spyOn(datasetFlowsService, "datasetPauseFlows").mockReturnValue(pause$);
        const refreshNowSpy = vi.spyOn(component, "refreshNow").mockImplementation(() => {});
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
            vi.spyOn(datasetFlowsService, "datasetPauseFlows").mockReturnValue(of(void 0));
            fixture.detectChanges();
            tick(0);
            component.toggleStateDatasetCard({
                state: FlowProcessEffectiveState.Active,
                datasetBasics: mockDatasetBasicsRootFragment,
            });
            expect(component.busyCardIds$.value.has(datasetId)).toBe(true);

            tick(component.TIMEOUT_REFRESH_FLOW);
            expect(component.busyCardIds$.value.has(datasetId)).toBe(true);

            // The refresh request is debounced
            tick(300);
            expect(component.busyCardIds$.value.has(datasetId)).toBe(false);
            discardPeriodicTasks();
        }));

        it("should not end with cards whose load started before the refresh was requested", fakeAsync(() => {
            const cards = {
                cards: mockAccountAllCards,
                rollup: mockAccountFullRollup,
            };
            const inFlightPoll$ = new Subject<typeof cards>();
            const refreshedCards$ = new Subject<typeof cards>();
            const loads = [of(cards), inFlightPoll$, refreshedCards$];
            // Polls after these answer at once
            getAccountAllCardsSpy.mockImplementation(() => loads.shift() ?? of(cards));
            vi.spyOn(datasetFlowsService, "datasetPauseFlows").mockReturnValue(of(void 0));
            fixture.detectChanges();
            tick(0);

            // The next poll starts after the toggle and answers while the refresh is debounced
            tick(environment.delay_polling_ms - 1000);
            component.toggleStateDatasetCard({
                state: FlowProcessEffectiveState.Active,
                datasetBasics: mockDatasetBasicsRootFragment,
            });
            tick(component.TIMEOUT_REFRESH_FLOW);
            inFlightPoll$.next(cards);
            expect(component.busyCardIds$.value.has(datasetId)).toBe(true);

            tick(300);
            refreshedCards$.next(cards);
            expect(component.busyCardIds$.value.has(datasetId)).toBe(false);
            discardPeriodicTasks();
        }));

        it("should track each dataset's card on its own", () => {
            const rootTrigger$ = new Subject<boolean>();
            const derivedTrigger$ = new Subject<boolean>();
            vi.spyOn(datasetFlowsService, "datasetTriggerIngestFlow").mockReturnValue(rootTrigger$);
            vi.spyOn(datasetFlowsService, "datasetTriggerTransformFlow").mockReturnValue(derivedTrigger$);
            const derivedDataset = { ...mockDatasetBasicsDerivedFragment, id: "derived-dataset-id" };
            component.updateNow(mockDatasetBasicsRootFragment);
            component.updateNow(derivedDataset);
            expect([...component.busyCardIds$.value]).toEqual([datasetId, derivedDataset.id]);

            rootTrigger$.next(false);
            expect([...component.busyCardIds$.value]).toEqual([derivedDataset.id]);
        });

        it("should last while 'Update now' is waiting for the trigger", () => {
            const trigger$ = new Subject<boolean>();
            vi.spyOn(datasetFlowsService, "datasetTriggerIngestFlow").mockReturnValue(trigger$);
            component.updateNow(mockDatasetBasicsRootFragment);
            expect(component.busyCardIds$.value.has(datasetId)).toBe(true);

            trigger$.next(false);
            expect(component.busyCardIds$.value.has(datasetId)).toBe(false);
        });

        it("should end when the toggle request fails, and leave the error to the global handler", fakeAsync(() => {
            vi.spyOn(datasetFlowsService, "datasetPauseFlows").mockReturnValue(
                throwError(() => new Error("Network failure")),
            );
            component.toggleStateDatasetCard({
                state: FlowProcessEffectiveState.Active,
                datasetBasics: mockDatasetBasicsRootFragment,
            });

            expect(component.busyCardIds$.value.has(datasetId)).toBe(false);
            expect(() => tick()).toThrowError("Network failure");
        }));
    });

    it("should refresh the cards after 'Update now' only once the delay passes", fakeAsync(() => {
        vi.spyOn(datasetFlowsService, "datasetTriggerIngestFlow").mockReturnValue(of(true));
        const refreshNowSpy = vi.spyOn(component, "refreshNow").mockImplementation(() => {});
        component.updateNow(mockDatasetBasicsRootFragment);

        tick(component.TIMEOUT_REFRESH_FLOW - 1);
        expect(refreshNowSpy).not.toHaveBeenCalled();

        tick(1);
        expect(refreshNowSpy).toHaveBeenCalledTimes(1);
    }));

    it("should not refresh the cards after 'Update now' once destroyed", fakeAsync(() => {
        vi.spyOn(datasetFlowsService, "datasetTriggerIngestFlow").mockReturnValue(of(true));
        const refreshNowSpy = vi.spyOn(component, "refreshNow").mockImplementation(() => {});
        component.updateNow(mockDatasetBasicsRootFragment);

        fixture.destroy();
        tick(component.TIMEOUT_REFRESH_FLOW);
        expect(refreshNowSpy).not.toHaveBeenCalled();
    }));

    it("should leave an auto-stopped process alone when the resume confirmation is cancelled", () => {
        answerConfirmModal(false);
        const resumeSpy = stubMethod(datasetFlowsService, "datasetResumeFlows");
        component.toggleStateDatasetCard({
            state: FlowProcessEffectiveState.StoppedAuto,
            datasetBasics: mockDatasetBasicsRootFragment,
        });

        expect(resumeSpy).not.toHaveBeenCalled();
        expect(component.busyCardIds$.value.size).toEqual(0);
    });

    it("should not hold a dataset card busy while the resume confirmation is open, as Escape closes it unanswered", () => {
        vi.spyOn(TestBed.inject(ModalService), "error").mockReturnValue(Promise.resolve(""));
        const resumeSpy = stubMethod(datasetFlowsService, "datasetResumeFlows");
        component.toggleStateDatasetCard({
            state: FlowProcessEffectiveState.StoppedAuto,
            datasetBasics: mockDatasetBasicsRootFragment,
        });

        expect(resumeSpy).not.toHaveBeenCalled();
        expect(component.busyCardIds$.value.size).toEqual(0);
    });

    it("should keep a webhook card busy until the cards refreshed after its toggle arrive", fakeAsync(() => {
        vi.spyOn(datasetWebhooksService, "datasetWebhookPauseSubscription").mockReturnValue(of(true));
        fixture.detectChanges();
        tick(0);
        component.toggleWebhookCardState({
            state: FlowProcessEffectiveState.Active,
            datasetBasics: mockDatasetBasicsRootFragment,
            subscriptionId: MOCK_SUBSCRIPTION_ID,
        });
        expect(component.busyCardIds$.value.has(MOCK_SUBSCRIPTION_ID)).toBe(true);

        tick(component.TIMEOUT_REFRESH_FLOW);
        expect(component.busyCardIds$.value.has(MOCK_SUBSCRIPTION_ID)).toBe(true);

        tick(300);
        expect(component.busyCardIds$.value.has(MOCK_SUBSCRIPTION_ID)).toBe(false);
        discardPeriodicTasks();
    }));
});
