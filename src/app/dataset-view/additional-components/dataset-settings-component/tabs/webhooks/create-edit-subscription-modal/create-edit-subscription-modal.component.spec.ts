/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";
import { CreateEditSubscriptionModalComponent } from "./create-edit-subscription-modal.component";

describe("CreateEditSubscriptionModalComponent", () => {
    let component: CreateEditSubscriptionModalComponent;
    let fixture: ComponentFixture<CreateEditSubscriptionModalComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [CreateEditSubscriptionModalComponent],
        });
        fixture = TestBed.createComponent(CreateEditSubscriptionModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
