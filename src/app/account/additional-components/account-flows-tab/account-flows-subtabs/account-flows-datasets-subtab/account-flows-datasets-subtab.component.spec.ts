/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, discardPeriodicTasks, fakeAsync, TestBed, tick } from "@angular/core/testing";
import { AccountFlowsDatasetsSubtabComponent } from "./account-flows-datasets-subtab.component";
import { AccountFlowsNav, ProcessCardFilterMode } from "../../account-flows-tab.types";
import {
    AccountFlowProcessCardConnectionDataFragment,
    FlowProcessEffectiveState,
    FlowStatus,
} from "src/app/api/kamu.graphql.interface";
import { SharedTestModule } from "src/app/common/modules/shared-test.module";
import { Apollo } from "apollo-angular";
import { provideToastr, ToastrService } from "ngx-toastr";
import { AccountService } from "src/app/account/account.service";
import { ActivatedRoute } from "@angular/router";
import { NavigationService } from "src/app/services/navigation.service";
import { of } from "rxjs";
import {
    mockAccountFlowsAsCardsQuery,
    mockAccountFlowsAsCardsQueryEmpty,
    mockAccountFlowsAsCardsQueryWithWebhook,
} from "src/app/api/mock/account.mock";
import { findElementByDataTestId, registerMatSvgIcons } from "src/app/common/helpers/base-test.helpers.spec";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { mockDatasetBasicsDerivedFragment, mockDatasetBasicsRootFragment } from "src/app/search/mock.data";
import { DatasetWebhooksService } from "src/app/dataset-view/additional-components/dataset-settings-component/tabs/webhooks/service/dataset-webhooks.service";
import { DatasetFlowsService } from "src/app/dataset-view/additional-components/flows-component/services/dataset-flows.service";
import { WebhookFlowProcessCardComponent } from "../../../../../flow-cards/webhook-flow-process-card/webhook-flow-process-card.component";
import { DatasetFlowProcessCardComponent } from "src/app/flow-cards/dataset-flow-process-card/dataset-flow-process-card.component";
import { MatButtonToggleChange } from "@angular/material/button-toggle";

