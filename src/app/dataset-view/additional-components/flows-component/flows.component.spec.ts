/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { MatRadioModule } from "@angular/material/radio";
import { PaginationModule } from "../../../common/components/pagination-component/pagination.module";
import { ComponentFixture, TestBed, discardPeriodicTasks, fakeAsync, flush, tick } from "@angular/core/testing";
import { FlowsComponent } from "./flows.component";
import { Apollo } from "apollo-angular";
import { ApolloTestingModule } from "apollo-angular/testing";
import { ActivatedRoute, RouterModule } from "@angular/router";
import {
    mockDatasetBasicsRootFragment,
    mockDatasetMainDataId,
    mockFullPowerDatasetPermissionsFragment,
} from "src/app/search/mock.data";
import { ToastrModule } from "ngx-toastr";
import { findElementByDataTestId, registerMatSvgIcons } from "src/app/common/helpers/base-test.helpers.spec";
import { DatasetFlowsService } from "./services/dataset-flows.service";
import { delay, of } from "rxjs";
import { MatMenuModule } from "@angular/material/menu";
import { PaginationComponent } from "src/app/common/components/pagination-component/pagination.component";
import { MatTableModule } from "@angular/material/table";
import { DisplayTimeModule } from "src/app/common/components/display-time/display-time.module";
import { FormsModule } from "@angular/forms";
import { MatDividerModule } from "@angular/material/divider";
import { MatIconModule } from "@angular/material/icon";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { NgbPaginationModule, NgbPopoverModule, NgbTypeaheadModule } from "@ng-bootstrap/ng-bootstrap";
import { NavigationService } from "src/app/services/navigation.service";
import { DatasetViewTypeEnum } from "../../dataset-view.interface";
import { mockOverviewUpdate } from "../data-tabs.mock";
import { FlowsTableComponent } from "src/app/dataset-flow/flows-table/flows-table.component";
import { mockFlowsTableData } from "src/app/api/mock/dataset-flow.mock";
import { TileBaseWidgetComponent } from "src/app/dataset-flow/tile-base-widget/tile-base-widget.component";
import { SettingsTabsEnum } from "../dataset-settings-component/dataset-settings.model";
import { mockDatasetBasicsDerivedFragment } from "src/app/search/mock.data";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { AngularMultiSelectModule } from "angular2-multiselect-dropdown";

describe("FlowsComponent", () => {
    let component: FlowsComponent;
    let fixture: ComponentFixture<FlowsComponent>;
    let datasetFlowsService: DatasetFlowsService;
    let navigationService: NavigationService;
    const MOCK_FLOW_ID = "2";

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            providers: [
                Apollo,
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
                HttpClientTestingModule,
                NgbPopoverModule,
                NgbTypeaheadModule,
                NgbPaginationModule,
                RouterModule,
                MatProgressBarModule,
                AngularMultiSelectModule,
            ],
        }).compileComponents();

        registerMatSvgIcons();

        fixture = TestBed.createComponent(FlowsComponent);
        datasetFlowsService = TestBed.inject(DatasetFlowsService);
        navigationService = TestBed.inject(NavigationService);
        component = fixture.componentInstance;
        component.flowsData = {
            datasetBasics: mockDatasetBasicsRootFragment,
            datasetPermissions: mockFullPowerDatasetPermissionsFragment,
            overviewUpdate: mockOverviewUpdate,
        };
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should check refresh button", () => {
        const getPageFromUrlSpy = spyOn(component, "getPageFromUrl");
        const fetchTableDataSpy = spyOn(component, "fetchTableData");
        component.refreshFlow();
        expect(getPageFromUrlSpy).toHaveBeenCalledTimes(1);
        expect(fetchTableDataSpy).toHaveBeenCalledTimes(1);
    });

    it("should empty block is visible", fakeAsync(() => {
        fixture.detectChanges();
        mockFlowsTableData.connectionDataForWidget.nodes = [];
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

    it("should check navigate when page equal 1 ", () => {
        const page = 1;
        const navigateToDatasetViewSpy = spyOn(navigationService, "navigateToDatasetView");
        component.onPageChange(page);
        expect(navigateToDatasetViewSpy).toHaveBeenCalledOnceWith({
            accountName: component.flowsData.datasetBasics.owner.accountName,
            datasetName: component.flowsData.datasetBasics.name,
            tab: DatasetViewTypeEnum.Flows,
        });
    });

    it("should check navigate when page > 1 ", () => {
        const page = 2;
        const navigateToDatasetViewSpy = spyOn(navigationService, "navigateToDatasetView");
        component.onPageChange(page);
        expect(navigateToDatasetViewSpy).toHaveBeenCalledOnceWith({
            accountName: component.flowsData.datasetBasics.owner.accountName,
            datasetName: component.flowsData.datasetBasics.name,
            tab: DatasetViewTypeEnum.Flows,
            page,
        });
    });

    it("should check redirect section", () => {
        expect(component.redirectSection).toEqual(SettingsTabsEnum.SCHEDULING);

        component.flowsData.datasetBasics = mockDatasetBasicsDerivedFragment;
        expect(component.redirectSection).toEqual(SettingsTabsEnum.TRANSFORM_SETTINGS);
    });

    it("should check init loading block", fakeAsync(() => {
        fixture.detectChanges();
        mockFlowsTableData.connectionDataForWidget.nodes = [];
        spyOn(datasetFlowsService, "allFlowsPaused").and.returnValue(of(false));
        spyOn(datasetFlowsService, "datasetFlowsList").and.returnValue(of(mockFlowsTableData).pipe(delay(10)));
        spyOn(datasetFlowsService, "flowsInitiators").and.returnValue(of([]));
        tick(5);
        fixture.detectChanges();
        const progressBarBefore = findElementByDataTestId(fixture, "init-progress-bar");
        expect(progressBarBefore).toBeDefined();

        tick(10);
        fixture.detectChanges();
        const progressBarAfter = findElementByDataTestId(fixture, "init-progress-bar");
        expect(progressBarAfter).toBeUndefined();
        discardPeriodicTasks();
    }));
});
