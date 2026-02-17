/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";

import { ModalDialogComponent } from "./modal-dialog.component";

describe("ModalDialogComponent", () => {
    let component: ModalDialogComponent;
    let fixture: ComponentFixture<ModalDialogComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ModalDialogComponent],
            providers: [],
        }).compileComponents();

        fixture = TestBed.createComponent(ModalDialogComponent);
        component = fixture.componentInstance;
        component.context = {};
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
