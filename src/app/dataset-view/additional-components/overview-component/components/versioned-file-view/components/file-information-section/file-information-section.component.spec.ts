/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { provideHttpClient } from "@angular/common/http";
import { ComponentFixture, TestBed } from "@angular/core/testing";

import { of } from "rxjs";

import { Apollo } from "apollo-angular";
import { provideToastr } from "ngx-toastr";

import { findElementByDataTestId, registerMatSvgIcons } from "@common/helpers/base-test.helpers.spec";

import { VersionedFileView } from "src/app/dataset-view/dataset-view.interface";
import {
    MOCK_VERSIONED_FILE_NAME,
    mockDatasetAsVersionedFileQuery,
    mockVersionedFileEntryLatest,
} from "src/app/search/mock.data";

import { DatasetAsVersionedFileService } from "../../../../services/dataset-as-versioned-file.service";
import { FileInformationSectionComponent } from "./file-information-section.component";

describe("FileInformationSectionComponent", () => {
    let component: FileInformationSectionComponent;
    let fixture: ComponentFixture<FileInformationSectionComponent>;
    let datasetAsVersionedFileService: DatasetAsVersionedFileService;

    const MOCK_VERSIONED_VIEW_FILE: VersionedFileView = {
        name: MOCK_VERSIONED_FILE_NAME,
        fileInfo: mockVersionedFileEntryLatest,
        countVersions: mockDatasetAsVersionedFileQuery.datasets.byId?.asVersionedFile?.versions.totalCount,
    };

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [FileInformationSectionComponent],
            providers: [Apollo, provideToastr(), provideHttpClient()],
        }).compileComponents();

        fixture = TestBed.createComponent(FileInformationSectionComponent);
        datasetAsVersionedFileService = TestBed.inject(DatasetAsVersionedFileService);
        component = fixture.componentInstance;
        vi.spyOn(datasetAsVersionedFileService, "versionedFileDetailsChanges", "get").mockReturnValue(
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
        expect(eventTimeElem?.innerText.trim()).toEqual("2025-12-18, 1:09:34 PM");

        const contentTypeElem = findElementByDataTestId(fixture, "file-content-type");
        expect(contentTypeElem?.innerText.trim()).toEqual("application/pdf");

        const contentLengthElem = findElementByDataTestId(fixture, "file-content-length");
        expect(contentLengthElem?.innerText.trim()).toEqual("372.9 KB");

        const contentHashElem = findElementByDataTestId(fixture, "file-content-hash");
        expect(contentHashElem?.innerText.trim()).toEqual("79907d0f");
    });
});
