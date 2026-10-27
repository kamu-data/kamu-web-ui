/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";

import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";

import { createSpyObj } from "@common/helpers/base-test.helpers.spec";
import { openModal } from "@common/helpers/modal.helpers";

@Component({
    selector: "app-test-modal",
    template: "",
})
class TestModalComponent {
    public title = "";
}

describe("ModalHelpers", () => {
    let ngbModal: NgbModal;

    beforeEach(() => {
        ngbModal = TestBed.inject(NgbModal);
    });

    afterEach(() => {
        ngbModal.dismissAll();
    });

    it("should return the modal with the instance it created", () => {
        const openSpy = vi.spyOn(ngbModal, "open");

        const { modalRef, instance } = openModal(ngbModal, TestModalComponent, { size: "lg" });

        expect(openSpy).toHaveBeenCalledWith(TestModalComponent, { size: "lg" });
        expect(instance).toBeInstanceOf(TestModalComponent);
        expect(modalRef.componentInstance).toBe(instance);
    });

    it("should throw when the modal holds another component", () => {
        const modalRef = createSpyObj<NgbModalRef>({}, { componentInstance: {} });
        vi.spyOn(ngbModal, "open").mockReturnValue(modalRef);

        expect(() => openModal(ngbModal, TestModalComponent)).toThrowError(
            `Expecting the modal to hold a ${TestModalComponent.name}`,
        );
    });
});
