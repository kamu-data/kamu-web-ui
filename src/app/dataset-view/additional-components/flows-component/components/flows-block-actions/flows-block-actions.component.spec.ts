/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FlowsBlockActionsComponent } from "./flows-block-actions.component";

describe("FlowsBlockActionsComponent", () => {
    let component: FlowsBlockActionsComponent;
    let fixture: ComponentFixture<FlowsBlockActionsComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [FlowsBlockActionsComponent],
        });
        fixture = TestBed.createComponent(FlowsBlockActionsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
