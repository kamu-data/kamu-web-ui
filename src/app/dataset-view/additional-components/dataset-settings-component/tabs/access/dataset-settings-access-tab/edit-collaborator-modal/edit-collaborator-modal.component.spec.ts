/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";
import { EditCollaboratorModalComponent } from "./edit-collaborator-modal.component";

describe("EditCollaboratorModalComponent", () => {
    let component: EditCollaboratorModalComponent;
    let fixture: ComponentFixture<EditCollaboratorModalComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [EditCollaboratorModalComponent],
        });
        fixture = TestBed.createComponent(EditCollaboratorModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
