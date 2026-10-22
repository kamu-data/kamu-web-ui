/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestbedHarnessEnvironment } from "@angular/cdk/testing/testbed";
import { provideHttpClient } from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { ComponentFixture, discardPeriodicTasks, fakeAsync, flush, TestBed, tick } from "@angular/core/testing";
import { MatChipListboxChange } from "@angular/material/chips";
import { ActivatedRoute } from "@angular/router";

import { delay, of, Subject, throwError } from "rxjs";

import { Apollo } from "apollo-angular";
import { provideToastr } from "ngx-toastr";

import { ModalService } from "@common/components/modal/modal.service";
import { registerMatSvgIcons } from "@common/helpers/base-test.helpers.spec";
import RoutingResolvers from "@common/resolvers/routing-resolvers";
import AppValues from "@common/values/app.values";
import {
    DatasetFlowProcesses,
    DatasetFlowType,
    FlowProcessEffectiveState,
    FlowStatus,
} from "@api/kamu.graphql.interface";
import { mockAccountDetails } from "@api/mock/auth.mock";
import { mockDatasetFlowsProcessesQuery, mockFlowsTableData } from "@api/mock/dataset-flow.mock";
import { ModalArgumentsInterface } from "@interface/modal.interface";

import { mockDatasets } from "src/app/dataset-flow/flows-table/flows-table.helpers.mock";
import { FlowsTableData } from "src/app/dataset-flow/flows-table/flows-table.types";
import { mockOverviewUpdate } from "src/app/dataset-view/additional-components/data-tabs.mock";
import { SettingsTabsEnum } from "src/app/dataset-view/additional-components/dataset-settings-component/dataset-settings.model";
import { DatasetWebhooksService } from "src/app/dataset-view/additional-components/dataset-settings-component/tabs/webhooks/service/dataset-webhooks.service";
import { FlowsComponent } from "src/app/dataset-view/additional-components/flows-component/flows.component";
import { FlowsHarness } from "src/app/dataset-view/additional-components/flows-component/flows.harness";
import { DatasetFlowsService } from "src/app/dataset-view/additional-components/flows-component/services/dataset-flows.service";
import { FlowsSelectionStateService } from "src/app/dataset-view/additional-components/flows-component/services/flows-selection-state.service";
import { DatasetViewTypeEnum } from "src/app/dataset-view/dataset-view.interface";
import { DatasetFlowProcessCardHarness } from "src/app/flow-cards/dataset-flow-process-card/dataset-flow-process-card.harness";
import ProjectLinks from "src/app/project-links";
import {
    mockDatasetBasicsDerivedFragment,
    mockDatasetBasicsRootFragment,
    mockDatasetMainDataId,
    mockFullPowerDatasetPermissionsFragment,
} from "src/app/search/mock.data";
import { NavigationService } from "src/app/services/navigation.service";
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

    // A copy, since `mockFlowsTableData` shares its connections with other fixtures
    function flowsTableDataWithoutRuns(): FlowsTableData {
        const data = structuredClone(mockFlowsTableData);
        data.connectionDataForWidget.nodes = [];
        data.connectionDataForTable.nodes = [];
        return data;
    }

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [FlowsComponent],
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
                provideHttpClient(),
                provideHttpClientTesting(),
            ],
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

    it("should show the empty block when there are no flow runs", fakeAsync(async () => {
        spyOn(datasetFlowsService, "datasetFlowsList").and.returnValue(of(flowsTableDataWithoutRuns()));
        spyOn(datasetFlowsService, "flowsInitiators").and.returnValue(of([]));
        spyOn(datasetFlowsService, "datasetFlowsProcesses").and.returnValue(
            of(mockDatasetFlowsProcessesQuery.datasets.byId?.flows.processes as DatasetFlowProcesses),
        );
        // The first poll runs on an interval, which the harness's own flush skips
        fixture.detectChanges();
        tick();
        const flows = await TestbedHarnessEnvironment.harnessForFixture(fixture, FlowsHarness);

        expect(await flows.isEmptyFlowRunsBlockVisible()).toBeTrue();
        discardPeriodicTasks();
    }));

    it("should check filter by status during the first request", fakeAsync(() => {
        fixture.detectChanges();
        const datasetFlowsListSpy = spyOn(datasetFlowsService, "datasetFlowsList").and.returnValue(
            of(flowsTableDataWithoutRuns()),
        );
        spyOn(datasetFlowsService, "flowsInitiators").and.returnValue(of([]));
        spyOn(datasetFlowsService, "datasetFlowsProcesses").and.returnValue(
            of(mockDatasetFlowsProcessesQuery.datasets.byId?.flows.processes as DatasetFlowProcesses),
        );
        tick();
        fixture.detectChanges();

        expect(datasetFlowsListSpy).toHaveBeenCalledWith(
            jasmine.objectContaining({
                filters: {
                    byStatus: null,
                    byInitiator: null,
                    byProcessType: null,
                },
            }),
        );
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
        const handleToggleStateSpy = spyOn(datasetCardService, "handleToggleState").and.returnValue(of(void 0));
        component.toggleStateDatasetFlowConfigs({
            state: FlowProcessEffectiveState.Active,
            datasetBasics: mockDatasetBasicsRootFragment,
        });
        expect(handleToggleStateSpy).toHaveBeenCalledOnceWith({
            state: FlowProcessEffectiveState.Active,
            datasetBasics: mockDatasetBasicsRootFragment,
        });
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

    it("should show the init loading block until the flow runs arrive", fakeAsync(async () => {
        const flowsList$ = new Subject<FlowsTableData>();
        spyOn(datasetFlowsService, "datasetFlowsProcesses").and.returnValue(
            of(mockDatasetFlowsProcessesQuery.datasets.byId?.flows.processes as DatasetFlowProcesses),
        );
        spyOn(datasetFlowsService, "datasetFlowsList").and.returnValue(flowsList$);
        spyOn(datasetFlowsService, "flowsInitiators").and.returnValue(of([]));
        fixture.detectChanges();
        tick();
        const flows = await TestbedHarnessEnvironment.harnessForFixture(fixture, FlowsHarness);
        expect(await flows.isInitProgressBarVisible()).toBeTrue();

        flowsList$.next(flowsTableDataWithoutRuns());
        expect(await flows.isInitProgressBarVisible()).toBeFalse();
        discardPeriodicTasks();
    }));

    it("should check 'update now' link for root dataset with PollingSource", fakeAsync(async () => {
        spyOn(datasetFlowsService, "datasetFlowsProcesses").and.returnValue(
            of(mockDatasetFlowsProcessesQuery.datasets.byId?.flows.processes as DatasetFlowProcesses),
        );
        spyOn(datasetFlowsService, "datasetFlowsList").and.returnValue(of(flowsTableDataWithoutRuns()));
        spyOn(datasetFlowsService, "flowsInitiators").and.returnValue(of([]));
        const updateNowClickSpy = spyOn(component, "updateNow");
        fixture.detectChanges();
        tick();
        const flows = await TestbedHarnessEnvironment.harnessForFixture(fixture, FlowsHarness);

        await flows.clickUpdateNowLink();

        expect(updateNowClickSpy).toHaveBeenCalledTimes(1);
        discardPeriodicTasks();
    }));

    it("should check 'update now' link for derivative dataset with SetTransform", fakeAsync(async () => {
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
        spyOn(datasetFlowsService, "datasetFlowsProcesses").and.returnValue(
            of(mockDatasetFlowsProcessesQuery.datasets.byId?.flows.processes as DatasetFlowProcesses),
        );
        spyOn(datasetFlowsService, "datasetFlowsList").and.returnValue(of(flowsTableDataWithoutRuns()));
        spyOn(datasetFlowsService, "flowsInitiators").and.returnValue(of([]));
        const updateNowClickSpy = spyOn(component, "updateNow");
        fixture.detectChanges();
        tick();
        const flows = await TestbedHarnessEnvironment.harnessForFixture(fixture, FlowsHarness);

        await flows.clickUpdateNowLink();

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

    it("should check set ProcessTypeFilter with webhookId", fakeAsync(() => {
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

    it("should check set ProcessTypeFilter with `webhooks` category", fakeAsync(() => {
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

    it("should refresh flows after an abort only once the delay passes, and not after destroy", fakeAsync(() => {
        const refreshFlowSpy = spyOn(component, "refreshFlow");
        spyOn(datasetFlowsService, "cancelFlowRun").and.returnValue(of(true));
        component.onAbortFlow({ flowId: MOCK_FLOW_ID, datasetId: mockDatasetMainDataId });

        tick(component.TIMEOUT_REFRESH_FLOW - 1);
        expect(refreshFlowSpy).not.toHaveBeenCalled();

        fixture.destroy();
        tick(1);
        expect(refreshFlowSpy).not.toHaveBeenCalled();
        flush();
    }));

    it("should refresh flows after pausing a webhook only once the delay passes, and not after destroy", fakeAsync(() => {
        const refreshFlowSpy = spyOn(component, "refreshFlow");
        spyOn(datasetWebhooksService, "datasetWebhookPauseSubscription").and.returnValue(of(true));
        component.pauseWebhook("1234-4444-43222");

        tick(AppValues.SIMULATION_UPDATE_WEBHOOK_STATUS_DELAY_MS - 1);
        expect(refreshFlowSpy).not.toHaveBeenCalled();

        fixture.destroy();
        tick(1);
        expect(refreshFlowSpy).not.toHaveBeenCalled();
        flush();
    }));

    describe("process type filter", () => {
        let datasetFlowsListSpy: jasmine.Spy;

        beforeEach(() => {
            spyOn(datasetFlowsService, "datasetFlowsProcesses").and.returnValue(
                of(mockDatasetFlowsProcessesQuery.datasets.byId?.flows.processes as DatasetFlowProcesses),
            );
            datasetFlowsListSpy = spyOn(datasetFlowsService, "datasetFlowsList").and.returnValue(
                of(mockFlowsTableData),
            );
            spyOn(datasetFlowsService, "flowsInitiators").and.returnValue(of([]));
        });

        it("should request ingest flows only for the `updates` category of a root dataset", fakeAsync(() => {
            component.setFlowsCategory = "updates";
            fixture.detectChanges();
            tick();

            expect(datasetFlowsListSpy).toHaveBeenCalledWith(
                jasmine.objectContaining({
                    filters: jasmine.objectContaining({
                        byProcessType: { primary: { byFlowTypes: [DatasetFlowType.Ingest] }, webhooks: undefined },
                    }),
                }),
            );
            discardPeriodicTasks();
        }));

        it("should request transform flows only for the `updates` category of a derivative dataset", fakeAsync(() => {
            component.flowsData = { ...component.flowsData, datasetBasics: mockDatasetBasicsDerivedFragment };
            component.setFlowsCategory = "updates";
            fixture.detectChanges();
            tick();

            expect(datasetFlowsListSpy).toHaveBeenCalledWith(
                jasmine.objectContaining({
                    filters: jasmine.objectContaining({
                        byProcessType: {
                            primary: { byFlowTypes: [DatasetFlowType.ExecuteTransform] },
                            webhooks: undefined,
                        },
                    }),
                }),
            );
            discardPeriodicTasks();
        }));

        it("should request webhook flows only for the `webhooks` category and drop the flows category", fakeAsync(() => {
            const selectionStateService = fixture.debugElement.injector.get(FlowsSelectionStateService);
            component.setFlowsCategory = "webhooks";
            fixture.detectChanges();
            tick();

            expect(datasetFlowsListSpy).toHaveBeenCalledWith(
                jasmine.objectContaining({
                    filters: jasmine.objectContaining({
                        byProcessType: { primary: undefined, webhooks: { subscriptionIds: [] } },
                    }),
                }),
            );
            expect(selectionStateService.snapshot.flowsCategory).toBeUndefined();
            discardPeriodicTasks();
        }));
    });

    it("should not ask for a polling source or a transformation when the dataset has push sources", () => {
        const overviewWithPushSource = structuredClone(mockOverviewUpdate);
        overviewWithPushSource.overview.metadata.currentPollingSource = null;
        overviewWithPushSource.overview.metadata.currentTransform = null;
        overviewWithPushSource.overview.metadata.currentPushSources = [{ __typename: "AddPushSource" }];

        component.flowsData = { ...component.flowsData, overviewUpdate: overviewWithPushSource };
        expect(component.hasPushSources).toBeTrue();
        expect(component.isSetPollingSourceEmpty).toBeFalse();

        component.flowsData = { ...component.flowsData, datasetBasics: mockDatasetBasicsDerivedFragment };
        expect(component.isSetTransformEmpty).toBeFalse();
    });

    describe("dataset process card", () => {
        beforeEach(() => {
            spyOn(datasetFlowsService, "datasetFlowsProcesses").and.returnValue(
                of(mockDatasetFlowsProcessesQuery.datasets.byId?.flows.processes as DatasetFlowProcesses),
            );
            spyOn(datasetFlowsService, "datasetFlowsList").and.returnValue(of(mockFlowsTableData));
            spyOn(datasetFlowsService, "flowsInitiators").and.returnValue(of([]));
        });

        async function loadCard(): Promise<DatasetFlowProcessCardHarness> {
            fixture.detectChanges();
            tick();
            const flows = await TestbedHarnessEnvironment.harnessForFixture(fixture, FlowsHarness);
            return flows.getDatasetProcessCard();
        }

        it("should trigger the dataset flow from the card's 'Update now' and refresh the flows", fakeAsync(async () => {
            const triggerIngestSpy = spyOn(datasetFlowsService, "datasetTriggerIngestFlow").and.returnValue(of(true));
            const card = await loadCard();
            const refreshFlowSpy = spyOn(component, "refreshFlow");

            await card.clickUpdateNow();

            expect(triggerIngestSpy).toHaveBeenCalledOnceWith({ datasetId: mockDatasetBasicsRootFragment.id });
            expect(await card.isUpdateNowDisabled()).toBeTrue();
            expect(await card.isToggleStateDisabled()).toBeTrue();
            tick(component.TIMEOUT_REFRESH_FLOW);
            expect(refreshFlowSpy).toHaveBeenCalledTimes(1);
            expect(await card.isUpdateNowDisabled()).toBeFalse();
            discardPeriodicTasks();
        }));

        it("should resume an auto-stopped process from the card after confirmation and refresh the flows", fakeAsync(async () => {
            const modalSpy = spyOn(modalService, "error").and.callFake((options: ModalArgumentsInterface) => {
                options.handler?.call(undefined, true);
                return Promise.resolve("");
            });
            const resumeSpy = spyOn(flowsService, "datasetResumeFlows").and.returnValue(of(void 0));
            const card = await loadCard();
            const refreshFlowSpy = spyOn(component, "refreshFlow");

            expect(await card.getToggleStateLabel()).toEqual("Resume updates");
            await card.clickToggleState();

            expect(modalSpy).toHaveBeenCalledTimes(1);
            expect(resumeSpy).toHaveBeenCalledOnceWith({ datasetId: mockDatasetBasicsRootFragment.id });
            tick(component.TIMEOUT_REFRESH_FLOW);
            expect(refreshFlowSpy).toHaveBeenCalledTimes(1);
            discardPeriodicTasks();
        }));
    });

    it("should refresh flows after 'Update now' only once the delay passes", fakeAsync(() => {
        const refreshFlowSpy = spyOn(component, "refreshFlow");
        spyOn(datasetFlowsService, "datasetTriggerIngestFlow").and.returnValue(of(true));
        component.updateNow();

        tick(component.TIMEOUT_REFRESH_FLOW - 1);
        expect(refreshFlowSpy).not.toHaveBeenCalled();

        tick(1);
        expect(refreshFlowSpy).toHaveBeenCalledTimes(1);
    }));

    it("should not refresh flows after 'Update now' once destroyed", fakeAsync(() => {
        const refreshFlowSpy = spyOn(component, "refreshFlow");
        spyOn(datasetFlowsService, "datasetTriggerIngestFlow").and.returnValue(of(true));
        component.updateNow();

        fixture.destroy();
        tick(component.TIMEOUT_REFRESH_FLOW);
        expect(refreshFlowSpy).not.toHaveBeenCalled();
    }));

    it("should not refresh flows when 'Update now' fails to trigger", fakeAsync(() => {
        const refreshFlowSpy = spyOn(component, "refreshFlow");
        spyOn(datasetFlowsService, "datasetTriggerIngestFlow").and.returnValue(of(false));
        component.updateNow();

        tick(component.TIMEOUT_REFRESH_FLOW);
        expect(refreshFlowSpy).not.toHaveBeenCalled();
    }));

    it("should refresh flows after pausing the dataset flows only once the delay passes", fakeAsync(() => {
        const refreshFlowSpy = spyOn(component, "refreshFlow");
        spyOn(flowsService, "datasetPauseFlows").and.returnValue(of(void 0));
        component.toggleStateDatasetFlowConfigs({
            state: FlowProcessEffectiveState.Failing,
            datasetBasics: mockDatasetBasicsRootFragment,
        });

        tick(component.TIMEOUT_REFRESH_FLOW - 1);
        expect(refreshFlowSpy).not.toHaveBeenCalled();

        tick(1);
        expect(refreshFlowSpy).toHaveBeenCalledTimes(1);
    }));

    it("should not refresh flows after pausing the dataset flows once destroyed", fakeAsync(() => {
        const refreshFlowSpy = spyOn(component, "refreshFlow");
        spyOn(flowsService, "datasetPauseFlows").and.returnValue(of(void 0));
        component.toggleStateDatasetFlowConfigs({
            state: FlowProcessEffectiveState.Failing,
            datasetBasics: mockDatasetBasicsRootFragment,
        });

        fixture.destroy();
        tick(component.TIMEOUT_REFRESH_FLOW);
        expect(refreshFlowSpy).not.toHaveBeenCalled();
    }));

    it("should not refresh flows when the trigger responds after the page is left", fakeAsync(() => {
        const refreshFlowSpy = spyOn(component, "refreshFlow");
        const trigger$ = new Subject<boolean>();
        spyOn(datasetFlowsService, "datasetTriggerIngestFlow").and.returnValue(trigger$);
        component.updateNow();

        fixture.destroy();
        trigger$.next(true);
        tick(component.TIMEOUT_REFRESH_FLOW);
        expect(refreshFlowSpy).not.toHaveBeenCalled();
    }));

    describe("dataset card action in progress", () => {
        it("should last from a toggle until the refresh", fakeAsync(() => {
            spyOn(flowsService, "datasetPauseFlows").and.returnValue(of(void 0));
            const refreshFlowSpy = spyOn(component, "refreshFlow");
            component.toggleStateDatasetFlowConfigs({
                state: FlowProcessEffectiveState.Failing,
                datasetBasics: mockDatasetBasicsRootFragment,
            });

            tick(component.TIMEOUT_REFRESH_FLOW - 1);
            expect(component.busyIds$.value.has(mockDatasetBasicsRootFragment.id)).toBeTrue();

            tick(1);
            expect(refreshFlowSpy).toHaveBeenCalledTimes(1);
            expect(component.busyIds$.value.has(mockDatasetBasicsRootFragment.id)).toBeFalse();
        }));

        it("should end when 'Update now' fails to trigger", () => {
            spyOn(datasetFlowsService, "datasetTriggerIngestFlow").and.returnValue(of(false));
            component.updateNow();
            expect(component.busyIds$.value.has(mockDatasetBasicsRootFragment.id)).toBeFalse();
        });

        it("should end when the resume confirmation is cancelled", () => {
            spyOn(modalService, "error").and.callFake((options: ModalArgumentsInterface) => {
                options.handler?.call(undefined, false);
                return Promise.resolve("");
            });
            component.toggleStateDatasetFlowConfigs({
                state: FlowProcessEffectiveState.StoppedAuto,
                datasetBasics: mockDatasetBasicsRootFragment,
            });
            expect(component.busyIds$.value.has(mockDatasetBasicsRootFragment.id)).toBeFalse();
        });

        it("should not start while the resume confirmation is open, as Escape closes it unanswered", () => {
            spyOn(modalService, "error").and.returnValue(Promise.resolve(""));
            const resumeSpy = spyOn(flowsService, "datasetResumeFlows");
            component.toggleStateDatasetFlowConfigs({
                state: FlowProcessEffectiveState.StoppedAuto,
                datasetBasics: mockDatasetBasicsRootFragment,
            });

            expect(resumeSpy).not.toHaveBeenCalled();
            expect(component.busyIds$.value.has(mockDatasetBasicsRootFragment.id)).toBeFalse();
        });

        it("should end when the page is left before the refresh", fakeAsync(() => {
            spyOn(flowsService, "datasetPauseFlows").and.returnValue(of(void 0));
            component.toggleStateDatasetFlowConfigs({
                state: FlowProcessEffectiveState.Failing,
                datasetBasics: mockDatasetBasicsRootFragment,
            });

            fixture.destroy();
            expect(component.busyIds$.value.has(mockDatasetBasicsRootFragment.id)).toBeFalse();
        }));

        it("should end when the request fails, and leave the error to the global handler", fakeAsync(() => {
            spyOn(datasetFlowsService, "datasetTriggerIngestFlow").and.returnValue(
                throwError(() => new Error("Network failure")),
            );
            component.updateNow();

            expect(component.busyIds$.value.has(mockDatasetBasicsRootFragment.id)).toBeFalse();
            expect(() => tick()).toThrowError("Network failure");
        }));
    });

    describe("switching to another dataset's Flows tab", () => {
        const otherDatasetFlowsData = {
            datasetBasics: { ...mockDatasetBasicsDerivedFragment, id: "other-dataset-id" },
            datasetPermissions: mockFullPowerDatasetPermissionsFragment,
            overviewUpdate: mockOverviewUpdate,
        };
        let datasetFlowsProcessesSpy: jasmine.Spy;

        beforeEach(() => {
            datasetFlowsProcessesSpy = spyOn(datasetFlowsService, "datasetFlowsProcesses").and.returnValue(
                of(mockDatasetFlowsProcessesQuery.datasets.byId?.flows.processes as DatasetFlowProcesses),
            );
            spyOn(datasetFlowsService, "datasetFlowsList").and.returnValue(of(mockFlowsTableData));
            spyOn(datasetFlowsService, "flowsInitiators").and.returnValue(of([]));
            fixture.componentRef.setInput(RoutingResolvers.DATASET_VIEW_FLOWS_KEY, component.flowsData);
        });

        function switchTo(flowsData: typeof component.flowsData): void {
            fixture.componentRef.setInput(RoutingResolvers.DATASET_VIEW_FLOWS_KEY, flowsData);
            fixture.detectChanges();
            tick();
        }

        it("should load the other dataset's flows", fakeAsync(() => {
            fixture.detectChanges();
            tick();
            datasetFlowsProcessesSpy.calls.reset();

            switchTo(otherDatasetFlowsData);

            expect(datasetFlowsProcessesSpy).toHaveBeenCalledOnceWith({ datasetId: "other-dataset-id" });
            discardPeriodicTasks();
        }));

        it("should keep only the selection the current URL asks for", fakeAsync(() => {
            const selectionStateService = fixture.debugElement.injector.get(FlowsSelectionStateService);
            fixture.componentRef.setInput(ProjectLinks.URL_QUERY_PARAM_WEBHOOK_ID, "subscription-from-url");
            fixture.detectChanges();
            tick();
            selectionStateService.addWebhookId("subscription-of-the-previous-dataset");

            switchTo(otherDatasetFlowsData);

            expect(selectionStateService.snapshot.webhooksIds).toEqual(["subscription-from-url"]);
            discardPeriodicTasks();
        }));

        it("should clear the filters chosen for the previous dataset", fakeAsync(() => {
            fixture.detectChanges();
            tick();
            component.onSearchByFiltersChange({
                status: [FlowStatus.Finished],
                accounts: [mockAccountDetails],
                datasets: [],
                onlySystemFlows: false,
            });
            tick();

            switchTo(otherDatasetFlowsData);

            expect(component.searchByAccount).toEqual([]);
            expect(component.selectedStatusItems).toEqual([]);
            expect(component.onlySystemFlows).toBeFalse();
            discardPeriodicTasks();
        }));

        it("should leave a card action of the previous dataset out of the new tab", fakeAsync(() => {
            spyOn(flowsService, "datasetPauseFlows").and.returnValue(of(void 0));
            fixture.detectChanges();
            tick();
            component.toggleStateDatasetFlowConfigs({
                state: FlowProcessEffectiveState.Failing,
                datasetBasics: mockDatasetBasicsRootFragment,
            });

            switchTo(otherDatasetFlowsData);
            expect(component.busyIds$.value.has("other-dataset-id")).toBeFalse();

            const refreshFlowSpy = spyOn(component, "refreshFlow");
            tick(component.TIMEOUT_REFRESH_FLOW);
            expect(refreshFlowSpy).not.toHaveBeenCalled();
            expect(component.busyIds$.value.size).toEqual(0);
            discardPeriodicTasks();
        }));

        it("should not start over when the data of the same dataset is resolved again", fakeAsync(() => {
            fixture.detectChanges();
            tick();
            datasetFlowsProcessesSpy.calls.reset();

            switchTo({ ...component.flowsData });

            expect(datasetFlowsProcessesSpy).not.toHaveBeenCalled();
            discardPeriodicTasks();
        }));
    });

    describe("webhook subscription action in progress", () => {
        const SUBSCRIPTION_ID = "1234-4444-43222";

        it("should last from a pause until the refresh", fakeAsync(() => {
            spyOn(datasetWebhooksService, "datasetWebhookPauseSubscription").and.returnValue(of(true));
            const refreshFlowSpy = spyOn(component, "refreshFlow");
            component.pauseWebhook(SUBSCRIPTION_ID);

            tick(AppValues.SIMULATION_UPDATE_WEBHOOK_STATUS_DELAY_MS - 1);
            expect(component.busyIds$.value.has(SUBSCRIPTION_ID)).toBeTrue();

            tick(1);
            expect(refreshFlowSpy).toHaveBeenCalledTimes(1);
            expect(component.busyIds$.value.has(SUBSCRIPTION_ID)).toBeFalse();
        }));

        it("should end when the resume fails", () => {
            spyOn(datasetWebhooksService, "datasetWebhookResumeSubscription").and.returnValue(of(false));
            component.resumeWebhook(SUBSCRIPTION_ID);
            expect(component.busyIds$.value.has(SUBSCRIPTION_ID)).toBeFalse();
        });
    });

    describe("page of flow runs", () => {
        let datasetFlowsListSpy: jasmine.Spy;

        // The API pages from 0, the URL and the pagination from 1
        function lastRequestedPage(): number {
            return (datasetFlowsListSpy.calls.mostRecent().args[0] as { page: number }).page + 1;
        }

        beforeEach(() => {
            spyOn(datasetFlowsService, "datasetFlowsProcesses").and.returnValue(
                of(mockDatasetFlowsProcessesQuery.datasets.byId?.flows.processes as DatasetFlowProcesses),
            );
            datasetFlowsListSpy = spyOn(datasetFlowsService, "datasetFlowsList").and.returnValue(
                of(mockFlowsTableData),
            );
            spyOn(datasetFlowsService, "flowsInitiators").and.returnValue(of([]));
            spyOn(navigationService, "navigateToDatasetView");
        });

        it("should start from the page in the URL", fakeAsync(() => {
            fixture.detectChanges();
            tick();

            expect(lastRequestedPage()).toEqual(2);
            discardPeriodicTasks();
        }));

        it("should stay on the page shown when a card action refreshes the flows", fakeAsync(() => {
            spyOn(flowsService, "datasetPauseFlows").and.returnValue(of(void 0));
            fixture.detectChanges();
            tick();
            component.onPageChange(3);
            tick();

            component.toggleStateDatasetFlowConfigs({
                state: FlowProcessEffectiveState.Failing,
                datasetBasics: mockDatasetBasicsRootFragment,
            });
            tick(component.TIMEOUT_REFRESH_FLOW);

            expect(lastRequestedPage()).toEqual(3);
            discardPeriodicTasks();
        }));

        it("should go back to the first page when another category is chosen", fakeAsync(() => {
            fixture.detectChanges();
            tick();
            component.onPageChange(3);
            tick();

            component.onSelectionFlowsChange({ value: "updates" } as MatChipListboxChange);
            tick();

            expect(lastRequestedPage()).toEqual(1);
            discardPeriodicTasks();
        }));
    });
});
