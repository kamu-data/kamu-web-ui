/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";
import { AddPeopleModalComponent } from "./add-people-modal.component";

describe("AddPeopleModalComponent", () => {
    let component: AddPeopleModalComponent;
    let fixture: ComponentFixture<AddPeopleModalComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [AddPeopleModalComponent],
        });
        fixture = TestBed.createComponent(AddPeopleModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
