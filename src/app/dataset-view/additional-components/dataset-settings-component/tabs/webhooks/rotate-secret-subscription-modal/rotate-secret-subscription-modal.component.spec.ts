/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";
import { RotateSecretSubscriptionModalComponent } from "./rotate-secret-subscription-modal.component";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { Apollo } from "apollo-angular";
import { registerMatSvgIcons } from "src/app/common/helpers/base-test.helpers.spec";
import { HttpClientTestingModule } from "@angular/common/http/testing";

describe("RotateSecretSubscriptionModalComponent", () => {
    let component: RotateSecretSubscriptionModalComponent;
    let fixture: ComponentFixture<RotateSecretSubscriptionModalComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule, RotateSecretSubscriptionModalComponent],
            providers: [Apollo, NgbActiveModal],
        });

        registerMatSvgIcons();

        fixture = TestBed.createComponent(RotateSecretSubscriptionModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
