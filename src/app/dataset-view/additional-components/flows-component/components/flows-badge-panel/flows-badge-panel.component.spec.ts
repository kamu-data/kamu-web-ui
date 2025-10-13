/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FlowsBadgePanelComponent } from "./flows-badge-panel.component";
import { DatasetFlowProcesses, DatasetKind } from "src/app/api/kamu.graphql.interface";
import { mockFlowsTableData, mockDatasetFlowsProcessesQuery } from "src/app/api/mock/dataset-flow.mock";

describe("FlowsBadgePanelComponent", () => {
    let component: FlowsBadgePanelComponent;
    let fixture: ComponentFixture<FlowsBadgePanelComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [FlowsBadgePanelComponent],
        });
        fixture = TestBed.createComponent(FlowsBadgePanelComponent);
        component = fixture.componentInstance;
        component.flowConnectionData = {
            flowsData: mockFlowsTableData,
            flowInitiators: [],
            flowProcesses: mockDatasetFlowsProcessesQuery.datasets.byId?.flows.processes as DatasetFlowProcesses,
        };
        component.datasetKind = DatasetKind.Root;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
