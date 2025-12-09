/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed, discardPeriodicTasks, fakeAsync, flush, tick } from "@angular/core/testing";
import { FlowsComponent } from "./flows.component";
import { Apollo } from "apollo-angular";
import { ActivatedRoute } from "@angular/router";
import {
    mockDatasetBasicsRootFragment,
    mockDatasetMainDataId,
    mockFullPowerDatasetPermissionsFragment,
} from "src/app/search/mock.data";
import { provideToastr } from "ngx-toastr";
import { findElementByDataTestId, registerMatSvgIcons } from "src/app/common/helpers/base-test.helpers.spec";
import { DatasetFlowsService } from "./services/dataset-flows.service";
import { delay, of } from "rxjs";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { NavigationService } from "src/app/services/navigation.service";
import { DatasetViewTypeEnum } from "../../dataset-view.interface";
import { mockOverviewUpdate } from "../data-tabs.mock";
import { mockDatasetFlowsProcessesQuery, mockFlowsTableData } from "src/app/api/mock/dataset-flow.mock";
import { SettingsTabsEnum } from "../dataset-settings-component/dataset-settings.model";
import { mockDatasetBasicsDerivedFragment } from "src/app/search/mock.data";
import { DatasetFlowProcesses, FlowProcessEffectiveState, FlowStatus } from "src/app/api/kamu.graphql.interface";
import { ModalArgumentsInterface } from "src/app/interface/modal.interface";
import { ModalService } from "src/app/common/components/modal/modal.service";
import { FlowsSelectionStateService } from "./services/flows-selection-state.service";
import { DatasetWebhooksService } from "../dataset-settings-component/tabs/webhooks/service/dataset-webhooks.service";
import AppValues from "src/app/common/values/app.values";
import { MatChipListboxChange } from "@angular/material/chips";
import { mockAccountDetails } from "src/app/api/mock/auth.mock";
import { mockDatasets } from "src/app/dataset-flow/flows-table/flows-table.helpers.mock";
import { ProcessDatasetCardInteractionService } from "src/app/services/process-dataset-card-interaction.service";

