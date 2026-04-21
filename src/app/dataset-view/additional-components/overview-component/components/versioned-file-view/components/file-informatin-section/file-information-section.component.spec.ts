/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";
import { ComponentFixture, TestBed } from "@angular/core/testing";

import { Apollo } from "apollo-angular";
import { provideToastr } from "ngx-toastr";

import { FileInformationSectionComponent } from "./file-information-section.component";

describe("FileInformationSectionComponent", () => {
    let component: FileInformationSectionComponent;
    let fixture: ComponentFixture<FileInformationSectionComponent>;
    // let datasetAsVersionedFileService: DatasetAsVersionedFileService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [FileInformationSectionComponent],
            providers: [Apollo, provideToastr(), provideHttpClient(withInterceptorsFromDi())],
        }).compileComponents();

        fixture = TestBed.createComponent(FileInformationSectionComponent);
        //  datasetAsVersionedFileService = TestBed.inject(DatasetAsVersionedFileService);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
