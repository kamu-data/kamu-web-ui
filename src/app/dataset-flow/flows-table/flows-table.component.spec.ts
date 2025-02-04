import { Apollo } from "apollo-angular";
import { ComponentFixture, fakeAsync, flush, TestBed, tick } from "@angular/core/testing";
import { FlowsTableComponent } from "./flows-table.component";
import { MatTableModule } from "@angular/material/table";
import { MatMenuModule } from "@angular/material/menu";
import { MatDividerModule } from "@angular/material/divider";
import { MatRadioModule } from "@angular/material/radio";
import { MatIconModule } from "@angular/material/icon";
import { FormsModule } from "@angular/forms";
import { mockDatasetFlowsInitiatorsQuery, mockFlowSummaryDataFragments } from "src/app/api/mock/dataset-flow.mock";
import { DisplayTimeModule } from "src/app/common/components/display-time/display-time.module";
import { Account } from "src/app/api/kamu.graphql.interface";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { HarnessLoader } from "@angular/cdk/testing";
import { TestbedHarnessEnvironment } from "@angular/cdk/testing/testbed";
import { MatTableHarness } from "@angular/material/table/testing";
import { SharedTestModule } from "src/app/common/modules/shared-test.module";
import { SimpleChanges } from "@angular/core";
import { ModalService } from "src/app/common/components/modal/modal.service";
import { NgbTypeaheadModule } from "@ng-bootstrap/ng-bootstrap";
import { mockDatasets, mockFlowSummaryDataFragmentShowForceLink } from "./flows-table.helpers.mock";
import { mockDatasetMainDataId } from "src/app/search/mock.data";
import { AngularMultiSelectModule } from "angular2-multiselect-dropdown";
import { ToastrModule, ToastrService } from "ngx-toastr";
import { DatasetFlowsService } from "src/app/dataset-view/additional-components/flows-component/services/dataset-flows.service";
import { of } from "rxjs";
import { RouterModule } from "@angular/router";
import { registerMatSvgIcons } from "../../common/helpers/base-test.helpers.spec";
import { ModalArgumentsInterface } from "src/app/interface/modal.interface";

describe("FlowsTableComponent", () => {
    let component: FlowsTableComponent;
    let fixture: ComponentFixture<FlowsTableComponent>;
    let loader: HarnessLoader;
    let modalService: ModalService;
    let datasetFlowsService: DatasetFlowsService;
    let toastService: ToastrService;
    const MOCK_FLOW_ID = "1";

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            providers: [Apollo],
            declarations: [FlowsTableComponent],
            imports: [
                MatTableModule,
                MatMenuModule,
                MatDividerModule,
                MatRadioModule,
                MatIconModule,
                FormsModule,
                DisplayTimeModule,
                HttpClientTestingModule,
                SharedTestModule,
                NgbTypeaheadModule,
                AngularMultiSelectModule,
                ToastrModule.forRoot(),
                RouterModule,
            ],
        }).compileComponents();

        // Note: for some reason this icon is not loaded
        registerMatSvgIcons();

        fixture = TestBed.createComponent(FlowsTableComponent);
        modalService = TestBed.inject(ModalService);
        datasetFlowsService = TestBed.inject(DatasetFlowsService);
        toastService = TestBed.inject(ToastrService);
        component = fixture.componentInstance;
        loader = TestbedHarnessEnvironment.loader(fixture);
        component.nodes = mockFlowSummaryDataFragments;
        component.filterByStatus = null;
        component.searchByAccount = [];
        component.tableOptions = {
            displayColumns: ["description", "information", "creator", "options"],
        };
        component.involvedDatasets = mockDatasets;
        component.dropdownDatasetList = mockDatasets;

        component.accountFlowInitiators = mockDatasetFlowsInitiatorsQuery.datasets.byId?.flows.runs.listFlowInitiators
            .nodes as Account[];
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
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
        const modalWindowSpy = spyOn(modalService, "error").and.callFake((options: ModalArgumentsInterface) => {
            options.handler?.call(undefined, false);
            return Promise.resolve("");
        });
        component.cancelFlow(MOCK_FLOW_ID, mockDatasetMainDataId);
        expect(modalWindowSpy).toHaveBeenCalledWith(jasmine.objectContaining({ title: "Cancel flow" }));
    });

    it("should check search method", () => {
        const searchByFiltersChangeSpy = spyOn(component.searchByFiltersChange, "emit");
        component.onSearch();
        expect(searchByFiltersChangeSpy).toHaveBeenCalledTimes(1);
    });

    it("should check reset filters", () => {
        const searchByFiltersChangeSpy = spyOn(component.searchByFiltersChange, "emit");
        component.onResetFilters();
        expect(searchByFiltersChangeSpy).toHaveBeenCalledTimes(1);
    });

    it("should check show use-force link", () => {
        expect(component.showForceUpdateLink(mockFlowSummaryDataFragmentShowForceLink)).toEqual(true);
    });

    it("should check trigger flow with force udate option", fakeAsync(() => {
        const datasetTriggerFlowSpy = spyOn(datasetFlowsService, "datasetTriggerFlow").and.returnValue(of(true));
        const forceUpdateModalSpy = spyOn(modalService, "error").and.callFake((options: ModalArgumentsInterface) => {
            options.handler?.call(undefined, true);
            return Promise.resolve("");
        });
        const toastrServiceSuccessSpy = spyOn(toastService, "success");

        component.onForceUpdate(mockFlowSummaryDataFragmentShowForceLink);

        fixture.detectChanges();
        tick();

        expect(forceUpdateModalSpy).toHaveBeenCalledTimes(1);
        expect(datasetTriggerFlowSpy).toHaveBeenCalledTimes(1);
        expect(toastrServiceSuccessSpy).toHaveBeenCalledWith("Force update started");
        flush();
    }));
});
