import { ComponentFixture, TestBed, discardPeriodicTasks, fakeAsync, flush, tick } from "@angular/core/testing";
import { AccountFlowsTabComponent } from "./account-flows-tab.component";
import { PaginationComponent } from "src/app/components/pagination-component/pagination.component";
import { ApolloTestingModule } from "apollo-angular/testing";
import { SharedTestModule } from "src/app/common/shared-test.module";
import { ToastrModule } from "ngx-toastr";
import { ActivatedRoute } from "@angular/router";
import { of } from "rxjs";
import { DatasetFlowsService } from "src/app/dataset-view/additional-components/flows-component/services/dataset-flows.service";
import { NavigationService } from "src/app/services/navigation.service";
import { AccountTabs } from "../../account.constants";
import { AccountService } from "src/app/services/account.service";
import { mockDatasetMainDataId } from "src/app/search/mock.data";
import { mockFlowsTableData } from "src/app/api/mock/dataset-flow.mock";
import { findElementByDataTestId } from "src/app/common/base-test.helpers.spec";
import { FlowsTableComponent } from "src/app/common/components/flows-table/flows-table.component";
import { TileBaseWidgetComponent } from "src/app/common/components/tile-base-widget/tile-base-widget.component";

describe("AccountFlowsTabComponent", () => {
    let component: AccountFlowsTabComponent;
    let fixture: ComponentFixture<AccountFlowsTabComponent>;
    let accountService: AccountService;
    let navigationService: NavigationService;
    let datasetFlowsService: DatasetFlowsService;
    const MOCK_FLOW_ID = "1";

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ApolloTestingModule, SharedTestModule, ToastrModule.forRoot()],
            declarations: [AccountFlowsTabComponent, TileBaseWidgetComponent, FlowsTableComponent, PaginationComponent],
            providers: [
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
        component = fixture.componentInstance;
        component.accountName = "mockAccountName";
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should check navigate to owner view with page=1 ", () => {
        const navigateToOwnerViewSpy = spyOn(navigationService, "navigateToOwnerView");
        component.onPageChange(1);
        expect(navigateToOwnerViewSpy).toHaveBeenCalledOnceWith(component.accountName, AccountTabs.FLOWS);
    });

    it("should check navigate to owner view with page>1 ", () => {
        const navigateToOwnerViewSpy = spyOn(navigationService, "navigateToOwnerView");
        component.onPageChange(2);
        expect(navigateToOwnerViewSpy).toHaveBeenCalledOnceWith(component.accountName, AccountTabs.FLOWS, 2);
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
        mockFlowsTableData.connectionData.nodes = [];
        spyOn(accountService, "accountAllFlowsPaused").and.returnValue(of(false));
        spyOn(accountService, "getAccountListFlows").and.returnValue(of(mockFlowsTableData));
        tick();
        fixture.detectChanges();

        const emptyBlock = findElementByDataTestId(fixture, "empty-block");
        expect(emptyBlock).toBeDefined();
        discardPeriodicTasks();
    }));
});
