/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed, discardPeriodicTasks, fakeAsync, flush, tick } from "@angular/core/testing";
import { AccountFlowsTabComponent } from "./account-flows-tab.component";
import { provideToastr } from "ngx-toastr";
import { ActivatedRoute } from "@angular/router";
import { of } from "rxjs";
import { DatasetFlowsService } from "src/app/dataset-view/additional-components/flows-component/services/dataset-flows.service";
import { NavigationService } from "src/app/services/navigation.service";
import { AccountTabs } from "../../account.constants";
import { AccountService } from "src/app/account/account.service";
import { mockDatasetMainDataId } from "src/app/search/mock.data";
import { mockDatasetFlowsInitiatorsQuery, mockFlowsTableData } from "src/app/api/mock/dataset-flow.mock";
import { findElementByDataTestId } from "src/app/common/helpers/base-test.helpers.spec";
import { Account, AccountFragment, FlowStatus } from "src/app/api/kamu.graphql.interface";
import { mockDatasets } from "src/app/dataset-flow/flows-table/flows-table.helpers.mock";
import { FlowsTableFiltersOptions } from "src/app/dataset-flow/flows-table/flows-table.types";
import { mockAccountDetails } from "src/app/api/mock/auth.mock";
import { LoggedUserService } from "src/app/auth/logged-user.service";
import { Apollo } from "apollo-angular";

describe("AccountFlowsTabComponent", () => {
    let component: AccountFlowsTabComponent;
    let fixture: ComponentFixture<AccountFlowsTabComponent>;
    let accountService: AccountService;
    let navigationService: NavigationService;
    let datasetFlowsService: DatasetFlowsService;
    let loggedUserService: LoggedUserService;
    const MOCK_FLOW_ID = "1";

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [AccountFlowsTabComponent],
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
        }).compileComponents();

        fixture = TestBed.createComponent(AccountFlowsTabComponent);
        accountService = TestBed.inject(AccountService);
        navigationService = TestBed.inject(NavigationService);
        datasetFlowsService = TestBed.inject(DatasetFlowsService);
        loggedUserService = TestBed.inject(LoggedUserService);
        component = fixture.componentInstance;
        spyOnProperty(loggedUserService, "currentlyLoggedInUser", "get").and.returnValue(mockAccountDetails);
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should check navigate to owner view with page=1 ", () => {
        const navigateToOwnerViewSpy = spyOn(navigationService, "navigateToOwnerView");
        component.onPageChange(1);
        expect(navigateToOwnerViewSpy).toHaveBeenCalledOnceWith(component.loggedUser.accountName, AccountTabs.FLOWS);
    });

    it("should check navigate to owner view with page>1 ", () => {
        const navigateToOwnerViewSpy = spyOn(navigationService, "navigateToOwnerView");
        component.onPageChange(2);
        expect(navigateToOwnerViewSpy).toHaveBeenCalledOnceWith(component.loggedUser.accountName, AccountTabs.FLOWS, 2);
    });

    it("should check cancel flow button", fakeAsync(() => {
        const refreshFlowSpy = spyOn(component, "refreshFlow");
        spyOn(datasetFlowsService, "cancelScheduledTasks").and.returnValue(of(true));
        component.onCancelFlow({ flowId: MOCK_FLOW_ID, datasetId: mockDatasetMainDataId });
        tick(component.TIMEOUT_REFRESH_FLOW);
        expect(refreshFlowSpy).toHaveBeenCalledTimes(1);
        flush();
    }));

    it("should check toggle state for account configurations with pause=true", fakeAsync(() => {
        const accountResumeFlowsSpy = spyOn(accountService, "accountResumeFlows").and.returnValue(of());
        const mockPause = true;
        const refreshFlowSpy = spyOn(component, "refreshFlow");
        component.toggleStateAccountFlowConfigs(mockPause);
        tick(component.TIMEOUT_REFRESH_FLOW);
        expect(accountResumeFlowsSpy).toHaveBeenCalledTimes(1);
        expect(refreshFlowSpy).toHaveBeenCalledTimes(1);
        flush();
    }));

    it("should check toggle state for account configurations with pause=false", fakeAsync(() => {
        const accountPauseFlowsSpy = spyOn(accountService, "accountPauseFlows").and.returnValue(of());
        const mockPause = false;
        const refreshFlowSpy = spyOn(component, "refreshFlow");
        component.toggleStateAccountFlowConfigs(mockPause);
        tick(component.TIMEOUT_REFRESH_FLOW);
        expect(accountPauseFlowsSpy).toHaveBeenCalledTimes(1);
        expect(refreshFlowSpy).toHaveBeenCalledTimes(1);
        flush();
    }));

    it("should empty block is visible", fakeAsync(() => {
        fixture.detectChanges();
        mockFlowsTableData.connectionDataForWidget.nodes = [];
        spyOn(accountService, "accountAllFlowsPaused").and.returnValue(of(false));
        spyOn(accountService, "getAccountListFlows").and.returnValue(of(mockFlowsTableData));
        tick();
        fixture.detectChanges();

        const emptyBlock = findElementByDataTestId(fixture, "empty-block");
        expect(emptyBlock).toBeDefined();
        discardPeriodicTasks();
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
        const filterOptions: FlowsTableFiltersOptions = {
            accounts: mockDatasetFlowsInitiatorsQuery.datasets.byId?.flows.runs.listFlowInitiators.nodes as Account[],
            datasets: mockDatasets,
            status: FlowStatus.Finished,
            onlySystemFlows: false,
        };
        const { accounts, datasets, status } = filterOptions;
        component.currentPage = 2;
        const fetchTableDataSpy = spyOn(component, "fetchTableData");
        fixture.detectChanges();
        component.onSearchByFiltersChange(filterOptions);

        expect(fetchTableDataSpy).toHaveBeenCalledWith(
            component.currentPage,
            status,
            { accounts: accounts.map((item: AccountFragment) => item.id) },
            datasets.map((item) => item.id),
        );
    });

    it("should check search by filters with filters options and only system flows", () => {
        const filterOptions: FlowsTableFiltersOptions = {
            accounts: [],
            datasets: [],
            status: FlowStatus.Finished,
            onlySystemFlows: true,
        };
        const { status } = filterOptions;
        component.currentPage = 1;
        component.onlySystemFlows = true;
        const fetchTableDataSpy = spyOn(component, "fetchTableData");
        fixture.detectChanges();
        component.onSearchByFiltersChange(filterOptions);

        expect(fetchTableDataSpy).toHaveBeenCalledWith(component.currentPage, status, { system: true }, []);
    });
});
