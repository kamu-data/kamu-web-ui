/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";

import { setComponentInput } from "@common/helpers/base-test.helpers.spec";

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
        setComponentInput(fixture, "onlySystemFlows", false);
        setComponentInput(fixture, "hasDatasetColumn", false);
        setComponentInput(fixture, "accountFlowInitiators", []);
        setComponentInput(fixture, "involvedDatasets", []);
        setComponentInput(fixture, "selectedDatasetItems", []);
        setComponentInput(fixture, "selectedAccountItems", []);
        setComponentInput(fixture, "selectedStatusItems", []);
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