describe("FlowsComponent", () => {
    let component: FlowsComponent;
    let fixture: ComponentFixture<FlowsComponent>;
    let datasetFlowsService: DatasetFlowsService;
    let navigationService: NavigationService;
    let flowsService: DatasetFlowsService;
    let modalService: ModalService;
    let datasetWebhooksService: DatasetWebhooksService;
    let datasetCardService: ProcessDatasetCardInteractionService;

    const MOCK_FLOW_ID = "2";

    beforeEach(async () => {
        await TestBed.configureTestingModule({
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
            imports: [HttpClientTestingModule, FlowsComponent],
        }).compileComponents();

        registerMatSvgIcons();

        fixture = TestBed.createComponent(FlowsComponent);
        datasetFlowsService = TestBed.inject(DatasetFlowsService);
        navigationService = TestBed.inject(NavigationService);
        flowsService = TestBed.inject(DatasetFlowsService);
        modalService = TestBed.inject(ModalService);
        datasetWebhooksService = TestBed.inject(DatasetWebhooksService);
        datasetCardService = TestBed.inject(ProcessDatasetCardInteractionService);

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
        const fetchTableDataSpy = spyOn(component, "fetchTableData");
        component.refreshFlow();
        expect(fetchTableDataSpy).toHaveBeenCalledTimes(1);
    });

    it("should empty block is visible", fakeAsync(() => {
        fixture.detectChanges();
        mockFlowsTableData.connectionDataForWidget.nodes = [];
        spyOn(datasetFlowsService, "datasetFlowsList").and.returnValue(of(mockFlowsTableData));
        spyOn(datasetFlowsService, "flowsInitiators").and.returnValue(of([]));
        spyOn(datasetFlowsService, "datasetFlowsProcesses").and.returnValue(
            of(mockDatasetFlowsProcessesQuery.datasets.byId?.flows.processes as DatasetFlowProcesses),
        );
        tick();
        fixture.detectChanges();

        const emptyBlock = findElementByDataTestId(fixture, "empty-flow-runs-block");
        expect(emptyBlock).toBeDefined();
        discardPeriodicTasks();
    }));

    it("should check update now button for root dataset", fakeAsync(() => {
        const refreshFlowSpy = spyOn(component, "refreshFlow");
        spyOn(datasetFlowsService, "datasetTriggerIngestFlow").and.returnValue(of(true));
        component.updateNow();
        tick(component.TIMEOUT_REFRESH_FLOW);
        expect(refreshFlowSpy).toHaveBeenCalledTimes(1);
        flush();
    }));

    it("should check update now button for derivative dataset", fakeAsync(() => {
        component.flowsData = {
            datasetBasics: mockDatasetBasicsDerivedFragment,
            datasetPermissions: mockFullPowerDatasetPermissionsFragment,
            overviewUpdate: mockOverviewUpdate,
        };
        const refreshFlowSpy = spyOn(component, "refreshFlow");
        spyOn(datasetFlowsService, "datasetTriggerTransformFlow").and.returnValue(of(true));
        component.updateNow();
        tick(component.TIMEOUT_REFRESH_FLOW);
        expect(refreshFlowSpy).toHaveBeenCalledTimes(1);
        flush();
    }));

    it(`should check toggle state for dataset flow when state=${FlowProcessEffectiveState.Active}`, () => {
        const handleToggleStateSpy = spyOn(datasetCardService, "handleToggleState");
        component.toggleStateDatasetFlowConfigs({
            state: FlowProcessEffectiveState.Active,
            datasetBasics: mockDatasetBasicsRootFragment,
        });
        expect(handleToggleStateSpy).toHaveBeenCalledTimes(1);
    });

    it(`should check toggle state for dataset flow when state=${FlowProcessEffectiveState.StoppedAuto}`, fakeAsync(() => {
        const refreshFlowSpy = spyOn(component, "refreshFlow");
        const modalServiceSpy = spyOn(modalService, "error").and.callFake((options: ModalArgumentsInterface) => {
            options.handler?.call(undefined, true);
            return Promise.resolve("");
        });
        const datasetResumeFlowsSpy = spyOn(flowsService, "datasetResumeFlows").and.returnValue(of(void 0));
        component.toggleStateDatasetFlowConfigs({
            state: FlowProcessEffectiveState.StoppedAuto,
            datasetBasics: mockDatasetBasicsRootFragment,
        });
        tick(component.TIMEOUT_REFRESH_FLOW);
        expect(modalServiceSpy).toHaveBeenCalledTimes(1);
        expect(refreshFlowSpy).toHaveBeenCalledTimes(1);
        expect(datasetResumeFlowsSpy).toHaveBeenCalledTimes(1);
        flush();
    }));

    it(`should check toggle state for dataset flow when state=${FlowProcessEffectiveState.Failing}`, fakeAsync(() => {
        const refreshFlowSpy = spyOn(component, "refreshFlow");
        const datasetPauseFlowsSpy = spyOn(flowsService, "datasetPauseFlows").and.returnValue(of(void 0));
        component.toggleStateDatasetFlowConfigs({
            state: FlowProcessEffectiveState.Failing,
            datasetBasics: mockDatasetBasicsRootFragment,
        });
        tick(component.TIMEOUT_REFRESH_FLOW);
        expect(datasetPauseFlowsSpy).toHaveBeenCalledTimes(1);
        expect(refreshFlowSpy).toHaveBeenCalledTimes(1);
        flush();
    }));

    it("should check abort flow button", fakeAsync(() => {
        const refreshFlowSpy = spyOn(component, "refreshFlow");
        spyOn(datasetFlowsService, "cancelFlowRun").and.returnValue(of(true));
        component.onAbortFlow({ flowId: MOCK_FLOW_ID, datasetId: mockDatasetMainDataId });
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
            category: "all",
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
            category: "all",
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
        spyOn(datasetFlowsService, "datasetFlowsProcesses").and.returnValue(
            of(mockDatasetFlowsProcessesQuery.datasets.byId?.flows.processes as DatasetFlowProcesses),
        );
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

    it("should check 'update now' link for root dataset with PollingSource", fakeAsync(() => {
        fixture.detectChanges();
        mockFlowsTableData.connectionDataForWidget.nodes = [];
        mockFlowsTableData.connectionDataForTable.nodes = [];
        spyOn(datasetFlowsService, "datasetFlowsProcesses").and.returnValue(
            of(mockDatasetFlowsProcessesQuery.datasets.byId?.flows.processes as DatasetFlowProcesses),
        );
        spyOn(datasetFlowsService, "datasetFlowsList").and.returnValue(of(mockFlowsTableData).pipe(delay(10)));
        spyOn(datasetFlowsService, "flowsInitiators").and.returnValue(of([]));
        tick(10);
        fixture.detectChanges();
        const updateNowClickSpy = spyOn(component, "updateNow");
        const updateNowLink = findElementByDataTestId(fixture, "update-now-link");
        expect(updateNowLink).toBeDefined();
        updateNowLink?.click();
        expect(updateNowClickSpy).toHaveBeenCalledTimes(1);
        discardPeriodicTasks();
    }));

    it("should check 'update now' link for derivative dataset with SetTransform", fakeAsync(() => {
        const copyMockOverviewUpdate = structuredClone(mockOverviewUpdate);
        copyMockOverviewUpdate.overview.metadata.currentPollingSource = null;
        copyMockOverviewUpdate.overview.metadata.currentTransform = {
            __typename: "SetTransform",
        };
        component.flowsData = {
            datasetBasics: mockDatasetBasicsDerivedFragment,
            datasetPermissions: mockFullPowerDatasetPermissionsFragment,
            overviewUpdate: copyMockOverviewUpdate,
        };
        fixture.detectChanges();
        mockFlowsTableData.connectionDataForWidget.nodes = [];
        mockFlowsTableData.connectionDataForTable.nodes = [];
        spyOn(datasetFlowsService, "datasetFlowsProcesses").and.returnValue(
            of(mockDatasetFlowsProcessesQuery.datasets.byId?.flows.processes as DatasetFlowProcesses),
        );
        spyOn(datasetFlowsService, "datasetFlowsList").and.returnValue(of(mockFlowsTableData).pipe(delay(10)));
        spyOn(datasetFlowsService, "flowsInitiators").and.returnValue(of([]));
        tick(10);
        fixture.detectChanges();
        const updateNowClickSpy = spyOn(component, "updateNow");
        const updateNowLink = findElementByDataTestId(fixture, "update-now-link");
        expect(updateNowLink).toBeDefined();
        updateNowLink?.click();
        expect(updateNowClickSpy).toHaveBeenCalledTimes(1);
        discardPeriodicTasks();
    }));

    it("should check to show panel buttons init filter with webhook ids", () => {
        const serviceInComponent = fixture.debugElement.injector.get(FlowsSelectionStateService);
        const addWebhookIdSpy = spyOn(serviceInComponent, "addWebhookId");
        const mockWebhookId = "d20a935e-0ccb-4844-b1bb-f4b5b9b0279a,d20a935e-0ccb-4844-b1bb-f4b5b9b0279b";
        component.setWebhookId = mockWebhookId;
        expect(addWebhookIdSpy).toHaveBeenCalledTimes(2);
    });

    it("should check to show panel buttons init filter without webhook id", () => {
        const serviceInComponent = fixture.debugElement.injector.get(FlowsSelectionStateService);
        const addWebhookIdSpy = spyOn(serviceInComponent, "addWebhookId");
        const mockWebhookId = null;
        component.setWebhookId = mockWebhookId;
        expect(addWebhookIdSpy).not.toHaveBeenCalled();
    });

    it("should check to show panel buttons init webhook filter buttons without states", () => {
        const serviceInComponent = fixture.debugElement.injector.get(FlowsSelectionStateService);
        const setWebhooksCategorySpy = spyOn(serviceInComponent, "setWebhooksCategory");
        const mockStates = null;
        component.setWebhookState = mockStates;
        expect(setWebhooksCategorySpy).not.toHaveBeenCalled();
    });

    it("should check to show panel buttons init webhook filter buttons with states", () => {
        const serviceInComponent = fixture.debugElement.injector.get(FlowsSelectionStateService);
        const setWebhooksCategorySpy = spyOn(serviceInComponent, "setWebhooksCategory");
        const mockStates = `${FlowProcessEffectiveState.Active},${FlowProcessEffectiveState.Failing}`;
        component.setWebhookState = mockStates;
        expect(setWebhooksCategorySpy).toHaveBeenCalledTimes(1);
    });

    it("should check to show panel buttons init webhooks category", () => {
        const serviceInComponent = fixture.debugElement.injector.get(FlowsSelectionStateService);
        const setWebhooksCategorySpy = spyOn(serviceInComponent, "setWebhooksCategory");
        const category = "webhooks";
        component.setFlowsCategory = category;
        expect(setWebhooksCategorySpy).toHaveBeenCalledTimes(1);
    });

    it("should check to show panel buttons init flows category", () => {
        const serviceInComponent = fixture.debugElement.injector.get(FlowsSelectionStateService);
        const setFlowsCategorySpy = spyOn(serviceInComponent, "setFlowsCategory");
        const category = "updates";
        component.setFlowsCategory = category;
        expect(setFlowsCategorySpy).toHaveBeenCalledTimes(1);
    });

    it("should check has push sources", () => {
        fixture.detectChanges();
        expect(component.hasPushSources).toEqual(false);
    });

    it("should check to show panel buttons", () => {
        fixture.detectChanges();
        expect(component.showPanelButtons).toEqual(true);
    });

    it("should check to navigate to webhook settings", () => {
        const mockSubscriptionId = "1234-4444-43222";
        const navigateToWebhooksSpy = spyOn(navigationService, "navigateToWebhooks");
        component.navigateToWebhookSettings(mockSubscriptionId);
        expect(navigateToWebhooksSpy).toHaveBeenCalledWith(
            jasmine.objectContaining({
                tab: mockSubscriptionId,
            }),
        );
    });

    it("should check to navigate to subscription", () => {
        const processes = mockDatasetFlowsProcessesQuery.datasets.byId?.flows.processes as DatasetFlowProcesses;
        const navigateToDatasetViewSpy = spyOn(navigationService, "navigateToDatasetView");
        component.navigateToSubscription(processes.webhooks.subprocesses[0]);
        expect(navigateToDatasetViewSpy).toHaveBeenCalledTimes(1);
    });

    it("should check pause webhook", fakeAsync(() => {
        const mockSubscriptionId = "1234-4444-43222";
        const refreshFlowSpy = spyOn(component, "refreshFlow");
        const datasetWebhookPauseSubscriptionSpy = spyOn(
            datasetWebhooksService,
            "datasetWebhookPauseSubscription",
        ).and.returnValue(of(true));
        component.pauseWebhook(mockSubscriptionId);
        expect(datasetWebhookPauseSubscriptionSpy).toHaveBeenCalledTimes(1);
        tick(AppValues.SIMULATION_UPDATE_WEBHOOK_STATUS_DELAY_MS);
        expect(refreshFlowSpy).toHaveBeenCalledTimes(1);
        flush();
    }));

    it("should check resume webhook", fakeAsync(() => {
        const mockSubscriptionId = "1234-4444-43222";
        const refreshFlowSpy = spyOn(component, "refreshFlow");
        const datasetWebhookResumeSubscriptionSpy = spyOn(
            datasetWebhooksService,
            "datasetWebhookResumeSubscription",
        ).and.returnValue(of(true));
        component.resumeWebhook(mockSubscriptionId);
        expect(datasetWebhookResumeSubscriptionSpy).toHaveBeenCalledTimes(1);
        tick(AppValues.SIMULATION_UPDATE_WEBHOOK_STATUS_DELAY_MS);
        expect(refreshFlowSpy).toHaveBeenCalledTimes(1);
    }));

    it("should check kind of dataset", () => {
        fixture.detectChanges();
        expect(component.isRoot).toEqual(true);
    });

    it("should check remove selected webhook", () => {
        const processes = mockDatasetFlowsProcessesQuery.datasets.byId?.flows.processes as DatasetFlowProcesses;
        const navigateToDatasetViewSpy = spyOn(navigationService, "navigateToDatasetView");
        component.removeSelectedWebhook("qwer", processes.webhooks.subprocesses);
        expect(navigateToDatasetViewSpy).toHaveBeenCalledWith(
            jasmine.objectContaining({
                webhookId: [],
            }),
        );
    });

    it("should check toggle webhook filter if states not exist", () => {
        const processes = mockDatasetFlowsProcessesQuery.datasets.byId?.flows.processes as DatasetFlowProcesses;
        const navigateToDatasetViewSpy = spyOn(navigationService, "navigateToDatasetView");
        component.onToggleWebhookFilter([FlowProcessEffectiveState.Active], processes.webhooks.subprocesses);
        expect(navigateToDatasetViewSpy).toHaveBeenCalledWith(
            jasmine.objectContaining({
                webhooksState: [FlowProcessEffectiveState.Active],
            }),
        );
    });

    it("should check toggle webhook filter if states  exist", () => {
        const processes = mockDatasetFlowsProcessesQuery.datasets.byId?.flows.processes as DatasetFlowProcesses;
        const navigateToDatasetViewSpy = spyOn(navigationService, "navigateToDatasetView");
        component.onToggleWebhookFilter([], processes.webhooks.subprocesses);
        expect(navigateToDatasetViewSpy).toHaveBeenCalledWith(
            jasmine.objectContaining({
                webhooksState: undefined,
            }),
        );
    });

    it("should check selection `Webhooks` chip", () => {
        const navigateToDatasetViewSpy = spyOn(navigationService, "navigateToDatasetView");
        component.onSelectionWebhooksChange("webhooks");
        expect(navigateToDatasetViewSpy).toHaveBeenCalledWith(
            jasmine.objectContaining({
                category: "webhooks",
            }),
        );
    });

    it("should check selection `Flows`chips", () => {
        const mockEvent = { value: "updates" } as unknown as MatChipListboxChange;
        const navigateToDatasetViewSpy = spyOn(navigationService, "navigateToDatasetView");
        component.onSelectionFlowsChange(mockEvent);
        expect(navigateToDatasetViewSpy).toHaveBeenCalledWith(
            jasmine.objectContaining({
                category: "updates",
            }),
        );
    });

    // TODO
    // eslint-disable-next-line jasmine/no-disabled-tests
    xit("should check set ProcessTypeFilter with webhookId", fakeAsync(() => {
        const mockWebhookId = "d20a935e-0ccb-4844-b1bb-f4b5b9b0279a,d20a935e-0ccb-4844-b1bb-f4b5b9b0279b";
        component.setWebhookId = mockWebhookId;
        fixture.detectChanges();
        const serviceInComponent = fixture.debugElement.injector.get(FlowsSelectionStateService);
        const clearFlowsCategorySpy = spyOn(serviceInComponent, "clearFlowsCategory");
        spyOn(datasetFlowsService, "datasetFlowsProcesses").and.returnValue(
            of(mockDatasetFlowsProcessesQuery.datasets.byId?.flows.processes as DatasetFlowProcesses),
        );
        spyOn(datasetFlowsService, "datasetFlowsList").and.returnValue(of(mockFlowsTableData).pipe(delay(10)));
        spyOn(datasetFlowsService, "flowsInitiators").and.returnValue(of([]));
        tick(10);
        fixture.detectChanges();

        expect(clearFlowsCategorySpy).toHaveBeenCalledTimes(1);
        discardPeriodicTasks();
    }));

    // TODO
    // eslint-disable-next-line jasmine/no-disabled-tests
    xit("should check set ProcessTypeFilter with `webhooks` category", fakeAsync(() => {
        const serviceInComponent = fixture.debugElement.injector.get(FlowsSelectionStateService);
        const setWebhooksCategorySpy = spyOn(serviceInComponent, "setWebhooksCategory");
        const mockStates = `${FlowProcessEffectiveState.Active},${FlowProcessEffectiveState.Failing}`;
        component.setWebhookState = mockStates;

        spyOn(datasetFlowsService, "datasetFlowsProcesses").and.returnValue(
            of(mockDatasetFlowsProcessesQuery.datasets.byId?.flows.processes as DatasetFlowProcesses),
        );
        spyOn(datasetFlowsService, "datasetFlowsList").and.returnValue(of(mockFlowsTableData).pipe(delay(10)));
        spyOn(datasetFlowsService, "flowsInitiators").and.returnValue(of([mockAccountDetails]));
        tick(10);
        fixture.detectChanges();

        expect(setWebhooksCategorySpy).toHaveBeenCalledTimes(1);
        flush();
    }));

    it("should check set SearchByFilters", () => {
        component.onSearchByFiltersChange(null);
        expect(component.searchByAccount).toEqual([]);
        const filters = {
            accounts: [mockAccountDetails],
            datasets: mockDatasets,
            status: [FlowStatus.Finished],
            onlySystemFlows: false,
        };
        component.onSearchByFiltersChange(filters);
        expect(component.searchByAccount).toEqual(filters.accounts);
    });

    it("should check to reset filters", () => {
        component.selectedDatasetItems = [mockDatasetBasicsRootFragment];
        component.selectedAccountItems = [mockAccountDetails];
        component.selectedStatusItems = [{ id: "FINISHED", status: FlowStatus.Finished }];
        component.onResetFilters();
        expect(component.selectedDatasetItems).toEqual([]);
        expect(component.selectedAccountItems).toEqual([]);
        expect(component.selectedStatusItems).toEqual([]);
    });
});
