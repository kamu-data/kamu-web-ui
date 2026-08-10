/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";

import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";

import { FileInformationModalComponent } from "./file-information-modal.component";

describe("FileInformationModalComponent", () => {
    let component: FileInformationModalComponent;
    let fixture: ComponentFixture<FileInformationModalComponent>;
    const file = new File(["file content"], "example.txt", { type: "text/plain" });

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [FileInformationModalComponent],
            providers: [NgbActiveModal],
        }).compileComponents();

        fixture = TestBed.createComponent(FileInformationModalComponent);
        component = fixture.componentInstance;
        component.fileInformation = file;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should initialize file information and keep immutable fields disabled", () => {
        expect(component.fileForm.getRawValue()).toEqual({
            name: file.name,
            contentLength: file.size,
            contentType: file.type,
        });
        expect(component.fileForm.controls.name.disabled).toBeTrue();
        expect(component.fileForm.controls.contentLength.disabled).toBeTrue();
        expect(component.fileForm.valid).toBeTrue();
    });

    it("should require a content type", () => {
        component.fileForm.controls.contentType.setValue("");

        expect(component.fileForm.controls.contentType.hasError("required")).toBeTrue();
        expect(component.fileForm.valid).toBeFalse();
    });

    it("should close the modal with editable file information", () => {
        const closeSpy = spyOn(component.activeModal, "close");
        component.fileForm.controls.contentType.setValue("application/json");

        component.onUploadFile();

        expect(closeSpy).toHaveBeenCalledOnceWith({
            contentType: "application/json",
        });
    });
});
