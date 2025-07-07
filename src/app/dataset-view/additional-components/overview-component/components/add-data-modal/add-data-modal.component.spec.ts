/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { SharedTestModule } from "src/app/common/modules/shared-test.module";
import { Apollo } from "apollo-angular";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { AddDataModalComponent } from "./add-data-modal.component";
import { NgbActiveModal, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { HttpClientModule } from "@angular/common/http";
import { mockDatasetBasicsRootFragment } from "src/app/search/mock.data";
import { FileFromUrlModalComponent } from "../file-from-url-modal/file-from-url-modal.component";
import { FileUploadService } from "src/app/services/file-upload.service";
import { mockFile } from "src/app/api/mock/upload-file.mock";
import { ModalService } from "src/app/common/components/modal/modal.service";
import { of } from "rxjs";
import { ModalArgumentsInterface } from "src/app/interface/modal.interface";

describe("AddDataModalComponent", () => {
    let component: AddDataModalComponent;
    let fixture: ComponentFixture<AddDataModalComponent>;
    let ngbModalService: NgbModal;
    let fileUploadService: FileUploadService;
    let modalService: ModalService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            providers: [Apollo, NgbActiveModal],
            imports: [HttpClientModule, SharedTestModule, AddDataModalComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(AddDataModalComponent);
        component = fixture.componentInstance;
        ngbModalService = TestBed.inject(NgbModal);
        fileUploadService = TestBed.inject(FileUploadService);
        modalService = TestBed.inject(ModalService);
        component.datasetBasics = mockDatasetBasicsRootFragment;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should check open modal with file url", () => {
        const ngbModalServiceOpenSpy = spyOn(ngbModalService, "open");
        component.onAddUrl();
        expect(ngbModalServiceOpenSpy).toHaveBeenCalledWith(FileFromUrlModalComponent);
    });

    it("should check if file selected and file size < 50MB", () => {
        const uploadFileSpy = spyOn(fileUploadService, "uploadFile").and.callFake(() => of({}));
        const event = {
            target: {
                files: [mockFile],
            },
        } as unknown as Event;
        component.onFileSelected(event);
        expect(uploadFileSpy).toHaveBeenCalledTimes(1);
    });

    it("should check if file selected and file size > 50MB", () => {
        const modalServiceSpy = spyOn(modalService, "warning").and.callFake((options: ModalArgumentsInterface) => {
            options.handler?.call(undefined, false);
            return Promise.resolve("");
        });
        const largeFile = {
            name: "data.csv",
            size: Math.pow(10, 8),
            type: "text/csv",
        } as File;
        const event = {
            target: {
                files: [largeFile],
            },
        } as unknown as Event;
        component.onFileSelected(event);
        expect(modalServiceSpy).toHaveBeenCalledTimes(1);
    });
});
