/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FlowProcessStatusListComponent } from "./flow-process-status-list.component";

describe("FlowProcessStatusListComponent", () => {
    let component: FlowProcessStatusListComponent;
    let fixture: ComponentFixture<FlowProcessStatusListComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [FlowProcessStatusListComponent],
        });
        fixture = TestBed.createComponent(FlowProcessStatusListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
