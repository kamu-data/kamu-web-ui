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

import { of } from "rxjs";

import { NgbNavChangeEvent } from "@ng-bootstrap/ng-bootstrap";
import { Apollo } from "apollo-angular";
import { provideToastr } from "ngx-toastr";
import { Mock } from "vitest";

import { PagePastEndHarness } from "@common/components/page-past-end/page-past-end.harness";
import { requireValue } from "@common/helpers/app.helpers";
import { registerMatSvgIcons, setComponentInput, stubMethod } from "@common/helpers/base-test.helpers.spec";
import { FlowStatus } from "@api/kamu.graphql.interface";
import { mockAccountDetails } from "@api/mock/auth.mock";
import { mockDatasetFlowsInitiatorsQuery, mockFlowsTableData } from "@api/mock/dataset-flow.mock";
import { MaybeNull } from "@interface/app.types";

import { AccountTabs } from "src/app/account/account.constants";
import { AccountService } from "src/app/account/account.service";
import { AccountFlowsActivitySubtabComponent } from "src/app/account/additional-components/account-flows-tab/account-flows-subtabs/account-flows-activity-subtab/account-flows-activity-subtab.component";
import { flowStatusGroup } from "src/app/account/additional-components/account-flows-tab/account-flows-tab.helpers";
import {
    AccountFlowsNav,
    ProcessCardFilterMode,
} from "src/app/account/additional-components/account-flows-tab/account-flows-tab.types";
import { LoggedUserService } from "src/app/auth/logged-user.service";
import { mockDatasets } from "src/app/dataset-flow/flows-table/flows-table.helpers.mock";
import { FlowsTableFiltersOptions } from "src/app/dataset-flow/flows-table/flows-table.types";
import { DatasetFlowsService } from "src/app/dataset-view/additional-components/flows-component/services/dataset-flows.service";
import { mockDatasetMainDataId } from "src/app/search/mock.data";
import { NavigationService } from "src/app/services/navigation.service";

