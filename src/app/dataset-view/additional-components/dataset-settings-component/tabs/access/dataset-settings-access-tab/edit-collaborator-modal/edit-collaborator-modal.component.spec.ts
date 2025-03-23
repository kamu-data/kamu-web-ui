/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";
import { EditCollaboratorModalComponent } from "./edit-collaborator-modal.component";
import { MOCK_ACCOUNT_WITH_ROLE } from "src/app/api/mock/dataset-collaborations.mock";
import { Apollo } from "apollo-angular";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { FormsModule } from "@angular/forms";
import { MatDividerModule } from "@angular/material/divider";

describe("EditCollaboratorModalComponent", () => {
    let component: EditCollaboratorModalComponent;
    let fixture: ComponentFixture<EditCollaboratorModalComponent>;
    let ngbActiveModal: NgbActiveModal;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [EditCollaboratorModalComponent],
            providers: [Apollo, NgbActiveModal],
            imports: [FormsModule, MatDividerModule],
        });
        fixture = TestBed.createComponent(EditCollaboratorModalComponent);
        ngbActiveModal = TestBed.inject(NgbActiveModal);
        component = fixture.componentInstance;
        component.collaborator = MOCK_ACCOUNT_WITH_ROLE;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should check init role of the collaborators", () => {
        expect(component.role).toEqual(MOCK_ACCOUNT_WITH_ROLE.role);
    });

    it("should check save changes", () => {
        const ngbActiveModalCloseSpy = spyOn(ngbActiveModal, "close");
        component.saveChanges();
        expect(ngbActiveModalCloseSpy).toHaveBeenCalledOnceWith(
            jasmine.objectContaining({ role: component.role, accountId: component.collaborator.account.id }),
        );
    });
});
