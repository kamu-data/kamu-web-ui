import { MatRadioModule } from "@angular/material/radio";
import { PaginationModule } from "./../../../components/pagination-component/pagination.module";
import { ComponentFixture, TestBed, discardPeriodicTasks, fakeAsync, flush, tick } from "@angular/core/testing";
import { FlowsComponent } from "./flows.component";
import { Apollo } from "apollo-angular";
import { ApolloTestingModule } from "apollo-angular/testing";
import { ActivatedRoute, Router } from "@angular/router";
import { mockDatasetBasicsRootFragment, mockDatasetMainDataId } from "src/app/search/mock.data";
import { ToastrModule } from "ngx-toastr";
import { findElementByDataTestId, routerMock } from "src/app/common/base-test.helpers.spec";
import { DatasetFlowsService } from "./services/dataset-flows.service";
import { of } from "rxjs";
import { MatMenuModule } from "@angular/material/menu";
import { PaginationComponent } from "src/app/components/pagination-component/pagination.component";
import { MatTableModule } from "@angular/material/table";
import { DisplayTimeModule } from "src/app/components/display-time/display-time.module";
import { FormsModule } from "@angular/forms";
import { MatDividerModule } from "@angular/material/divider";
import { MatIconModule } from "@angular/material/icon";
import { AngularSvgIconModule } from "angular-svg-icon";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { NgbPopoverModule, NgbTypeaheadModule } from "@ng-bootstrap/ng-bootstrap";
import { NavigationService } from "src/app/services/navigation.service";
import { DatasetViewTypeEnum } from "../../dataset-view.interface";
import { SettingsTabsEnum } from "../dataset-settings-component/dataset-settings.model";
import { Account, FlowStatus } from "src/app/api/kamu.graphql.interface";
import { DatasetSubscriptionsService } from "../../dataset.subscriptions.service";
import _ from "lodash";
import { OverviewUpdate } from "../../dataset.subscriptions.interface";
import { mockMetadataDerivedUpdate, mockOverviewDataUpdate } from "../data-tabs.mock";
import { mockAccountByNameResponse } from "src/app/api/mock/account.mock";
import { TileBaseWidgetComponent } from "src/app/common/components/tile-base-widget/tile-base-widget.component";
import { FlowsTableComponent } from "src/app/common/components/flows-table/flows-table.component";
import { FilterByInitiatorEnum } from "src/app/common/components/flows-table/flows-table.types";
import { mockFlowsTableData } from "src/app/api/mock/dataset-flow.mock";

