/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";

import { FlowTablePanelFiltersComponent } from "src/app/dataset-flow/flows-table/components/flow-table-panel-filters/flow-table-panel-filters.component";

describe("FlowTablePanelFiltersComponent", () => {
    let component: FlowTablePanelFiltersComponent;
    let fixture: ComponentFixture<FlowTablePanelFiltersComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [FlowTablePanelFiltersComponent],
        });
        fixture = TestBed.createComponent(FlowTablePanelFiltersComponent);
        component = fixture.componentInstance;
        fixture.componentRef.setInput("onlySystemFlows", false);
        fixture.componentRef.setInput("hasDatasetColumn", false);
        fixture.componentRef.setInput("accountFlowInitiators", []);
        fixture.componentRef.setInput("involvedDatasets", []);
        fixture.componentRef.setInput("selectedDatasetItems", []);
        fixture.componentRef.setInput("selectedAccountItems", []);
        fixture.componentRef.setInput("selectedStatusItems", []);
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
