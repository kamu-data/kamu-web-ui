/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";
import { RotateSecretSubscriptionModalComponent } from "./rotate-secret-subscription-modal.component";

describe("RotateSecretSubscriptionModalComponent", () => {
    let component: RotateSecretSubscriptionModalComponent;
    let fixture: ComponentFixture<RotateSecretSubscriptionModalComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [RotateSecretSubscriptionModalComponent],
        });
        fixture = TestBed.createComponent(RotateSecretSubscriptionModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
