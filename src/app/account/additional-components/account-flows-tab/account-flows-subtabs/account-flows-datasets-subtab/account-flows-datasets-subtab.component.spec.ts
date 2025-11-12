/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, discardPeriodicTasks, fakeAsync, TestBed, tick } from "@angular/core/testing";
import { AccountFlowsDatasetsSubtabComponent } from "./account-flows-datasets-subtab.component";
import { AccountFlowsNav } from "../../account-flows-tab.types";
import {
    AccountFlowProcessCardConnectionDataFragment,
    FlowProcessEffectiveState,
    FlowStatus,
} from "src/app/api/kamu.graphql.interface";
import { SharedTestModule } from "src/app/common/modules/shared-test.module";
import { Apollo } from "apollo-angular";
import { provideToastr } from "ngx-toastr";
import { AccountService } from "src/app/account/account.service";
import { ActivatedRoute } from "@angular/router";
import { NavigationService } from "src/app/services/navigation.service";
import { AccountTabs } from "src/app/account/account.constants";
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

describe("AccountFlowsDatasetsSubtabComponent", () => {
    let component: AccountFlowsDatasetsSubtabComponent;
    let fixture: ComponentFixture<AccountFlowsDatasetsSubtabComponent>;
    let accountService: AccountService;
    let navigationService: NavigationService;
    let datasetWebhooksService: DatasetWebhooksService;
    let datasetFlowsService: DatasetFlowsService;
    const MOCK_ACCOUNT_NAME = "kamu";
    const MOCK_SUBSCRIPTION_ID = "121223-21212-567788";
    let getAccountFlowsAsCardsSpy: jasmine.Spy;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [AccountFlowsDatasetsSubtabComponent, SharedTestModule, HttpClientTestingModule],
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
        component = fixture.componentInstance;
        component.accountName = MOCK_ACCOUNT_NAME;
        component.accountFlowsData = {
            activeNav: AccountFlowsNav.DATASETS,
            flowGroup: FlowStatus.Finished,
        };
        getAccountFlowsAsCardsSpy = spyOn(accountService, "getAccountFlowsAsCards").and.returnValue(
            of(
                mockAccountFlowsAsCardsQuery.accounts.byName?.flows.processes
                    .allCards as AccountFlowProcessCardConnectionDataFragment,
            ),
        );
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should check navigate to owner view with page=1 ", () => {
        const navigateToOwnerViewSpy = spyOn(navigationService, "navigateToOwnerView");
        component.onPageChange(1);
        expect(navigateToOwnerViewSpy).toHaveBeenCalledOnceWith(
            component.accountName,
            AccountTabs.FLOWS,
            undefined,
            component.accountFlowsData.activeNav,
        );
    });

    it("should check navigate to owner view with page>1 ", () => {
        const navigateToOwnerViewSpy = spyOn(navigationService, "navigateToOwnerView");
        component.onPageChange(2);
        expect(navigateToOwnerViewSpy).toHaveBeenCalledOnceWith(
            component.accountName,
            AccountTabs.FLOWS,
            2,
            component.accountFlowsData.activeNav,
        );
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
        component.refreshNow();
        expect(fetchCardsDataSpy).toHaveBeenCalledTimes(1);
    });

    it("should check to edit webhook card", () => {
        const navigateToWebhooksSpy = spyOn(navigationService, "navigateToWebhooks");
        component.editWebhookCard(mockDatasetBasicsRootFragment, MOCK_SUBSCRIPTION_ID);
        expect(navigateToWebhooksSpy).toHaveBeenCalledTimes(1);
    });

    it("should check to toggle webhook card with active state", fakeAsync(() => {
        const datasetWebhookPauseSubscriptionSpy = spyOn(
            datasetWebhooksService,
            "datasetWebhookPauseSubscription",
        ).and.returnValue(of(true));
        component.toggleWebhookCardState(
            mockDatasetBasicsRootFragment,
            MOCK_SUBSCRIPTION_ID,
            FlowProcessEffectiveState.Active,
        );
        tick(component.TIMEOUT_REFRESH_FLOW);
        expect(datasetWebhookPauseSubscriptionSpy).toHaveBeenCalledTimes(1);
        discardPeriodicTasks();
    }));

    it("should check to toggle webhook card with stopped state", fakeAsync(() => {
        const datasetWebhookResumeSubscriptionSpy = spyOn(
            datasetWebhooksService,
            "datasetWebhookResumeSubscription",
        ).and.returnValue(of(true));
        component.toggleWebhookCardState(
            mockDatasetBasicsRootFragment,
            MOCK_SUBSCRIPTION_ID,
            FlowProcessEffectiveState.StoppedAuto,
        );
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
        const navigateToDatasetViewSpy = spyOn(navigationService, "navigateToDatasetView");
        const datasetTriggerIngestFlowSpy = spyOn(datasetFlowsService, "datasetTriggerIngestFlow").and.returnValue(
            of(true),
        );
        component.updateNow(mockDatasetBasicsRootFragment);
        tick(component.TIMEOUT_REFRESH_FLOW);
        expect(navigateToDatasetViewSpy).toHaveBeenCalledTimes(1);
        expect(datasetTriggerIngestFlowSpy).toHaveBeenCalledTimes(1);
        discardPeriodicTasks();
    }));

    it("should check to update process for card belongs the derivative dataset", fakeAsync(() => {
        const navigateToDatasetViewSpy = spyOn(navigationService, "navigateToDatasetView");
        const datasetTriggerTransformFlowSpy = spyOn(
            datasetFlowsService,
            "datasetTriggerTransformFlow",
        ).and.returnValue(of(true));
        component.updateNow(mockDatasetBasicsDerivedFragment);
        tick(component.TIMEOUT_REFRESH_FLOW);
        expect(navigateToDatasetViewSpy).toHaveBeenCalledTimes(1);
        expect(datasetTriggerTransformFlowSpy).toHaveBeenCalledTimes(1);
        discardPeriodicTasks();
    }));
});
