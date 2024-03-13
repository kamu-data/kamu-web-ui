import { TileBaseWidgetComponent } from "./components/tile-base-widget/tile-base-widget.component";
import { MatRadioModule } from "@angular/material/radio";
import { PaginationModule } from "./../../../components/pagination-component/pagination.module";
import { ComponentFixture, TestBed, fakeAsync, flush, tick } from "@angular/core/testing";
import { FlowsComponent } from "./flows.component";
import { Apollo } from "apollo-angular";
import { ApolloTestingModule } from "apollo-angular/testing";
import { ActivatedRoute, Router } from "@angular/router";
import { mockDatasetBasicsRootFragment } from "src/app/search/mock.data";
import { ToastrModule } from "ngx-toastr";
import { findElementByDataTestId, routerMock } from "src/app/common/base-test.helpers.spec";
import { DatasetFlowsService } from "./services/dataset-flows.service";
import { of } from "rxjs";
import { MatMenuModule } from "@angular/material/menu";
import { FlowsTableComponent } from "./components/flows-table/flows-table.component";
import { PaginationComponent } from "src/app/components/pagination-component/pagination.component";
import { MatTableModule } from "@angular/material/table";
import { DisplayTimeModule } from "src/app/components/display-time/display-time.module";
import { FormsModule } from "@angular/forms";
import { MatDividerModule } from "@angular/material/divider";
import { MatIconModule } from "@angular/material/icon";
import { AngularSvgIconModule } from "angular-svg-icon";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { NgbPopoverModule } from "@ng-bootstrap/ng-bootstrap";
import { NavigationService } from "src/app/services/navigation.service";
import { DatasetViewTypeEnum } from "../../dataset-view.interface";
import { SettingsTabsEnum } from "../dataset-settings-component/dataset-settings.model";
import { FlowStatus } from "src/app/api/kamu.graphql.interface";
import { FilterByInitiatorEnum } from "./components/flows-table/flows-table.types";

describe("FlowsComponent", () => {
    let component: FlowsComponent;
    let fixture: ComponentFixture<FlowsComponent>;
    let datasetFlowsService: DatasetFlowsService;
    let navigationService: NavigationService;
    const MOCK_PAGE_NUNBER = 1;
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
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(FlowsComponent);
        datasetFlowsService = TestBed.inject(DatasetFlowsService);
        navigationService = TestBed.inject(NavigationService);
        component = fixture.componentInstance;
        component.datasetBasics = mockDatasetBasicsRootFragment;
        spyOn(datasetFlowsService, "allFlowsPaused").and.returnValue(of(false));
        spyOn(datasetFlowsService, "datasetFlowsList").and.returnValue(of());
        spyOnProperty(component, "loadingFlowsList$", "get").and.returnValue(of(true));
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should check page change", () => {
        const onPageChangeEmitSpy = spyOn(component.onPageChangeEmit, "emit");
        component.onPageChange(MOCK_PAGE_NUNBER);
        expect(onPageChangeEmitSpy).toHaveBeenCalledWith(MOCK_PAGE_NUNBER);
    });

    it("should check update settings button", () => {
        const navigateToDatasetViewSpy = spyOn(navigationService, "navigateToDatasetView");
        component.updateSettings();
        expect(navigateToDatasetViewSpy).toHaveBeenCalledWith(
            jasmine.objectContaining({ tab: DatasetViewTypeEnum.Settings, section: SettingsTabsEnum.SCHEDULING }),
        );
    });

    it("should check refresh button", () => {
        const getTileWidgetDataSpy = spyOn(component, "getTileWidgetData");
        const getFlowConnectionDataSpy = spyOn(component, "getFlowConnectionData");
        component.refreshFlow();
        expect(getTileWidgetDataSpy).toHaveBeenCalledTimes(1);
        expect(getFlowConnectionDataSpy).toHaveBeenCalledTimes(1);
    });

    it("should check change filter status", () => {
        const getFlowConnectionDataSpy = spyOn(component, "getFlowConnectionData");
        const changedFlowStatus = FlowStatus.Running;
        component.onChangeFilterByStatus(changedFlowStatus);
        expect(getFlowConnectionDataSpy).toHaveBeenCalledTimes(1);
        expect(component.filterByStatus).toEqual(changedFlowStatus);
    });

    it("should check search by account name", () => {
        const getFlowConnectionDataSpy = spyOn(component, "getFlowConnectionData");
        const mockAccountName = "mockAccountName";
        component.onSearchByAccountName(mockAccountName);
        expect(getFlowConnectionDataSpy).toHaveBeenCalledTimes(1);
        expect(component.searchByAccountName).toEqual(mockAccountName);
    });

    it("should empty block is visible", () => {
        const emptyBlock = findElementByDataTestId(fixture, "empty-flow-runs-block");
        expect(emptyBlock).toBeDefined();
    });

    it("should check toggle state for flow configurations with pause=true", () => {
        const datasetResumeFlowsSpy = spyOn(datasetFlowsService, "datasetResumeFlows").and.returnValue(of());
        const mockPause = true;
        component.toggleStateDatasetFlowConfigs(mockPause);
        expect(datasetResumeFlowsSpy).toHaveBeenCalledTimes(1);
    });

    it("should check toggle state for flow configurations with pause=false", () => {
        const datasetPauseFlowsSpy = spyOn(datasetFlowsService, "datasetPauseFlows").and.returnValue(of());
        const mockPause = false;
        component.toggleStateDatasetFlowConfigs(mockPause);
        expect(datasetPauseFlowsSpy).toHaveBeenCalledTimes(1);
    });

    it("should check change filter by tnitiator", () => {
        const changedFilterByInitiator = FilterByInitiatorEnum.System;
        const getFlowConnectionDataSpy = spyOn(component, "getFlowConnectionData");
        component.onChangeFilterByInitiator(changedFilterByInitiator);
        expect(component.filterByInitiator).toEqual(changedFilterByInitiator);
        expect(getFlowConnectionDataSpy).toHaveBeenCalledTimes(1);
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
        component.onCancelFlow(MOCK_FLOW_ID);
        tick(component.TIMEOUT_REFRESH_FLOW);
        expect(refreshFlowSpy).toHaveBeenCalledTimes(1);
        flush();
    }));
});
