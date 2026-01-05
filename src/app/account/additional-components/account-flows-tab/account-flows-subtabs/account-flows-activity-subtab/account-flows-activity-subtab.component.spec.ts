/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, discardPeriodicTasks, fakeAsync, flush, TestBed, tick } from "@angular/core/testing";
import { AccountFlowsActivitySubtabComponent } from "./account-flows-activity-subtab.component";
import { Account, FlowStatus } from "src/app/api/kamu.graphql.interface";
import { AccountFlowsNav, ProcessCardFilterMode } from "../../account-flows-tab.types";
import { Apollo } from "apollo-angular";
import { provideToastr } from "ngx-toastr";
import { ActivatedRoute } from "@angular/router";
import { NavigationService } from "src/app/services/navigation.service";
import { mockAccountDetails } from "src/app/api/mock/auth.mock";
import { LoggedUserService } from "src/app/auth/logged-user.service";
import { AccountTabs } from "src/app/account/account.constants";
import { of } from "rxjs";
import { mockDatasetMainDataId } from "src/app/search/mock.data";
import { DatasetFlowsService } from "src/app/dataset-view/additional-components/flows-component/services/dataset-flows.service";
import { AccountService } from "src/app/account/account.service";
import { mockDatasetFlowsInitiatorsQuery, mockFlowsTableData } from "src/app/api/mock/dataset-flow.mock";
import { mockDatasets } from "src/app/dataset-flow/flows-table/flows-table.helpers.mock";
import { FlowsTableFiltersOptions } from "src/app/dataset-flow/flows-table/flows-table.types";
import { NgbNavChangeEvent } from "@ng-bootstrap/ng-bootstrap";

