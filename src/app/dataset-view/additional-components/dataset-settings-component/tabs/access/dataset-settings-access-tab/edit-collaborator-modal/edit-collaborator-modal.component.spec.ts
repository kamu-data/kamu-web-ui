/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";

import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { Apollo } from "apollo-angular";

import { MOCK_ACCOUNT_WITH_ROLE } from "@api/mock/dataset-collaborations.mock";

import { EditCollaboratorModalComponent } from "src/app/dataset-view/additional-components/dataset-settings-component/tabs/access/dataset-settings-access-tab/edit-collaborator-modal/edit-collaborator-modal.component";

describe("EditCollaboratorModalComponent", () => {
    let component: EditCollaboratorModalComponent;
    let fixture: ComponentFixture<EditCollaboratorModalComponent>;
    let ngbActiveModal: NgbActiveModal;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [Apollo, NgbActiveModal],
            imports: [EditCollaboratorModalComponent],
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
