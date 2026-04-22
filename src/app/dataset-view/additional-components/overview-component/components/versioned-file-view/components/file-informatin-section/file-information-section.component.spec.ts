/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";
import { ComponentFixture, TestBed } from "@angular/core/testing";

import { of } from "rxjs";

import { Apollo } from "apollo-angular";
import { provideToastr } from "ngx-toastr";

import { findElementByDataTestId, registerMatSvgIcons } from "@common/helpers/base-test.helpers.spec";
import { VersionedFileEntryDataFragment } from "@api/kamu.graphql.interface";

import { VersionedFileView } from "src/app/dataset-view/dataset-view.interface";
import { mockDatasetAsVersionedFileQuery } from "src/app/search/mock.data";

import { DatasetAsVersionedFileService } from "../../../../services/dataset-as-versioned-file.service";
import { FileInformationSectionComponent } from "./file-information-section.component";

fdescribe("FileInformationSectionComponent", () => {
    let component: FileInformationSectionComponent;
    let fixture: ComponentFixture<FileInformationSectionComponent>;
    let datasetAsVersionedFileService: DatasetAsVersionedFileService;

    const MOCK_VERSIONED_VIEW_FILE: VersionedFileView = {
        name: mockDatasetAsVersionedFileQuery.datasets.byId?.name as string,
        fileInfo: mockDatasetAsVersionedFileQuery.datasets.byId?.asVersionedFile
            ?.latest as VersionedFileEntryDataFragment,
        countVersions: mockDatasetAsVersionedFileQuery.datasets.byId?.asVersionedFile?.versions.totalCount as number,
    };

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [FileInformationSectionComponent],
            providers: [Apollo, provideToastr(), provideHttpClient(withInterceptorsFromDi())],
        }).compileComponents();

        fixture = TestBed.createComponent(FileInformationSectionComponent);
        datasetAsVersionedFileService = TestBed.inject(DatasetAsVersionedFileService);
        component = fixture.componentInstance;
        spyOnProperty(datasetAsVersionedFileService, "versionedFileDetailsChanges", "get").and.returnValue(
            of(MOCK_VERSIONED_VIEW_FILE),
        );
        registerMatSvgIcons();
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should check file details", () => {
        const versionElem = findElementByDataTestId(fixture, "file-version");
        expect(versionElem?.innerText.trim()).toEqual(MOCK_VERSIONED_VIEW_FILE.fileInfo?.version.toString());

        const eventTimeElem = findElementByDataTestId(fixture, "file-event-time");
        expect(eventTimeElem?.innerText.trim()).toEqual("2025-12-18, 3:09:34 PM");

        const contentTypeElem = findElementByDataTestId(fixture, "file-content-type");
        expect(contentTypeElem?.innerText.trim()).toEqual("application/pdf");

        const contentLengthElem = findElementByDataTestId(fixture, "file-content-length");
        expect(contentLengthElem?.innerText.trim()).toEqual("372.9 KB");

        const contentHashElem = findElementByDataTestId(fixture, "file-content-hash");
        expect(contentHashElem?.innerText.trim()).toEqual("79907d0f");
    });
});