describe("AccountFlowsActivitySubtabComponent", () => {
    let component: AccountFlowsActivitySubtabComponent;
    let fixture: ComponentFixture<AccountFlowsActivitySubtabComponent>;
    let navigationService: NavigationService;
    let datasetFlowsService: DatasetFlowsService;
    let loggedUserService: LoggedUserService;
    let accountService: AccountService;
    const MOCK_FLOW_ID = "1";
    const MOCK_ACCOUNT_NAME = "kamu";
    let pageParam: MaybeNull<string>;

    beforeEach(() => {
        pageParam = "1";
        TestBed.configureTestingModule({
            imports: [AccountFlowsActivitySubtabComponent],
            providers: [
                Apollo,
                provideToastr(),
                provideHttpClient(),
                provideHttpClientTesting(),
                {
                    provide: ActivatedRoute,
                    useValue: {
                        snapshot: {
                            queryParamMap: {
                                get: (key: string) => {
                                    switch (key) {
                                        case "page":
                                            return pageParam;
                                    }
                                },
                            },
                        },
                    },
                },
            ],
        });
        registerMatSvgIcons();
        fixture = TestBed.createComponent(AccountFlowsActivitySubtabComponent);
        navigationService = TestBed.inject(NavigationService);
        loggedUserService = TestBed.inject(LoggedUserService);
        datasetFlowsService = TestBed.inject(DatasetFlowsService);
        accountService = TestBed.inject(AccountService);
        component = fixture.componentInstance;
        setComponentInput(fixture, "accountName", MOCK_ACCOUNT_NAME);
        setComponentInput(fixture, "accountFlowsData", {
            activeNav: AccountFlowsNav.PROCESSES,
            flowGroup: [FlowStatus.Finished],
            datasetsFiltersMode: ProcessCardFilterMode.RECENT_ACTIVITY,
        });
        vi.spyOn(loggedUserService, "currentlyLoggedInUser", "get").mockReturnValue(mockAccountDetails);
        vi.spyOn(accountService, "getAccountListFlows").mockReturnValue(of(mockFlowsTableData));
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should check navigate to owner view with page=1 ", () => {
        const navigateToOwnerViewSpy = vi.spyOn(navigationService, "navigateToOwnerView").mockImplementation(() => {});
        component.onPageChange(1);
        expect(navigateToOwnerViewSpy).toHaveBeenCalledTimes(1);
        expect(navigateToOwnerViewSpy).toHaveBeenCalledWith(
            MOCK_ACCOUNT_NAME,
            AccountTabs.FLOWS,
            undefined,
            component.accountFlowsData.activeNav,
            component.accountFlowsData.flowGroup,
        );
    });

    it("should check navigate to owner view with page>1 ", () => {
        const navigateToOwnerViewSpy = vi.spyOn(navigationService, "navigateToOwnerView").mockImplementation(() => {});
        component.onPageChange(2);
        expect(navigateToOwnerViewSpy).toHaveBeenCalledTimes(1);
        expect(navigateToOwnerViewSpy).toHaveBeenCalledWith(
            MOCK_ACCOUNT_NAME,
            AccountTabs.FLOWS,
            2,
            component.accountFlowsData.activeNav,
            component.accountFlowsData.flowGroup,
        );
    });

    it("should say a page past the last one has no flow runs and lead to the last page", fakeAsync(async () => {
        const pastEndData = structuredClone(mockFlowsTableData);
        pastEndData.connectionDataForTable.nodes = [];
        pastEndData.connectionDataForTable.pageInfo.currentPage = 98;
        pastEndData.connectionDataForTable.pageInfo.totalPages = 3;
        vi.spyOn(accountService, "getAccountListFlows").mockReturnValue(of(pastEndData));
        const navigateToOwnerViewSpy = stubMethod(navigationService, "navigateToOwnerView");
        component.refreshFlow();
        tick();

        const pagePastEnd = await TestbedHarnessEnvironment.loader(fixture).getHarness(PagePastEndHarness);
        expect(await pagePastEnd.getMessage()).toEqual("There are no flow runs on this page.");
        await pagePastEnd.goToLastPage();
        expect(navigateToOwnerViewSpy).toHaveBeenCalledWith(
            MOCK_ACCOUNT_NAME,
            AccountTabs.FLOWS,
            3,
            component.accountFlowsData.activeNav,
            component.accountFlowsData.flowGroup,
        );
        discardPeriodicTasks();
    }));

    it("should keep viewed account (not logged user) when paginating another account's flows", () => {
        expect(component.loggedUser.accountName).not.toEqual(MOCK_ACCOUNT_NAME);
        const navigateToOwnerViewSpy = vi.spyOn(navigationService, "navigateToOwnerView").mockImplementation(() => {});
        component.onPageChange(3);
        expect(navigateToOwnerViewSpy).toHaveBeenCalledTimes(1);
        expect(navigateToOwnerViewSpy).toHaveBeenCalledWith(
            MOCK_ACCOUNT_NAME,
            AccountTabs.FLOWS,
            3,
            component.accountFlowsData.activeNav,
            component.accountFlowsData.flowGroup,
        );
    });

    it("should check to apply filter status in the request", () => {
        component.filters = {
            accounts: requireValue(mockDatasetFlowsInitiatorsQuery.datasets.byId).flows.runs.listFlowInitiators.nodes,
            datasets: mockDatasets,
            status: [FlowStatus.Finished],
            onlySystemFlows: false,
        };
        vi.spyOn(navigationService, "navigateToOwnerView").mockImplementation(() => {});
        const onSearchByFiltersChangeSpy = vi.spyOn(component, "onSearchByFiltersChange").mockImplementation(() => {});
        component.onPageChange(2);
        expect(onSearchByFiltersChangeSpy).toHaveBeenCalledTimes(1);
    });

    it("should check to refresh page when filters=null", () => {
        component.filters = null;
        vi.spyOn(navigationService, "navigateToOwnerView").mockImplementation(() => {});
        const refreshNowSpy = vi.spyOn(component, "refreshNow").mockImplementation(() => {});
        component.onPageChange(2);
        expect(refreshNowSpy).toHaveBeenCalledTimes(1);
    });

    it("should check abort flow button", fakeAsync(() => {
        vi.spyOn(datasetFlowsService, "cancelFlowRun").mockReturnValue(of(true));
        const refreshNowSpy = vi.spyOn(component, "refreshNow").mockImplementation(() => {});
        component.onAbortFlow({ flowId: MOCK_FLOW_ID, datasetId: mockDatasetMainDataId });
        tick(component.TIMEOUT_REFRESH_FLOW);
        expect(refreshNowSpy).toHaveBeenCalledTimes(1);
        discardPeriodicTasks();
    }));

    it("should check search by filters with filters=null", () => {
        component.searchByAccount = requireValue(
            mockDatasetFlowsInitiatorsQuery.datasets.byId,
        ).flows.runs.listFlowInitiators.nodes;
        component.searchByDataset = mockDatasets;
        fixture.detectChanges();
        component.onSearchByFiltersChange(null);

        expect(component.searchByAccount).toEqual([]);
        expect(component.searchByDataset).toEqual([]);
    });

    it("should check search by filters with filters options", () => {
        const accounts = requireValue(mockDatasetFlowsInitiatorsQuery.datasets.byId).flows.runs.listFlowInitiators
            .nodes;
        const filterOptions: FlowsTableFiltersOptions = {
            accounts,
            datasets: mockDatasets,
            status: [FlowStatus.Finished],
            onlySystemFlows: false,
        };
        component.currentPage = 2;

        const updateFiltersSpy = vi.spyOn(component.fetchTrigger$, "next").mockImplementation(() => {});
        fixture.detectChanges();
        component.onSearchByFiltersChange(filterOptions);

        expect(updateFiltersSpy).toHaveBeenCalledWith(
            expect.objectContaining({
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
        const updateFiltersSpy = vi.spyOn(component.fetchTrigger$, "next").mockImplementation(() => {});
        fixture.detectChanges();
        component.onSearchByFiltersChange(filterOptions);

        expect(updateFiltersSpy).toHaveBeenCalledWith(
            expect.objectContaining({
                page: component.currentPage,
                filterByStatus: status,
                filterByInitiator: { system: true },
                datasetsIds: component.selectedDatasetItems.map((x) => x.id),
            }),
        );
    });

    it("should check to reset filters", () => {
        vi.spyOn(navigationService, "navigateToOwnerView").mockImplementation(() => {});
        component.selectedAccountItems = [mockAccountDetails];
        component.selectedStatusItems = [{ id: "FINISHED", status: FlowStatus.Finished }];
        component.onResetFilters();
        expect(component.selectedAccountItems).toEqual([]);
        expect(component.selectedStatusItems).toEqual([]);
    });

    it("should check to refresh page", () => {
        const fetchTableDataSpy = vi.spyOn(component, "fetchTableData").mockImplementation(() => {});
        component.refreshFlow();
        expect(fetchTableDataSpy).toHaveBeenCalledTimes(1);
    });

    it("should check to change navigation status with finished status", () => {
        const navigateToOwnerViewSpy = vi.spyOn(navigationService, "navigateToOwnerView").mockImplementation(() => {});
        const event: NgbNavChangeEvent<FlowStatus> = {
            activeId: FlowStatus.Running,
            nextId: FlowStatus.Finished,
            preventDefault: () => undefined,
        };
        component.onNavStatusChange(event);
        expect(navigateToOwnerViewSpy).toHaveBeenCalledTimes(1);
        expect(navigateToOwnerViewSpy).toHaveBeenCalledWith(
            component.accountName,
            AccountTabs.FLOWS,
            undefined,
            component.accountFlowsData.activeNav,
            [FlowStatus.Finished],
        );
    });

    it("should check to change navigation status with running status", () => {
        const navigateToOwnerViewSpy = vi.spyOn(navigationService, "navigateToOwnerView").mockImplementation(() => {});
        const event: NgbNavChangeEvent<FlowStatus> = {
            activeId: FlowStatus.Finished,
            nextId: FlowStatus.Running,
            preventDefault: () => undefined,
        };
        component.onNavStatusChange(event);
        expect(navigateToOwnerViewSpy).toHaveBeenCalledTimes(1);
        expect(navigateToOwnerViewSpy).toHaveBeenCalledWith(
            component.accountName,
            AccountTabs.FLOWS,
            undefined,
            component.accountFlowsData.activeNav,
            [FlowStatus.Running, FlowStatus.Retrying],
        );
    });

    it("should refresh after an abort only once the delay passes, and not after destroy", fakeAsync(() => {
        vi.spyOn(datasetFlowsService, "cancelFlowRun").mockReturnValue(of(true));
        const refreshNowSpy = vi.spyOn(component, "refreshNow").mockImplementation(() => {});
        component.onAbortFlow({ flowId: MOCK_FLOW_ID, datasetId: mockDatasetMainDataId });

        tick(component.TIMEOUT_REFRESH_FLOW - 1);
        expect(refreshNowSpy).not.toHaveBeenCalled();

        fixture.destroy();
        tick(1);
        expect(refreshNowSpy).not.toHaveBeenCalled();
        discardPeriodicTasks();
    }));
    describe("after back or forward", () => {
        let getAccountListFlowsSpy: Mock<AccountService["getAccountListFlows"]>;

        function lastRequest(): Parameters<AccountService["getAccountListFlows"]>[0] {
            return requireValue(getAccountListFlowsSpy.mock.lastCall)[0];
        }

        beforeEach(() => {
            getAccountListFlowsSpy = vi
                .spyOn(accountService, "getAccountListFlows")
                .mockReturnValue(of(mockFlowsTableData));
            stubMethod(navigationService, "navigateToOwnerView");
        });

        it("should list the status group the URL names", fakeAsync(() => {
            setComponentInput(fixture, "accountFlowsData", {
                ...component.accountFlowsData,
                flowGroup: flowStatusGroup(FlowStatus.Running),
            });
            fixture.detectChanges();
            tick();

            expect(lastRequest().filters.byStatus).toEqual(flowStatusGroup(FlowStatus.Running));
            discardPeriodicTasks();
        }));

        it("should list the page the URL names", fakeAsync(() => {
            pageParam = "3";
            setComponentInput(fixture, "accountFlowsData", { ...component.accountFlowsData });
            fixture.detectChanges();
            tick();

            expect(component.currentPage).toEqual(3);
            expect(lastRequest().page).toEqual(2);
            discardPeriodicTasks();
        }));

        it("should not list again when the URL follows its own status tab change", fakeAsync(() => {
            component.onNavStatusChange({
                activeId: FlowStatus.Finished,
                nextId: FlowStatus.Running,
                preventDefault: () => undefined,
            });
            fixture.detectChanges();
            tick();
            getAccountListFlowsSpy.mockClear();

            setComponentInput(fixture, "accountFlowsData", {
                ...component.accountFlowsData,
                flowGroup: flowStatusGroup(FlowStatus.Running),
            });
            fixture.detectChanges();
            tick();

            expect(getAccountListFlowsSpy).not.toHaveBeenCalled();
            discardPeriodicTasks();
        }));

        it("should keep the status filter chosen in the panel when the URL follows a page change", fakeAsync(() => {
            component.onSearchByFiltersChange({
                accounts: [],
                datasets: [],
                status: [FlowStatus.Retrying],
                onlySystemFlows: false,
            });
            component.onPageChange(2);
            fixture.detectChanges();
            tick();

            pageParam = "2";
            setComponentInput(fixture, "accountFlowsData", { ...component.accountFlowsData });
            fixture.detectChanges();
            tick();

            expect(lastRequest().filters.byStatus).toEqual([FlowStatus.Retrying]);
            expect(lastRequest().page).toEqual(1);
            discardPeriodicTasks();
        }));
    });
});
