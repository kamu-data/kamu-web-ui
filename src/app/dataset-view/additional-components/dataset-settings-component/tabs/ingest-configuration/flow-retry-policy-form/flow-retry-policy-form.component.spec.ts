/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";

import { FlowRetryPolicyFormComponent } from "./flow-retry-policy-form.component";
import { RouterTestingModule } from "@angular/router/testing";

describe("FlowRetryPolicyFormComponent", () => {
    let component: FlowRetryPolicyFormComponent;
    let fixture: ComponentFixture<FlowRetryPolicyFormComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                //-----//
                RouterTestingModule,
                //-----//
                FlowRetryPolicyFormComponent,
            ],
        });
        fixture = TestBed.createComponent(FlowRetryPolicyFormComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
