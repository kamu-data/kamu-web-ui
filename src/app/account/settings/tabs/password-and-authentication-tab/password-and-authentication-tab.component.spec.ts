/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";
import { PasswordAndAuthenticationTabComponent } from "./password-and-authentication-tab.component";

describe("PasswordAndAuthenticationTabComponent", () => {
    let component: PasswordAndAuthenticationTabComponent;
    let fixture: ComponentFixture<PasswordAndAuthenticationTabComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [PasswordAndAuthenticationTabComponent],
        });
        fixture = TestBed.createComponent(PasswordAndAuthenticationTabComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
