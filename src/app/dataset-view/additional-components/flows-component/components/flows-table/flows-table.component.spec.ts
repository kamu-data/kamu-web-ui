import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FlowsTableComponent } from "./flows-table.component";
import { MatTableModule } from "@angular/material/table";
import { MatMenuModule } from "@angular/material/menu";
import { MatDividerModule } from "@angular/material/divider";
import { MatRadioChange, MatRadioModule } from "@angular/material/radio";
import { MatIconModule } from "@angular/material/icon";
import { FormsModule } from "@angular/forms";
import { mockFlowSummaryDataFragments, mockGetDatasetListFlowsQuery } from "src/app/api/mock/dataset-flow.mock";
import { FilterByInitiatorEnum } from "./flows-table.types";
import { DisplayTimeModule } from "src/app/components/display-time/display-time.module";
import { FlowStatus } from "src/app/api/kamu.graphql.interface";
import { mockDatasetBasicsRootFragment } from "src/app/search/mock.data";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { AngularSvgIconModule, SvgIconRegistryService } from "angular-svg-icon";
import { HarnessLoader } from "@angular/cdk/testing";
import { TestbedHarnessEnvironment } from "@angular/cdk/testing/testbed";
import { MatTableHarness } from "@angular/material/table/testing";
import { SharedTestModule } from "src/app/common/shared-test.module";
import { SimpleChanges } from "@angular/core";
import { NavigationService } from "src/app/services/navigation.service";
import { ModalService } from "src/app/components/modal/modal.service";
import { SharedModule } from "src/app/shared/shared/shared.module";

describe("FlowsTableComponent", () => {
    let component: FlowsTableComponent;
    let fixture: ComponentFixture<FlowsTableComponent>;
    let loader: HarnessLoader;
    let navigationService: NavigationService;
    let modalService: ModalService;
    const MOCK_FLOW_ID = "1";

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [FlowsTableComponent],
            imports: [
                MatTableModule,
                MatMenuModule,
                MatDividerModule,
                MatRadioModule,
                MatIconModule,
                FormsModule,
                DisplayTimeModule,
                AngularSvgIconModule.forRoot(),
                HttpClientTestingModule,
                SharedTestModule,
                SharedModule,
            ],
        }).compileComponents();

        // Note: for some reason this icon is not loaded
        const iconRegistryService: SvgIconRegistryService = TestBed.inject(SvgIconRegistryService);
        iconRegistryService.addSvg("show-options", "");
        iconRegistryService.addSvg("hour-glass", "");
        iconRegistryService.addSvg("timer", "");

        fixture = TestBed.createComponent(FlowsTableComponent);
        navigationService = TestBed.inject(NavigationService);
        modalService = TestBed.inject(ModalService);
        component = fixture.componentInstance;
        loader = TestbedHarnessEnvironment.loader(fixture);
        component.nodes = mockFlowSummaryDataFragments;
        component.filterByStatus = null;
        component.filterByInitiator = FilterByInitiatorEnum.All;
        component.searchByAccountName = "";
        component.datasetBasics = mockDatasetBasicsRootFragment;
        component.fetchStep = mockGetDatasetListFlowsQuery.datasets.byId?.metadata.currentPollingSource?.fetch;
        component.transformData = {
            numInputs: 0,
            engine: "",
        };
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should check change filter by status", () => {
        const filterByStatusChangeSpy = spyOn(component.filterByStatusChange, "emit");
        component.changeFilterByStatus(FlowStatus.Finished);
        expect(filterByStatusChangeSpy).toHaveBeenCalledWith(FlowStatus.Finished);
    });

    it("should check change filter by initiator", () => {
        const filterByInitiatorChangeSpy = spyOn(component.filterByInitiatorChange, "emit");
        component.changeFilterByInitiator({ value: FilterByInitiatorEnum.System } as MatRadioChange);
        expect(filterByInitiatorChangeSpy).toHaveBeenCalledWith(FilterByInitiatorEnum.System);
    });

    it("should check search by accountName emits value", () => {
        const searchByAccountNameChangeSpy = spyOn(component.searchByAccountNameChange, "emit");
        component.onSearchByAccountName();
        expect(searchByAccountNameChangeSpy).toHaveBeenCalledWith("");
    });

    it("should check table rows length", async () => {
        const table = await loader.getHarness<MatTableHarness>(MatTableHarness);
        expect((await table.getRows()).length).toBe(5);
    });

    it("should check ngOnChanges", () => {
        const nodesSimpleChanges: SimpleChanges = {
            nodes: {
                previousValue: undefined,
                currentValue: mockFlowSummaryDataFragments,
                firstChange: true,
                isFirstChange: () => true,
            },
        };
        component.ngOnChanges(nodesSimpleChanges);
        expect(component.dataSource.data).toEqual(mockFlowSummaryDataFragments);
    });

    it("should check show modal window with warning", () => {
        const modalWindowSpy = spyOn(modalService, "error").and.callFake((options) => {
            options.handler?.call(undefined, false);
            return Promise.resolve("");
        });
        component.cancelFlow(MOCK_FLOW_ID);
        expect(modalWindowSpy).toHaveBeenCalledWith(jasmine.objectContaining({ title: "Cancel flow" }));
    });

    it("should check navigate to flow details view", () => {
        const navigateToFlowDetailsSpy = spyOn(navigationService, "navigateToFlowDetails");
        component.navigateToFlowDetaisView(MOCK_FLOW_ID);
        expect(navigateToFlowDetailsSpy).toHaveBeenCalledWith(jasmine.objectContaining({ flowId: MOCK_FLOW_ID }));
    });
});
