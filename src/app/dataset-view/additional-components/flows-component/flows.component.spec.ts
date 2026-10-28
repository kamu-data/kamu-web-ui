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
import { MatChipListbox, MatChipListboxChange } from "@angular/material/chips";
import { ActivatedRoute } from "@angular/router";

import { delay, of, Subject, throwError } from "rxjs";

import { Apollo } from "apollo-angular";
import { provideToastr } from "ngx-toastr";
import type { Mock } from "vitest";

import { ModalService } from "@common/components/modal/modal.service";
import { PagePastEndHarness } from "@common/components/page-past-end/page-past-end.harness";
import { requireValue } from "@common/helpers/app.helpers";
import {
    createSpyObj,
    registerMatSvgIcons,
    setComponentInput,
    stubMethod,
} from "@common/helpers/base-test.helpers.spec";
import AppValues from "@common/values/app.values";
import { DatasetFlowType, FlowProcessEffectiveState, FlowStatus } from "@api/kamu.graphql.interface";
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

    function chipListboxChange(value: string): MatChipListboxChange {
        return new MatChipListboxChange(createSpyObj<MatChipListbox>({ focus: undefined }), value);
    }

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
        setComponentInput(fixture, "flowsData", {
            datasetBasics: mockDatasetBasicsRootFragment,
            datasetPermissions: mockFullPowerDatasetPermissionsFragment,
            overviewUpdate: mockOverviewUpdate,
        });
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should check refresh button", () => {
        const fetchTableDataSpy = vi.spyOn(component, "fetchTableData").mockImplementation(() => {});
        component.refreshFlow();
        expect(fetchTableDataSpy).toHaveBeenCalledTimes(1);
    });

    it("should show the empty block when there are no flow runs", fakeAsync(async () => {
        vi.spyOn(datasetFlowsService, "datasetFlowsList").mockReturnValue(of(flowsTableDataWithoutRuns()));
        vi.spyOn(datasetFlowsService, "flowsInitiators").mockReturnValue(of([]));
        vi.spyOn(datasetFlowsService, "datasetFlowsProcesses").mockReturnValue(
            of(requireValue(mockDatasetFlowsProcessesQuery.datasets.byId?.flows.processes)),
        );
        // The first poll runs on an interval, which the harness's own flush skips
        fixture.detectChanges();
        tick();
        const flows = await TestbedHarnessEnvironment.harnessForFixture(fixture, FlowsHarness);

        expect(await flows.isEmptyFlowRunsBlockVisible()).toBe(true);
        discardPeriodicTasks();
    }));

    it("should say a page past the last one has no flow runs and lead to the last page", fakeAsync(async () => {
        const pastEndData = structuredClone(mockFlowsTableData);
        pastEndData.connectionDataForTable.nodes = [];
        pastEndData.connectionDataForTable.pageInfo.currentPage = 98;
        pastEndData.connectionDataForTable.pageInfo.totalPages = 3;
        vi.spyOn(datasetFlowsService, "datasetFlowsList").mockReturnValue(of(pastEndData));
        vi.spyOn(datasetFlowsService, "flowsInitiators").mockReturnValue(of([]));
        vi.spyOn(datasetFlowsService, "datasetFlowsProcesses").mockReturnValue(
            of(requireValue(mockDatasetFlowsProcessesQuery.datasets.byId?.flows.processes)),
        );
        const navigateToDatasetViewSpy = stubMethod(navigationService, "navigateToDatasetView");
        // The first poll runs on an interval, which the harness's own flush skips
        fixture.detectChanges();
        tick();

        const pagePastEnd = await TestbedHarnessEnvironment.loader(fixture).getHarness(PagePastEndHarness);
        expect(await pagePastEnd.getMessage()).toEqual("There are no flow runs on this page.");
        await pagePastEnd.goToLastPage();
        expect(navigateToDatasetViewSpy).toHaveBeenCalledWith(expect.objectContaining({ page: 3 }));
        discardPeriodicTasks();
    }));

    it("should check filter by status during the first request", fakeAsync(() => {
        fixture.detectChanges();
        const datasetFlowsListSpy = vi
            .spyOn(datasetFlowsService, "datasetFlowsList")
            .mockReturnValue(of(flowsTableDataWithoutRuns()));
        vi.spyOn(datasetFlowsService, "flowsInitiators").mockReturnValue(of([]));
        vi.spyOn(datasetFlowsService, "datasetFlowsProcesses").mockReturnValue(
            of(requireValue(mockDatasetFlowsProcessesQuery.datasets.byId?.flows.processes)),
        );
        tick();
        fixture.detectChanges();

        expect(datasetFlowsListSpy).toHaveBeenCalledWith(
            expect.objectContaining({
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
        const refreshFlowSpy = vi.spyOn(component, "refreshFlow").mockImplementation(() => {});
        vi.spyOn(datasetFlowsService, "datasetTriggerIngestFlow").mockReturnValue(of(true));
        component.updateNow();
        tick(component.TIMEOUT_REFRESH_FLOW);
        expect(refreshFlowSpy).toHaveBeenCalledTimes(1);
        flush();
    }));

    it("should check update now button for derivative dataset", fakeAsync(() => {
        setComponentInput(fixture, "flowsData", {
            datasetBasics: mockDatasetBasicsDerivedFragment,
            datasetPermissions: mockFullPowerDatasetPermissionsFragment,
            overviewUpdate: mockOverviewUpdate,
        });
        const refreshFlowSpy = vi.spyOn(component, "refreshFlow").mockImplementation(() => {});
        vi.spyOn(datasetFlowsService, "datasetTriggerTransformFlow").mockReturnValue(of(true));
        component.updateNow();
        tick(component.TIMEOUT_REFRESH_FLOW);
        expect(refreshFlowSpy).toHaveBeenCalledTimes(1);
        flush();
    }));

    it(`should check toggle state for dataset flow when state=${FlowProcessEffectiveState.Active}`, () => {
        const handleToggleStateSpy = vi.spyOn(datasetCardService, "handleToggleState").mockReturnValue(of(void 0));
        component.toggleStateDatasetFlowConfigs({
            state: FlowProcessEffectiveState.Active,
            datasetBasics: mockDatasetBasicsRootFragment,
        });
        expect(handleToggleStateSpy).toHaveBeenCalledTimes(1);
        expect(handleToggleStateSpy).toHaveBeenCalledWith({
            state: FlowProcessEffectiveState.Active,
            datasetBasics: mockDatasetBasicsRootFragment,
        });
    });

    it(`should check toggle state for dataset flow when state=${FlowProcessEffectiveState.StoppedAuto}`, fakeAsync(() => {
        const refreshFlowSpy = vi.spyOn(component, "refreshFlow").mockImplementation(() => {});
        const modalServiceSpy = vi
            .spyOn(modalService, "error")
            .mockImplementation((options: ModalArgumentsInterface) => {
                options.handler?.call(undefined, true);
                return Promise.resolve("");
            });
        const datasetResumeFlowsSpy = vi.spyOn(flowsService, "datasetResumeFlows").mockReturnValue(of(void 0));
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
        const refreshFlowSpy = vi.spyOn(component, "refreshFlow").mockImplementation(() => {});
        const datasetPauseFlowsSpy = vi.spyOn(flowsService, "datasetPauseFlows").mockReturnValue(of(void 0));
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
        const refreshFlowSpy = vi.spyOn(component, "refreshFlow").mockImplementation(() => {});
        vi.spyOn(datasetFlowsService, "cancelFlowRun").mockReturnValue(of(true));
        component.onAbortFlow({ flowId: MOCK_FLOW_ID, datasetId: mockDatasetMainDataId });
        tick(component.TIMEOUT_REFRESH_FLOW);
        expect(refreshFlowSpy).toHaveBeenCalledTimes(1);
        flush();
    }));

    it("should check navigate when page equal 1 ", () => {
        const page = 1;
        const navigateToDatasetViewSpy = vi
            .spyOn(navigationService, "navigateToDatasetView")
            .mockImplementation(() => {});
        component.onPageChange(page);
        expect(navigateToDatasetViewSpy).toHaveBeenCalledTimes(1);
        expect(navigateToDatasetViewSpy).toHaveBeenCalledWith({
            accountName: component.flowsData.datasetBasics.owner.accountName,
            datasetName: component.flowsData.datasetBasics.name,
            tab: DatasetViewTypeEnum.Flows,
            category: "all",
        });
    });

    it("should check navigate when page > 1 ", () => {
        const page = 2;
        const navigateToDatasetViewSpy = vi
            .spyOn(navigationService, "navigateToDatasetView")
            .mockImplementation(() => {});
        component.onPageChange(page);
        expect(navigateToDatasetViewSpy).toHaveBeenCalledTimes(1);
        expect(navigateToDatasetViewSpy).toHaveBeenCalledWith({
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
        vi.spyOn(datasetFlowsService, "datasetFlowsProcesses").mockReturnValue(
            of(requireValue(mockDatasetFlowsProcessesQuery.datasets.byId?.flows.processes)),
        );
        vi.spyOn(datasetFlowsService, "datasetFlowsList").mockReturnValue(flowsList$);
        vi.spyOn(datasetFlowsService, "flowsInitiators").mockReturnValue(of([]));
        fixture.detectChanges();
        tick();
        const flows = await TestbedHarnessEnvironment.harnessForFixture(fixture, FlowsHarness);
        expect(await flows.isInitProgressBarVisible()).toBe(true);

        flowsList$.next(flowsTableDataWithoutRuns());
        expect(await flows.isInitProgressBarVisible()).toBe(false);
        discardPeriodicTasks();
    }));

    it("should check 'update now' link for root dataset with PollingSource", fakeAsync(async () => {
        vi.spyOn(datasetFlowsService, "datasetFlowsProcesses").mockReturnValue(
            of(requireValue(mockDatasetFlowsProcessesQuery.datasets.byId?.flows.processes)),
        );
        vi.spyOn(datasetFlowsService, "datasetFlowsList").mockReturnValue(of(flowsTableDataWithoutRuns()));
        vi.spyOn(datasetFlowsService, "flowsInitiators").mockReturnValue(of([]));
        const updateNowClickSpy = vi.spyOn(component, "updateNow").mockImplementation(() => {});
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
        setComponentInput(fixture, "flowsData", {
            datasetBasics: mockDatasetBasicsDerivedFragment,
            datasetPermissions: mockFullPowerDatasetPermissionsFragment,
            overviewUpdate: copyMockOverviewUpdate,
        });
        vi.spyOn(datasetFlowsService, "datasetFlowsProcesses").mockReturnValue(
            of(requireValue(mockDatasetFlowsProcessesQuery.datasets.byId?.flows.processes)),
        );
        vi.spyOn(datasetFlowsService, "datasetFlowsList").mockReturnValue(of(flowsTableDataWithoutRuns()));
        vi.spyOn(datasetFlowsService, "flowsInitiators").mockReturnValue(of([]));
        const updateNowClickSpy = vi.spyOn(component, "updateNow").mockImplementation(() => {});
        fixture.detectChanges();
        tick();
        const flows = await TestbedHarnessEnvironment.harnessForFixture(fixture, FlowsHarness);

        await flows.clickUpdateNowLink();

        expect(updateNowClickSpy).toHaveBeenCalledTimes(1);
        discardPeriodicTasks();
    }));

    it("should check to show panel buttons init filter with webhook ids", () => {
        const serviceInComponent = fixture.debugElement.injector.get(FlowsSelectionStateService);
        const addWebhookIdSpy = vi.spyOn(serviceInComponent, "addWebhookId").mockImplementation(() => {});
        const mockWebhookId = "d20a935e-0ccb-4844-b1bb-f4b5b9b0279a,d20a935e-0ccb-4844-b1bb-f4b5b9b0279b";
        setComponentInput(fixture, "setWebhookId", mockWebhookId);
        expect(addWebhookIdSpy).toHaveBeenCalledTimes(2);
    });

    it("should check to show panel buttons init filter without webhook id", () => {
        const serviceInComponent = fixture.debugElement.injector.get(FlowsSelectionStateService);
        const addWebhookIdSpy = vi.spyOn(serviceInComponent, "addWebhookId").mockImplementation(() => {});
        setComponentInput(fixture, "setWebhookId", undefined);
        expect(addWebhookIdSpy).not.toHaveBeenCalled();
    });

    it("should keep only the webhook ids that are UUIDs", () => {
        const serviceInComponent = fixture.debugElement.injector.get(FlowsSelectionStateService);
        const addWebhookIdSpy = stubMethod(serviceInComponent, "addWebhookId");

        setComponentInput(fixture, "setWebhookId", "not-an-id,d20a935e-0ccb-4844-b1bb-f4b5b9b0279a,");

        expect(addWebhookIdSpy).toHaveBeenCalledTimes(1);
        expect(addWebhookIdSpy).toHaveBeenCalledWith("d20a935e-0ccb-4844-b1bb-f4b5b9b0279a");
    });

    it("should check to show panel buttons init webhook filter buttons without states", () => {
        const serviceInComponent = fixture.debugElement.injector.get(FlowsSelectionStateService);
        const setWebhooksCategorySpy = vi.spyOn(serviceInComponent, "setWebhooksCategory").mockImplementation(() => {});
        setComponentInput(fixture, "setWebhookState", undefined);
        expect(setWebhooksCategorySpy).not.toHaveBeenCalled();
    });

    it("should check to show panel buttons init webhook filter buttons with states", () => {
        const serviceInComponent = fixture.debugElement.injector.get(FlowsSelectionStateService);
        const setWebhooksCategorySpy = vi.spyOn(serviceInComponent, "setWebhooksCategory").mockImplementation(() => {});
        const mockStates = `${FlowProcessEffectiveState.Active},${FlowProcessEffectiveState.Failing}`;
        setComponentInput(fixture, "setWebhookState", mockStates);
        expect(setWebhooksCategorySpy).toHaveBeenCalledTimes(1);
    });

    it("should check to show panel buttons init webhooks category", () => {
        const serviceInComponent = fixture.debugElement.injector.get(FlowsSelectionStateService);
        const setWebhooksCategorySpy = vi.spyOn(serviceInComponent, "setWebhooksCategory").mockImplementation(() => {});
        const category = "webhooks";
        setComponentInput(fixture, "setFlowsCategory", category);
        expect(setWebhooksCategorySpy).toHaveBeenCalledTimes(1);
    });

    it("should check to show panel buttons init flows category", () => {
        const serviceInComponent = fixture.debugElement.injector.get(FlowsSelectionStateService);
        const setFlowsCategorySpy = vi.spyOn(serviceInComponent, "setFlowsCategory").mockImplementation(() => {});
        const category = "updates";
        setComponentInput(fixture, "setFlowsCategory", category);
        expect(setFlowsCategorySpy).toHaveBeenCalledTimes(1);
    });

    ["bogus", "WEBHOOKS", undefined].forEach((category) => {
        it(`should read the category "${category}" as no category, as a missing one`, () => {
            const serviceInComponent = fixture.debugElement.injector.get(FlowsSelectionStateService);
            const setFlowsCategorySpy = stubMethod(serviceInComponent, "setFlowsCategory");
            const setWebhooksCategorySpy = stubMethod(serviceInComponent, "setWebhooksCategory");
            const clearFlowsCategorySpy = stubMethod(serviceInComponent, "clearFlowsCategory");

            setComponentInput(fixture, "setFlowsCategory", category);

            expect(clearFlowsCategorySpy).toHaveBeenCalledTimes(1);
            expect(setFlowsCategorySpy).not.toHaveBeenCalled();
            expect(setWebhooksCategorySpy).not.toHaveBeenCalled();
        });
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
        const navigateToWebhooksSpy = vi.spyOn(navigationService, "navigateToWebhooks").mockImplementation(() => {});
        component.navigateToWebhookSettings(mockSubscriptionId);
        expect(navigateToWebhooksSpy).toHaveBeenCalledWith(
            expect.objectContaining({
                tab: mockSubscriptionId,
            }),
        );
    });

    it("should check to navigate to subscription", () => {
        const processes = requireValue(mockDatasetFlowsProcessesQuery.datasets.byId?.flows.processes);
        const navigateToDatasetViewSpy = vi
            .spyOn(navigationService, "navigateToDatasetView")
            .mockImplementation(() => {});
        component.navigateToSubscription(processes.webhooks.subprocesses[0]);
        expect(navigateToDatasetViewSpy).toHaveBeenCalledTimes(1);
    });

    it("should check pause webhook", fakeAsync(() => {
        const mockSubscriptionId = "1234-4444-43222";
        const refreshFlowSpy = vi.spyOn(component, "refreshFlow").mockImplementation(() => {});
        const datasetWebhookPauseSubscriptionSpy = vi
            .spyOn(datasetWebhooksService, "datasetWebhookPauseSubscription")
            .mockReturnValue(of(true));
        component.pauseWebhook(mockSubscriptionId);
        expect(datasetWebhookPauseSubscriptionSpy).toHaveBeenCalledTimes(1);
        tick(AppValues.SIMULATION_UPDATE_WEBHOOK_STATUS_DELAY_MS);
        expect(refreshFlowSpy).toHaveBeenCalledTimes(1);
        flush();
    }));

    it("should check resume webhook", fakeAsync(() => {
        const mockSubscriptionId = "1234-4444-43222";
        const refreshFlowSpy = vi.spyOn(component, "refreshFlow").mockImplementation(() => {});
        const datasetWebhookResumeSubscriptionSpy = vi
            .spyOn(datasetWebhooksService, "datasetWebhookResumeSubscription")
            .mockReturnValue(of(true));
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
        const processes = requireValue(mockDatasetFlowsProcessesQuery.datasets.byId?.flows.processes);
        const navigateToDatasetViewSpy = vi
            .spyOn(navigationService, "navigateToDatasetView")
            .mockImplementation(() => {});
        component.removeSelectedWebhook("qwer", processes.webhooks.subprocesses);
        expect(navigateToDatasetViewSpy).toHaveBeenCalledWith(
            expect.objectContaining({
                webhookId: [],
            }),
        );
    });

    it("should check toggle webhook filter if states not exist", () => {
        const processes = requireValue(mockDatasetFlowsProcessesQuery.datasets.byId?.flows.processes);
        const navigateToDatasetViewSpy = vi
            .spyOn(navigationService, "navigateToDatasetView")
            .mockImplementation(() => {});
        component.onToggleWebhookFilter([FlowProcessEffectiveState.Active], processes.webhooks.subprocesses);
        expect(navigateToDatasetViewSpy).toHaveBeenCalledWith(
            expect.objectContaining({
                webhooksState: [FlowProcessEffectiveState.Active],
            }),
        );
    });

    it("should check toggle webhook filter if states  exist", () => {
        const processes = requireValue(mockDatasetFlowsProcessesQuery.datasets.byId?.flows.processes);
        const navigateToDatasetViewSpy = vi
            .spyOn(navigationService, "navigateToDatasetView")
            .mockImplementation(() => {});
        component.onToggleWebhookFilter([], processes.webhooks.subprocesses);
        expect(navigateToDatasetViewSpy).toHaveBeenCalledWith(
            expect.objectContaining({
                webhooksState: undefined,
            }),
        );
    });

    it("should check selection `Webhooks` chip", () => {
        const navigateToDatasetViewSpy = vi
            .spyOn(navigationService, "navigateToDatasetView")
            .mockImplementation(() => {});
        component.onSelectionWebhooksChange("webhooks");
        expect(navigateToDatasetViewSpy).toHaveBeenCalledWith(
            expect.objectContaining({
                category: "webhooks",
            }),
        );
    });

    it("should check selection `Flows`chips", () => {
        const mockEvent = chipListboxChange("updates");
        const navigateToDatasetViewSpy = vi
            .spyOn(navigationService, "navigateToDatasetView")
            .mockImplementation(() => {});
        component.onSelectionFlowsChange(mockEvent);
        expect(navigateToDatasetViewSpy).toHaveBeenCalledWith(
            expect.objectContaining({
                category: "updates",
            }),
        );
    });

    it("should check set ProcessTypeFilter with webhookId", fakeAsync(() => {
        const mockWebhookId = "d20a935e-0ccb-4844-b1bb-f4b5b9b0279a,d20a935e-0ccb-4844-b1bb-f4b5b9b0279b";
        setComponentInput(fixture, "setWebhookId", mockWebhookId);
        fixture.detectChanges();
        const serviceInComponent = fixture.debugElement.injector.get(FlowsSelectionStateService);
        const clearFlowsCategorySpy = vi.spyOn(serviceInComponent, "clearFlowsCategory").mockImplementation(() => {});
        vi.spyOn(datasetFlowsService, "datasetFlowsProcesses").mockReturnValue(
            of(requireValue(mockDatasetFlowsProcessesQuery.datasets.byId?.flows.processes)),
        );
        vi.spyOn(datasetFlowsService, "datasetFlowsList").mockReturnValue(of(mockFlowsTableData).pipe(delay(10)));
        vi.spyOn(datasetFlowsService, "flowsInitiators").mockReturnValue(of([]));
        tick(10);
        fixture.detectChanges();

        expect(clearFlowsCategorySpy).toHaveBeenCalledTimes(1);
        discardPeriodicTasks();
    }));

    it("should check set ProcessTypeFilter with `webhooks` category", fakeAsync(() => {
        const serviceInComponent = fixture.debugElement.injector.get(FlowsSelectionStateService);
        const setWebhooksCategorySpy = vi.spyOn(serviceInComponent, "setWebhooksCategory").mockImplementation(() => {});
        const mockStates = `${FlowProcessEffectiveState.Active},${FlowProcessEffectiveState.Failing}`;
        setComponentInput(fixture, "setWebhookState", mockStates);

        vi.spyOn(datasetFlowsService, "datasetFlowsProcesses").mockReturnValue(
            of(requireValue(mockDatasetFlowsProcessesQuery.datasets.byId?.flows.processes)),
        );
        vi.spyOn(datasetFlowsService, "datasetFlowsList").mockReturnValue(of(mockFlowsTableData).pipe(delay(10)));
        vi.spyOn(datasetFlowsService, "flowsInitiators").mockReturnValue(of([mockAccountDetails]));
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
        const refreshFlowSpy = vi.spyOn(component, "refreshFlow").mockImplementation(() => {});
        vi.spyOn(datasetFlowsService, "cancelFlowRun").mockReturnValue(of(true));
        component.onAbortFlow({ flowId: MOCK_FLOW_ID, datasetId: mockDatasetMainDataId });

        tick(component.TIMEOUT_REFRESH_FLOW - 1);
        expect(refreshFlowSpy).not.toHaveBeenCalled();

        fixture.destroy();
        tick(1);
        expect(refreshFlowSpy).not.toHaveBeenCalled();
        flush();
    }));

    it("should refresh flows after pausing a webhook only once the delay passes, and not after destroy", fakeAsync(() => {
        const refreshFlowSpy = vi.spyOn(component, "refreshFlow").mockImplementation(() => {});
        vi.spyOn(datasetWebhooksService, "datasetWebhookPauseSubscription").mockReturnValue(of(true));
        component.pauseWebhook("1234-4444-43222");

        tick(AppValues.SIMULATION_UPDATE_WEBHOOK_STATUS_DELAY_MS - 1);
        expect(refreshFlowSpy).not.toHaveBeenCalled();

        fixture.destroy();
        tick(1);
        expect(refreshFlowSpy).not.toHaveBeenCalled();
        flush();
    }));

    describe("process type filter", () => {
        let datasetFlowsListSpy: Mock<DatasetFlowsService["datasetFlowsList"]>;

        beforeEach(() => {
            vi.spyOn(datasetFlowsService, "datasetFlowsProcesses").mockReturnValue(
                of(requireValue(mockDatasetFlowsProcessesQuery.datasets.byId?.flows.processes)),
            );
            datasetFlowsListSpy = vi
                .spyOn(datasetFlowsService, "datasetFlowsList")
                .mockReturnValue(of(mockFlowsTableData));
            vi.spyOn(datasetFlowsService, "flowsInitiators").mockReturnValue(of([]));
        });

        it("should request ingest flows only for the `updates` category of a root dataset", fakeAsync(() => {
            setComponentInput(fixture, "setFlowsCategory", "updates");
            fixture.detectChanges();
            tick();

            expect(datasetFlowsListSpy.mock.calls.map(([params]) => params.filters.byProcessType)).toContainEqual({
                primary: { byFlowTypes: [DatasetFlowType.Ingest] },
                webhooks: undefined,
            });
            discardPeriodicTasks();
        }));

        it("should request transform flows only for the `updates` category of a derivative dataset", fakeAsync(() => {
            setComponentInput(fixture, "flowsData", {
                ...component.flowsData,
                datasetBasics: mockDatasetBasicsDerivedFragment,
            });
            setComponentInput(fixture, "setFlowsCategory", "updates");
            fixture.detectChanges();
            tick();

            expect(datasetFlowsListSpy.mock.calls.map(([params]) => params.filters.byProcessType)).toContainEqual({
                primary: { byFlowTypes: [DatasetFlowType.ExecuteTransform] },
                webhooks: undefined,
            });
            discardPeriodicTasks();
        }));

        it("should request webhook flows only for the `webhooks` category and drop the flows category", fakeAsync(() => {
            const selectionStateService = fixture.debugElement.injector.get(FlowsSelectionStateService);
            setComponentInput(fixture, "setFlowsCategory", "webhooks");
            fixture.detectChanges();
            tick();

            expect(datasetFlowsListSpy.mock.calls.map(([params]) => params.filters.byProcessType)).toContainEqual({
                primary: undefined,
                webhooks: { subscriptionIds: [] },
            });
            expect(selectionStateService.snapshot.flowsCategory).toBeUndefined();
            discardPeriodicTasks();
        }));
    });

    it("should not ask for a polling source or a transformation when the dataset has push sources", () => {
        const overviewWithPushSource = structuredClone(mockOverviewUpdate);
        overviewWithPushSource.overview.metadata.currentPollingSource = null;
        overviewWithPushSource.overview.metadata.currentTransform = null;
        overviewWithPushSource.overview.metadata.currentPushSources = [{ __typename: "AddPushSource" }];

        setComponentInput(fixture, "flowsData", {
            ...component.flowsData,
            overviewUpdate: overviewWithPushSource,
        });
        expect(component.hasPushSources).toBe(true);
        expect(component.isSetPollingSourceEmpty).toBe(false);

        setComponentInput(fixture, "flowsData", {
            ...component.flowsData,
            datasetBasics: mockDatasetBasicsDerivedFragment,
        });
        expect(component.isSetTransformEmpty).toBe(false);
    });

    describe("dataset process card", () => {
        beforeEach(() => {
            vi.spyOn(datasetFlowsService, "datasetFlowsProcesses").mockReturnValue(
                of(requireValue(mockDatasetFlowsProcessesQuery.datasets.byId?.flows.processes)),
            );
            vi.spyOn(datasetFlowsService, "datasetFlowsList").mockReturnValue(of(mockFlowsTableData));
            vi.spyOn(datasetFlowsService, "flowsInitiators").mockReturnValue(of([]));
        });

        async function loadCard(): Promise<DatasetFlowProcessCardHarness> {
            fixture.detectChanges();
            tick();
            const flows = await TestbedHarnessEnvironment.harnessForFixture(fixture, FlowsHarness);
            return flows.getDatasetProcessCard();
        }

        it("should trigger the dataset flow from the card's 'Update now' and refresh the flows", fakeAsync(async () => {
            const triggerIngestSpy = vi
                .spyOn(datasetFlowsService, "datasetTriggerIngestFlow")
                .mockReturnValue(of(true));
            const card = await loadCard();
            const refreshFlowSpy = vi.spyOn(component, "refreshFlow").mockImplementation(() => {});

            await card.clickUpdateNow();

            expect(triggerIngestSpy).toHaveBeenCalledTimes(1);

            expect(triggerIngestSpy).toHaveBeenCalledWith({ datasetId: mockDatasetBasicsRootFragment.id });
            expect(await card.isUpdateNowDisabled()).toBe(true);
            expect(await card.isToggleStateDisabled()).toBe(true);
            tick(component.TIMEOUT_REFRESH_FLOW);
            expect(refreshFlowSpy).toHaveBeenCalledTimes(1);
            expect(await card.isUpdateNowDisabled()).toBe(false);
            discardPeriodicTasks();
        }));

        it("should resume an auto-stopped process from the card after confirmation and refresh the flows", fakeAsync(async () => {
            const modalSpy = vi.spyOn(modalService, "error").mockImplementation((options: ModalArgumentsInterface) => {
                options.handler?.call(undefined, true);
                return Promise.resolve("");
            });
            const resumeSpy = vi.spyOn(flowsService, "datasetResumeFlows").mockReturnValue(of(void 0));
            const card = await loadCard();
            const refreshFlowSpy = vi.spyOn(component, "refreshFlow").mockImplementation(() => {});

            expect(await card.getToggleStateLabel()).toEqual("Resume updates");
            await card.clickToggleState();

            expect(modalSpy).toHaveBeenCalledTimes(1);
            expect(resumeSpy).toHaveBeenCalledTimes(1);
            expect(resumeSpy).toHaveBeenCalledWith({ datasetId: mockDatasetBasicsRootFragment.id });
            tick(component.TIMEOUT_REFRESH_FLOW);
            expect(refreshFlowSpy).toHaveBeenCalledTimes(1);
            discardPeriodicTasks();
        }));
    });

    it("should refresh flows after 'Update now' only once the delay passes", fakeAsync(() => {
        const refreshFlowSpy = vi.spyOn(component, "refreshFlow").mockImplementation(() => {});
        vi.spyOn(datasetFlowsService, "datasetTriggerIngestFlow").mockReturnValue(of(true));
        component.updateNow();

        tick(component.TIMEOUT_REFRESH_FLOW - 1);
        expect(refreshFlowSpy).not.toHaveBeenCalled();

        tick(1);
        expect(refreshFlowSpy).toHaveBeenCalledTimes(1);
    }));

    it("should not refresh flows after 'Update now' once destroyed", fakeAsync(() => {
        const refreshFlowSpy = vi.spyOn(component, "refreshFlow").mockImplementation(() => {});
        vi.spyOn(datasetFlowsService, "datasetTriggerIngestFlow").mockReturnValue(of(true));
        component.updateNow();

        fixture.destroy();
        tick(component.TIMEOUT_REFRESH_FLOW);
        expect(refreshFlowSpy).not.toHaveBeenCalled();
    }));

    it("should not refresh flows when 'Update now' fails to trigger", fakeAsync(() => {
        const refreshFlowSpy = vi.spyOn(component, "refreshFlow").mockImplementation(() => {});
        vi.spyOn(datasetFlowsService, "datasetTriggerIngestFlow").mockReturnValue(of(false));
        component.updateNow();

        tick(component.TIMEOUT_REFRESH_FLOW);
        expect(refreshFlowSpy).not.toHaveBeenCalled();
    }));

    it("should refresh flows after pausing the dataset flows only once the delay passes", fakeAsync(() => {
        const refreshFlowSpy = vi.spyOn(component, "refreshFlow").mockImplementation(() => {});
        vi.spyOn(flowsService, "datasetPauseFlows").mockReturnValue(of(void 0));
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
        const refreshFlowSpy = vi.spyOn(component, "refreshFlow").mockImplementation(() => {});
        vi.spyOn(flowsService, "datasetPauseFlows").mockReturnValue(of(void 0));
        component.toggleStateDatasetFlowConfigs({
            state: FlowProcessEffectiveState.Failing,
            datasetBasics: mockDatasetBasicsRootFragment,
        });

        fixture.destroy();
        tick(component.TIMEOUT_REFRESH_FLOW);
        expect(refreshFlowSpy).not.toHaveBeenCalled();
    }));

    it("should not refresh flows when the trigger responds after the page is left", fakeAsync(() => {
        const refreshFlowSpy = vi.spyOn(component, "refreshFlow").mockImplementation(() => {});
        const trigger$ = new Subject<boolean>();
        vi.spyOn(datasetFlowsService, "datasetTriggerIngestFlow").mockReturnValue(trigger$);
        component.updateNow();

        fixture.destroy();
        trigger$.next(true);
        tick(component.TIMEOUT_REFRESH_FLOW);
        expect(refreshFlowSpy).not.toHaveBeenCalled();
    }));

    describe("dataset card action in progress", () => {
        it("should last from a toggle until the refresh", fakeAsync(() => {
            vi.spyOn(flowsService, "datasetPauseFlows").mockReturnValue(of(void 0));
            const refreshFlowSpy = vi.spyOn(component, "refreshFlow").mockImplementation(() => {});
            component.toggleStateDatasetFlowConfigs({
                state: FlowProcessEffectiveState.Failing,
                datasetBasics: mockDatasetBasicsRootFragment,
            });

            tick(component.TIMEOUT_REFRESH_FLOW - 1);
            expect(component.busyIds$.value.has(mockDatasetBasicsRootFragment.id)).toBe(true);

            tick(1);
            expect(refreshFlowSpy).toHaveBeenCalledTimes(1);
            expect(component.busyIds$.value.has(mockDatasetBasicsRootFragment.id)).toBe(false);
        }));

        it("should end when 'Update now' fails to trigger", () => {
            vi.spyOn(datasetFlowsService, "datasetTriggerIngestFlow").mockReturnValue(of(false));
            component.updateNow();
            expect(component.busyIds$.value.has(mockDatasetBasicsRootFragment.id)).toBe(false);
        });

        it("should end when the resume confirmation is cancelled", () => {
            vi.spyOn(modalService, "error").mockImplementation((options: ModalArgumentsInterface) => {
                options.handler?.call(undefined, false);
                return Promise.resolve("");
            });
            component.toggleStateDatasetFlowConfigs({
                state: FlowProcessEffectiveState.StoppedAuto,
                datasetBasics: mockDatasetBasicsRootFragment,
            });
            expect(component.busyIds$.value.has(mockDatasetBasicsRootFragment.id)).toBe(false);
        });

        it("should not start while the resume confirmation is open, as Escape closes it unanswered", () => {
            vi.spyOn(modalService, "error").mockReturnValue(Promise.resolve(""));
            const resumeSpy = stubMethod(flowsService, "datasetResumeFlows");
            component.toggleStateDatasetFlowConfigs({
                state: FlowProcessEffectiveState.StoppedAuto,
                datasetBasics: mockDatasetBasicsRootFragment,
            });

            expect(resumeSpy).not.toHaveBeenCalled();
            expect(component.busyIds$.value.has(mockDatasetBasicsRootFragment.id)).toBe(false);
        });

        it("should end when the page is left before the refresh", fakeAsync(() => {
            vi.spyOn(flowsService, "datasetPauseFlows").mockReturnValue(of(void 0));
            component.toggleStateDatasetFlowConfigs({
                state: FlowProcessEffectiveState.Failing,
                datasetBasics: mockDatasetBasicsRootFragment,
            });

            fixture.destroy();
            expect(component.busyIds$.value.has(mockDatasetBasicsRootFragment.id)).toBe(false);
        }));

        it("should end when the request fails, and leave the error to the global handler", fakeAsync(() => {
            vi.spyOn(datasetFlowsService, "datasetTriggerIngestFlow").mockReturnValue(
                throwError(() => new Error("Network failure")),
            );
            component.updateNow();

            expect(component.busyIds$.value.has(mockDatasetBasicsRootFragment.id)).toBe(false);
            expect(() => tick()).toThrowError("Network failure");
        }));
    });

    describe("switching to another dataset's Flows tab", () => {
        const otherDatasetFlowsData = {
            datasetBasics: { ...mockDatasetBasicsDerivedFragment, id: "other-dataset-id" },
            datasetPermissions: mockFullPowerDatasetPermissionsFragment,
            overviewUpdate: mockOverviewUpdate,
        };
        let datasetFlowsProcessesSpy: Mock;

        beforeEach(() => {
            datasetFlowsProcessesSpy = vi
                .spyOn(datasetFlowsService, "datasetFlowsProcesses")
                .mockReturnValue(of(requireValue(mockDatasetFlowsProcessesQuery.datasets.byId?.flows.processes)));
            vi.spyOn(datasetFlowsService, "datasetFlowsList").mockReturnValue(of(mockFlowsTableData));
            vi.spyOn(datasetFlowsService, "flowsInitiators").mockReturnValue(of([]));
            setComponentInput(fixture, "flowsData", component.flowsData);
        });

        function switchTo(flowsData: typeof component.flowsData): void {
            setComponentInput(fixture, "flowsData", flowsData);
            fixture.detectChanges();
            tick();
        }

        it("should load the other dataset's flows", fakeAsync(() => {
            fixture.detectChanges();
            tick();
            datasetFlowsProcessesSpy.mockClear();

            switchTo(otherDatasetFlowsData);

            expect(datasetFlowsProcessesSpy).toHaveBeenCalledTimes(1);

            expect(datasetFlowsProcessesSpy).toHaveBeenCalledWith({ datasetId: "other-dataset-id" });
            discardPeriodicTasks();
        }));

        it("should keep only the selection the current URL asks for", fakeAsync(() => {
            const selectionStateService = fixture.debugElement.injector.get(FlowsSelectionStateService);
            setComponentInput(fixture, "setWebhookId", "d20a935e-0ccb-4844-b1bb-f4b5b9b0279c");
            fixture.detectChanges();
            tick();
            selectionStateService.addWebhookId("subscription-of-the-previous-dataset");

            switchTo(otherDatasetFlowsData);

            expect(selectionStateService.snapshot.webhooksIds).toEqual(["d20a935e-0ccb-4844-b1bb-f4b5b9b0279c"]);
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
            expect(component.onlySystemFlows).toBe(false);
            discardPeriodicTasks();
        }));

        it("should leave a card action of the previous dataset out of the new tab", fakeAsync(() => {
            vi.spyOn(flowsService, "datasetPauseFlows").mockReturnValue(of(void 0));
            fixture.detectChanges();
            tick();
            component.toggleStateDatasetFlowConfigs({
                state: FlowProcessEffectiveState.Failing,
                datasetBasics: mockDatasetBasicsRootFragment,
            });

            switchTo(otherDatasetFlowsData);
            expect(component.busyIds$.value.has("other-dataset-id")).toBe(false);

            const refreshFlowSpy = vi.spyOn(component, "refreshFlow").mockImplementation(() => {});
            tick(component.TIMEOUT_REFRESH_FLOW);
            expect(refreshFlowSpy).not.toHaveBeenCalled();
            expect(component.busyIds$.value.size).toEqual(0);
            discardPeriodicTasks();
        }));

        it("should not start over when the data of the same dataset is resolved again", fakeAsync(() => {
            fixture.detectChanges();
            tick();
            datasetFlowsProcessesSpy.mockClear();

            switchTo({ ...component.flowsData });

            expect(datasetFlowsProcessesSpy).not.toHaveBeenCalled();
            discardPeriodicTasks();
        }));
    });

    describe("webhook subscription action in progress", () => {
        const SUBSCRIPTION_ID = "1234-4444-43222";

        it("should last from a pause until the refresh", fakeAsync(() => {
            vi.spyOn(datasetWebhooksService, "datasetWebhookPauseSubscription").mockReturnValue(of(true));
            const refreshFlowSpy = vi.spyOn(component, "refreshFlow").mockImplementation(() => {});
            component.pauseWebhook(SUBSCRIPTION_ID);

            tick(AppValues.SIMULATION_UPDATE_WEBHOOK_STATUS_DELAY_MS - 1);
            expect(component.busyIds$.value.has(SUBSCRIPTION_ID)).toBe(true);

            tick(1);
            expect(refreshFlowSpy).toHaveBeenCalledTimes(1);
            expect(component.busyIds$.value.has(SUBSCRIPTION_ID)).toBe(false);
        }));

        it("should end when the resume fails", () => {
            vi.spyOn(datasetWebhooksService, "datasetWebhookResumeSubscription").mockReturnValue(of(false));
            component.resumeWebhook(SUBSCRIPTION_ID);
            expect(component.busyIds$.value.has(SUBSCRIPTION_ID)).toBe(false);
        });
    });

    describe("page of flow runs", () => {
        let datasetFlowsListSpy: Mock<DatasetFlowsService["datasetFlowsList"]>;

        // The API pages from 0, the URL and the pagination from 1
        function lastRequestedPage(): number {
            return requireValue(datasetFlowsListSpy.mock.lastCall)[0].page + 1;
        }

        beforeEach(() => {
            vi.spyOn(datasetFlowsService, "datasetFlowsProcesses").mockReturnValue(
                of(requireValue(mockDatasetFlowsProcessesQuery.datasets.byId?.flows.processes)),
            );
            datasetFlowsListSpy = vi
                .spyOn(datasetFlowsService, "datasetFlowsList")
                .mockReturnValue(of(mockFlowsTableData));
            vi.spyOn(datasetFlowsService, "flowsInitiators").mockReturnValue(of([]));
            vi.spyOn(navigationService, "navigateToDatasetView").mockImplementation(() => {});
        });

        it("should start from the page in the URL", fakeAsync(() => {
            fixture.detectChanges();
            tick();

            expect(lastRequestedPage()).toEqual(2);
            discardPeriodicTasks();
        }));

        it("should stay on the page shown when a card action refreshes the flows", fakeAsync(() => {
            vi.spyOn(flowsService, "datasetPauseFlows").mockReturnValue(of(void 0));
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

            component.onSelectionFlowsChange(chipListboxChange("updates"));
            tick();

            expect(lastRequestedPage()).toEqual(1);
            discardPeriodicTasks();
        }));
    });
});
