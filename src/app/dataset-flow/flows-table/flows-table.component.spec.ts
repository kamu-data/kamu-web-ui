/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { Apollo } from "apollo-angular";
import { ComponentFixture, fakeAsync, flush, TestBed, tick } from "@angular/core/testing";
import { FlowsTableComponent } from "./flows-table.component";
import { mockDatasetFlowsInitiatorsQuery, mockFlowSummaryDataFragments } from "src/app/api/mock/dataset-flow.mock";
import { Account } from "src/app/api/kamu.graphql.interface";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { HarnessLoader } from "@angular/cdk/testing";
import { TestbedHarnessEnvironment } from "@angular/cdk/testing/testbed";
import { MatTableHarness } from "@angular/material/table/testing";
import { SharedTestModule } from "src/app/common/modules/shared-test.module";
import { SimpleChanges } from "@angular/core";
import { ModalService } from "src/app/common/components/modal/modal.service";
import { mockDatasets, mockFlowSummaryDataFragmentShowForceLink } from "./flows-table.helpers.mock";
import { provideToastr, ToastrService } from "ngx-toastr";
import { DatasetFlowsService } from "src/app/dataset-view/additional-components/flows-component/services/dataset-flows.service";
import { of } from "rxjs";
import { registerMatSvgIcons } from "../../common/helpers/base-test.helpers.spec";
import { ModalArgumentsInterface } from "src/app/interface/modal.interface";
import { provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";

describe("FlowsTableComponent", () => {
    let component: FlowsTableComponent;
    let fixture: ComponentFixture<FlowsTableComponent>;
    let loader: HarnessLoader;
    let modalService: ModalService;
    let datasetFlowsService: DatasetFlowsService;
    let toastService: ToastrService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
    imports: [SharedTestModule, FlowsTableComponent],
    providers: [Apollo, provideToastr(), provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
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

        component.accountFlowInitiators = mockDatasetFlowsInitiatorsQuery.datasets.byId?.flows.runs.listFlowInitiators
            .nodes as Account[];
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should check table rows length", async () => {
        const table = await loader.getHarness<MatTableHarness>(MatTableHarness);
        expect((await table.getRows()).length).toBe(8);
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

    it("should check show modal window for aborting flow", () => {
        const modalWindowSpy = spyOn(modalService, "error").and.callFake((options: ModalArgumentsInterface) => {
            options.handler?.call(undefined, false);
            return Promise.resolve("");
        });
        component.abortFlow(mockFlowSummaryDataFragments[0]);
        expect(modalWindowSpy).toHaveBeenCalledWith(
            jasmine.objectContaining({
                title: "Abort flow",
                message: "Do you want to abort this flow?",
            }),
        );
    });

    it("should check show modal window for aborting flow with enabled schedule", () => {
        const modalWindowSpy = spyOn(modalService, "error").and.callFake((options: ModalArgumentsInterface) => {
            options.handler?.call(undefined, false);
            return Promise.resolve("");
        });
        component.abortFlow({
            ...mockFlowSummaryDataFragments[0],
            relatedTrigger: {
                paused: false,
                schedule: {
                    __typename: "TimeDelta",
                },
            },
        });
        expect(modalWindowSpy).toHaveBeenCalledWith(
            jasmine.objectContaining({
                title: "Abort flow",
                message: "Do you want to abort this flow? This will also pause the scheduled updates.",
            }),
        );
    });

    it("should check show modal window for aborting flow with paused schedule", () => {
        const modalWindowSpy = spyOn(modalService, "error").and.callFake((options: ModalArgumentsInterface) => {
            options.handler?.call(undefined, false);
            return Promise.resolve("");
        });
        component.abortFlow({
            ...mockFlowSummaryDataFragments[0],
            relatedTrigger: {
                paused: true,
                schedule: {
                    __typename: "TimeDelta",
                },
            },
        });
        expect(modalWindowSpy).toHaveBeenCalledWith(
            jasmine.objectContaining({
                title: "Abort flow",
                message: "Do you want to abort this flow?",
            }),
        );
    });

    it("should check show use-force link", () => {
        expect(component.showForceUpdateLink(mockFlowSummaryDataFragmentShowForceLink)).toEqual(true);
    });

    it("should check trigger flow with force update option", fakeAsync(() => {
        const datasetTriggerIngestFlowSpy = spyOn(datasetFlowsService, "datasetTriggerIngestFlow").and.returnValue(
            of(true),
        );
        const forceUpdateModalSpy = spyOn(modalService, "error").and.callFake((options: ModalArgumentsInterface) => {
            options.handler?.call(undefined, true);
            return Promise.resolve("");
        });
        const toastrServiceSuccessSpy = spyOn(toastService, "success");

        component.onForceUpdate(mockFlowSummaryDataFragmentShowForceLink);

        fixture.detectChanges();
        tick();

        expect(forceUpdateModalSpy).toHaveBeenCalledTimes(1);
        expect(datasetTriggerIngestFlowSpy).toHaveBeenCalledTimes(1);
        expect(toastrServiceSuccessSpy).toHaveBeenCalledWith("Force update started");
        flush();
    }));
});