describe("AccountFlowsDatasetsSubtabComponent", () => {
    let component: AccountFlowsDatasetsSubtabComponent;
    let fixture: ComponentFixture<AccountFlowsDatasetsSubtabComponent>;
    let accountService: AccountService;
    let navigationService: NavigationService;
    let datasetWebhooksService: DatasetWebhooksService;
    let datasetFlowsService: DatasetFlowsService;
    let toastrService: ToastrService;
    const MOCK_ACCOUNT_NAME = "kamu";
    const MOCK_SUBSCRIPTION_ID = "121223-21212-567788";
    let getAccountFlowsAsCardsSpy: jasmine.Spy;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                AccountFlowsDatasetsSubtabComponent,
                SharedTestModule,
                HttpClientTestingModule,
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
            ],
        });

        registerMatSvgIcons();

        fixture = TestBed.createComponent(AccountFlowsDatasetsSubtabComponent);
        accountService = TestBed.inject(AccountService);
        navigationService = TestBed.inject(NavigationService);
        datasetWebhooksService = TestBed.inject(DatasetWebhooksService);
        datasetFlowsService = TestBed.inject(DatasetFlowsService);
        toastrService = TestBed.inject(ToastrService);
        component = fixture.componentInstance;
        component.accountName = MOCK_ACCOUNT_NAME;
        component.accountFlowsData = {
            activeNav: AccountFlowsNav.DATASETS,
            flowGroup: [FlowStatus.Finished],
            datasetsFiltersMode: ProcessCardFilterMode.CUSTOM,
        };
        getAccountFlowsAsCardsSpy = spyOn(accountService, "getAccountFlowsAsCards").and.returnValue(
            of(
                mockAccountFlowsAsCardsQuery.accounts.byName?.flows.processes
                    .allCards as AccountFlowProcessCardConnectionDataFragment,
            ),
        );
    });

    it("should create", () => {
        fixture.detectChanges();
        expect(component).toBeTruthy();
    });

    it("should empty block is visible", fakeAsync(() => {
        fixture.detectChanges();
        getAccountFlowsAsCardsSpy.and.returnValue(
            of(
                mockAccountFlowsAsCardsQueryEmpty.accounts.byName?.flows.processes
                    .allCards as AccountFlowProcessCardConnectionDataFragment,
            ),
        );
        tick(0);
        fixture.detectChanges();

        const emptyBlock = findElementByDataTestId(fixture, "empty-cards-block");
        expect(emptyBlock).toBeDefined();
        discardPeriodicTasks();
    }));

    it("should check cards is visible", fakeAsync(() => {
        fixture.detectChanges();
        getAccountFlowsAsCardsSpy.and.returnValue(
            of(
                mockAccountFlowsAsCardsQueryWithWebhook.accounts.byName?.flows.processes
                    .allCards as AccountFlowProcessCardConnectionDataFragment,
            ),
        );
        tick(0);
        fixture.detectChanges();

        const cardsBlock = findElementByDataTestId(fixture, "cards");
        expect(cardsBlock).toBeDefined();
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

    it("should check to get cards for ProcessCardFilterMode.CUSTOM mode", fakeAsync(() => {
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
            applyFilters: true,
        });

        fixture.detectChanges();
        tick(0);
        fixture.detectChanges();
        const cardsBlock = findElementByDataTestId(fixture, "cards");
        expect(cardsBlock).toBeDefined();
        expect(getAccountFlowsAsCardsSpy).toHaveBeenCalledTimes(1);
        discardPeriodicTasks();
    }));

    it("should check to get cards for ProcessCardFilterMode.PAUSED mode", fakeAsync(() => {
        component.accountFlowsData.datasetsFiltersMode = ProcessCardFilterMode.PAUSED;

        fixture.detectChanges();
        tick(0);
        fixture.detectChanges();
        const cardsBlock = findElementByDataTestId(fixture, "cards");
        expect(cardsBlock).toBeDefined();
        expect(getAccountFlowsAsCardsSpy).toHaveBeenCalledTimes(1);
        discardPeriodicTasks();
    }));

    it("should check to get cards for ProcessCardFilterMode.UPCOMING_SCHEDULED mode without selectedFlowProcessStates", fakeAsync(() => {
        component.accountFlowsData.datasetsFiltersMode = ProcessCardFilterMode.UPCOMING_SCHEDULED;

        fixture.detectChanges();
        tick(0);
        fixture.detectChanges();
        const cardsBlock = findElementByDataTestId(fixture, "cards");
        expect(cardsBlock).toBeDefined();
        expect(getAccountFlowsAsCardsSpy).toHaveBeenCalledTimes(1);
        discardPeriodicTasks();
    }));

    it("should check to get cards for ProcessCardFilterMode.UPCOMING_SCHEDULED mode with selectedFlowProcessStates", fakeAsync(() => {
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
            applyFilters: true,
        });

        fixture.detectChanges();
        tick(0);
        fixture.detectChanges();
        const cardsBlock = findElementByDataTestId(fixture, "cards");
        expect(cardsBlock).toBeDefined();
        expect(getAccountFlowsAsCardsSpy).toHaveBeenCalledTimes(1);
        discardPeriodicTasks();
    }));

    it("should check to get cards for ProcessCardFilterMode.TRIAGE mode with minConsecutiveFailures=0 ", fakeAsync(() => {
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
            applyFilters: true,
        });

        fixture.detectChanges();
        tick(0);
        fixture.detectChanges();
        const cardsBlock = findElementByDataTestId(fixture, "cards");
        expect(cardsBlock).toBeDefined();
        expect(getAccountFlowsAsCardsSpy).toHaveBeenCalledTimes(1);
        discardPeriodicTasks();
    }));

    it("should check to get cards for ProcessCardFilterMode.TRIAGE mode with minConsecutiveFailures>1 ", fakeAsync(() => {
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
            applyFilters: true,
        });

        fixture.detectChanges();
        tick(0);
        fixture.detectChanges();
        const cardsBlock = findElementByDataTestId(fixture, "cards");
        expect(cardsBlock).toBeDefined();
        expect(getAccountFlowsAsCardsSpy).toHaveBeenCalledTimes(1);
        discardPeriodicTasks();
    }));

    it("should check to get cards for ProcessCardFilterMode.RECENT_ACTIVITY mode with selectedFlowProcessStates", fakeAsync(() => {
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
            applyFilters: true,
        });

        fixture.detectChanges();
        tick(0);
        fixture.detectChanges();
        const cardsBlock = findElementByDataTestId(fixture, "cards");
        expect(cardsBlock).toBeDefined();
        expect(getAccountFlowsAsCardsSpy).toHaveBeenCalledTimes(1);
        discardPeriodicTasks();
    }));

    it("should check to get cards for ProcessCardFilterMode.RECENT_ACTIVITY mode witout selectedFlowProcessStates", fakeAsync(() => {
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
            applyFilters: true,
        });

        fixture.detectChanges();
        tick(0);
        fixture.detectChanges();
        const cardsBlock = findElementByDataTestId(fixture, "cards");
        expect(cardsBlock).toBeDefined();
        expect(getAccountFlowsAsCardsSpy).toHaveBeenCalledTimes(1);
        discardPeriodicTasks();
    }));

    it("should be checked that scrolling is not working", () => {
        component.loadingCards = true;
        component.hasNextPage = true;
        component.onScroll();
        expect(component.currentPage).toEqual(1);

        component.loadingCards = false;
        component.hasNextPage = false;
        component.onScroll();
        expect(component.currentPage).toEqual(1);
    });

    it("should check that scrolling is working", () => {
        component.loadingCards = false;
        component.hasNextPage = true;
        component.onScroll();
        expect(component.currentPage).toEqual(2);
    });
});
