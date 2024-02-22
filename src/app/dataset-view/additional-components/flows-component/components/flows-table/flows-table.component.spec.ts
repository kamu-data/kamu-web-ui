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

describe("FlowsTableComponent", () => {
    let component: FlowsTableComponent;
    let fixture: ComponentFixture<FlowsTableComponent>;
    let loader: HarnessLoader;

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
            ],
        }).compileComponents();

        // Note: for some reason this icon is not loaded
        const iconRegistryService: SvgIconRegistryService = TestBed.inject(SvgIconRegistryService);
        iconRegistryService.addSvg("show-options", "");
        iconRegistryService.addSvg("hour-glass", "");
        iconRegistryService.addSvg("timer", "");

        fixture = TestBed.createComponent(FlowsTableComponent);
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
        expect((await table.getRows()).length).toBe(8);
    });
});
