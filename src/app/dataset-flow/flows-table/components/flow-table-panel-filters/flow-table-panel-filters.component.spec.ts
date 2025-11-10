/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FlowTablePanelFiltersComponent } from "./flow-table-panel-filters.component";

describe("FlowTablePanelFiltersComponent", () => {
    let component: FlowTablePanelFiltersComponent;
    let fixture: ComponentFixture<FlowTablePanelFiltersComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [FlowTablePanelFiltersComponent],
        });
        fixture = TestBed.createComponent(FlowTablePanelFiltersComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