describe("FlowsComponent", () => {
    let component: FlowsComponent;
    let fixture: ComponentFixture<FlowsComponent>;
    let datasetFlowsService: DatasetFlowsService;
    let navigationService: NavigationService;
    let datasetSubsService: DatasetSubscriptionsService;
    const MOCK_FLOW_ID = "2";

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            providers: [
                Apollo,
                { provide: Router, useValue: routerMock },
                {
                    provide: ActivatedRoute,
                    useValue: {
                        snapshot: {
                            queryParamMap: {
                                get: (key: string) => {
                                    switch (key) {
                                        case "tab":
                                            return "flows";
                                        case "page":
                                            return 2;
                                    }
                                },
                            },
                            paramMap: {
                                get: (key: string) => {
                                    switch (key) {
                                        case "accountName":
                                            return "accountName";
                                        case "datasetName":
                                            return "datasetName";
                                    }
                                },
                            },
                        },
                    },
                },
            ],
            declarations: [FlowsComponent, FlowsTableComponent, PaginationComponent, TileBaseWidgetComponent],
            imports: [
                ApolloTestingModule,
                ToastrModule.forRoot(),
                MatMenuModule,
                PaginationModule,
                MatTableModule,
                DisplayTimeModule,
                MatRadioModule,
                FormsModule,
                MatDividerModule,
                MatIconModule,
                AngularSvgIconModule.forRoot(),
                HttpClientTestingModule,
                NgbPopoverModule,
                NgbTypeaheadModule,
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(FlowsComponent);
        datasetFlowsService = TestBed.inject(DatasetFlowsService);
        navigationService = TestBed.inject(NavigationService);
        datasetSubsService = TestBed.inject(DatasetSubscriptionsService);
        component = fixture.componentInstance;
        component.datasetBasics = mockDatasetBasicsRootFragment;
        datasetSubsService.emitOverviewChanged({
            schema: mockMetadataDerivedUpdate.schema,
            content: mockOverviewDataUpdate.content,
            overview: _.cloneDeep(mockOverviewDataUpdate.overview), // clone, as we modify this data in the tests
            size: mockOverviewDataUpdate.size,
        } as OverviewUpdate);
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should check update settings button", () => {
        const navigateToDatasetViewSpy = spyOn(navigationService, "navigateToDatasetView");
        component.updateSettings();
        expect(navigateToDatasetViewSpy).toHaveBeenCalledWith(
            jasmine.objectContaining({ tab: DatasetViewTypeEnum.Settings, section: SettingsTabsEnum.SCHEDULING }),
        );
    });

    it("should check refresh button", () => {
        const getPageFromUrlSpy = spyOn(component, "getPageFromUrl");
        const fetchTableDataSpy = spyOn(component, "fetchTableData");
        component.refreshFlow();
        expect(getPageFromUrlSpy).toHaveBeenCalledTimes(1);
        expect(fetchTableDataSpy).toHaveBeenCalledTimes(1);
    });

    it("should check change filter status", () => {
        const fetchTableDataSpy = spyOn(component, "fetchTableData");
        const changedFlowStatus = FlowStatus.Running;
        component.onChangeFilterByStatus(changedFlowStatus);
        expect(fetchTableDataSpy).toHaveBeenCalledTimes(1);
        expect(component.filterByStatus).toEqual(changedFlowStatus);
    });

    it("should check search by account name", () => {
        const fetchTableDataSpy = spyOn(component, "fetchTableData");
        component.onSearchByAccountName(mockAccountByNameResponse.accounts.byName as Account);
        expect(fetchTableDataSpy).toHaveBeenCalledTimes(1);
        expect(component.searchByAccount).toEqual(mockAccountByNameResponse.accounts.byName as Account);
    });

    it("should empty block is visible", fakeAsync(() => {
        fixture.detectChanges();
        mockFlowsTableData.connectionData.nodes = [];
        spyOn(datasetFlowsService, "allFlowsPaused").and.returnValue(of(false));
        spyOn(datasetFlowsService, "datasetFlowsList").and.returnValue(of(mockFlowsTableData));
        spyOn(datasetFlowsService, "flowsInitiators").and.returnValue(of([]));
        tick();
        fixture.detectChanges();

        const emptyBlock = findElementByDataTestId(fixture, "empty-flow-runs-block");
        expect(emptyBlock).toBeDefined();
        discardPeriodicTasks();
    }));

    it("should check toggle state for flow configurations with pause=true", fakeAsync(() => {
        const datasetResumeFlowsSpy = spyOn(datasetFlowsService, "datasetResumeFlows").and.returnValue(of());
        const mockPause = true;
        const refreshFlowSpy = spyOn(component, "refreshFlow");
        component.toggleStateDatasetFlowConfigs(mockPause);
        expect(datasetResumeFlowsSpy).toHaveBeenCalledTimes(1);
        tick(component.TIMEOUT_REFRESH_FLOW);
        expect(refreshFlowSpy).toHaveBeenCalledTimes(1);
        flush();
    }));

    it("should check toggle state for flow configurations with pause=false", fakeAsync(() => {
        const datasetPauseFlowsSpy = spyOn(datasetFlowsService, "datasetPauseFlows").and.returnValue(of());
        const mockPause = false;
        const refreshFlowSpy = spyOn(component, "refreshFlow");
        component.toggleStateDatasetFlowConfigs(mockPause);
        expect(datasetPauseFlowsSpy).toHaveBeenCalledTimes(1);
        tick(component.TIMEOUT_REFRESH_FLOW);
        expect(refreshFlowSpy).toHaveBeenCalledTimes(1);
        flush();
    }));

    it("should check change filter by tnitiator", () => {
        const changedFilterByInitiator = FilterByInitiatorEnum.System;
        const fetchTableDataSpy = spyOn(component, "fetchTableData");
        component.onChangeFilterByInitiator(changedFilterByInitiator);
        expect(component.filterByInitiator).toEqual(changedFilterByInitiator);
        expect(fetchTableDataSpy).toHaveBeenCalledTimes(1);
    });

    it("should check update now button", fakeAsync(() => {
        const refreshFlowSpy = spyOn(component, "refreshFlow");
        spyOn(datasetFlowsService, "datasetTriggerFlow").and.returnValue(of(true));
        component.updateNow();
        tick(component.TIMEOUT_REFRESH_FLOW);
        expect(refreshFlowSpy).toHaveBeenCalledTimes(1);
        flush();
    }));

    it("should check cancel flow button", fakeAsync(() => {
        const refreshFlowSpy = spyOn(component, "refreshFlow");
        spyOn(datasetFlowsService, "cancelScheduledTasks").and.returnValue(of(true));
        component.onCancelFlow({ flowId: MOCK_FLOW_ID, datasetId: mockDatasetMainDataId });
        tick(component.TIMEOUT_REFRESH_FLOW);
        expect(refreshFlowSpy).toHaveBeenCalledTimes(1);
        flush();
    }));

    it("should check navigate to AddPollingSource", () => {
        const navigateToAddPollingSourceSpy = spyOn(navigationService, "navigateToAddPollingSource");
        component.navigateToAddPollingSource();
        expect(navigateToAddPollingSourceSpy).toHaveBeenCalledOnceWith({
            accountName: component.datasetBasics.owner.accountName,
            datasetName: component.datasetBasics.name,
        });
    });

    it("should check navigate to SetTransform", () => {
        const navigateToSetTransformSpy = spyOn(navigationService, "navigateToSetTransform");
        component.navigateToSetTransform();
        expect(navigateToSetTransformSpy).toHaveBeenCalledOnceWith({
            accountName: component.datasetBasics.owner.accountName,
            datasetName: component.datasetBasics.name,
        });
    });

    it("should check navigate when page equal 1 ", () => {
        const page = 1;
        const navigateToDatasetViewSpy = spyOn(navigationService, "navigateToDatasetView");
        component.onPageChange(page);
        expect(navigateToDatasetViewSpy).toHaveBeenCalledOnceWith({
            accountName: component.datasetBasics.owner.accountName,
            datasetName: component.datasetBasics.name,
            tab: DatasetViewTypeEnum.Flows,
        });
    });

    it("should check navigate when page > 1 ", () => {
        const page = 2;
        const navigateToDatasetViewSpy = spyOn(navigationService, "navigateToDatasetView");
        component.onPageChange(page);
        expect(navigateToDatasetViewSpy).toHaveBeenCalledOnceWith({
            accountName: component.datasetBasics.owner.accountName,
            datasetName: component.datasetBasics.name,
            tab: DatasetViewTypeEnum.Flows,
            page,
        });
    });
});