describe("AccountFlowsActivitySubtabComponent", () => {
    let component: AccountFlowsActivitySubtabComponent;
    let fixture: ComponentFixture<AccountFlowsActivitySubtabComponent>;
    let navigationService: NavigationService;
    let datasetFlowsService: DatasetFlowsService;
    let loggedUserService: LoggedUserService;
    let accountService: AccountService;
    const MOCK_FLOW_ID = "1";
    const MOCK_ACCOUNT_NAME = "kamu";

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [AccountFlowsActivitySubtabComponent],
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
        fixture = TestBed.createComponent(AccountFlowsActivitySubtabComponent);
        navigationService = TestBed.inject(NavigationService);
        loggedUserService = TestBed.inject(LoggedUserService);
        datasetFlowsService = TestBed.inject(DatasetFlowsService);
        accountService = TestBed.inject(AccountService);
        component = fixture.componentInstance;
        component.accountName = MOCK_ACCOUNT_NAME;
        component.accountFlowsData = {
            activeNav: AccountFlowsNav.DATASETS,
            flowGroup: [FlowStatus.Finished],
            datasetsFiltersMode: ProcessCardFilterMode.RECENT_ACTIVITY,
        };
        spyOnProperty(loggedUserService, "currentlyLoggedInUser", "get").and.returnValue(mockAccountDetails);
        spyOn(accountService, "getAccountListFlows").and.returnValue(of(mockFlowsTableData));
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should check navigate to owner view with page=1 ", () => {
        const navigateToOwnerViewSpy = spyOn(navigationService, "navigateToOwnerView");
        component.onPageChange(1);
        expect(navigateToOwnerViewSpy).toHaveBeenCalledOnceWith(
            component.loggedUser.accountName,
            AccountTabs.FLOWS,
            undefined,
            component.accountFlowsData.activeNav,
            component.accountFlowsData.flowGroup,
        );
    });

    it("should check navigate to owner view with page>1 ", () => {
        const navigateToOwnerViewSpy = spyOn(navigationService, "navigateToOwnerView");
        component.onPageChange(2);
        expect(navigateToOwnerViewSpy).toHaveBeenCalledOnceWith(
            component.loggedUser.accountName,
            AccountTabs.FLOWS,
            2,
            component.accountFlowsData.activeNav,
            component.accountFlowsData.flowGroup,
        );
    });

    it("should check to apply filter status in the request", () => {
        component.filters = {
            accounts: mockDatasetFlowsInitiatorsQuery.datasets.byId?.flows.runs.listFlowInitiators.nodes as Account[],
            datasets: mockDatasets,
            status: [FlowStatus.Finished],
            onlySystemFlows: false,
        };
        spyOn(navigationService, "navigateToOwnerView");
        const onSearchByFiltersChangeSpy = spyOn(component, "onSearchByFiltersChange");
        component.onPageChange(2);
        expect(onSearchByFiltersChangeSpy).toHaveBeenCalledTimes(1);
    });

    it("should check to refresh page when filters=null", () => {
        component.filters = null;
        spyOn(navigationService, "navigateToOwnerView");
        const refreshNowSpy = spyOn(component, "refreshNow");
        component.onPageChange(2);
        expect(refreshNowSpy).toHaveBeenCalledTimes(1);
    });

    it("should check abort flow button", fakeAsync(() => {
        spyOn(datasetFlowsService, "cancelFlowRun").and.returnValue(of(true));
        const refreshNowSpy = spyOn(component, "refreshNow");
        component.onAbortFlow({ flowId: MOCK_FLOW_ID, datasetId: mockDatasetMainDataId });
        tick(component.TIMEOUT_REFRESH_FLOW);
        expect(refreshNowSpy).toHaveBeenCalledTimes(1);
        discardPeriodicTasks();
    }));

    it("should check toggle state for account configurations with pause=true", fakeAsync(() => {
        const accountResumeFlowsSpy = spyOn(accountService, "accountResumeFlows").and.returnValue(of());
        const mockPause = true;
        const refreshNowSpy = spyOn(component, "refreshNow");
        component.toggleStateAccountFlowConfigs(mockPause);
        tick(component.TIMEOUT_REFRESH_FLOW);
        expect(accountResumeFlowsSpy).toHaveBeenCalledTimes(1);
        expect(refreshNowSpy).toHaveBeenCalledTimes(1);
        flush();
    }));

    it("should check toggle state for account configurations with pause=false", fakeAsync(() => {
        const accountPauseFlowsSpy = spyOn(accountService, "accountPauseFlows").and.returnValue(of());
        const mockPause = false;
        const refreshNowSpy = spyOn(component, "refreshNow");
        component.toggleStateAccountFlowConfigs(mockPause);
        tick(component.TIMEOUT_REFRESH_FLOW);
        expect(accountPauseFlowsSpy).toHaveBeenCalledTimes(1);
        expect(refreshNowSpy).toHaveBeenCalledTimes(1);
        flush();
    }));

    it("should check search by filters with filters=null", () => {
        component.searchByAccount = mockDatasetFlowsInitiatorsQuery.datasets.byId?.flows.runs.listFlowInitiators
            .nodes as Account[];
        component.searchByDataset = mockDatasets;
        fixture.detectChanges();
        component.onSearchByFiltersChange(null);

        expect(component.searchByAccount).toEqual([]);
        expect(component.searchByDataset).toEqual([]);
    });

    it("should check search by filters with filters options", () => {
        const accounts = mockDatasetFlowsInitiatorsQuery.datasets.byId?.flows.runs.listFlowInitiators
            .nodes as Account[];
        const filterOptions: FlowsTableFiltersOptions = {
            accounts,
            datasets: mockDatasets,
            status: [FlowStatus.Finished],
            onlySystemFlows: false,
        };
        component.currentPage = 2;

        const updateFiltersSpy = spyOn(component.fetchTrigger$, "next");
        fixture.detectChanges();
        component.onSearchByFiltersChange(filterOptions);

        expect(updateFiltersSpy).toHaveBeenCalledWith(
            jasmine.objectContaining({
                page: component.currentPage,
                filterByStatus: [FlowStatus.Finished],
                filterByInitiator: { accounts: accounts.map((x) => x.id) },
                datasetsIds: component.selectedDatasetItems.map((x) => x.id),
            }),
        );
    });

    it("should check search by filters with filters options and only system flows", () => {
        const filterOptions: FlowsTableFiltersOptions = {
            accounts: [],
            datasets: [],
            status: [FlowStatus.Finished],
            onlySystemFlows: true,
        };
        const { status } = filterOptions;
        component.currentPage = 1;
        component.onlySystemFlows = true;
        const updateFiltersSpy = spyOn(component.fetchTrigger$, "next");
        fixture.detectChanges();
        component.onSearchByFiltersChange(filterOptions);

        expect(updateFiltersSpy).toHaveBeenCalledWith(
            jasmine.objectContaining({
                page: component.currentPage,
                filterByStatus: status,
                filterByInitiator: { system: true },
                datasetsIds: component.selectedDatasetItems.map((x) => x.id),
            }),
        );
    });

    it("should check to reset filters", () => {
        spyOn(navigationService, "navigateToOwnerView");
        component.selectedAccountItems = [mockAccountDetails];
        component.selectedStatusItems = [{ id: "FINISHED", status: FlowStatus.Finished }];
        component.onResetFilters();
        expect(component.selectedAccountItems).toEqual([]);
        expect(component.selectedStatusItems).toEqual([]);
    });

    it("should check to refresh page", () => {
        const fetchTableDataSpy = spyOn(component, "fetchTableData");
        component.refreshFlow();
        expect(fetchTableDataSpy).toHaveBeenCalledTimes(1);
    });

    it("should check to change navigation", () => {
        const navigateToOwnerViewSpy = spyOn(navigationService, "navigateToOwnerView");
        const event = {
            nextId: AccountFlowsNav.DATASETS,
        } as NgbNavChangeEvent;
        component.onNavChange(event);
        expect(navigateToOwnerViewSpy).toHaveBeenCalledTimes(1);
    });

    it("should check to change navigation status with finished status", () => {
        const navigateToOwnerViewSpy = spyOn(navigationService, "navigateToOwnerView");
        const event = {
            nextId: FlowStatus.Finished,
        } as NgbNavChangeEvent;
        component.onNavStatusChange(event);
        expect(navigateToOwnerViewSpy).toHaveBeenCalledOnceWith(
            component.accountName,
            AccountTabs.FLOWS,
            undefined,
            component.accountFlowsData.activeNav,
            [FlowStatus.Finished],
        );
    });

    it("should check to change navigation status with running status", () => {
        const navigateToOwnerViewSpy = spyOn(navigationService, "navigateToOwnerView");
        const event = {
            nextId: FlowStatus.Running,
        } as NgbNavChangeEvent;
        component.onNavStatusChange(event);
        expect(navigateToOwnerViewSpy).toHaveBeenCalledOnceWith(
            component.accountName,
            AccountTabs.FLOWS,
            undefined,
            component.accountFlowsData.activeNav,
            [FlowStatus.Running, FlowStatus.Retrying],
        );
    });
});
