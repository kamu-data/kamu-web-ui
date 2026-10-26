/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { HarnessLoader } from "@angular/cdk/testing";
import { TestbedHarnessEnvironment } from "@angular/cdk/testing/testbed";
import { provideHttpClient } from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { SimpleChanges } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MatTableHarness } from "@angular/material/table/testing";

import { of } from "rxjs";

import { Apollo } from "apollo-angular";
import { provideToastr, ToastrService } from "ngx-toastr";
import timekeeper from "timekeeper";

import { ModalService } from "@common/components/modal/modal.service";
import { registerMatSvgIcons } from "@common/helpers/base-test.helpers.spec";
import { SharedTestModule } from "@common/modules/shared-test.module";
import { mockDatasetFlowsInitiatorsQuery, mockFlowSummaryDataFragments } from "@api/mock/dataset-flow.mock";
import { ModalArgumentsInterface } from "@interface/modal.interface";

import { FlowsTableComponent } from "src/app/dataset-flow/flows-table/flows-table.component";
import {
    mockDatasets,
    mockFlowSummaryDataFragmentShowForceLink,
} from "src/app/dataset-flow/flows-table/flows-table.helpers.mock";
import { FlowsTableOptions } from "src/app/dataset-flow/flows-table/flows-table.types";
import { DatasetFlowsService } from "src/app/dataset-view/additional-components/flows-component/services/dataset-flows.service";

describe("FlowsTableComponent", () => {
    let component: FlowsTableComponent;
    let fixture: ComponentFixture<FlowsTableComponent>;
    let loader: HarnessLoader;
    let modalService: ModalService;
    let datasetFlowsService: DatasetFlowsService;
    let toastService: ToastrService;

    beforeAll(() => {
        timekeeper.freeze("2024-03-14T11:22:29+00:00");
    });

    afterAll(() => {
        timekeeper.reset();
    });

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SharedTestModule, FlowsTableComponent],
            providers: [Apollo, provideToastr(), provideHttpClient(), provideHttpClientTesting()],
        }).compileComponents();

        // Note: for some reason this icon is not loaded
        registerMatSvgIcons();

        fixture = TestBed.createComponent(FlowsTableComponent);
        modalService = TestBed.inject(ModalService);
        datasetFlowsService = TestBed.inject(DatasetFlowsService);
        toastService = TestBed.inject(ToastrService);
        component = fixture.componentInstance;
        loader = TestbedHarnessEnvironment.loader(fixture);
        fixture.componentRef.setInput("nodes", mockFlowSummaryDataFragments);
        fixture.componentRef.setInput("filterByStatus", null);
        fixture.componentRef.setInput("searchByAccount", []);
        fixture.componentRef.setInput("tableOptions", {
            displayColumns: ["description", "information", "creator", "options"],
        } satisfies FlowsTableOptions);
        fixture.componentRef.setInput("involvedDatasets", mockDatasets);

        fixture.componentRef.setInput(
            "accountFlowInitiators",
            mockDatasetFlowsInitiatorsQuery.datasets.byId?.flows.runs.listFlowInitiators.nodes,
        );
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should check table rows length", async () => {
        const table = await loader.getHarness<MatTableHarness>(MatTableHarness);
        const rows = await table.getRows();
        expect(rows.length).toBe(8);
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

    it("should check trigger flow with force update option", async () => {
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
        await fixture.whenStable();

        expect(forceUpdateModalSpy).toHaveBeenCalledTimes(1);
        expect(datasetTriggerIngestFlowSpy).toHaveBeenCalledTimes(1);
        expect(toastrServiceSuccessSpy).toHaveBeenCalledWith("Force update started");
    });
});
