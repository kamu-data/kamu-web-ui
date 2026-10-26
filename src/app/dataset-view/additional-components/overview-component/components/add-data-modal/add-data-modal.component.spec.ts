/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { provideHttpClient } from "@angular/common/http";
import { ComponentFixture, TestBed } from "@angular/core/testing";

import { of } from "rxjs";

import { NgbActiveModal, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Apollo } from "apollo-angular";

import { ModalService } from "@common/components/modal/modal.service";
import { setComponentInput } from "@common/helpers/base-test.helpers.spec";
import { SharedTestModule } from "@common/modules/shared-test.module";
import { mockFile } from "@api/mock/upload-file.mock";
import { ModalArgumentsInterface } from "@interface/modal.interface";

import { AppUIConfig } from "src/app/app-config.model";
import { AppConfigService } from "src/app/app-config.service";
import { AddDataModalComponent } from "src/app/dataset-view/additional-components/overview-component/components/add-data-modal/add-data-modal.component";
import { FileFromUrlModalComponent } from "src/app/dataset-view/additional-components/overview-component/components/file-from-url-modal/file-from-url-modal.component";
import { mockDatasetBasicsRootFragment } from "src/app/search/mock.data";
import { FileUploadService } from "src/app/services/file-upload.service";

describe("AddDataModalComponent", () => {
    let component: AddDataModalComponent;
    let fixture: ComponentFixture<AddDataModalComponent>;
    let ngbModalService: NgbModal;
    let fileUploadService: FileUploadService;
    let modalService: ModalService;
    let configService: AppUIConfig;
    let uploadFileLimitMbSpy: jasmine.Spy;

    function selectFile(file: File): void {
        const fileInput = document.createElement("input");
        fileInput.type = "file";
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        fileInput.files = dataTransfer.files;
        fileInput.addEventListener("change", (event: Event) => component.onFileSelected(event));
        fileInput.dispatchEvent(new Event("change"));
    }

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SharedTestModule, AddDataModalComponent],
            providers: [Apollo, NgbActiveModal, provideHttpClient()],
        }).compileComponents();

        fixture = TestBed.createComponent(AddDataModalComponent);
        component = fixture.componentInstance;
        ngbModalService = TestBed.inject(NgbModal);
        fileUploadService = TestBed.inject(FileUploadService);
        modalService = TestBed.inject(ModalService);
        configService = TestBed.inject(AppConfigService);
        setComponentInput(fixture, "datasetBasics", mockDatasetBasicsRootFragment);
        uploadFileLimitMbSpy = spyOnProperty(configService, "ingestUploadFileLimitMb", "get").and.returnValue(50);

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
        selectFile(mockFile);
        expect(uploadFileSpy).toHaveBeenCalledTimes(1);
    });

    it("should check if file selected and file size is over the upload limit", () => {
        const modalServiceSpy = spyOn(modalService, "warning").and.callFake((options: ModalArgumentsInterface) => {
            options.handler?.call(undefined, false);
            return Promise.resolve("");
        });
        // A zero limit makes any non-empty file too large, without allocating one over 50 MB
        uploadFileLimitMbSpy.and.returnValue(0);
        selectFile(mockFile);
        expect(modalServiceSpy).toHaveBeenCalledTimes(1);
    });
});
